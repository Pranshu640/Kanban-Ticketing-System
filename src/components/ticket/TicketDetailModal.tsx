import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import ConfirmationModal from '../ui/ConfirmationModal';
import type { Ticket } from '../../types';
import { Priority as PriorityEnum, TicketStatus } from '../../types';
import { useTickets } from '../../contexts';
import { mockAssignees, mockTags } from '../../data';
import { staggerContainer, staggerItem } from '../../utils/animations';
import styles from './TicketDetailModal.module.css';

export interface TicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onDelete?: (ticketId: string) => void;
}

interface TicketHistory {
  id: string;
  timestamp: Date;
  action: 'created' | 'updated' | 'moved' | 'deleted';
  field?: string;
  oldValue?: string | number | string[] | Date | undefined;
  newValue?: string | number | string[] | Date | undefined;
  description: string;
}

interface EditableField<T> {
  field: keyof Ticket;
  isEditing: boolean;
  value: T;
  originalValue: T;
}

type EditableFieldsState = {
  title: EditableField<string>;
  description: EditableField<string>;
  priority: EditableField<PriorityEnum>;
  assignee: EditableField<string>;
  dueDate: EditableField<string>; // ISO date string (yyyy-mm-dd) or ''
  estimatedHours: EditableField<number | ''>;
  tags: EditableField<string[]>;
};

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onDelete,
}) => {
  const { actions } = useTickets();
  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState<EditableFieldsState | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingTicket, setIsDeletingTicket] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<TicketHistory[]>([]);

  // Get status label
  const getStatusLabel = useCallback((status: string) => {
    switch (status) {
      case TicketStatus.TODO:
        return 'To Do';
      case TicketStatus.IN_PROGRESS:
        return 'In Progress';
      case TicketStatus.IN_REVIEW:
        return 'In Review';
      case TicketStatus.DONE:
        return 'Done';
      default:
        return status;
    }
  }, []);

  // Generate mock history for demonstration
  const generateTicketHistory = useCallback((ticket: Ticket) => {
    const mockHistory: TicketHistory[] = [
      {
        id: '1',
        timestamp: ticket.createdAt,
        action: 'created',
        description: `Ticket created by ${ticket.assignee}`,
      },
    ];

    // Add some mock updates
    if (ticket.updatedAt > ticket.createdAt) {
      mockHistory.push({
        id: '2',
        timestamp: ticket.updatedAt,
        action: 'updated',
        field: 'description',
        description: 'Description updated',
      });
    }

    // Add status changes based on current status
    if (ticket.status !== TicketStatus.TODO) {
      const statusDate = new Date(ticket.createdAt.getTime() + 24 * 60 * 60 * 1000);
      mockHistory.push({
        id: '3',
        timestamp: statusDate,
        action: 'moved',
        field: 'status',
        oldValue: TicketStatus.TODO,
        newValue: ticket.status,
        description: `Status changed from To Do to ${getStatusLabel(ticket.status)}`,
      });
    }

    setHistory(mockHistory.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, [getStatusLabel]);

  // Initialize editable fields when ticket changes
  useEffect(() => {
    if (ticket) {
      const fields: EditableFieldsState = {
        title: {
          field: 'title',
          isEditing: false,
          value: ticket.title,
          originalValue: ticket.title,
        },
        description: {
          field: 'description',
          isEditing: false,
          value: ticket.description,
          originalValue: ticket.description,
        },
        priority: {
          field: 'priority',
          isEditing: false,
          value: ticket.priority,
          originalValue: ticket.priority,
        },
        assignee: {
          field: 'assignee',
          isEditing: false,
          value: ticket.assignee,
          originalValue: ticket.assignee,
        },
        dueDate: {
          field: 'dueDate',
          isEditing: false,
          value: ticket.dueDate ? ticket.dueDate.toISOString().split('T')[0] : '',
          originalValue: ticket.dueDate ? ticket.dueDate.toISOString().split('T')[0] : '',
        },
        estimatedHours: {
          field: 'estimatedHours',
          isEditing: false,
          value: ticket.estimatedHours ?? '',
          originalValue: ticket.estimatedHours ?? '',
        },
        tags: {
          field: 'tags',
          isEditing: false,
          value: [...ticket.tags],
          originalValue: [...ticket.tags],
        },
      };
      setEditableFields(fields);

      // Generate mock history for the ticket
      generateTicketHistory(ticket);
    }
  }, [ticket, generateTicketHistory]);

  // Validation functions
  const validateField = (field: keyof EditableFieldsState, value: EditableFieldsState[keyof EditableFieldsState]['value']): string | undefined => {
    switch (field) {
      case 'title': {
        const v = value as string;
        if (!v || v.trim().length === 0) return 'Title is required';
        if (v.trim().length < 3) return 'Title must be at least 3 characters long';
        if (v.trim().length > 100) return 'Title must be less than 100 characters';
        break;
      }
      case 'description': {
        const v = value as string;
        if (!v || v.trim().length === 0) return 'Description is required';
        if (v.trim().length < 10) return 'Description must be at least 10 characters long';
        if (v.trim().length > 1000) return 'Description must be less than 1000 characters';
        break;
      }
      case 'assignee': {
        const v = value as string;
        if (!v || v.trim().length === 0) return 'Assignee is required';
        break;
      }
      case 'dueDate': {
        const v = value as string;
        if (v) {
          const selectedDate = new Date(v);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) return 'Due date cannot be in the past';
        }
        break;
      }
      case 'estimatedHours': {
        const v = value as number | '';
        if (v !== undefined && v !== '') {
          const hours = Number(v);
          if (isNaN(hours) || hours < 0) return 'Estimated hours must be a positive number';
          if (hours > 1000) return 'Estimated hours must be less than 1000';
        }
        break;
      }
      default:
        break;
    }
    return undefined;
  };

  // Start editing a field
  const startEditing = (fieldName: keyof EditableFieldsState) => {
    if (!editableFields) return;
    setEditableFields(prev => prev ? ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        isEditing: true,
      },
    }) : prev);
    setIsEditing(true);
  };

  // Cancel editing a field
  const cancelEditing = (fieldName: keyof EditableFieldsState) => {
    if (!editableFields) return;
    setEditableFields(prev => prev ? ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        isEditing: false,
        value: prev[fieldName].originalValue,
      },
    }) : prev);

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName as string];
      return newErrors;
    });

    const stillEditing = Object.entries(editableFields).some(([key, field]) => (key as keyof EditableFieldsState) !== fieldName && field.isEditing);
    if (!stillEditing) {
      setIsEditing(false);
    }
  };

  // Save field changes
  const saveField = async (fieldName: keyof EditableFieldsState) => {
    if (!editableFields || !ticket) return;
    const field = editableFields[fieldName];

    const error = validateField(fieldName, field.value as any);
    if (error) {
      setErrors(prev => ({ ...prev, [fieldName as string]: error }));
      return;
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName as string];
      return newErrors;
    });

    setIsSubmitting(true);

    try {
      const updates: Partial<Ticket> = {};
      if (fieldName === 'dueDate') {
        const v = field.value as string;
        updates.dueDate = v ? new Date(v) : undefined;
      } else if (fieldName === 'estimatedHours') {
        const v = field.value as number | '';
        updates.estimatedHours = v !== '' ? Number(v) : undefined;
      } else if (fieldName === 'tags') {
        updates.tags = field.value as string[];
      } else if (fieldName === 'priority') {
        updates.priority = field.value as PriorityEnum;
      } else if (fieldName === 'title' || fieldName === 'description' || fieldName === 'assignee') {
        updates[field.field] = field.value as any;
      }

      actions.updateTicket(ticket.id, updates);

      setEditableFields(prev => prev ? ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          isEditing: false,
          originalValue: prev[fieldName].value,
        },
      }) : prev);

      const label = (fieldName as string).charAt(0).toUpperCase() + (fieldName as string).slice(1);
      const newHistoryItem: TicketHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        action: 'updated',
        field: fieldName,
        oldValue: field.originalValue as any,
        newValue: field.value as any,
        description: `${label} updated`,
      };
      setHistory(prev => [newHistoryItem, ...prev]);

      const stillEditing = Object.entries(editableFields).some(([key, f]) => (key as keyof EditableFieldsState) !== fieldName && f.isEditing);
      if (!stillEditing) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update ticket:', error);
      setErrors(prev => ({ ...prev, [fieldName as string]: 'Failed to save changes' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update field value
  const updateFieldValue = <K extends keyof EditableFieldsState>(fieldName: K, value: EditableFieldsState[K]['value']) => {
    setEditableFields(prev => prev ? ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
      },
    }) : prev);
  };

  // Handle tag toggle
  const toggleTag = (tag: string) => {
    if (!editableFields) return;
    const currentTags = editableFields.tags.value;
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t: string) => t !== tag)
      : [...currentTags, tag];

    updateFieldValue('tags', newTags);
  };

  // Handle delete confirmation
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (ticket && onDelete) {
      setIsDeletingTicket(true);
      try {
        onDelete(ticket.id);
        // Small delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 300));
        setShowDeleteConfirm(false);
        onClose();
      } catch (error) {
        console.error('Failed to delete ticket:', error);
      } finally {
        setIsDeletingTicket(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // Priority options
  const priorityOptions = [
    { value: PriorityEnum.LOW, label: 'Low' },
    { value: PriorityEnum.HIGH, label: 'High' },
    { value: PriorityEnum.URGENT, label: 'Urgent' },
  ];

  // Assignee options
  const assigneeOptions = mockAssignees.map(assignee => ({
    value: assignee,
    label: assignee,
  }));

  if (!ticket || !editableFields) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Ticket Details - ${ticket.id}`}
        size="large"
        className={styles.ticketDetailModal}
        closeOnOverlayClick={!isEditing}
        closeOnEscape={!isEditing}
      >
        <motion.div 
          className={styles.content}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Ticket Header */}
          <motion.div className={styles.header} variants={staggerItem}>
            <div className={styles.headerInfo}>
              <div className={styles.statusBadge}>
                <span className={`${styles.status} ${styles[ticket.status]}`}>
                  {getStatusLabel(ticket.status)}
                </span>
              </div>
              <div className={styles.priorityBadge}>
                <span className={`${styles.priority} ${styles[ticket.priority]}`}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                </span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <Button
                variant="outline"
                size="small"
                onClick={handleDeleteClick}
                disabled={isEditing}
              >
                Delete
              </Button>
            </div>
          </motion.div>

          {/* Ticket Fields */}
          <motion.div className={styles.fields} variants={staggerItem}>
            {/* Title Field */}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Title</label>
              {editableFields.title.isEditing ? (
                <div className={styles.editingField}>
                  <Input
                    value={editableFields.title.value}
                    onChange={(e) => updateFieldValue('title', e.target.value)}
                    error={errors.title}
                    fullWidth
                    autoFocus
                  />
                  <div className={styles.fieldActions}>
                    <Button
                      size="small"
                      variant="primary"
                      onClick={() => saveField('title')}
                      loading={isSubmitting}
                    >
                      Save
                    </Button>
                    <Button
                      size="small"
                      variant="ghost"
                      onClick={() => cancelEditing('title')}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={styles.fieldValue} onClick={() => startEditing('title')}>
                  <span>{editableFields.title.value}</span>
                  <Button variant="ghost" size="small" iconOnly>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </Button>
                </div>
              )}
            </div>

            {/* Description Field */}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Description</label>
              {editableFields.description.isEditing ? (
                <div className={styles.editingField}>
                  <Textarea
                    value={editableFields.description.value}
                    onChange={(e) => updateFieldValue('description', e.target.value)}
                    error={errors.description}
                    fullWidth
                    rows={4}
                    autoResize
                  />
                  <div className={styles.fieldActions}>
                    <Button
                      size="small"
                      variant="primary"
                      onClick={() => saveField('description')}
                      loading={isSubmitting}
                    >
                      Save
                    </Button>
                    <Button
                      size="small"
                      variant="ghost"
                      onClick={() => cancelEditing('description')}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={styles.fieldValue} onClick={() => startEditing('description')}>
                  <p>{editableFields.description.value}</p>
                  <Button variant="ghost" size="small" iconOnly>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </Button>
                </div>
              )}
            </div>

            {/* Priority and Assignee Row */}
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Priority</label>
                {editableFields.priority.isEditing ? (
                  <div className={styles.editingField}>
                    <Select
                      value={editableFields.priority.value}
                      onChange={(e) => updateFieldValue('priority', e.target.value as PriorityEnum)}
                      options={priorityOptions}
                      fullWidth
                    />
                    <div className={styles.fieldActions}>
                      <Button
                        size="small"
                        variant="primary"
                        onClick={() => saveField('priority')}
                        loading={isSubmitting}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        variant="ghost"
                        onClick={() => cancelEditing('priority')}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.fieldValue} onClick={() => startEditing('priority')}>
                    <span className={`${styles.priorityValue} ${styles[editableFields.priority.value]}`}>
                      {editableFields.priority.value.charAt(0).toUpperCase() + editableFields.priority.value.slice(1)}
                    </span>
                    <Button variant="ghost" size="small" iconOnly>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </Button>
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Assignee</label>
                {editableFields.assignee.isEditing ? (
                  <div className={styles.editingField}>
                    <Select
                      value={editableFields.assignee.value}
                      onChange={(e) => updateFieldValue('assignee', e.target.value)}
                      options={assigneeOptions}
                      fullWidth
                    />
                    <div className={styles.fieldActions}>
                      <Button
                        size="small"
                        variant="primary"
                        onClick={() => saveField('assignee')}
                        loading={isSubmitting}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        variant="ghost"
                        onClick={() => cancelEditing('assignee')}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.fieldValue} onClick={() => startEditing('assignee')}>
                    <span>{editableFields.assignee.value}</span>
                    <Button variant="ghost" size="small" iconOnly>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Due Date and Estimated Hours Row */}
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Due Date</label>
                {editableFields.dueDate.isEditing ? (
                  <div className={styles.editingField}>
                    <Input
                      type="date"
                      value={editableFields.dueDate.value}
                      onChange={(e) => updateFieldValue('dueDate', e.target.value)}
                      error={errors.dueDate}
                      fullWidth
                    />
                    <div className={styles.fieldActions}>
                      <Button
                        size="small"
                        variant="primary"
                        onClick={() => saveField('dueDate')}
                        loading={isSubmitting}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        variant="ghost"
                        onClick={() => cancelEditing('dueDate')}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.fieldValue} onClick={() => startEditing('dueDate')}>
                    <span>
                      {editableFields.dueDate.value
                        ? new Date(editableFields.dueDate.value).toLocaleDateString()
                        : 'No due date set'}
                    </span>
                    <Button variant="ghost" size="small" iconOnly>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </Button>
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Estimated Hours</label>
                {editableFields.estimatedHours.isEditing ? (
                  <div className={styles.editingField}>
                    <Input
                      type="number"
                      value={editableFields.estimatedHours.value}
                      onChange={(e) => updateFieldValue('estimatedHours', e.target.value === '' ? '' : Number(e.target.value))}
                      error={errors.estimatedHours}
                      fullWidth
                      min="0"
                      step="0.5"
                    />
                    <div className={styles.fieldActions}>
                      <Button
                        size="small"
                        variant="primary"
                        onClick={() => saveField('estimatedHours')}
                        loading={isSubmitting}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        variant="ghost"
                        onClick={() => cancelEditing('estimatedHours')}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.fieldValue} onClick={() => startEditing('estimatedHours')}>
                    <span>
                      {editableFields.estimatedHours.value !== '' && editableFields.estimatedHours.value !== undefined
                        ? `${editableFields.estimatedHours.value} hours`
                        : 'Not estimated'}
                    </span>
                    <Button variant="ghost" size="small" iconOnly>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Tags Field */}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Tags</label>
              {editableFields.tags.isEditing ? (
                <div className={styles.editingField}>
                  <div className={styles.tagsContainer}>
                    {mockTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        className={`${styles.tagButton} ${editableFields.tags.value.includes(tag) ? styles.tagSelected : ''}`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <div className={styles.fieldActions}>
                    <Button
                      size="small"
                      variant="primary"
                      onClick={() => saveField('tags')}
                      loading={isSubmitting}
                    >
                      Save
                    </Button>
                    <Button
                      size="small"
                      variant="ghost"
                      onClick={() => cancelEditing('tags')}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={styles.fieldValue} onClick={() => startEditing('tags')}>
                  <div className={styles.tagsDisplay}>
                    {editableFields.tags.value.length > 0 ? (
                      editableFields.tags.value.map((tag: string) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className={styles.emptyValue}>No tags</span>
                    )}
                  </div>
                  <Button variant="ghost" size="small" iconOnly>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Ticket History */}
          <motion.div className={styles.history} variants={staggerItem}>
            <h3 className={styles.historyTitle}>Activity History</h3>
            <div className={styles.historyList}>
              <AnimatePresence>
                {history.map((item) => (
                  <motion.div
                    key={item.id}
                    className={styles.historyItem}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={styles.historyIcon}>
                      {item.action === 'created' && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="16"></line>
                          <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                      )}
                      {item.action === 'updated' && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      )}
                      {item.action === 'moved' && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9,10 4,15 9,20"></polyline>
                          <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
                        </svg>
                      )}
                    </div>
                    <div className={styles.historyContent}>
                      <p className={styles.historyDescription}>{item.description}</p>
                      <span className={styles.historyTime}>
                        {item.timestamp.toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </Modal>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Ticket"
        message={`Are you sure you want to delete "${ticket?.title}"? This action cannot be undone and will permanently remove all associated data.`}
        confirmText="Delete Ticket"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeletingTicket}
      />
    </>
  );
};

export default TicketDetailModal;
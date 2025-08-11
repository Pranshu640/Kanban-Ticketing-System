import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Priority } from '../../types';
import { mockAssignees, mockTags } from '../../data';
import { staggerContainer, staggerItem } from '../../utils/animations';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import styles from './TicketForm.module.css';

export interface TicketFormData {
  title: string;
  description: string;
  priority: Priority;
  assignee: string;
  dueDate: string;
  tags: string[];
  estimatedHours: number | undefined;
}

export interface TicketFormProps {
  onSubmit: (data: TicketFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<TicketFormData>;
}

interface FormErrors {
  title?: string;
  description?: string;
  priority?: string;
  assignee?: string;
  dueDate?: string;
  estimatedHours?: string;
}

const TicketForm: React.FC<TicketFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<TicketFormData>({
    title: initialData.title || '',
    description: initialData.description || '',
    priority: initialData.priority || Priority.MEDIUM,
    assignee: initialData.assignee || '',
    dueDate: initialData.dueDate || '',
    tags: initialData.tags || [],
    estimatedHours: initialData.estimatedHours,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation rules
  const validateField = useCallback((name: string, value: any): string | undefined => {
    switch (name) {
      case 'title':
        if (!value || value.trim().length === 0) {
          return 'Title is required';
        }
        if (value.trim().length < 3) {
          return 'Title must be at least 3 characters long';
        }
        if (value.trim().length > 100) {
          return 'Title must be less than 100 characters';
        }
        break;

      case 'description':
        if (!value || value.trim().length === 0) {
          return 'Description is required';
        }
        if (value.trim().length < 10) {
          return 'Description must be at least 10 characters long';
        }
        if (value.trim().length > 1000) {
          return 'Description must be less than 1000 characters';
        }
        break;

      case 'priority':
        if (!value || !Object.values(Priority).includes(value)) {
          return 'Please select a valid priority';
        }
        break;

      case 'assignee':
        if (!value || value.trim().length === 0) {
          return 'Assignee is required';
        }
        break;

      case 'dueDate':
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (selectedDate < today) {
            return 'Due date cannot be in the past';
          }
        }
        break;

      case 'estimatedHours':
        if (value !== undefined && value !== '') {
          const hours = Number(value);
          if (isNaN(hours) || hours < 0) {
            return 'Estimated hours must be a positive number';
          }
          if (hours > 1000) {
            return 'Estimated hours must be less than 1000';
          }
        }
        break;

      default:
        break;
    }
    return undefined;
  }, []);

  // Validate all fields
  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof TicketFormData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    return newErrors;
  }, [formData, validateField]);

  // Handle field changes
  const handleFieldChange = useCallback((name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  }, [touched, validateField]);

  // Handle field blur (mark as touched)
  const handleFieldBlur = useCallback((name: string) => {
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    // Validate field on blur
    const error = validateField(name, formData[name as keyof TicketFormData]);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, [formData, validateField]);

  // Handle tag selection
  const handleTagToggle = useCallback((tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = Object.keys(formData);
    setTouched(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));

    // Validate form
    const formErrors = validateForm();
    setErrors(formErrors);

    // Submit if no errors
    if (Object.keys(formErrors).length === 0) {
      onSubmit(formData);
    }
  }, [formData, validateForm, onSubmit]);

  // Priority options
  const priorityOptions = [
    { value: Priority.LOW, label: 'Low' },
    { value: Priority.MEDIUM, label: 'Medium' },
    { value: Priority.HIGH, label: 'High' },
    { value: Priority.URGENT, label: 'Urgent' },
  ];

  // Assignee options
  const assigneeOptions = mockAssignees.map(assignee => ({
    value: assignee,
    label: assignee,
  }));

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className={styles.form} 
      noValidate
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.formGrid}>
        {/* Title */}
        <motion.div className={styles.formField} variants={staggerItem}>
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            onBlur={() => handleFieldBlur('title')}
            error={errors.title}
            required
            fullWidth
            placeholder="Enter ticket title..."
            maxLength={100}
          />
        </motion.div>

        {/* Description */}
        <motion.div className={styles.formField} variants={staggerItem}>
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            onBlur={() => handleFieldBlur('description')}
            error={errors.description}
            required
            fullWidth
            placeholder="Describe the ticket in detail..."
            rows={4}
            maxLength={1000}
            showCharacterCount
            autoResize
          />
        </motion.div>

        {/* Priority and Assignee Row */}
        <motion.div className={styles.formRow} variants={staggerItem}>
          <div className={styles.formField}>
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => handleFieldChange('priority', e.target.value as Priority)}
              onBlur={() => handleFieldBlur('priority')}
              error={errors.priority}
              required
              fullWidth
              options={priorityOptions}
              placeholder="Select priority..."
            />
          </div>

          <div className={styles.formField}>
            <Select
              label="Assignee"
              value={formData.assignee}
              onChange={(e) => handleFieldChange('assignee', e.target.value)}
              onBlur={() => handleFieldBlur('assignee')}
              error={errors.assignee}
              required
              fullWidth
              options={assigneeOptions}
              placeholder="Select assignee..."
            />
          </div>
        </motion.div>

        {/* Due Date and Estimated Hours Row */}
        <motion.div className={styles.formRow} variants={staggerItem}>
          <div className={styles.formField}>
            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleFieldChange('dueDate', e.target.value)}
              onBlur={() => handleFieldBlur('dueDate')}
              error={errors.dueDate}
              fullWidth
            />
          </div>

          <div className={styles.formField}>
            <Input
              label="Estimated Hours"
              type="number"
              value={formData.estimatedHours || ''}
              onChange={(e) => handleFieldChange('estimatedHours', e.target.value ? Number(e.target.value) : undefined)}
              onBlur={() => handleFieldBlur('estimatedHours')}
              error={errors.estimatedHours}
              fullWidth
              placeholder="Optional"
              min="0"
              max="1000"
              step="0.5"
            />
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div className={styles.formField} variants={staggerItem}>
          <label className={styles.tagsLabel}>Tags</label>
          <div className={styles.tagsContainer}>
            {mockTags.map(tag => (
              <button
                key={tag}
                type="button"
                className={`${styles.tagButton} ${
                  formData.tags.includes(tag) ? styles.tagSelected : ''
                }`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Form Actions */}
      <motion.div className={styles.formActions} variants={staggerItem}>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Ticket'}
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default TicketForm;
import React, { useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import type { Ticket as TicketType } from '../../types';
import { Priority, ItemTypes } from '../../types';
import { hoverLift, tapScale } from '../../utils/animations';
import Card from '../ui/Card';
import Button from '../ui/Button';
import styles from './Ticket.module.css';

export interface TicketProps {
  ticket: TicketType;
  onEdit?: (ticket: TicketType) => void;
  onDelete?: (ticketId: string) => void;
  onClick?: (ticket: TicketType) => void;
  onViewDetails?: (ticket: TicketType) => void;
  className?: string;
}

const Ticket: React.FC<TicketProps> = ({
  ticket,
  onEdit,
  onDelete,
  onClick,
  onViewDetails,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Set up drag functionality
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TICKET,
    item: {
      type: ItemTypes.TICKET,
      id: ticket.id,
      status: ticket.status,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult() as { status: string; columnId: string } | null;
      if (item && dropResult) {
        // Optional: Add success feedback here
        console.log(`Moved ticket ${item.id} to ${dropResult.status}`);
      }
    },
  }), [ticket.id, ticket.status]);

  useEffect(() => {
    drag(ref.current);
  }, [drag]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(ticket);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(ticket.id);
  };

  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails(ticket);
    } else {
      onClick?.(ticket);
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.priorityIcon}
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
      case Priority.HIGH:
        return (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.priorityIcon}
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case Priority.LOW:
        return (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.priorityIcon}
          >
            <path d="M7 13l3 3 7-7"></path>
            <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  const actions = (
    <div className={styles.ticketActions}>
      {onViewDetails && (
        <Button
          variant="ghost"
          size="small"
          iconOnly
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(ticket);
          }}
          title="View details"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </Button>
      )}
      {onEdit && (
        <Button
          variant="ghost"
          size="small"
          iconOnly
          onClick={handleEdit}
          title="Edit ticket"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </Button>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="small"
          iconOnly
          onClick={handleDelete}
          title="Delete ticket"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3,6 5,6 21,6"></polyline>
            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </Button>
      )}
    </div>
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`${styles.ticketWrapper} ${isDragging ? styles.dragging : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`Ticket: ${ticket.title}. Priority: ${ticket.priority}. Status: ${ticket.status}. Assigned to: ${ticket.assignee}. Press Enter to view details or drag to move.`}
      aria-describedby={`ticket-desc-${ticket.id}`}
      title="Drag to move this ticket to another column or press Enter to view details"
      onKeyDown={handleKeyDown}
      layout
      layoutId={`ticket-${ticket.id}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        y: 0, 
        scale: isDragging ? 1.05 : 1,
        rotate: isDragging ? 2 : 0,
        zIndex: isDragging ? 1000 : 1
      }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      whileHover={!isDragging ? hoverLift : {}}
      whileTap={!isDragging ? tapScale : {}}
      drag={false} // Let react-dnd handle dragging
    >
      <Card
        title={ticket.title}
        subtitle={ticket.id}
        priority={ticket.priority}
        status={ticket.status}
        tags={ticket.tags}
        dueDate={ticket.dueDate}
        assignee={ticket.assignee}
        clickable={!!(onClick || onViewDetails)}
        onClick={handleClick}
        actions={actions}
        className={`${styles.ticket} ${className}`}
      >
      <div className={styles.ticketContent}>
        <div className={styles.prioritySection}>
          {getPriorityIcon(ticket.priority)}
          <span 
            className={`${styles.priorityLabel} ${styles[ticket.priority]}`}
aria-label={`Priority: ${ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}`}
          >
{(() => {
              const priorityLabels = {
                'low': 'Low',
                'high': 'High',
                'urgent': 'Urgent'
              };
              return priorityLabels[ticket.priority as keyof typeof priorityLabels] || ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1);
            })()}
          </span>
        </div>
        
        {ticket.description && (
          <p 
            className={styles.description}
            id={`ticket-desc-${ticket.id}`}
            aria-label="Ticket description"
          >
            {ticket.description.length > 120 
              ? `${ticket.description.substring(0, 120)}...` 
              : ticket.description
            }
          </p>
        )}
        
        {ticket.estimatedHours && (
          <div 
            className={styles.estimatedHours}
            aria-label={`Estimated time: ${ticket.estimatedHours} hours`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
            {ticket.estimatedHours}h estimated
          </div>
        )}
      </div>
    </Card>
    </motion.div>
  );
};

export default Ticket;
import React from 'react';
import { motion } from 'framer-motion';
import { Priority, TicketStatus } from '../../types';
import styles from './Card.module.css';

export interface CardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  clickable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  priority?: Priority;
  status?: TicketStatus;
  tags?: string[];
  dueDate?: Date;
  assignee?: string;
  className?: string;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  actions,
  size = 'medium',
  clickable = false,
  loading = false,
  disabled = false,
  fullWidth = false,
  priority,
  status,
  tags,
  dueDate,
  assignee,
  className = '',
  onClick,
  onKeyDown,
}) => {
  const cardClasses = [
    styles.card,
    styles[size],
    clickable && styles.clickable,
    loading && styles.loading,
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
    priority && styles.hasPriorityIndicator,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (clickable && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick?.();
    }
    onKeyDown?.(event);
  };

  const formatDueDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, className: styles.overdue };
    } else if (diffDays === 0) {
      return { text: 'Due today', className: styles.warning };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', className: styles.warning };
    } else if (diffDays <= 3) {
      return { text: `Due in ${diffDays} days`, className: styles.warning };
    } else {
      return { text: `Due in ${diffDays} days`, className: '' };
    }
  };

  const getStatusDisplay = (status: TicketStatus) => {
    const statusMap = {
      [TicketStatus.TODO]: { label: 'To Do', className: styles.todo },
      [TicketStatus.IN_PROGRESS]: { label: 'In Progress', className: styles.inProgress },
      [TicketStatus.IN_REVIEW]: { label: 'In Review', className: styles.inReview },
      [TicketStatus.DONE]: { label: 'Done', className: styles.done },
    };
    return statusMap[status];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2);
  };

  const dueDateInfo = dueDate ? formatDueDate(dueDate) : null;
  const statusInfo = status ? getStatusDisplay(status) : null;

  return (
    <motion.div
      className={cardClasses}
      onClick={clickable ? onClick : undefined}
      onKeyDown={clickable ? handleKeyDown : undefined}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      aria-disabled={disabled}
      whileHover={clickable && !disabled ? { 
        y: -2,
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.2 }
      } : {}}
      whileTap={clickable && !disabled ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {priority && (
        <div className={`${styles.priorityIndicator} ${styles[priority]}`} />
      )}
      
      {(title || subtitle || actions) && (
        <div className={styles.header}>
          <div>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      
      {children && <div className={styles.content}>{children}</div>}
      
      {tags && tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {(footer || status || dueDate || assignee) && (
        <div className={styles.footer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            {status && (
              <span className={`${styles.statusIndicator} ${statusInfo?.className}`}>
                {statusInfo?.label}
              </span>
            )}
            
            {dueDate && (
              <div className={`${styles.dueDate} ${dueDateInfo?.className}`}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {dueDateInfo?.text}
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            {assignee && (
              <div className={styles.avatar} title={assignee}>
                {getInitials(assignee)}
              </div>
            )}
            {footer}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Card;
import React, { useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import type { Column as ColumnType, Ticket as TicketType, DragItem, TicketStatus } from '../../types';
import { ItemTypes } from '../../types';
import { useTickets } from '../../contexts';
import { staggerContainer, staggerItem, fadeInUp } from '../../utils/animations';
import Ticket from '../ticket/Ticket';
import styles from './Column.module.css';

export interface ColumnProps {
  column: ColumnType;
  tickets: TicketType[];
  onTicketEdit?: (ticket: TicketType) => void;
  onTicketDelete?: (ticketId: string) => void;
  onTicketClick?: (ticket: TicketType) => void;
  onTicketViewDetails?: (ticket: TicketType) => void;
  className?: string;
}

const Column: React.FC<ColumnProps> = ({
  column,
  tickets,
  onTicketEdit,
  onTicketDelete,
  onTicketClick,
  onTicketViewDetails,
  className = '',
}) => {
  const { actions } = useTickets();
  const ref = useRef<HTMLDivElement>(null);
  const ticketCount = tickets.length;
  const isOverLimit = column.limit && ticketCount > column.limit;

  // Set up drop functionality
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.TICKET,
    drop: (item: DragItem) => {
      if (item.status !== column.status) {
        try {
          actions.moveTicket(item.id, column.status as TicketStatus);
          // Optional: Add success feedback
          console.log(`Successfully moved ticket ${item.id} to ${column.title}`);
        } catch (error) {
          console.error('Failed to move ticket:', error);
          // Optional: Add error feedback to user
        }
      }
      return { status: column.status, columnId: column.id };
    },
    canDrop: (item: DragItem) => {
      // Prevent dropping in the same column
      const isSameColumn = item.status === column.status;
      
      // Check if column has a limit and would exceed it
      const wouldExceedLimit = column.limit && ticketCount >= column.limit;
      
      return !isSameColumn && !wouldExceedLimit;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [column.status, column.id, column.limit, ticketCount, actions]);

  useEffect(() => {
    drop(ref.current);
  }, [drop]);

  const getStatusIcon = () => {
    switch (column.status) {
      case 'todo':
        return (
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
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
      case 'in-progress':
        return (
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
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="10,8 16,12 10,16 10,8"></polygon>
          </svg>
        );
      case 'in-review':
        return (
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
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        );
      case 'done':
        return (
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22,4 12,14.01 9,11.01"></polyline>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      ref={ref}
      className={`${styles.column} ${className} ${
        isOver && canDrop ? styles.dropTarget : ''
      } ${isOver && !canDrop ? styles.invalidDrop : ''}`}
      role="region"
      aria-label={`${column.title} column - ${ticketCount} tickets`}
      aria-describedby={`column-${column.id}-description`}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      whileHover={{
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 }
      }}
    >
      <div className={styles.columnHeader}>
        <div className={styles.columnTitle}>
          <div 
            className={styles.columnIndicator}
            style={{ backgroundColor: column.color }}
          />
          {getStatusIcon()}
          <h2 className={styles.title}>{column.title}</h2>
          <span 
            id={`column-${column.id}-description`} 
            className="sr-only"
          >
            Drop zone for {column.title.toLowerCase()} tickets
          </span>
        </div>
        
        <div className={styles.columnMeta}>
          <span 
            className={`${styles.ticketCount} ${isOverLimit ? styles.overLimit : ''}`}
            title={column.limit ? `${ticketCount} of ${column.limit} tickets` : `${ticketCount} tickets`}
          >
            {ticketCount}
            {column.limit && (
              <span className={styles.limit}>/{column.limit}</span>
            )}
          </span>
        </div>
      </div>

      <div className={styles.columnContent}>
        {tickets.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="15"></line>
                <line x1="15" y1="9" x2="9" y2="15"></line>
              </svg>
            </div>
            <p className={styles.emptyText}>No tickets in {column.title.toLowerCase()}</p>
            <p className={styles.emptySubtext}>
              {column.status === 'todo' && 'Create a new ticket to get started'}
              {column.status === 'in-progress' && 'Move tickets here when work begins'}
              {column.status === 'in-review' && 'Move completed work here for review'}
              {column.status === 'done' && 'Completed tickets will appear here'}
            </p>
          </div>
        ) : (
          <motion.div 
            className={styles.ticketList}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {tickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  variants={staggerItem}
                  layout
                  layoutId={ticket.id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{
                    layout: { duration: 0.3, ease: "easeInOut" }
                  }}
                >
                  <Ticket
                    ticket={ticket}
                    onEdit={onTicketEdit}
                    onDelete={onTicketDelete}
                    onClick={onTicketClick}
                    onViewDetails={onTicketViewDetails}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            <AnimatePresence>
              {isOver && canDrop && (
                <motion.div 
                  className={styles.dropIndicator}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.dropIndicatorContent}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9,11 12,14 15,11"></polyline>
                      <polyline points="9,7 12,10 15,7"></polyline>
                    </svg>
                    Drop ticket here
                  </div>
                </motion.div>
              )}
              {isOver && !canDrop && (
                <motion.div 
                  className={styles.dropIndicatorInvalid}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.dropIndicatorContent}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    {column.limit && ticketCount >= column.limit 
                      ? 'Column limit reached' 
                      : 'Cannot drop here'
                    }
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Column;
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Ticket as TicketType } from '../../types';
import { useTickets, useToast } from '../../contexts';
import { ConfirmationModal, SearchAndFilter, EmptyState } from '../ui';
import Column from './Column';
import styles from './Board.module.css';

export interface BoardProps {
  onTicketEdit?: (ticket: TicketType) => void;
  onTicketClick?: (ticket: TicketType) => void;
  onTicketViewDetails?: (ticket: TicketType) => void;
  className?: string;
}

const Board: React.FC<BoardProps> = ({
  onTicketEdit,
  onTicketClick,
  onTicketViewDetails,
  className = '',
}) => {
  const { state, actions } = useTickets();
  const { showToast } = useToast();
  const { board, filteredTickets, isLoading, error } = state;
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    ticketId: string | null;
    ticketTitle: string;
  }>({
    isOpen: false,
    ticketId: null,
    ticketTitle: '',
  });
  const [isDeletingTicket, setIsDeletingTicket] = useState(false);
  const [, setFocusedColumnIndex] = useState(0);

  // Keyboard navigation for columns
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.target !== document.body) return; // Only handle when no specific element is focused

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        setFocusedColumnIndex((prev) => Math.max(0, prev - 1));
        break;
      case 'ArrowRight':
        event.preventDefault();
        setFocusedColumnIndex((prev) => Math.min(board.columns.length - 1, prev + 1));
        break;
      case 'Home':
        event.preventDefault();
        setFocusedColumnIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusedColumnIndex(board.columns.length - 1);
        break;
    }
  }, [board.columns.length]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleTicketDelete = (ticketId: string) => {
    const ticket = filteredTickets.find(t => t.id === ticketId);
    if (ticket) {
      setDeleteConfirmation({
        isOpen: true,
        ticketId,
        ticketTitle: ticket.title,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation.ticketId) {
      setIsDeletingTicket(true);
      try {
        actions.deleteTicket(deleteConfirmation.ticketId);
        // Show success toast
        showToast(`Ticket "${deleteConfirmation.ticketTitle}" has been deleted successfully`, 'success');
        // Small delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error('Failed to delete ticket:', error);
        showToast('Failed to delete ticket. Please try again.', 'error');
      } finally {
        setIsDeletingTicket(false);
        setDeleteConfirmation({
          isOpen: false,
          ticketId: null,
          ticketTitle: '',
        });
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      isOpen: false,
      ticketId: null,
      ticketTitle: '',
    });
  };

  // Group filtered tickets by status
  const getTicketsForColumn = (columnStatus: string) => {
    return filteredTickets.filter(ticket => ticket.status === columnStatus);
  };

  if (isLoading) {
    return (
      <motion.div 
        className={`${styles.board} ${styles.loading} ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.loadingContent}>
          <motion.div 
            className={styles.loadingSpinner}
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
              <line x1="2" y1="12" x2="6" y2="12"></line>
              <line x1="18" y1="12" x2="22" y2="12"></line>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
          </motion.div>
          <motion.p 
            className={styles.loadingText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading board...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.board} ${styles.error} ${className}`}>
        <div className={styles.errorContent}>
          <div className={styles.errorIcon}>
            <svg
              width="48"
              height="48"
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
          </div>
          <h3 className={styles.errorTitle}>Failed to load board</h3>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => actions.refreshBoard()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!board.columns.length) {
    return (
      <div className={`${styles.board} ${className}`}>
        <EmptyState
          title="No board configured"
          description="There are no columns configured for this board."
          action={{
            label: "Refresh Board",
            onClick: () => actions.refreshBoard(),
            variant: "primary"
          }}
          icon={
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          }
        />
      </div>
    );
  }

  return (
    <>
      <div 
        className={`${styles.board} ${className}`}
        role="main"
        aria-label="Kanban board"
      >
        <div className={styles.boardHeader}>
          <div className={styles.boardTitle}>
            <h1 id="board-title">{board.name}</h1>
            <div className={styles.boardStats} aria-live="polite">
              <span 
                className={styles.totalTickets}
                aria-label={`${filteredTickets.length} tickets currently displayed`}
              >
                {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
              </span>
              {filteredTickets.length !== board.tickets.length && (
                <span 
                  className={styles.filteredIndicator}
                  aria-label={`Filtered view showing ${filteredTickets.length} of ${board.tickets.length} total tickets`}
                >
                  (filtered from {board.tickets.length})
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.searchAndFilterSection}>
          <SearchAndFilter 
            className={styles.searchAndFilter}
            collapsedByDefault={true}
          />
        </div>

        <motion.div 
          className={styles.boardContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.1,
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
          role="region"
          aria-labelledby="board-title"
          aria-describedby="board-stats"
        >
          <motion.div 
            className={styles.columnsContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.2,
              staggerChildren: 0.1
            }}
            role="group"
            aria-label="Board columns"
          >
            {board.columns.map((column, index) => {
              const columnTickets = getTicketsForColumn(column.status);
              
              return (
                <motion.div
                  key={column.id}
                  initial={{ opacity: 0, x: -30, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.1 * index,
                    type: "spring",
                    stiffness: 120,
                    damping: 15
                  }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Column
                    column={column}
                    tickets={columnTickets}
                    onTicketEdit={onTicketEdit}
                    onTicketDelete={handleTicketDelete}
                    onTicketClick={onTicketClick}
                    onTicketViewDetails={onTicketViewDetails}
                    className={styles.boardColumn}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Ticket"
        message={`Are you sure you want to delete "${deleteConfirmation.ticketTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeletingTicket}
      />
    </>
  );
};

export default Board;
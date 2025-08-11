import React, { useState, useCallback } from 'react';
import Modal from '../ui/Modal';
import TicketForm from './TicketForm';
import type { TicketFormData } from './TicketForm';
import { useTickets } from '../../contexts';
import { TicketStatus } from '../../types';
import styles from './TicketModal.module.css';

export interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { actions } = useTickets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = useCallback(async (formData: TicketFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create the ticket
      actions.createTicket({
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        assignee: formData.assignee,
        status: TicketStatus.TODO,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        tags: formData.tags,
        estimatedHours: formData.estimatedHours,
      });

      // Show success feedback
      setShowSuccess(true);
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

      // Close modal after brief delay to show success
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Failed to create ticket:', error);
      // In a real app, you'd show an error message here
    } finally {
      setIsSubmitting(false);
    }
  }, [actions, onClose, onSuccess]);

  // Handle modal close
  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setShowSuccess(false);
      onClose();
    }
  }, [isSubmitting, onClose]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (!isSubmitting) {
      handleClose();
    }
  }, [isSubmitting, handleClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Ticket"
      size="large"
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
      showCloseButton={!isSubmitting}
      className={styles.ticketModal}
    >
      {showSuccess ? (
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
          </div>
          <h3 className={styles.successTitle}>Ticket Created Successfully!</h3>
          <p className={styles.successDescription}>
            Your new ticket has been added to the board and is ready for work.
          </p>
        </div>
      ) : (
        <TicketForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      )}
    </Modal>
  );
};

export default TicketModal;
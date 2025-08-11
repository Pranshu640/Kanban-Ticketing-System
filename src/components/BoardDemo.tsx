import React, { useState } from 'react';
import { Board } from './board';
import { TicketDetailModal } from './ticket';
import { ResponsiveLayout, useBreakpoint } from './ui';
import type { Ticket } from '../types';
import { useTickets, useToast } from '../contexts';
import styles from './BoardDemo.module.css';

const BoardDemoContent: React.FC = () => {
  const { actions, state } = useTickets();
  const { showToast } = useToast();
  const breakpoint = useBreakpoint();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailModalOpen(true);
  };

  const handleTicketEdit = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailModalOpen(true);
  };

  const handleTicketDelete = (ticketId: string) => {
    const ticket = state.board.tickets.find(t => t.id === ticketId);
    actions.deleteTicket(ticketId);
    
    // Show success toast
    if (ticket) {
      showToast(`Ticket "${ticket.title}" has been deleted successfully`, 'success');
    }
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedTicket(null);
  };

  return (
    <ResponsiveLayout>
      <div className={styles.demo}>
        <div className={styles.demoHeader}>
          <h1>Kanban Board Demo</h1>
          <p className={breakpoint.isMobile ? styles.mobileSubtitle : ''}>
            Interactive ticket management system with drag-and-drop functionality
          </p>
        </div>
        
        <div className={styles.boardContainer}>
          <Board
            onTicketClick={handleTicketClick}
            onTicketEdit={handleTicketEdit}
            onTicketViewDetails={handleTicketClick}
          />
        </div>
      </div>

      <TicketDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleDetailModalClose}
        ticket={selectedTicket}
        onDelete={handleTicketDelete}
      />
    </ResponsiveLayout>
  );
};

const BoardDemo: React.FC = () => {
  return <BoardDemoContent />;
};

export default BoardDemo;
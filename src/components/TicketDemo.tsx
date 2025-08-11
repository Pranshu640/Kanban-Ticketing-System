import React, { useState } from 'react';
import { useTickets } from '../contexts';
import { Button } from './ui';
import { TicketModal } from './ticket';

const TicketDemo: React.FC = () => {
  const { state } = useTickets();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTicketCreated = () => {
    console.log('Ticket created successfully!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Ticket Creation Demo</h3>
      <p>Total tickets: {state.board.tickets.length}</p>
      
      <Button onClick={handleOpenModal} variant="primary">
        Create New Ticket
      </Button>

      {state.board.tickets.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>Recent Tickets:</h4>
          <ul>
            {state.board.tickets.slice(-3).map(ticket => (
              <li key={ticket.id}>
                <strong>{ticket.title}</strong> - {ticket.priority} - {ticket.assignee}
              </li>
            ))}
          </ul>
        </div>
      )}

      <TicketModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleTicketCreated}
      />
    </div>
  );
};

export default TicketDemo;
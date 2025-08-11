import React from 'react';
import { SearchAndFilter } from './ui';
import { ThemeProvider, TicketProvider, ToastProvider, useTickets } from '../contexts';
import styles from './SearchFilterDemo.module.css';

const SearchFilterDemoContent: React.FC = () => {
  const { state } = useTickets();
  const { board, filteredTickets, filters } = state;

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.priorities.length > 0) count++;
    if (filters.assignees.length > 0) count++;
    if (filters.statuses.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.overdue) count++;
    return count;
  };

  return (
    <div className={styles.demo}>
      <div className={styles.header}>
        <h1>Search & Filter Demo</h1>
        <p>Test the search and filtering functionality</p>
      </div>

      <div className={styles.searchFilterContainer}>
        <SearchAndFilter 
          collapsedByDefault={false}
          className={styles.searchFilter}
        />
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Tickets:</span>
          <span className={styles.statValue}>{board.tickets.length}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Filtered Tickets:</span>
          <span className={styles.statValue}>{filteredTickets.length}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Active Filters:</span>
          <span className={styles.statValue}>{getActiveFiltersCount()}</span>
        </div>
      </div>

      <div className={styles.ticketsList}>
        <h3>Filtered Tickets ({filteredTickets.length})</h3>
        {filteredTickets.length === 0 ? (
          <div className={styles.noTickets}>
            <p>No tickets match the current filters.</p>
          </div>
        ) : (
          <div className={styles.tickets}>
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className={styles.ticketCard}>
                <div className={styles.ticketHeader}>
                  <h4 className={styles.ticketTitle}>{ticket.title}</h4>
                  <span className={`${styles.priority} ${styles[ticket.priority]}`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                </div>
                <div className={styles.ticketMeta}>
                  <span className={styles.status}>{ticket.status}</span>
                  <span className={styles.assignee}>{ticket.assignee}</span>
                </div>
                {ticket.tags.length > 0 && (
                  <div className={styles.tags}>
                    {ticket.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {ticket.dueDate && (
                  <div className={styles.dueDate}>
                    Due: {new Date(ticket.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SearchFilterDemo: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <TicketProvider>
          <SearchFilterDemoContent />
        </TicketProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default SearchFilterDemo;
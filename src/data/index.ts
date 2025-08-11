import type { Ticket, Column, Board } from '../types';
import { TicketStatus, Priority } from '../types';

// Mock assignees data
export const mockAssignees = [
  'Alice Johnson',
  'Bob Smith',
  'Carol Davis',
  'David Wilson',
  'Emma Brown',
  'Frank Miller',
  'Grace Lee',
  'Henry Taylor',
];

// Mock tags for tickets
export const mockTags = [
  'frontend',
  'backend',
  'bug',
  'feature',
  'urgent',
  'design',
  'testing',
  'documentation',
  'api',
  'database',
  'security',
  'performance',
];

// Mock project types and descriptions
const mockTicketTemplates = [
  {
    title: 'Implement user authentication system',
    description: 'Create a secure authentication system with JWT tokens, password hashing, and session management.',
    tags: ['backend', 'security', 'api'],
  },
  {
    title: 'Design responsive navigation component',
    description: 'Build a mobile-first navigation component that adapts to different screen sizes and includes accessibility features.',
    tags: ['frontend', 'design'],
  },
  {
    title: 'Fix memory leak in data processing',
    description: 'Investigate and resolve memory leak occurring during large dataset processing operations.',
    tags: ['bug', 'performance', 'backend'],
  },
  {
    title: 'Add dark mode theme support',
    description: 'Implement dark mode theme with proper color contrast and user preference persistence.',
    tags: ['frontend', 'feature', 'design'],
  },
  {
    title: 'Optimize database query performance',
    description: 'Review and optimize slow database queries, add proper indexing, and implement query caching.',
    tags: ['database', 'performance', 'backend'],
  },
  {
    title: 'Create API documentation',
    description: 'Write comprehensive API documentation with examples, error codes, and integration guides.',
    tags: ['documentation', 'api'],
  },
  {
    title: 'Implement real-time notifications',
    description: 'Add WebSocket-based real-time notifications for user actions and system events.',
    tags: ['feature', 'backend', 'api'],
  },
  {
    title: 'Add unit tests for payment module',
    description: 'Write comprehensive unit tests for the payment processing module to ensure reliability.',
    tags: ['testing', 'backend'],
  },
  {
    title: 'Update user profile interface',
    description: 'Redesign the user profile page with improved UX and additional customization options.',
    tags: ['frontend', 'design', 'feature'],
  },
  {
    title: 'Security audit and vulnerability fixes',
    description: 'Conduct security audit and fix identified vulnerabilities in authentication and data handling.',
    tags: ['security', 'urgent', 'backend'],
  },
];

// Utility function to generate random date within range
const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Utility function to get random items from array
const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate a single mock ticket
const generateMockTicket = (id: string, status?: TicketStatus): Ticket => {
  const template = mockTicketTemplates[Math.floor(Math.random() * mockTicketTemplates.length)];
  const assignee = mockAssignees[Math.floor(Math.random() * mockAssignees.length)];
  const priority = Object.values(Priority)[Math.floor(Math.random() * Object.values(Priority).length)];
  
  const now = new Date();
  const createdAt = getRandomDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), now); // Last 30 days
  const updatedAt = getRandomDate(createdAt, now);
  
  // Generate due date (some tickets might not have one)
  let dueDate: Date | undefined;
  if (Math.random() > 0.3) { // 70% chance of having a due date
    dueDate = getRandomDate(now, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)); // Next 30 days
    
    // Some tickets might be overdue
    if (Math.random() > 0.8) { // 20% chance of being overdue
      dueDate = getRandomDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), now); // Last 7 days
    }
  }
  
  // Generate estimated hours (optional)
  const estimatedHours = Math.random() > 0.4 ? Math.floor(Math.random() * 40) + 1 : undefined;
  
  // Set completion date for done tickets
  let completedAt: Date | undefined;
  if (status === TicketStatus.DONE) {
    completedAt = getRandomDate(updatedAt, now);
  }
  
  // Generate random tags (1-3 tags per ticket)
  const ticketTags = getRandomItems(template.tags, Math.floor(Math.random() * 3) + 1);
  
  return {
    id,
    title: template.title,
    description: template.description,
    status: status || Object.values(TicketStatus)[Math.floor(Math.random() * Object.values(TicketStatus).length)],
    priority,
    assignee,
    createdAt,
    updatedAt,
    dueDate,
    tags: ticketTags,
    estimatedHours,
    completedAt,
  };
};

// Generate mock tickets with realistic distribution
export const generateMockTickets = (): Ticket[] => {
  const tickets: Ticket[] = [];
  
  // Distribute tickets across statuses with realistic proportions
  const statusDistribution = {
    [TicketStatus.TODO]: 3, // 3 tickets
    [TicketStatus.IN_PROGRESS]: 3, // 3 tickets
    [TicketStatus.IN_REVIEW]: 2, // 2 tickets
    [TicketStatus.DONE]: 2, // 2 tickets
  };
  
  let ticketId = 1;
  
  // Generate tickets for each status
  Object.entries(statusDistribution).forEach(([status, statusCount]) => {
    for (let i = 0; i < statusCount; i++) {
      tickets.push(generateMockTicket(`TICKET-${ticketId.toString().padStart(3, '0')}`, status as TicketStatus));
      ticketId++;
    }
  });
  
  // Sort tickets by creation date (newest first) so new tickets appear at top
  tickets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  return tickets;
};

// Default columns configuration
export const defaultColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    status: TicketStatus.TODO,
    color: '#64748b',
    limit: undefined,
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    status: TicketStatus.IN_PROGRESS,
    color: '#3b82f6',
    limit: 5,
  },
  {
    id: 'in-review',
    title: 'In Review',
    status: TicketStatus.IN_REVIEW,
    color: '#f59e0b',
    limit: 3,
  },
  {
    id: 'done',
    title: 'Done',
    status: TicketStatus.DONE,
    color: '#10b981',
    limit: undefined,
  },
];

// Generate default board with mock data
export const generateMockBoard = (): Board => {
  const tickets = generateMockTickets();
  
  return {
    id: 'main-board',
    name: 'Project Board',
    columns: defaultColumns,
    tickets,
  };
};

// Utility functions for ticket filtering and searching
export const filterTickets = (
  tickets: Ticket[],
  filters: {
    search?: string;
    priorities?: Priority[];
    assignees?: string[];
    statuses?: TicketStatus[];
    tags?: string[];
    dueDateRange?: { start: Date; end: Date };
    overdue?: boolean;
  }
): Ticket[] => {
  return tickets.filter(ticket => {
    // Search filter (title, description, assignee)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.assignee.toLowerCase().includes(searchLower) ||
        ticket.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }
    
    // Priority filter
    if (filters.priorities && filters.priorities.length > 0) {
      if (!filters.priorities.includes(ticket.priority)) return false;
    }
    
    // Assignee filter
    if (filters.assignees && filters.assignees.length > 0) {
      if (!filters.assignees.includes(ticket.assignee)) return false;
    }
    
    // Status filter
    if (filters.statuses && filters.statuses.length > 0) {
      if (!filters.statuses.includes(ticket.status)) return false;
    }
    
    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => ticket.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }
    
    // Due date range filter
    if (filters.dueDateRange && ticket.dueDate) {
      const dueDate = new Date(ticket.dueDate);
      if (dueDate < filters.dueDateRange.start || dueDate > filters.dueDateRange.end) {
        return false;
      }
    }
    
    // Overdue filter
    if (filters.overdue !== undefined) {
      const isOverdue = ticket.dueDate && new Date(ticket.dueDate) < new Date() && ticket.status !== TicketStatus.DONE;
      if (filters.overdue && !isOverdue) return false;
      if (!filters.overdue && isOverdue) return false;
    }
    
    return true;
  });
};

// Search tickets with debouncing support
export const searchTickets = (tickets: Ticket[], query: string): Ticket[] => {
  if (!query.trim()) return tickets;
  
  return filterTickets(tickets, { search: query });
};

// Get unique values for filter options
export const getUniqueAssignees = (tickets: Ticket[]): string[] => {
  return [...new Set(tickets.map(ticket => ticket.assignee))].sort();
};

export const getUniqueTags = (tickets: Ticket[]): string[] => {
  const allTags = tickets.flatMap(ticket => ticket.tags);
  return [...new Set(allTags)].sort();
};

// Ticket statistics
export const getTicketStats = (tickets: Ticket[]) => {
  const stats = {
    total: tickets.length,
    byStatus: {} as Record<TicketStatus, number>,
    byPriority: {} as Record<Priority, number>,
    overdue: 0,
    completed: 0,
  };
  
  // Initialize counters
  Object.values(TicketStatus).forEach(status => {
    stats.byStatus[status] = 0;
  });
  
  Object.values(Priority).forEach(priority => {
    stats.byPriority[priority] = 0;
  });
  
  // Count tickets
  tickets.forEach(ticket => {
    stats.byStatus[ticket.status]++;
    stats.byPriority[ticket.priority]++;
    
    if (ticket.status === TicketStatus.DONE) {
      stats.completed++;
    }
    
    if (ticket.dueDate && new Date(ticket.dueDate) < new Date() && ticket.status !== TicketStatus.DONE) {
      stats.overdue++;
    }
  });
  
  return stats;
};
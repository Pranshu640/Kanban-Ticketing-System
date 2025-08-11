import type { Ticket } from '../types';
import { TicketStatus, Priority } from '../types';

// Debounce utility for search functionality
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Date formatting utilities
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
  }
  
  return formatDate(date);
};

// Ticket utility functions
export const isTicketOverdue = (ticket: Ticket): boolean => {
  if (!ticket.dueDate || ticket.status === TicketStatus.DONE) {
    return false;
  }
  return new Date(ticket.dueDate) < new Date();
};

export const getDaysUntilDue = (ticket: Ticket): number | null => {
  if (!ticket.dueDate) return null;
  
  const now = new Date();
  const dueDate = new Date(ticket.dueDate);
  const diffInMs = dueDate.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
  return diffInDays;
};

export const getTicketPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case Priority.URGENT:
      return '#ef4444'; // red
    case Priority.HIGH:
      return '#f97316'; // orange
    case Priority.MEDIUM:
      return '#3b82f6'; // blue
    case Priority.LOW:
      return '#6b7280'; // gray
    default:
      return '#6b7280';
  }
};

export const getTicketStatusColor = (status: TicketStatus): string => {
  switch (status) {
    case TicketStatus.TODO:
      return '#64748b'; // slate
    case TicketStatus.IN_PROGRESS:
      return '#3b82f6'; // blue
    case TicketStatus.IN_REVIEW:
      return '#f59e0b'; // amber
    case TicketStatus.DONE:
      return '#10b981'; // emerald
    default:
      return '#64748b';
  }
};

// Validation utilities
export const validateTicketTitle = (title: string): string | null => {
  if (!title.trim()) {
    return 'Title is required';
  }
  if (title.length < 3) {
    return 'Title must be at least 3 characters long';
  }
  if (title.length > 100) {
    return 'Title must be less than 100 characters';
  }
  return null;
};

export const validateTicketDescription = (description: string): string | null => {
  if (!description.trim()) {
    return 'Description is required';
  }
  if (description.length < 10) {
    return 'Description must be at least 10 characters long';
  }
  if (description.length > 1000) {
    return 'Description must be less than 1000 characters';
  }
  return null;
};

export const validateDueDate = (dueDate: Date | null): string | null => {
  if (!dueDate) return null;
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  
  if (due < today) {
    return 'Due date cannot be in the past';
  }
  
  return null;
};

export const validateEstimatedHours = (hours: number | null): string | null => {
  if (hours === null || hours === undefined) return null;
  
  if (hours < 0) {
    return 'Estimated hours cannot be negative';
  }
  if (hours > 1000) {
    return 'Estimated hours cannot exceed 1000';
  }
  
  return null;
};

// Search and filter utilities
export const normalizeSearchQuery = (query: string): string => {
  return query.toLowerCase().trim();
};

export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

// Sorting utilities
export const sortTicketsByPriority = (tickets: Ticket[]): Ticket[] => {
  const priorityOrder = {
    [Priority.URGENT]: 0,
    [Priority.HIGH]: 1,
    [Priority.MEDIUM]: 2,
    [Priority.LOW]: 3,
  };
  
  return [...tickets].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

export const sortTicketsByDueDate = (tickets: Ticket[]): Ticket[] => {
  return [...tickets].sort((a, b) => {
    // Tickets without due dates go to the end
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
};

export const sortTicketsByCreatedDate = (tickets: Ticket[]): Ticket[] => {
  return [...tickets].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const sortTicketsByUpdatedDate = (tickets: Ticket[]): Ticket[] => {
  return [...tickets].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
};

// Local storage utilities
export const saveToLocalStorage = <T>(key: string, data: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn(`Failed to save to localStorage (${key}):`, error);
    return false;
  }
};

export const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn(`Failed to load from localStorage (${key}):`, error);
    return null;
  }
};

export const removeFromLocalStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove from localStorage (${key}):`, error);
    return false;
  }
};

// ID generation utility
export const generateTicketId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `TICKET-${timestamp}-${random}`;
};

// Array utilities
export const groupBy = <T, K extends keyof any>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const key = getKey(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};

export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const uniqueBy = <T, K>(array: T[], getKey: (item: T) => K): T[] => {
  const seen = new Set<K>();
  return array.filter(item => {
    const key = getKey(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

// Export animation utilities
export * from './animations';

// Export mobile utilities
export * from './mobile';
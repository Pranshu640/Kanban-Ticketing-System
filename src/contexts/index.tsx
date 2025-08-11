import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Theme } from '../types';
import { defaultTheme, getThemeById } from '../themes';

// Theme Context Types
interface ThemeState {
  currentTheme: Theme;
  isLoading: boolean;
}

type ThemeAction = 
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_LOADING'; payload: boolean };

interface ThemeContextType {
  state: ThemeState;
  setTheme: (theme: Theme) => void;
  setThemeById: (themeId: string) => void;
}

// Theme Reducer
const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        currentTheme: action.payload,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Create Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider Props
interface ThemeProviderProps {
  children: ReactNode;
}

// Local Storage Key
const THEME_STORAGE_KEY = 'kanban-theme-preference';

// Theme Provider Component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, {
    currentTheme: defaultTheme,
    isLoading: true,
  });

  // Load theme from localStorage on mount
  useEffect(() => {
    const loadSavedTheme = () => {
      try {
        const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
        if (savedThemeId) {
          const savedTheme = getThemeById(savedThemeId);
          if (savedTheme) {
            dispatch({ type: 'SET_THEME', payload: savedTheme });
            return;
          }
        }
      } catch (error) {
        console.warn('Failed to load theme from localStorage:', error);
      }
      
      // Fallback to default theme
      dispatch({ type: 'SET_THEME', payload: defaultTheme });
    };

    loadSavedTheme();
  }, []);

  // Apply theme to CSS custom properties
  useEffect(() => {
    const applyThemeToDOM = (theme: Theme) => {
      const root = document.documentElement;
      
      // Apply color variables
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });

      // Apply typography variables
      root.style.setProperty('--font-family', theme.typography.fontFamily);
      Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
        root.style.setProperty(`--font-size-${key}`, value);
      });

      // Apply spacing variables
      Object.entries(theme.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--spacing-${key}`, value);
      });

      // Apply border radius variables
      Object.entries(theme.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--border-radius-${key}`, value);
      });

      // Apply shadow variables
      Object.entries(theme.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value);
      });

      // Set theme ID as data attribute for CSS targeting
      root.setAttribute('data-theme', theme.id);
    };

    if (!state.isLoading) {
      applyThemeToDOM(state.currentTheme);
    }
  }, [state.currentTheme, state.isLoading]);

  // Set theme function with smooth animation
  const setTheme = (theme: Theme) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Add theme loading class for smooth transition
    document.documentElement.classList.add('theme-loading');
    
    // Save to localStorage
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme.id);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }

    // Smooth transition with proper timing
    setTimeout(() => {
      dispatch({ type: 'SET_THEME', payload: theme });
      
      // Remove loading class after transition
      setTimeout(() => {
        document.documentElement.classList.remove('theme-loading');
      }, 100);
    }, 100);
  };

  // Set theme by ID function
  const setThemeById = (themeId: string) => {
    const theme = getThemeById(themeId);
    if (theme) {
      setTheme(theme);
    } else {
      console.warn(`Theme with ID "${themeId}" not found`);
    }
  };

  const contextValue: ThemeContextType = {
    state,
    setTheme,
    setThemeById,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export the context for advanced usage
export { ThemeContext };

// Ticket Context Implementation
import type { Ticket, Board } from '../types';
import { TicketStatus } from '../types';
import { generateMockBoard, filterTickets } from '../data';

// Ticket Context Types
interface TicketState {
  board: Board;
  filteredTickets: Ticket[];
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    priorities: string[];
    assignees: string[];
    statuses: string[];
    tags: string[];
    overdue: boolean;
  };
}

type TicketAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_BOARD'; payload: Board }
  | { type: 'CREATE_TICKET'; payload: Ticket }
  | { type: 'UPDATE_TICKET'; payload: { id: string; updates: Partial<Ticket> } }
  | { type: 'DELETE_TICKET'; payload: string }
  | { type: 'MOVE_TICKET'; payload: { id: string; newStatus: TicketStatus } }
  | { type: 'SET_FILTERS'; payload: Partial<TicketState['filters']> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'APPLY_FILTERS' };

interface TicketContextType {
  state: TicketState;
  actions: {
    createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateTicket: (id: string, updates: Partial<Ticket>) => void;
    deleteTicket: (id: string) => void;
    moveTicket: (id: string, newStatus: TicketStatus) => void;
    setFilters: (filters: Partial<TicketState['filters']>) => void;
    clearFilters: () => void;
    refreshBoard: () => void;
  };
}

// Ticket Reducer
const ticketReducer = (state: TicketState, action: TicketAction): TicketState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'LOAD_BOARD':
      return {
        ...state,
        board: action.payload,
        filteredTickets: action.payload.tickets,
        isLoading: false,
        error: null,
      };

    case 'CREATE_TICKET': {
      const newTicket = {
        ...action.payload,
        id: `TICKET-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add new ticket at the beginning so it appears at the top
      const updatedBoard = {
        ...state.board,
        tickets: [newTicket, ...state.board.tickets],
      };

      const filteredTickets = filterTickets(updatedBoard.tickets, {
        search: state.filters.search || undefined,
        priorities: state.filters.priorities.length > 0 ? state.filters.priorities as any : undefined,
        assignees: state.filters.assignees.length > 0 ? state.filters.assignees : undefined,
        statuses: state.filters.statuses.length > 0 ? state.filters.statuses as any : undefined,
        tags: state.filters.tags.length > 0 ? state.filters.tags : undefined,
        overdue: state.filters.overdue || undefined,
      });

      return {
        ...state,
        board: updatedBoard,
        filteredTickets,
      };
    }

    case 'UPDATE_TICKET': {
      const updatedTickets = state.board.tickets.map(ticket =>
        ticket.id === action.payload.id
          ? { ...ticket, ...action.payload.updates, updatedAt: new Date() }
          : ticket
      );

      const updatedBoard = {
        ...state.board,
        tickets: updatedTickets,
      };

      const filteredTickets = filterTickets(updatedBoard.tickets, {
        search: state.filters.search || undefined,
        priorities: state.filters.priorities.length > 0 ? state.filters.priorities as any : undefined,
        assignees: state.filters.assignees.length > 0 ? state.filters.assignees : undefined,
        statuses: state.filters.statuses.length > 0 ? state.filters.statuses as any : undefined,
        tags: state.filters.tags.length > 0 ? state.filters.tags : undefined,
        overdue: state.filters.overdue || undefined,
      });

      return {
        ...state,
        board: updatedBoard,
        filteredTickets,
      };
    }

    case 'DELETE_TICKET': {
      const updatedTickets = state.board.tickets.filter(ticket => ticket.id !== action.payload);
      const updatedBoard = {
        ...state.board,
        tickets: updatedTickets,
      };

      const filteredTickets = filterTickets(updatedBoard.tickets, {
        search: state.filters.search || undefined,
        priorities: state.filters.priorities.length > 0 ? state.filters.priorities as any : undefined,
        assignees: state.filters.assignees.length > 0 ? state.filters.assignees : undefined,
        statuses: state.filters.statuses.length > 0 ? state.filters.statuses as any : undefined,
        tags: state.filters.tags.length > 0 ? state.filters.tags : undefined,
        overdue: state.filters.overdue || undefined,
      });

      return {
        ...state,
        board: updatedBoard,
        filteredTickets,
      };
    }

    case 'MOVE_TICKET': {
      const updatedTickets = state.board.tickets.map(ticket =>
        ticket.id === action.payload.id
          ? {
              ...ticket,
              status: action.payload.newStatus,
              updatedAt: new Date(),
              completedAt: action.payload.newStatus === TicketStatus.DONE ? new Date() : ticket.completedAt,
            }
          : ticket
      );

      const updatedBoard = {
        ...state.board,
        tickets: updatedTickets,
      };

      const filteredTickets = filterTickets(updatedBoard.tickets, {
        search: state.filters.search || undefined,
        priorities: state.filters.priorities.length > 0 ? state.filters.priorities as any : undefined,
        assignees: state.filters.assignees.length > 0 ? state.filters.assignees : undefined,
        statuses: state.filters.statuses.length > 0 ? state.filters.statuses as any : undefined,
        tags: state.filters.tags.length > 0 ? state.filters.tags : undefined,
        overdue: state.filters.overdue || undefined,
      });

      return {
        ...state,
        board: updatedBoard,
        filteredTickets,
      };
    }

    case 'SET_FILTERS': {
      const newFilters = {
        ...state.filters,
        ...action.payload,
      };

      const filteredTickets = filterTickets(state.board.tickets, {
        search: newFilters.search || undefined,
        priorities: newFilters.priorities.length > 0 ? newFilters.priorities as any : undefined,
        assignees: newFilters.assignees.length > 0 ? newFilters.assignees : undefined,
        statuses: newFilters.statuses.length > 0 ? newFilters.statuses as any : undefined,
        tags: newFilters.tags.length > 0 ? newFilters.tags : undefined,
        overdue: newFilters.overdue || undefined,
      });

      return {
        ...state,
        filters: newFilters,
        filteredTickets,
      };
    }

    case 'CLEAR_FILTERS': {
      const defaultFilters = {
        search: '',
        priorities: [],
        assignees: [],
        statuses: [],
        tags: [],
        overdue: false,
      };

      return {
        ...state,
        filters: defaultFilters,
        filteredTickets: state.board.tickets,
      };
    }

    case 'APPLY_FILTERS': {
      const filteredTickets = filterTickets(state.board.tickets, {
        search: state.filters.search || undefined,
        priorities: state.filters.priorities.length > 0 ? state.filters.priorities as any : undefined,
        assignees: state.filters.assignees.length > 0 ? state.filters.assignees : undefined,
        statuses: state.filters.statuses.length > 0 ? state.filters.statuses as any : undefined,
        tags: state.filters.tags.length > 0 ? state.filters.tags : undefined,
        overdue: state.filters.overdue || undefined,
      });

      return {
        ...state,
        filteredTickets,
      };
    }

    default:
      return state;
  }
};

// Create Ticket Context
const TicketContext = createContext<TicketContextType | undefined>(undefined);

// Ticket Provider Props
interface TicketProviderProps {
  children: ReactNode;
}

// Local Storage Keys
const BOARD_STORAGE_KEY = 'kanban-board-data';
const FILTERS_STORAGE_KEY = 'kanban-filters';

// Ticket Provider Component
export const TicketProvider: React.FC<TicketProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, {
    board: { id: '', name: '', columns: [], tickets: [] },
    filteredTickets: [],
    isLoading: true,
    error: null,
    filters: {
      search: '',
      priorities: [],
      assignees: [],
      statuses: [],
      tags: [],
      overdue: false,
    },
  });

  // Load board data from localStorage on mount
  useEffect(() => {
    const loadBoardData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        // Try to load from localStorage first
        const savedBoard = localStorage.getItem(BOARD_STORAGE_KEY);
        const savedFilters = localStorage.getItem(FILTERS_STORAGE_KEY);

        let board: Board;
        if (savedBoard) {
          const parsedBoard = JSON.parse(savedBoard);
          // Convert date strings back to Date objects
          parsedBoard.tickets = parsedBoard.tickets.map((ticket: any) => ({
            ...ticket,
            createdAt: new Date(ticket.createdAt),
            updatedAt: new Date(ticket.updatedAt),
            dueDate: ticket.dueDate ? new Date(ticket.dueDate) : undefined,
            completedAt: ticket.completedAt ? new Date(ticket.completedAt) : undefined,
          }));
          board = parsedBoard;
        } else {
          // Generate mock board if no saved data
          board = generateMockBoard();
        }

        dispatch({ type: 'LOAD_BOARD', payload: board });

        // Load saved filters
        if (savedFilters) {
          const parsedFilters = JSON.parse(savedFilters);
          dispatch({ type: 'SET_FILTERS', payload: parsedFilters });
        }
      } catch (error) {
        console.error('Failed to load board data:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load board data' });
        
        // Fallback to mock data
        const board = generateMockBoard();
        dispatch({ type: 'LOAD_BOARD', payload: board });
      }
    };

    loadBoardData();
  }, []);

  // Save board data to localStorage whenever it changes
  useEffect(() => {
    if (!state.isLoading && state.board.tickets.length > 0) {
      try {
        localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(state.board));
      } catch (error) {
        console.warn('Failed to save board data to localStorage:', error);
      }
    }
  }, [state.board, state.isLoading]);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(state.filters));
      } catch (error) {
        console.warn('Failed to save filters to localStorage:', error);
      }
    }
  }, [state.filters, state.isLoading]);

  // Action creators
  const createTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'CREATE_TICKET', payload: ticketData as Ticket });
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    dispatch({ type: 'UPDATE_TICKET', payload: { id, updates } });
  };

  const deleteTicket = (id: string) => {
    dispatch({ type: 'DELETE_TICKET', payload: id });
  };

  const moveTicket = (id: string, newStatus: TicketStatus) => {
    dispatch({ type: 'MOVE_TICKET', payload: { id, newStatus } });
  };

  const setFilters = (filters: Partial<TicketState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const refreshBoard = () => {
    const newBoard = generateMockBoard();
    dispatch({ type: 'LOAD_BOARD', payload: newBoard });
  };

  const contextValue: TicketContextType = {
    state,
    actions: {
      createTicket,
      updateTicket,
      deleteTicket,
      moveTicket,
      setFilters,
      clearFilters,
      refreshBoard,
    },
  };

  return (
    <TicketContext.Provider value={contextValue}>
      {children}
    </TicketContext.Provider>
  );
};

// Custom hook to use ticket context
export const useTickets = (): TicketContextType => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

// Export the context for advanced usage
export { TicketContext };

// Export toast context
export { ToastProvider, useToast } from './ToastContext';
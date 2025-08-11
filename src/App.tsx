import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { MultiBackend } from 'react-dnd-multi-backend';
import { ThemeProvider, TicketProvider, ToastProvider, useTickets } from './contexts';
import { ThemeSelector, Button, ErrorBoundary, ResponsiveTestPanel, AccessibilityChecker, MotionWrapper, DataManager } from './components/ui';
import MobileErrorBoundary from './components/ui/MobileErrorBoundary';
import { TicketModal } from './components/ticket';
import BoardDemo from './components/BoardDemo';
import { shouldUseTouchBackend } from './utils';
import './App.css';
import './mobile-fix.css';
import { ConfirmationModal } from './components/ui';

const MockDataButton = () => {
  const { actions } = useTickets();
  return (
    <Button
      variant="outline"
      onClick={() => actions.useMockData()}
      aria-label="Load mock data"
      title="Populate board with mock tickets"
    >
      Use Mock Data
    </Button>
  );
};

const ResetBoardButton = () => {
  const { actions } = useTickets();
  const [open, setOpen] = useState(false);
  const onReset = () => setOpen(true);
  const onClose = () => setOpen(false);
  const onConfirm = () => {
    actions.resetBoard();
    setOpen(false);
  };
  return (
    <>
      <Button
        variant="outline"
        onClick={onReset}
        aria-label="Reset board"
        title="Clear all tickets and filters"
      >
        Reset Board
      </Button>
      <ConfirmationModal
        isOpen={open}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Reset Board"
        message="This will clear all tickets and filters and reset the board to an empty state. This action cannot be undone."
        confirmText="Reset"
        cancelText="Cancel"
        variant="warning"
      />
    </>
  );
};

function App() {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isTestPanelOpen, setIsTestPanelOpen] = useState(false);
  const [isA11yCheckerOpen, setIsA11yCheckerOpen] = useState(false);
  const [isDataManagerOpen, setIsDataManagerOpen] = useState(false);

  const handleCreateTicket = () => {
    setIsTicketModalOpen(true);
  };

  const handleCloseTicketModal = () => {
    setIsTicketModalOpen(false);
  };

  const handleTicketCreated = () => {
    console.log('Ticket created successfully!');
    // Modal will be closed by the TicketModal component itself
  };

  const handleOpenTestPanel = () => {
    setIsTestPanelOpen(true);
  };

  const handleCloseTestPanel = () => {
    setIsTestPanelOpen(false);
  };

  const handleOpenA11yChecker = () => {
    setIsA11yCheckerOpen(true);
  };

  const handleCloseA11yChecker = () => {
    setIsA11yCheckerOpen(false);
  };

  const handleOpenDataManager = () => {
    setIsDataManagerOpen(true);
  };

  const handleCloseDataManager = () => {
    setIsDataManagerOpen(false);
  };

  // Multi-backend configuration for both mouse and touch support
  const backendOptions = {
    backends: [
      {
        id: 'html5',
        backend: HTML5Backend,
        transition: {
          type: 'pointer',
          options: {
            pointerTypes: ['mouse']
          }
        }
      },
      {
        id: 'touch',
        backend: TouchBackend,
        options: {
          enableMouseEvents: true,
          delayTouchStart: 100,
          delayMouseStart: 0,
          touchSlop: 8,
          ignoreContextMenu: true,
          enableHoverOutsideTarget: false,
          enableKeyboardEvents: false,
        },
        preview: true,
        transition: {
          type: 'pointer',
          options: {
            pointerTypes: ['touch', 'pen']
          }
        }
      }
    ]
  };

  // Detect if we should use touch backend
  const useTouchBackend = shouldUseTouchBackend();
  
  // Use simpler backend on mobile to prevent crashes
  const dndBackend = useTouchBackend ? TouchBackend : MultiBackend;
  const dndOptions = useTouchBackend ? {
    enableMouseEvents: true,
    delayTouchStart: 50,
    delayMouseStart: 0,
    touchSlop: 5,
    ignoreContextMenu: true,
  } : backendOptions;

  // Fallback component when DnD fails
  const DnDWrapper = ({ children }: { children: React.ReactNode }) => {
    try {
      return (
        <DndProvider backend={dndBackend} options={dndOptions}>
          {children}
        </DndProvider>
      );
    } catch (error) {
      console.error('DnD Provider failed:', error);
      return <>{children}</>; 
    }
  };

  return (
    <MobileErrorBoundary>
      <ErrorBoundary>
        <DnDWrapper>
          <ThemeProvider>
            <ToastProvider>
              <TicketProvider>
            <div className="app">
              <header className="app-header">
                <h1>Kanban Ticketing System</h1>
                <div className="header-actions">
                  <Button 
                    variant="primary" 
                    onClick={handleCreateTicket}
                    aria-label="Create new ticket"
                  >
                    Create Ticket
                  </Button>
                  <MockDataButton />
                  <ResetBoardButton />
                  {import.meta.env.DEV && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={handleOpenTestPanel}
                        aria-label="Open responsive and theme testing panel"
                        title="Test responsive design and themes"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                          <line x1="8" y1="21" x2="16" y2="21"></line>
                          <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                        Test
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleOpenA11yChecker}
                        aria-label="Open accessibility checker"
                        title="Check accessibility issues"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="m9 12 2 2 4-4"></path>
                        </svg>
                        A11y
                      </Button>
                    </>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={handleOpenDataManager}
                    aria-label="Open data management"
                    title="Manage data backup and storage"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                      <path d="m21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                    </svg>
                    Data
                  </Button>
                  <ThemeSelector />
                </div>
              </header>
              <main className="app-main" role="main">
                <ErrorBoundary>
                  <MotionWrapper animate={true} delay={0.1}>
                    <BoardDemo />
                  </MotionWrapper>
                </ErrorBoundary>
              </main>

              <TicketModal
                isOpen={isTicketModalOpen}
                onClose={handleCloseTicketModal}
                onSuccess={handleTicketCreated}
              />

              <ResponsiveTestPanel
                isOpen={isTestPanelOpen}
                onClose={handleCloseTestPanel}
              />

              <AccessibilityChecker
                isOpen={isA11yCheckerOpen}
                onClose={handleCloseA11yChecker}
              />

              <DataManager
                isOpen={isDataManagerOpen}
                onClose={handleCloseDataManager}
              />
            </div>
              </TicketProvider>
            </ToastProvider>
          </ThemeProvider>
        </DnDWrapper>
      </ErrorBoundary>
    </MobileErrorBoundary>
  );
}

export default App

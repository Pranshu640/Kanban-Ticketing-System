import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { MultiBackend } from 'react-dnd-multi-backend';
import { ThemeProvider, TicketProvider, ToastProvider } from './contexts';
import { ThemeSelector, Button, ErrorBoundary, ResponsiveTestPanel, AccessibilityChecker, MotionWrapper } from './components/ui';
import { TicketModal } from './components/ticket';
import BoardDemo from './components/BoardDemo';
import './App.css';
import './mobile-fix.css';

function App() {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isTestPanelOpen, setIsTestPanelOpen] = useState(false);
  const [isA11yCheckerOpen, setIsA11yCheckerOpen] = useState(false);

  const handleCreateTicket = () => {
    setIsTicketModalOpen(true);
  };

  const handleCloseTicketModal = () => {
    setIsTicketModalOpen(false);
  };

  const handleTicketCreated = () => {
    console.log('Ticket created successfully!');
    // Close the modal after ticket is created
    setIsTicketModalOpen(false);
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
          delayTouchStart: 200,
          delayMouseStart: 0,
          touchSlop: 16,
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

  return (
    <ErrorBoundary>
      <DndProvider backend={MultiBackend} options={backendOptions}>
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
            </div>
          </TicketProvider>
        </ToastProvider>
      </ThemeProvider>
    </DndProvider>
    </ErrorBoundary>
  );
}

export default App

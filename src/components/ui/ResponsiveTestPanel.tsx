import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts';
import { availableThemes } from '../../themes';
import Button from './Button';
import styles from './ResponsiveTestPanel.module.css';

interface ResponsiveTestPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ViewportSize {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

const viewportSizes: ViewportSize[] = [
  {
    name: 'Mobile',
    width: 375,
    height: 667,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
        <line x1="12" y1="18" x2="12.01" y2="18"></line>
      </svg>
    ),
  },
  {
    name: 'Tablet',
    width: 768,
    height: 1024,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <line x1="12" y1="18" x2="12.01" y2="18"></line>
      </svg>
    ),
  },
  {
    name: 'Desktop',
    width: 1440,
    height: 900,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
  },
  {
    name: 'Large Desktop',
    width: 1920,
    height: 1080,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
  },
];

const ResponsiveTestPanel: React.FC<ResponsiveTestPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { state, setTheme } = useTheme();
  const [currentViewport, setCurrentViewport] = useState<ViewportSize>(viewportSizes[2]);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [isAutoTesting, setIsAutoTesting] = useState(false);

  // Auto-cycle through themes for testing
  useEffect(() => {
    if (!isAutoTesting) return;

    const interval = setInterval(() => {
      setCurrentThemeIndex((prev) => {
        const nextIndex = (prev + 1) % availableThemes.length;
        setTheme(availableThemes[nextIndex]);
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoTesting, setTheme]);

  const handleViewportChange = (viewport: ViewportSize) => {
    setCurrentViewport(viewport);
    
    // Apply viewport size to the main app container
    const appElement = document.querySelector('.app') as HTMLElement;
    if (appElement) {
      appElement.style.maxWidth = `${viewport.width}px`;
      appElement.style.maxHeight = `${viewport.height}px`;
      appElement.style.margin = '0 auto';
      appElement.style.border = '1px solid var(--color-border)';
      appElement.style.borderRadius = 'var(--border-radius-lg)';
      appElement.style.overflow = 'hidden';
    }
  };

  const handleResetViewport = () => {
    const appElement = document.querySelector('.app') as HTMLElement;
    if (appElement) {
      appElement.style.maxWidth = '';
      appElement.style.maxHeight = '';
      appElement.style.margin = '';
      appElement.style.border = '';
      appElement.style.borderRadius = '';
      appElement.style.overflow = '';
    }
  };

  const handleThemeChange = (themeIndex: number) => {
    setCurrentThemeIndex(themeIndex);
    setTheme(availableThemes[themeIndex]);
  };

  const toggleAutoTesting = () => {
    setIsAutoTesting(!isAutoTesting);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.panel}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.header}>
            <h3 className={styles.title}>Responsive & Theme Testing</h3>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close testing panel"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className={styles.content}>
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Viewport Sizes</h4>
              <div className={styles.viewportButtons}>
                {viewportSizes.map((viewport) => (
                  <Button
                    key={viewport.name}
                    variant={currentViewport.name === viewport.name ? 'primary' : 'outline'}
                    size="small"
                    onClick={() => handleViewportChange(viewport)}
                    className={styles.viewportButton}
                  >
                    {viewport.icon}
                    {viewport.name}
                    <span className={styles.dimensions}>
                      {viewport.width}×{viewport.height}
                    </span>
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="small"
                onClick={handleResetViewport}
                className={styles.resetButton}
              >
                Reset to Full Size
              </Button>
            </div>

            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Theme Testing</h4>
              <div className={styles.themeControls}>
                <div className={styles.themeButtons}>
                  {availableThemes.map((theme, index) => (
                    <Button
                      key={theme.id}
                      variant={currentThemeIndex === index ? 'primary' : 'outline'}
                      size="small"
                      onClick={() => handleThemeChange(index)}
                      className={styles.themeButton}
                    >
                      {theme.name}
                    </Button>
                  ))}
                </div>
                <Button
                  variant={isAutoTesting ? 'danger' : 'secondary'}
                  size="small"
                  onClick={toggleAutoTesting}
                  className={styles.autoTestButton}
                >
                  {isAutoTesting ? 'Stop Auto-Test' : 'Start Auto-Test'}
                </Button>
              </div>
              {isAutoTesting && (
                <motion.div
                  className={styles.autoTestIndicator}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={styles.progressBar}>
                    <motion.div
                      className={styles.progressFill}
                      animate={{ width: ['0%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>
                  <span className={styles.currentTheme}>
                    Current: {availableThemes[currentThemeIndex].name}
                  </span>
                </motion.div>
              )}
            </div>

            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Current Status</h4>
              <div className={styles.statusInfo}>
                <div className={styles.statusItem}>
                  <strong>Viewport:</strong> {currentViewport.name} ({currentViewport.width}×{currentViewport.height})
                </div>
                <div className={styles.statusItem}>
                  <strong>Theme:</strong> {state.currentTheme.name}
                </div>
                <div className={styles.statusItem}>
                  <strong>Auto-Testing:</strong> {isAutoTesting ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResponsiveTestPanel;
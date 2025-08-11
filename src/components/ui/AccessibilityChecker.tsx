import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import styles from './AccessibilityChecker.module.css';

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  element: string;
  issue: string;
  suggestion: string;
}

interface AccessibilityCheckerProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityChecker: React.FC<AccessibilityCheckerProps> = ({
  isOpen,
  onClose,
}) => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const runAccessibilityCheck = () => {
    setIsScanning(true);
    setScanComplete(false);
    setIssues([]);

    // Simulate accessibility scanning
    setTimeout(() => {
      const foundIssues: AccessibilityIssue[] = [];

      // Check for missing alt text
      const images = document.querySelectorAll('img:not([alt])');
      images.forEach((_, index) => {
        foundIssues.push({
          type: 'error',
          element: `Image ${index + 1}`,
          issue: 'Missing alt attribute',
          suggestion: 'Add descriptive alt text for screen readers'
        });
      });

      // Check for missing form labels
      const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
      inputs.forEach((input, index) => {
        const hasLabel = input.closest('label') || document.querySelector(`label[for="${input.id}"]`);
        if (!hasLabel) {
          foundIssues.push({
            type: 'error',
            element: `Input ${index + 1}`,
            issue: 'Missing label or aria-label',
            suggestion: 'Add a label or aria-label attribute'
          });
        }
      });

      // Check for low contrast (simplified check)
      const buttons = document.querySelectorAll('button');
      buttons.forEach((button, index) => {
        const styles = window.getComputedStyle(button);
        const bgColor = styles.backgroundColor;
        const textColor = styles.color;
        
        // Simplified contrast check (in real implementation, you'd calculate actual contrast ratio)
        if (bgColor === textColor) {
          foundIssues.push({
            type: 'warning',
            element: `Button ${index + 1}`,
            issue: 'Potential low contrast',
            suggestion: 'Ensure sufficient color contrast (4.5:1 for normal text)'
          });
        }
      });

      // Check for missing headings hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let previousLevel = 0;
      headings.forEach((heading, index) => {
        const currentLevel = parseInt(heading.tagName.charAt(1));
        if (currentLevel > previousLevel + 1) {
          foundIssues.push({
            type: 'warning',
            element: `${heading.tagName} ${index + 1}`,
            issue: 'Heading level skipped',
            suggestion: 'Use heading levels in sequential order (h1, h2, h3, etc.)'
          });
        }
        previousLevel = currentLevel;
      });

      // Check for missing focus indicators
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      let focusIssues = 0;
      focusableElements.forEach((element) => {
        const styles = window.getComputedStyle(element, ':focus');
        if (styles.outline === 'none' && !styles.boxShadow.includes('0 0 0')) {
          focusIssues++;
        }
      });

      if (focusIssues > 0) {
        foundIssues.push({
          type: 'warning',
          element: `${focusIssues} focusable elements`,
          issue: 'Missing focus indicators',
          suggestion: 'Add visible focus indicators for keyboard navigation'
        });
      }

      // Check for missing ARIA landmarks
      const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer');
      if (landmarks.length === 0) {
        foundIssues.push({
          type: 'info',
          element: 'Page structure',
          issue: 'No ARIA landmarks found',
          suggestion: 'Add semantic HTML elements or ARIA landmarks for better navigation'
        });
      }

      setIssues(foundIssues);
      setIsScanning(false);
      setScanComplete(true);
    }, 2000);
  };

  useEffect(() => {
    if (isOpen && !scanComplete) {
      runAccessibilityCheck();
    }
  }, [isOpen, scanComplete]);

  const getIssueIcon = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'error':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      case 'warning':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case 'info':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };

  const getScoreColor = () => {
    const errorCount = issues.filter(i => i.type === 'error').length;
    const warningCount = issues.filter(i => i.type === 'warning').length;
    
    if (errorCount > 0) return 'var(--color-error)';
    if (warningCount > 3) return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  const getScoreText = () => {
    const errorCount = issues.filter(i => i.type === 'error').length;
    const warningCount = issues.filter(i => i.type === 'warning').length;
    
    if (errorCount > 0) return 'Needs Improvement';
    if (warningCount > 3) return 'Good';
    return 'Excellent';
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
            <h3 className={styles.title}>Accessibility Report</h3>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close accessibility report"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className={styles.content}>
            {isScanning ? (
              <div className={styles.scanning}>
                <motion.div
                  className={styles.scanningIcon}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                    <path d="M3 5c0-1.66 4-3 9-3s9 1.34 9 3"></path>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                  </svg>
                </motion.div>
                <p>Scanning for accessibility issues...</p>
              </div>
            ) : (
              <>
                <div className={styles.summary}>
                  <div className={styles.score} style={{ color: getScoreColor() }}>
                    <div className={styles.scoreValue}>{getScoreText()}</div>
                    <div className={styles.scoreDetails}>
                      {issues.length === 0 ? 'No issues found' : `${issues.length} issues found`}
                    </div>
                  </div>
                  <div className={styles.breakdown}>
                    <div className={styles.breakdownItem}>
                      <span className={styles.errorCount}>
                        {issues.filter(i => i.type === 'error').length}
                      </span>
                      <span>Errors</span>
                    </div>
                    <div className={styles.breakdownItem}>
                      <span className={styles.warningCount}>
                        {issues.filter(i => i.type === 'warning').length}
                      </span>
                      <span>Warnings</span>
                    </div>
                    <div className={styles.breakdownItem}>
                      <span className={styles.infoCount}>
                        {issues.filter(i => i.type === 'info').length}
                      </span>
                      <span>Info</span>
                    </div>
                  </div>
                </div>

                {issues.length > 0 && (
                  <div className={styles.issues}>
                    <h4 className={styles.issuesTitle}>Issues Found</h4>
                    <div className={styles.issuesList}>
                      {issues.map((issue, index) => (
                        <motion.div
                          key={index}
                          className={`${styles.issue} ${styles[issue.type]}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className={styles.issueIcon}>
                            {getIssueIcon(issue.type)}
                          </div>
                          <div className={styles.issueContent}>
                            <div className={styles.issueHeader}>
                              <span className={styles.issueElement}>{issue.element}</span>
                              <span className={styles.issueType}>{issue.type}</span>
                            </div>
                            <div className={styles.issueDescription}>{issue.issue}</div>
                            <div className={styles.issueSuggestion}>{issue.suggestion}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.actions}>
                  <Button
                    variant="primary"
                    onClick={runAccessibilityCheck}
                    disabled={isScanning}
                  >
                    Re-scan
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AccessibilityChecker;
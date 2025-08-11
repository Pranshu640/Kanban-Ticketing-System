import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts';
import { lightMode, darkMode, brownieMode } from '../../themes';
import Button from './Button';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { state, setTheme } = useTheme();
  const { currentTheme } = state;
  const [brownieClicks, setBrownieClicks] = useState(0);
  const [showBrownieButton, setShowBrownieButton] = useState(false);

  const isDarkMode = currentTheme.id === 'dark';
  const isBrownieMode = currentTheme.id === 'brownie';

  const toggleTheme = () => {
    if (isBrownieMode) {
      setTheme(lightMode);
    } else {
      setTheme(isDarkMode ? lightMode : darkMode);
    }
  };

  const handleBrownieClick = () => {
    setBrownieClicks(prev => prev + 1);
    
    if (brownieClicks >= 4) {
      setTheme(brownieMode);
      setBrownieClicks(0);
    } else if (brownieClicks === 2) {
      setShowBrownieButton(true);
    }
  };

  const exitBrownieMode = () => {
    setTheme(lightMode);
    setShowBrownieButton(false);
    setBrownieClicks(0);
  };

  return (
    <div className={`${styles.themeToggle} ${className || ''}`}>
      {/* Main theme toggle */}
      <motion.button
        className={`${styles.toggleButton} ${isDarkMode ? styles.dark : styles.light}`}
        onClick={toggleTheme}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        <motion.div
          className={styles.toggleTrack}
          animate={{ 
            backgroundColor: isDarkMode ? '#334155' : '#E2E0DB' 
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={styles.toggleThumb}
            animate={{ 
              x: isDarkMode ? 24 : 0,
              backgroundColor: isDarkMode ? '#f1f5f9' : '#2563eb'
            }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            {isDarkMode ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </motion.div>
        </motion.div>
      </motion.button>

      {/* Hidden brownie mode trigger */}
      {!isBrownieMode && (
        <motion.div
          className={styles.brownieContainer}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: showBrownieButton ? 1 : 0,
            scale: showBrownieButton ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            size="small"
            onClick={handleBrownieClick}
            className={styles.brownieButton}
            title="🍪 Brownie points!"
          >
            🍪
          </Button>
          {brownieClicks > 2 && (
            <motion.span 
              className={styles.brownieHint}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {5 - brownieClicks} more clicks!
            </motion.span>
          )}
        </motion.div>
      )}

      {/* Exit brownie mode */}
      {isBrownieMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.brownieExit}
        >
          <Button
            variant="outline"
            size="small"
            onClick={exitBrownieMode}
            className={styles.exitButton}
          >
            Exit Brownie Mode
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ThemeToggle;
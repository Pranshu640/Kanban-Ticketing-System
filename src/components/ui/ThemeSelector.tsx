import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts';
import { availableThemes } from '../../themes';
import styles from './ThemeSelector.module.css';

interface ThemeSelectorProps {
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className }) => {
  const { state, setTheme } = useTheme();
  const { currentTheme, isLoading } = state;

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedThemeId = event.target.value;
    const selectedTheme = availableThemes.find(theme => theme.id === selectedThemeId);
    if (selectedTheme) {
      setTheme(selectedTheme);
    }
  };

  return (
    <motion.div 
      className={`${styles.themeSelector} ${className || ''}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.label 
        htmlFor="theme-select" 
        className={styles.label}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        Theme
      </motion.label>
      <motion.select
        id="theme-select"
        value={currentTheme.id}
        onChange={handleThemeChange}
        disabled={isLoading}
        className={styles.select}
        aria-label="Select application theme"
        whileHover={{ scale: 1.01 }}
        whileFocus={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {availableThemes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </motion.select>
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className={styles.loadingIndicator} 
            aria-label="Loading theme"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className={styles.spinner}
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ThemeSelector;
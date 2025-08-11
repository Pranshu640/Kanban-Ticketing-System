import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import Input from './Input';
import Button from './Button';
import styles from './SearchBar.module.css';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  onClear?: () => void;
  disabled?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search tickets...',
  debounceMs = 300,
  className = '',
  onClear,
  disabled = false,
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Debounced onChange handler
  const debouncedOnChange = useCallback(
    (searchValue: string) => {
      const timeoutId = setTimeout(() => {
        onChange(searchValue);
      }, debounceMs);

      return () => clearTimeout(timeoutId);
    },
    [onChange, debounceMs]
  );

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle input change with debouncing
  useEffect(() => {
    if (localValue !== value) {
      const cleanup = debouncedOnChange(localValue);
      return cleanup;
    }
  }, [localValue, value, debouncedOnChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <motion.div 
      className={`${styles.searchBar} ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Input
        type="text"
        value={localValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        leftIcon={<Search size={16} />}
        rightIcon={
          localValue && (
            <Button
              variant="ghost"
              size="small"
              iconOnly
              onClick={handleClear}
              className={styles.clearButton}
              aria-label="Clear search"
            >
              <X size={14} />
            </Button>
          )
        }
        fullWidth
        className={styles.searchInput}
        aria-label="Search tickets"
      />
    </motion.div>
  );
};

export default SearchBar;
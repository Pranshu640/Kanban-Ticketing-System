import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import Button from './Button';
import styles from './MultiSelect.module.css';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  maxDisplayItems?: number;
  searchable?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  label,
  disabled = false,
  className = '',
  maxDisplayItems = 3,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const filteredOptions = searchable && searchQuery
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const selectedOptions = options.filter(option => value.includes(option.value));

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchQuery('');
      }
    }
  };

  const handleOptionClick = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    
    onChange(newValue);
  };

  const handleRemoveItem = (optionValue: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newValue = value.filter(v => v !== optionValue);
    onChange(newValue);
  };

  const handleClearAll = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange([]);
  };

  const getDisplayText = () => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }

    if (selectedOptions.length <= maxDisplayItems) {
      return selectedOptions.map(option => option.label).join(', ');
    }

    const displayItems = selectedOptions.slice(0, maxDisplayItems);
    const remainingCount = selectedOptions.length - maxDisplayItems;
    return `${displayItems.map(option => option.label).join(', ')} +${remainingCount} more`;
  };

  const containerClasses = [
    styles.multiSelect,
    isOpen && styles.open,
    disabled && styles.disabled,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.multiSelectGroup}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}
      
      <div ref={containerRef} className={containerClasses}>
        <div
          className={styles.trigger}
          onClick={handleToggle}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className={styles.triggerContent}>
            <span className={`${styles.triggerText} ${selectedOptions.length === 0 ? styles.placeholder : ''}`}>
              {getDisplayText()}
            </span>
            
            {selectedOptions.length > 0 && (
              <Button
                variant="ghost"
                size="small"
                iconOnly
                onClick={handleClearAll}
                className={styles.clearAllButton}
                aria-label="Clear all selections"
              >
                <X size={14} />
              </Button>
            )}
          </div>
          
          <ChevronDown 
            size={16} 
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          />
        </div>

        {isOpen && (
          <div className={styles.dropdown}>
            {searchable && (
              <div className={styles.searchContainer}>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search options..."
                  className={styles.searchInput}
                />
              </div>
            )}
            
            <div className={styles.optionsList} role="listbox">
              {filteredOptions.length === 0 ? (
                <div className={styles.noOptions}>
                  {searchQuery ? 'No matching options' : 'No options available'}
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  
                  return (
                    <div
                      key={option.value}
                      className={`${styles.option} ${isSelected ? styles.selected : ''} ${option.disabled ? styles.optionDisabled : ''}`}
                      onClick={() => !option.disabled && handleOptionClick(option.value)}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className={styles.optionContent}>
                        <span className={styles.optionLabel}>{option.label}</span>
                        {isSelected && (
                          <Check size={16} className={styles.checkIcon} />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {selectedOptions.length > 0 && (
        <div className={styles.selectedTags}>
          {selectedOptions.map((option) => (
            <div key={option.value} className={styles.tag}>
              <span className={styles.tagLabel}>{option.label}</span>
              <button
                type="button"
                onClick={(e) => handleRemoveItem(option.value, e)}
                className={styles.tagRemove}
                aria-label={`Remove ${option.label}`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
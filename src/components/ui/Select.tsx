import React from 'react';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  required?: boolean;
  placeholder?: string;
  options: SelectOption[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      size = 'medium',
      fullWidth = false,
      required = false,
      placeholder,
      options,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);
    const hasSuccess = Boolean(success);
    const displayHelperText = error || success || helperText;

    const selectClasses = [
      styles.select,
      styles[size],
      hasError && styles.error,
      hasSuccess && styles.success,
      fullWidth && styles.fullWidth,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const helperTextClasses = [
      styles.helperText,
      hasError && styles.error,
      hasSuccess && styles.success,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`${styles.selectGroup} ${fullWidth ? styles.fullWidth : ''}`}>
        {label && (
          <label 
            htmlFor={selectId} 
            className={`${styles.label} ${required ? styles.required : ''}`}
          >
            {label}
          </label>
        )}
        
        <div className={styles.selectWrapper}>
          <select
            ref={ref}
            id={selectId}
            className={selectClasses}
            aria-invalid={hasError}
            aria-describedby={displayHelperText ? `${selectId}-helper` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {displayHelperText && (
          <div id={`${selectId}-helper`} className={helperTextClasses}>
            {error || success || helperText}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
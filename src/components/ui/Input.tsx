import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Input.module.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      size = 'medium',
      fullWidth = false,
      leftIcon,
      rightIcon,
      required = false,
      className = '',
      id,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);
    const hasSuccess = Boolean(success);
    const displayHelperText = error || success || helperText;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const inputClasses = [
      styles.input,
      styles[size],
      hasError && styles.error,
      hasSuccess && styles.success,
      leftIcon && styles.hasLeftIcon,
      rightIcon && styles.hasRightIcon,
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
      <motion.div 
        className={`${styles.inputGroup} ${fullWidth ? styles.fullWidth : ''}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {label && (
          <motion.label 
            htmlFor={inputId} 
            className={`${styles.label} ${required ? styles.required : ''}`}
            animate={{ 
              color: isFocused ? 'var(--color-primary)' : 'var(--color-text)',
              scale: isFocused ? 1.02 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}
        
        <motion.div 
          className={styles.inputWrapper}
          animate={{ 
            scale: isFocused ? 1.01 : 1,
            boxShadow: isFocused 
              ? '0 0 0 2px var(--color-primary-alpha)' 
              : '0 0 0 0px transparent'
          }}
          transition={{ duration: 0.2 }}
        >
          {leftIcon && (
            <div className={styles.leftIcon}>
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            aria-invalid={hasError}
            aria-describedby={displayHelperText ? `${inputId}-helper` : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          
          {rightIcon && (
            <div className={styles.rightIcon}>
              {rightIcon}
            </div>
          )}
        </motion.div>
        
        {displayHelperText && (
          <motion.div 
            id={`${inputId}-helper`} 
            className={helperTextClasses}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error || success || helperText}
          </motion.div>
        )}
      </motion.div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
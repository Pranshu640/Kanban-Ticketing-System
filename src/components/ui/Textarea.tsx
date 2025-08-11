import React, { useEffect, useRef } from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  required?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
  autoResize?: boolean;
  noResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      size = 'medium',
      fullWidth = false,
      required = false,
      maxLength,
      showCharacterCount = false,
      autoResize = false,
      noResize = false,
      className = '',
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);
    const hasSuccess = Boolean(success);
    const displayHelperText = error || success || helperText;
    
    const currentLength = typeof value === 'string' ? value.length : 0;
    const isOverLimit = maxLength ? currentLength > maxLength : false;

    // Auto resize functionality
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [value, autoResize]);

    const textareaClasses = [
      styles.textarea,
      styles[size],
      hasError && styles.error,
      hasSuccess && styles.success,
      fullWidth && styles.fullWidth,
      noResize && styles.noResize,
      autoResize && styles.autoResize,
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

    const characterCountClasses = [
      styles.characterCount,
      isOverLimit && styles.overLimit,
    ]
      .filter(Boolean)
      .join(' ');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e);
      }
      
      // Auto resize on change
      if (autoResize) {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    return (
      <div className={`${styles.textareaGroup} ${fullWidth ? styles.fullWidth : ''}`}>
        {label && (
          <label 
            htmlFor={textareaId} 
            className={`${styles.label} ${required ? styles.required : ''}`}
          >
            {label}
          </label>
        )}
        
        <textarea
          ref={(node) => {
            textareaRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          id={textareaId}
          className={textareaClasses}
          aria-invalid={hasError}
          aria-describedby={displayHelperText ? `${textareaId}-helper` : undefined}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          {...props}
        />
        
        {(displayHelperText || (showCharacterCount && maxLength)) && (
          <div>
            {displayHelperText && (
              <div id={`${textareaId}-helper`} className={helperTextClasses}>
                {error || success || helperText}
              </div>
            )}
            
            {showCharacterCount && maxLength && (
              <div className={characterCountClasses}>
                {currentLength}/{maxLength}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
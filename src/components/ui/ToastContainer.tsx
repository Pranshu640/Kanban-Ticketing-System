import React from 'react';
import { createPortal } from 'react-dom';
import Toast from './Toast';
import type { ToastProps } from './Toast';
import styles from './ToastContainer.module.css';

export interface ToastContainerProps {
  toasts: ToastProps[];
  onRemoveToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className={styles.container}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemoveToast}
        />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
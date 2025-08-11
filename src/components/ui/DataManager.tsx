import React, { useState } from 'react';
import { storage, createBackup, restoreBackup } from '../../utils/storage';
import Button from './Button';
import Modal from './Modal';
import styles from './DataManager.module.css';

interface DataManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DataManager: React.FC<DataManagerProps> = ({ isOpen, onClose }) => {
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExportData = () => {
    createBackup();
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    setRestoreStatus('idle');

    try {
      const success = await restoreBackup(file);
      if (success) {
        setRestoreStatus('success');
        // Reload the page to reflect imported data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setRestoreStatus('error');
      }
    } catch (error) {
      console.error('Failed to restore backup:', error);
      setRestoreStatus('error');
    } finally {
      setIsRestoring(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      storage.clear();
      window.location.reload();
    }
  };

  const storageInfo = storage.getStorageInfo();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Data Management"
      size="medium"
      showCloseButton={true}
    >
      <div className={styles.dataManager}>
        <div className={styles.section}>
          <h3>Storage Information</h3>
          <div className={styles.storageInfo}>
            <div className={styles.storageBar}>
              <div 
                className={styles.storageUsed} 
                style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
              />
            </div>
            <div className={styles.storageText}>
              <span>Used: {(storageInfo.used / 1024).toFixed(1)} KB</span>
              <span>Available: {(storageInfo.available / 1024).toFixed(1)} KB</span>
              <span>{storageInfo.percentage.toFixed(1)}% used</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Backup & Restore</h3>
          <p className={styles.description}>
            Export your data to a JSON file for backup, or import previously exported data.
          </p>
          
          <div className={styles.actions}>
            <Button
              variant="primary"
              onClick={handleExportData}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7,10 12,15 17,10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export Data
            </Button>

            <div className={styles.importSection}>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                disabled={isRestoring}
                className={styles.fileInput}
                id="import-file"
              />
              <label htmlFor="import-file" className={styles.fileLabel}>
                <span className={styles.importButton + (isRestoring ? ' ' + styles.disabled : '')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17,8 12,3 7,8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  {isRestoring ? 'Importing...' : 'Import Data'}
                </span>
              </label>
            </div>
          </div>

          {restoreStatus === 'success' && (
            <div className={styles.statusMessage + ' ' + styles.success}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
              </svg>
              Data imported successfully! The page will reload shortly.
            </div>
          )}

          {restoreStatus === 'error' && (
            <div className={styles.statusMessage + ' ' + styles.error}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              Failed to import data. Please check the file format.
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h3>Reset Data</h3>
          <p className={styles.description}>
            Clear all stored data and reset the application to its initial state.
          </p>
          
          <Button
            variant="danger"
            onClick={handleClearData}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
            </svg>
            Clear All Data
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DataManager;
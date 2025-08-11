// Enhanced localStorage utilities for frontend-only data persistence

export interface StorageOptions {
  compress?: boolean;
  encrypt?: boolean;
  ttl?: number; // Time to live in milliseconds
}

export interface StorageItem<T> {
  data: T;
  timestamp: number;
  ttl?: number;
}

class FrontendStorage {
  private prefix = 'kanban_';

  // Check if localStorage is available
  private isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // Generate storage key with prefix
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  // Save data to localStorage with options
  save<T>(key: string, data: T, options: StorageOptions = {}): boolean {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage is not available');
      return false;
    }

    try {
      const item: StorageItem<T> = {
        data,
        timestamp: Date.now(),
        ttl: options.ttl,
      };

      const serialized = JSON.stringify(item);
      localStorage.setItem(this.getKey(key), serialized);
      return true;
    } catch (error) {
      console.error(`Failed to save to storage (${key}):`, error);
      return false;
    }
  }

  // Load data from localStorage with validation
  load<T>(key: string): T | null {
    if (!this.isStorageAvailable()) {
      return null;
    }

    try {
      const serialized = localStorage.getItem(this.getKey(key));
      if (!serialized) return null;

      const item: StorageItem<T> = JSON.parse(serialized);
      
      // Check if item has expired
      if (item.ttl && Date.now() - item.timestamp > item.ttl) {
        this.remove(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error(`Failed to load from storage (${key}):`, error);
      this.remove(key); // Remove corrupted data
      return null;
    }
  }

  // Remove item from localStorage
  remove(key: string): boolean {
    if (!this.isStorageAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error(`Failed to remove from storage (${key}):`, error);
      return false;
    }
  }

  // Clear all app data from localStorage
  clear(): boolean {
    if (!this.isStorageAvailable()) {
      return false;
    }

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  }

  // Get storage usage info
  getStorageInfo(): { used: number; available: number; percentage: number } {
    if (!this.isStorageAvailable()) {
      return { used: 0, available: 0, percentage: 0 };
    }

    try {
      let used = 0;
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          used += localStorage.getItem(key)?.length || 0;
        }
      });

      // Estimate available space (localStorage limit is usually 5-10MB)
      const estimated = 5 * 1024 * 1024; // 5MB estimate
      const available = Math.max(0, estimated - used);
      const percentage = (used / estimated) * 100;

      return { used, available, percentage };
    } catch {
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  // Export all app data
  exportData(): string | null {
    if (!this.isStorageAvailable()) {
      return null;
    }

    try {
      const data: Record<string, any> = {};
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const cleanKey = key.replace(this.prefix, '');
          data[cleanKey] = localStorage.getItem(key);
        }
      });

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return null;
    }
  }

  // Import data from exported JSON
  importData(jsonData: string): boolean {
    if (!this.isStorageAvailable()) {
      return false;
    }

    try {
      const data = JSON.parse(jsonData);
      
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'string') {
          localStorage.setItem(this.getKey(key), value);
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}

// Create singleton instance
export const storage = new FrontendStorage();

// Convenience functions for common operations
export const saveTickets = (tickets: any[]) => storage.save('tickets', tickets);
export const loadTickets = () => storage.load<any[]>('tickets');
export const saveBoard = (board: any) => storage.save('board', board);
export const loadBoard = () => storage.load<any>('board');
export const saveFilters = (filters: any) => storage.save('filters', filters);
export const loadFilters = () => storage.load<any>('filters');
export const saveTheme = (theme: any) => storage.save('theme', theme);
export const loadTheme = () => storage.load<any>('theme');

// Backup and restore functions
export const createBackup = () => {
  const backup = storage.exportData();
  if (backup) {
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kanban-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

export const restoreBackup = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = storage.importData(content);
        resolve(success);
      } catch {
        resolve(false);
      }
    };
    reader.onerror = () => resolve(false);
    reader.readAsText(file);
  });
};
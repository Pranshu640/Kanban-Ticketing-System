import type { Theme } from '../types';

// Light mode (Off-white & brown palette)
export const lightMode: Theme = {
  id: 'light',
  name: 'Light Mode',
  colors: {
    primary: '#8B4513',
    secondary: '#A0826D',
    accent: '#CD853F',
    background: '#FAF7F2',
    surface: '#F5F1EB',
    text: '#2F2F2F',
    textSecondary: '#6B5B47',
    border: '#E8E0D6',
    success: '#6B8E23',
    warning: '#DAA520',
    error: '#B22222',
    info: '#4682B4',
  },
  typography: {
    fontFamily: 'Atkinson Hyperlegible, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
  shadows: {
    sm: '0 1px 3px 0 rgba(47, 47, 47, 0.08)',
    md: '0 4px 12px 0 rgba(47, 47, 47, 0.08)',
    lg: '0 8px 25px 0 rgba(47, 47, 47, 0.12)',
  },
};

// Dark mode (Brown-tan contrast palette)
export const darkMode: Theme = {
  id: 'dark',
  name: 'Dark Mode',
  colors: {
    primary: '#D2B48C',
    secondary: '#A0826D',
    accent: '#DEB887',
    background: '#1C1917',
    surface: '#292524',
    text: '#F5F1EB',
    textSecondary: '#A8A29E',
    border: '#44403C',
    success: '#84CC16',
    warning: '#EAB308',
    error: '#EF4444',
    info: '#06B6D4',
  },
  typography: {
    fontFamily: 'Atkinson Hyperlegible, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
  shadows: {
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
    md: '0 4px 12px 0 rgba(0, 0, 0, 0.4)',
    lg: '0 8px 25px 0 rgba(0, 0, 0, 0.5)',
  },
};

// Brownie Mode (retro fun mode)
export const brownieMode: Theme = {
  id: 'brownie',
  name: 'Brownie Mode',
  colors: {
    primary: '#00FF00',
    secondary: '#FFFF00',
    accent: '#FF00FF',
    background: '#000000',
    surface: '#1A1A1A',
    text: '#00FF00',
    textSecondary: '#CCCCCC',
    border: '#00FF00',
    success: '#00FF00',
    warning: '#FFFF00',
    error: '#FF0000',
    info: '#00FFFF',
  },
  typography: {
    fontFamily: 'Atkinson Hyperlegible, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      xs: '0.875rem',
      sm: '1rem',
      md: '1.125rem',
      lg: '1.25rem',
      xl: '1.5rem',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0',
    md: '0',
    lg: '0',
  },
  shadows: {
    sm: '0 0 4px #00FF00',
    md: '0 0 8px #00FF00',
    lg: '0 0 16px #00FF00',
  },
};

// Only export these three as selectable themes
export const availableThemes: Theme[] = [lightMode, darkMode, brownieMode];

// Default theme
export const defaultTheme = lightMode;

// Helpers
export const getThemeById = (id: string): Theme | undefined => availableThemes.find(t => t.id === id);
export const getThemeByName = (name: string): Theme | undefined => availableThemes.find(t => t.name === name);
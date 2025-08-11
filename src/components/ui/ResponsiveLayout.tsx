import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './ResponsiveLayout.module.css';

export interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export interface BreakpointInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className = '',
}) => {
  const [breakpoint, setBreakpoint] = useState<BreakpointInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 1024,
    height: 768,
  });

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setBreakpoint({
        isMobile: width <= 480,
        isTablet: width > 480 && width <= 768,
        isDesktop: width > 768,
        width,
        height,
      });
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const layoutClass = `${styles.responsiveLayout} ${
    breakpoint.isMobile ? styles.mobile : 
    breakpoint.isTablet ? styles.tablet : 
    styles.desktop
  } ${className}`;

  return (
    <motion.div 
      className={layoutClass}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      data-breakpoint={
        breakpoint.isMobile ? 'mobile' : 
        breakpoint.isTablet ? 'tablet' : 
        'desktop'
      }
    >
      {children}
    </motion.div>
  );
};

export default ResponsiveLayout;

// Hook to use breakpoint information in other components
export const useBreakpoint = (): BreakpointInfo => {
  const [breakpoint, setBreakpoint] = useState<BreakpointInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 1024,
    height: 768,
  });

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setBreakpoint({
        isMobile: width <= 480,
        isTablet: width > 480 && width <= 768,
        isDesktop: width > 768,
        width,
        height,
      });
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
};
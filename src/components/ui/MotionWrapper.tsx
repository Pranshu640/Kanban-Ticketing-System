import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts';

interface MotionWrapperProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
}

const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  className = '',
  animate = true,
  delay = 0,
}) => {
  const { state } = useTheme();
  const { isLoading } = state;

  if (!animate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state.currentTheme.id}
        className={className}
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isLoading ? 0.7 : 1, 
          y: 0,
          transition: {
            duration: 0.3,
            delay,
            ease: "easeOut"
          }
        }}
        exit={{ 
          opacity: 0, 
          y: -10,
          transition: {
            duration: 0.2,
            ease: "easeIn"
          }
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default MotionWrapper;
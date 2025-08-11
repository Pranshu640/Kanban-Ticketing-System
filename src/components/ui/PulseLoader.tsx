import React from 'react';
import { motion, type Variants } from 'framer-motion';
import styles from './PulseLoader.module.css';

export interface PulseLoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

const PulseLoader: React.FC<PulseLoaderProps> = ({
  size = 'medium',
  color = 'primary',
  className = '',
}) => {
  const pulseVariants: Variants = {
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      } as any
    }
  };

  const containerVariants: Variants = {
    pulse: {
      transition: {
        staggerChildren: 0.2
      } as any
    }
  };

  return (
    <motion.div 
      className={`${styles.pulseLoader} ${styles[size]} ${className}`}
      variants={containerVariants}
      animate="pulse"
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${styles.dot} ${styles[color]}`}
          variants={pulseVariants}
        />
      ))}
    </motion.div>
  );
};

export default PulseLoader;
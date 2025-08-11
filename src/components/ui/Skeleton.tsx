import React from 'react';
import { motion } from 'framer-motion';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'text',
  animation = 'pulse',
  className = '',
}) => {
  const skeletonClasses = [
    styles.skeleton,
    styles[variant],
    styles[animation],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (animation === 'wave') {
    return (
      <motion.div
        className={skeletonClasses}
        style={style}
        initial={{ backgroundPosition: '-200px 0' }}
        animate={{ backgroundPosition: 'calc(200px + 100%) 0' }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    );
  }

  if (animation === 'pulse') {
    return (
      <motion.div
        className={skeletonClasses}
        style={style}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    );
  }

  return <div className={skeletonClasses} style={style} />;
};

export default Skeleton;
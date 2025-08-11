import React from 'react';
import { motion } from 'framer-motion';
import Skeleton from '../ui/Skeleton';
import Card from '../ui/Card';
import styles from './TicketSkeleton.module.css';

export interface TicketSkeletonProps {
  className?: string;
}

const TicketSkeleton: React.FC<TicketSkeletonProps> = ({ className = '' }) => {
  return (
    <motion.div
      className={`${styles.ticketSkeleton} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={styles.skeletonCard}>
        <div className={styles.skeletonContent}>
          {/* Priority indicator */}
          <div className={styles.prioritySection}>
            <Skeleton variant="circular" width={12} height={12} />
            <Skeleton variant="text" width={60} height={14} />
          </div>
          
          {/* Title */}
          <Skeleton variant="text" width="80%" height={18} />
          
          {/* Description */}
          <div className={styles.descriptionSection}>
            <Skeleton variant="text" width="100%" height={14} />
            <Skeleton variant="text" width="70%" height={14} />
          </div>
          
          {/* Footer */}
          <div className={styles.footerSection}>
            <div className={styles.leftSection}>
              <Skeleton variant="rectangular" width={60} height={20} />
              <Skeleton variant="rectangular" width={80} height={20} />
            </div>
            <Skeleton variant="circular" width={24} height={24} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TicketSkeleton;
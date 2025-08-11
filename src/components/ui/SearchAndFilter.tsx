import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTickets } from '../../contexts';
import { fadeInUp, slideInDown } from '../../utils/animations';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import styles from './SearchAndFilter.module.css';

export interface SearchAndFilterProps {
  className?: string;
  showFilterPanel?: boolean;
  collapsedByDefault?: boolean;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  className = '',
  showFilterPanel = true,
  collapsedByDefault = false,
}) => {
  const { state, actions } = useTickets();
  const { filters, isLoading } = state;
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(collapsedByDefault);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-collapse filters on mobile by default
  React.useEffect(() => {
    if (isMobile && !collapsedByDefault) {
      setIsFilterCollapsed(true);
    }
  }, [isMobile, collapsedByDefault]);

  const handleSearchChange = (searchValue: string) => {
    actions.setFilters({ search: searchValue });
  };

  const handleSearchClear = () => {
    actions.setFilters({ search: '' });
  };

  const handleToggleFilterCollapse = () => {
    setIsFilterCollapsed(!isFilterCollapsed);
  };

  return (
    <motion.div 
      className={`${styles.searchAndFilter} ${className}`}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className={styles.searchSection}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <SearchBar
          value={filters.search}
          onChange={handleSearchChange}
          onClear={handleSearchClear}
          placeholder="Search tickets by title, description, assignee, or tags..."
          disabled={isLoading}
          className={styles.searchBar}
        />
      </motion.div>

      {showFilterPanel && (
        <AnimatePresence>
          <motion.div 
            className={styles.filterSection}
            variants={slideInDown}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ delay: 0.2 }}
          >
            <FilterPanel
            isCollapsed={isFilterCollapsed}
            onToggleCollapse={handleToggleFilterCollapse}
            className={styles.filterPanel}
          />
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default SearchAndFilter;
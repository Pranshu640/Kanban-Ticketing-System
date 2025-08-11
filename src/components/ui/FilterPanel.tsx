import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Priority, TicketStatus } from '../../types';
import { getUniqueAssignees, getUniqueTags } from '../../data';
import { useTickets } from '../../contexts';
import Button from './Button';
import MultiSelect from './MultiSelect';
import styles from './FilterPanel.module.css';

export interface FilterPanelProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  className = '',
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { state, actions } = useTickets();
  const { board, filters } = state;
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Get unique values for filter options
  const uniqueAssignees = getUniqueAssignees(board.tickets);
  const uniqueTags = getUniqueTags(board.tickets);

  // Priority options
  const priorityOptions = Object.values(Priority).map(priority => ({
    value: priority,
    label: priority.charAt(0).toUpperCase() + priority.slice(1),
  }));

  // Status options
  const statusOptions = Object.values(TicketStatus).map(status => ({
    value: status,
    label: status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
  }));

  // Assignee options
  const assigneeOptions = uniqueAssignees.map(assignee => ({
    value: assignee,
    label: assignee,
  }));

  // Tag options
  const tagOptions = uniqueTags.map(tag => ({
    value: tag,
    label: tag.charAt(0).toUpperCase() + tag.slice(1),
  }));

  const handleFilterChange = (filterKey: keyof typeof filters, value: any) => {
    actions.setFilters({ [filterKey]: value });
  };

  const handleClearAllFilters = () => {
    actions.clearFilters();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.priorities.length > 0) count++;
    if (filters.assignees.length > 0) count++;
    if (filters.statuses.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.overdue) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();
  const hasActiveFilters = activeFilterCount > 0;

  if (isCollapsed) {
    return (
      <div className={`${styles.filterPanel} ${styles.collapsed} ${className}`}>
        <Button
          variant="outline"
          size="medium"
          onClick={onToggleCollapse}
          className={styles.toggleButton}
        >
          <Filter size={16} />
          Filters
          {hasActiveFilters && (
            <span className={styles.filterBadge}>{activeFilterCount}</span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={`${styles.filterPanel} ${className}`}>
      <div className={styles.filterHeader}>
        <div className={styles.filterTitle}>
          <Filter size={16} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className={styles.filterBadge}>{activeFilterCount}</span>
          )}
        </div>
        
        <div className={styles.filterActions}>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="small"
              onClick={handleClearAllFilters}
              className={styles.clearButton}
            >
              Clear All
            </Button>
          )}
          
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="small"
              iconOnly
              onClick={onToggleCollapse}
              className={styles.collapseButton}
              aria-label="Collapse filters"
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </div>

      <div className={styles.filterContent}>
        {/* Priority Filter */}
        <div className={styles.filterGroup}>
          <MultiSelect
            label="Priority"
            options={priorityOptions}
            value={filters.priorities}
            onChange={(value) => handleFilterChange('priorities', value)}
            placeholder="All priorities"
            maxDisplayItems={2}
          />
        </div>

        {/* Status Filter */}
        <div className={styles.filterGroup}>
          <MultiSelect
            label="Status"
            options={statusOptions}
            value={filters.statuses}
            onChange={(value) => handleFilterChange('statuses', value)}
            placeholder="All statuses"
            maxDisplayItems={2}
          />
        </div>

        {/* Assignee Filter */}
        <div className={styles.filterGroup}>
          <MultiSelect
            label="Assignee"
            options={assigneeOptions}
            value={filters.assignees}
            onChange={(value) => handleFilterChange('assignees', value)}
            placeholder="All assignees"
            maxDisplayItems={2}
            searchable
          />
        </div>

        {/* Advanced Filters Toggle */}
        <div className={styles.advancedToggle}>
          <Button
            variant="ghost"
            size="small"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={styles.advancedToggleButton}
          >
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            Advanced Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className={styles.advancedFilters}>
            {/* Tags Filter */}
            <div className={styles.filterGroup}>
              <MultiSelect
                label="Tags"
                options={tagOptions}
                value={filters.tags}
                onChange={(value) => handleFilterChange('tags', value)}
                placeholder="All tags"
                maxDisplayItems={2}
                searchable
              />
            </div>

            {/* Overdue Filter */}
            <div className={styles.filterGroup}>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.overdue}
                    onChange={(e) => handleFilterChange('overdue', e.target.checked)}
                    className={styles.checkbox}
                  />
                  <div className={styles.checkboxIndicator}>
                    <AlertCircle size={14} />
                  </div>
                  <span className={styles.checkboxText}>Show only overdue tickets</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Filter Summary */}
        {hasActiveFilters && (
          <div className={styles.filterSummary}>
            <div className={styles.summaryTitle}>Active Filters:</div>
            <div className={styles.summaryItems}>
              {filters.search && (
                <div className={styles.summaryItem}>
                  Search: "{filters.search}"
                </div>
              )}
              {filters.priorities.length > 0 && (
                <div className={styles.summaryItem}>
                  Priority: {filters.priorities.join(', ')}
                </div>
              )}
              {filters.statuses.length > 0 && (
                <div className={styles.summaryItem}>
                  Status: {filters.statuses.map(status => 
                    status.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')
                  ).join(', ')}
                </div>
              )}
              {filters.assignees.length > 0 && (
                <div className={styles.summaryItem}>
                  Assignee: {filters.assignees.join(', ')}
                </div>
              )}
              {filters.tags.length > 0 && (
                <div className={styles.summaryItem}>
                  Tags: {filters.tags.join(', ')}
                </div>
              )}
              {filters.overdue && (
                <div className={styles.summaryItem}>
                  Overdue tickets only
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
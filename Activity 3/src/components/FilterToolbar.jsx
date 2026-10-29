import React from 'react';
import { Search, X, LayoutGrid, List, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../data/initialTasks';

export default function FilterToolbar({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterPriority,
  onFilterPriorityChange,
  filterCategory,
  onFilterCategoryChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  isFiltered
}) {
  return (
    <div className="toolbar-section">
      <div className="search-box-wrapper">
        <Search size={16} className="search-input-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks, descriptions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          id="search-input"
        />
        {searchQuery && (
          <button
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="filters-wrapper">
        <select
          className="select-custom"
          value={filterStatus}
          onChange={(e) => onFilterStatusChange(e.target.value)}
          aria-label="Filter by Status"
          id="filter-status"
        >
          <option value="all">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">In Review</option>
          <option value="completed">Completed</option>
        </select>

        <select
          className="select-custom"
          value={filterPriority}
          onChange={(e) => onFilterPriorityChange(e.target.value)}
          aria-label="Filter by Priority"
          id="filter-priority"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          className="select-custom"
          value={filterCategory}
          onChange={(e) => onFilterCategoryChange(e.target.value)}
          aria-label="Filter by Category"
          id="filter-category"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="select-custom"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          aria-label="Sort Tasks"
          id="sort-by"
        >
          <option value="createdDesc">Newest First</option>
          <option value="dueDateAsc">Due Date (Earliest)</option>
          <option value="dueDateDesc">Due Date (Latest)</option>
          <option value="priorityDesc">Priority (Highest)</option>
          <option value="titleAsc">Title (A - Z)</option>
        </select>

        {isFiltered && (
          <button
            className="btn-reset-filters"
            onClick={onResetFilters}
            title="Reset all active filters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}

        <div className="view-toggle-group">
          <button
            className={`view-toggle-btn ${viewMode === 'board' ? 'active' : ''}`}
            onClick={() => onViewModeChange('board')}
            title="Kanban Board View"
            id="view-toggle-board"
          >
            <LayoutGrid size={15} />
            <span>Board</span>
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="List Table View"
            id="view-toggle-list"
          >
            <List size={15} />
            <span>List</span>
          </button>
        </div>
      </div>
    </div>
  );
}

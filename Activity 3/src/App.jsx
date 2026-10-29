import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import FilterToolbar from './components/FilterToolbar';
import KanbanBoard from './components/KanbanBoard';
import TaskListView from './components/TaskListView';
import TaskModal from './components/TaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { INITIAL_TASKS } from './data/initialTasks';
import './App.css';

export default function App() {
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('taskflow_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taskflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Tasks state with localStorage persistence
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('taskflow_tasks');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved tasks:', e);
    }
    return INITIAL_TASKS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks:', e);
    }
  }, [tasks]);

  // Filtering, Searching & Sorting states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdDesc');
  const [viewMode, setViewMode] = useState('board');

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [modalDefaultStatus, setModalDefaultStatus] = useState('todo');
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Check if any filter is active
  const isFiltered = searchQuery !== '' || filterStatus !== 'all' || filterPriority !== 'all' || filterCategory !== 'all' || sortBy !== 'createdDesc';

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterPriority('all');
    setFilterCategory('all');
    setSortBy('createdDesc');
    addToast('Filters reset to default', 'info');
  };

  // Task CRUD operations
  const handleOpenCreateModal = (defaultColStatus = 'todo') => {
    setTaskToEdit(null);
    setModalDefaultStatus(defaultColStatus);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (taskToEdit) {
      // Update existing task
      setTasks(prev => prev.map(t => (t.id === taskToEdit.id ? { ...t, ...taskData } : t)));
      addToast(`Updated "${taskData.title}"`, 'success');
    } else {
      // Create new task
      const newTask = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [newTask, ...prev]);
      addToast(`Created "${taskData.title}"`, 'success');
    }
    setIsTaskModalOpen(false);
    setTaskToEdit(null);
  };

  const handleDeletePrompt = (task) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setTaskToDelete(null);
    if (task) {
      addToast(`Deleted "${task.title}"`, 'warning');
    }
  };

  const handleToggleStatus = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
        const msg = nextStatus === 'completed' ? `Completed "${t.title}"` : `Marked "${t.title}" as to do`;
        addToast(msg, 'info');
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleQuickStatusChange = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        if (t.status !== newStatus) {
          addToast(`Moved "${t.title}" to ${newStatus.replace('-', ' ')}`, 'info');
          return { ...t, status: newStatus };
        }
      }
      return t;
    }));
  };

  const handleDropTask = (taskId, targetStatus) => {
    handleQuickStatusChange(taskId, targetStatus);
  };

  // Filter & Sort Logic
  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(query);
          const matchDesc = task.description && task.description.toLowerCase().includes(query);
          const matchAssignee = task.assignee?.name && task.assignee.name.toLowerCase().includes(query);
          const matchCategory = task.category && task.category.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchAssignee && !matchCategory) {
            return false;
          }
        }

        // Status Filter
        if (filterStatus !== 'all' && task.status !== filterStatus) {
          return false;
        }

        // Priority Filter
        if (filterPriority !== 'all' && task.priority !== filterPriority) {
          return false;
        }

        // Category Filter
        if (filterCategory !== 'all' && task.category !== filterCategory) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDateAsc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortBy === 'dueDateDesc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return b.dueDate.localeCompare(a.dueDate);
        }
        if (sortBy === 'priorityDesc') {
          const priorityWeights = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
        }
        if (sortBy === 'titleAsc') {
          return a.title.localeCompare(b.title);
        }
        // createdDesc
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [tasks, searchQuery, filterStatus, filterPriority, filterCategory, sortBy]);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenCreateModal={() => handleOpenCreateModal('todo')}
      />

      {/* Analytics & Progress Overview */}
      <StatsCards tasks={tasks} />

      {/* Controls: Search, Filters & View Toggle */}
      <FilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        filterPriority={filterPriority}
        onFilterPriorityChange={setFilterPriority}
        filterCategory={filterCategory}
        onFilterCategoryChange={setFilterCategory}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetFilters={handleResetFilters}
        isFiltered={isFiltered}
      />

      {/* Main Content: Kanban Board or List View */}
      <main>
        {viewMode === 'board' ? (
          <KanbanBoard
            tasks={filteredAndSortedTasks}
            onEditTask={handleOpenEditModal}
            onDeleteTask={handleDeletePrompt}
            onToggleStatus={handleToggleStatus}
            onDropTask={handleDropTask}
            onQuickStatusChange={handleQuickStatusChange}
            onOpenCreateWithStatus={(colId) => handleOpenCreateModal(colId)}
          />
        ) : (
          <TaskListView
            tasks={filteredAndSortedTasks}
            onEditTask={handleOpenEditModal}
            onDeleteTask={handleDeletePrompt}
            onToggleStatus={handleToggleStatus}
            onQuickStatusChange={handleQuickStatusChange}
          />
        )}
      </main>

      {/* Create & Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        defaultStatus={modalDefaultStatus}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!taskToDelete}
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Dynamic Toasts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

import React, { useState } from 'react';
import { Plus, Inbox } from 'lucide-react';
import TaskCard from './TaskCard';
import { STATUS_COLUMNS } from '../data/initialTasks';

export default function KanbanBoard({
  tasks,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  onDropTask,
  onQuickStatusChange,
  onOpenCreateWithStatus
}) {
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e, columnId) => {
    e.preventDefault();
    if (dragOverColumn === columnId) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onDropTask(taskId, columnId);
    }
  };

  return (
    <div className="kanban-grid">
      {STATUS_COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);

        return (
          <div
            key={column.id}
            className={`kanban-column ${dragOverColumn === column.id ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={(e) => handleDragLeave(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
            id={`column-${column.id}`}
          >
            <div className="column-header">
              <div className="column-title-wrap">
                <span className={`column-dot ${column.dotClass}`} />
                <h2 className="column-title">{column.label}</h2>
                <span className="column-count">{columnTasks.length}</span>
              </div>
              <button
                className="btn-add-column-task"
                onClick={() => onOpenCreateWithStatus(column.id)}
                title={`Add task to ${column.label}`}
                aria-label={`Add task to ${column.label}`}
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="column-task-list">
              {columnTasks.length === 0 ? (
                <div className="empty-column-placeholder">
                  <Inbox size={24} />
                  <span>No tasks in this column</span>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onToggleStatus={onToggleStatus}
                    onQuickStatusChange={onQuickStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

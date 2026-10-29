import React from 'react';
import { Calendar, CheckCircle2, Circle, Edit3, Trash2, ArrowRight } from 'lucide-react';

export default function TaskCard({
  task,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  onQuickStatusChange
}) {
  const isCompleted = task.status === 'completed';

  // Subtask completion calculate
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  const completedSubtasks = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
  const subtasksPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  // Format Due Date & check overdue
  const todayStr = new Date().toISOString().split('T')[0];
  const isOverdue = task.dueDate && task.dueDate < todayStr && !isCompleted;
  const isToday = task.dueDate && task.dueDate === todayStr && !isCompleted;

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const initials = task.assignee?.name
    ? task.assignee.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'TF';

  return (
    <div
      className={`task-card ${isCompleted ? 'completed' : ''}`}
      draggable
      onDragStart={handleDragStart}
      id={`task-card-${task.id}`}
    >
      <div className="card-top">
        <div className="badge-group">
          {task.category && (
            <span className="badge badge-category">{task.category}</span>
          )}
          <span className={`badge badge-priority ${task.priority}`}>
            {task.priority.toUpperCase()}
          </span>
        </div>

        <div className="card-actions">
          <button
            className="btn-card-action"
            onClick={() => onToggleStatus(task.id)}
            title={isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
            aria-label="Toggle Complete"
          >
            {isCompleted ? (
              <CheckCircle2 size={16} color="var(--accent-emerald)" />
            ) : (
              <Circle size={16} />
            )}
          </button>
          <button
            className="btn-card-action"
            onClick={() => onEditTask(task)}
            title="Edit Task"
            aria-label="Edit Task"
          >
            <Edit3 size={15} />
          </button>
          <button
            className="btn-card-action danger"
            onClick={() => onDeleteTask(task)}
            title="Delete Task"
            aria-label="Delete Task"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <h3 className="card-title">{task.title}</h3>

      {task.description && (
        <p className="card-desc">{task.description}</p>
      )}

      {totalSubtasks > 0 && (
        <div className="card-subtasks-preview">
          <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
          <div className="subtask-bar-track">
            <div
              className="subtask-bar-fill"
              style={{ width: `${subtasksPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="card-meta">
        <div className="assignee-chip" title={`${task.assignee?.name} (${task.assignee?.role})`}>
          <div
            className="avatar-circle"
            style={{ backgroundColor: task.assignee?.avatarColor || 'var(--accent-primary)' }}
          >
            {initials}
          </div>
          <span className="assignee-name">{task.assignee?.name}</span>
        </div>

        {task.dueDate && (
          <div
            className={`due-date-pill ${isOverdue ? 'overdue' : isToday ? 'today' : ''}`}
            title={isOverdue ? 'Overdue!' : isToday ? 'Due today' : `Due on ${task.dueDate}`}
          >
            <Calendar size={13} />
            <span>{task.dueDate}</span>
          </div>
        )}
      </div>

      {/* Quick Move Status Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem', marginTop: '0.2rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Move to:</span>
        <select
          className="select-custom"
          style={{ padding: '0.2rem 1.4rem 0.2rem 0.4rem', fontSize: '0.72rem' }}
          value={task.status}
          onChange={(e) => onQuickStatusChange(task.id, e.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">In Review</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
}

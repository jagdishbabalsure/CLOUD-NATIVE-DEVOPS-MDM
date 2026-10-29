import React from 'react';
import { Calendar, CheckCircle2, Circle, Edit3, Trash2, Inbox } from 'lucide-react';

export default function TaskListView({
  tasks,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  onQuickStatusChange
}) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state-view">
        <div className="empty-state-icon">
          <Inbox size={32} />
        </div>
        <h3>No tasks found</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          No tasks match the selected search and filter criteria.
        </p>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="list-view-container">
      <table className="task-list-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}>Done</th>
            <th>Task Details</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Category</th>
            <th>Due Date</th>
            <th>Assignee</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isOverdue = task.dueDate && task.dueDate < todayStr && !isCompleted;
            const isToday = task.dueDate && task.dueDate === todayStr && !isCompleted;

            const initials = task.assignee?.name
              ? task.assignee.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : 'TF';

            return (
              <tr key={task.id}>
                <td>
                  <button
                    className="btn-card-action"
                    onClick={() => onToggleStatus(task.id)}
                    title={isCompleted ? "Mark incomplete" : "Mark completed"}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={18} color="var(--accent-emerald)" />
                    ) : (
                      <Circle size={18} color="var(--text-muted)" />
                    )}
                  </button>
                </td>

                <td>
                  <div className="table-title-cell">
                    <span className={`table-title ${isCompleted ? 'task-completed-text' : ''}`}>
                      {task.title}
                    </span>
                    {task.description && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {task.description}
                      </span>
                    )}
                  </div>
                </td>

                <td>
                  <select
                    className="select-custom"
                    value={task.status}
                    onChange={(e) => onQuickStatusChange(task.id, e.target.value)}
                    style={{ padding: '0.35rem 1.6rem 0.35rem 0.6rem', fontSize: '0.78rem' }}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>

                <td>
                  <span className={`badge badge-priority ${task.priority}`}>
                    {task.priority.toUpperCase()}
                  </span>
                </td>

                <td>
                  {task.category && (
                    <span className="badge badge-category">
                      {task.category}
                    </span>
                  )}
                </td>

                <td>
                  {task.dueDate ? (
                    <div
                      className={`due-date-pill ${isOverdue ? 'overdue' : isToday ? 'today' : ''}`}
                    >
                      <Calendar size={13} />
                      <span>{task.dueDate}</span>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>None</span>
                  )}
                </td>

                <td>
                  <div className="assignee-chip">
                    <div
                      className="avatar-circle"
                      style={{ backgroundColor: task.assignee?.avatarColor || 'var(--accent-primary)' }}
                    >
                      {initials}
                    </div>
                    <span className="assignee-name">{task.assignee?.name}</span>
                  </div>
                </td>

                <td>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.3rem' }}>
                    <button
                      className="btn-card-action"
                      onClick={() => onEditTask(task)}
                      title="Edit Task"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      className="btn-card-action danger"
                      onClick={() => onDeleteTask(task)}
                      title="Delete Task"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import React from 'react';
import { CheckCircle2, Clock, ListTodo, AlertCircle } from 'lucide-react';

export default function StatsCards({ tasks }) {
  const total = tasks.length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress' || t.status === 'review').length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const percentCompleted = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="stats-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <ListTodo size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{total}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon todo">
            <AlertCircle size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">To Do</span>
            <span className="stat-value">{todo}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon in-progress">
            <Clock size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{inProgress}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{completed}</span>
          </div>
        </div>
      </div>

      <div className="overall-progress-card" style={{ marginTop: '0.85rem' }}>
        <div className="progress-header">
          <span>Overall Workspace Velocity & Completion</span>
          <span className="progress-percentage">{percentCompleted}% Done</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${percentCompleted}%` }}
          />
        </div>
      </div>
    </section>
  );
}

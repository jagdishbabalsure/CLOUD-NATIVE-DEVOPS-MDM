import React from 'react';
import { Layers, Plus, Sun, Moon, CheckSquare } from 'lucide-react';

export default function Navbar({ theme, onToggleTheme, onOpenCreateModal }) {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon-wrapper">
          <Layers size={24} />
        </div>
        <div className="brand-info">
          <h1>TaskFlow</h1>
          <p className="brand-tagline">Real-Time Task Management Dashboard</p>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="btn-icon"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="btn-primary"
          onClick={() => onOpenCreateModal()}
          id="btn-create-task"
        >
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}

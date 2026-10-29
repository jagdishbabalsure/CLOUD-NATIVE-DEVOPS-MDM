import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { CATEGORIES, PRIORITIES, TEAM_MEMBERS } from '../data/initialTasks';

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  defaultStatus = 'todo'
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [dueDate, setDueDate] = useState('');
  const [assigneeName, setAssigneeName] = useState(TEAM_MEMBERS[0].name);
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status || 'todo');
      setPriority(taskToEdit.priority || 'medium');
      setCategory(taskToEdit.category || CATEGORIES[0]);
      setDueDate(taskToEdit.dueDate || '');
      setAssigneeName(taskToEdit.assignee?.name || TEAM_MEMBERS[0].name);
      setSubtasks(taskToEdit.subtasks ? [...taskToEdit.subtasks] : []);
    } else {
      // Default reset
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
      setPriority('medium');
      setCategory(CATEGORIES[0]);
      // default due date: 7 days from now
      const d = new Date();
      d.setDate(d.getDate() + 7);
      setDueDate(d.toISOString().split('T')[0]);
      setAssigneeName(TEAM_MEMBERS[0].name);
      setSubtasks([]);
    }
    setNewSubtaskText('');
    setErrorMessage('');
  }, [taskToEdit, defaultStatus, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    const newSub = {
      id: `st-${Date.now()}`,
      text: newSubtaskText.trim(),
      completed: false
    };
    setSubtasks([...subtasks, newSub]);
    setNewSubtaskText('');
  };

  const handleToggleSubtask = (subtaskId) => {
    setSubtasks(subtasks.map(s => 
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    ));
  };

  const handleDeleteSubtask = (subtaskId) => {
    setSubtasks(subtasks.filter(s => s.id !== subtaskId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Task title is required.');
      return;
    }

    const selectedMember = TEAM_MEMBERS.find(m => m.name === assigneeName) || TEAM_MEMBERS[0];

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      category,
      dueDate,
      assignee: selectedMember,
      subtasks
    };

    onSave(taskData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMessage && (
              <div style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', fontWeight: 600 }}>
                {errorMessage}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Implement user authentication..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Add context, specifications or acceptance criteria..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  {PRIORITIES.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assignee</label>
                <select
                  className="form-select"
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                >
                  {TEAM_MEMBERS.map(m => (
                    <option key={m.name} value={m.name}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subtasks checklist */}
            <div className="subtasks-section">
              <label className="form-label">Subtasks / Checklist ({subtasks.length})</label>
              
              <div className="subtask-input-row">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add a checklist item..."
                  value={newSubtaskText}
                  onChange={(e) => setNewSubtaskText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask(e);
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleAddSubtask}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              </div>

              {subtasks.length > 0 && (
                <div className="subtask-items-list">
                  {subtasks.map((st) => (
                    <div key={st.id} className="subtask-item">
                      <div className="subtask-item-left">
                        <button
                          type="button"
                          className="btn-card-action"
                          onClick={() => handleToggleSubtask(st.id)}
                        >
                          {st.completed ? (
                            <CheckCircle2 size={16} color="var(--accent-emerald)" />
                          ) : (
                            <Circle size={16} color="var(--text-muted)" />
                          )}
                        </button>
                        <span style={{
                          textDecoration: st.completed ? 'line-through' : 'none',
                          color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)'
                        }}>
                          {st.text}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn-card-action danger"
                        onClick={() => handleDeleteSubtask(st.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" id="btn-save-task">
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

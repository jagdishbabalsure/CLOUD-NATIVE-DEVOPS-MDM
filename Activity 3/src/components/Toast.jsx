import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  const renderIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="var(--accent-emerald)" />;
      case 'warning':
        return <AlertTriangle size={18} color="var(--accent-amber)" />;
      case 'error':
        return <AlertCircle size={18} color="var(--accent-rose)" />;
      default:
        return <Info size={18} color="var(--accent-primary)" />;
    }
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type || 'info'}`}>
          {renderIcon(toast.type)}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            className="btn-card-action"
            style={{ width: '22px', height: '22px' }}
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

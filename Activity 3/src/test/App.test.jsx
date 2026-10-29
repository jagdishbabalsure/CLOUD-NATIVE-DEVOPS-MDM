import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('TaskFlow Dashboard Application', () => {
  it('renders application title and branding', () => {
    render(<App />);
    expect(screen.getByText('TaskFlow')).toBeDefined();
    expect(screen.getByText('Real-Time Task Management Dashboard')).toBeDefined();
  });

  it('renders stats overview cards', () => {
    render(<App />);
    expect(screen.getByText('Total Tasks')).toBeDefined();
    expect(screen.getAllByText('To Do').length).toBeGreaterThan(0);
    expect(screen.getAllByText('In Progress').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
  });

  it('renders Kanban board columns', () => {
    render(<App />);
    const todoColumns = screen.getAllByText('To Do');
    expect(todoColumns.length).toBeGreaterThan(0);
    const inProgressColumns = screen.getAllByText('In Progress');
    expect(inProgressColumns.length).toBeGreaterThan(0);
  });

  it('filters tasks by search input', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/search tasks/i);
    fireEvent.change(searchInput, { target: { value: 'OAuth' } });
    expect(screen.getByText(/Implement OAuth 2.0/i)).toBeDefined();
  });

  it('toggles to list view and back to board view', () => {
    render(<App />);
    const listBtn = screen.getByRole('button', { name: /list/i });
    fireEvent.click(listBtn);
    expect(screen.getByText(/Task Details/i)).toBeDefined();

    const boardBtn = screen.getByRole('button', { name: /board/i });
    fireEvent.click(boardBtn);
    expect(screen.getAllByText('In Review').length).toBeGreaterThan(0);
  });

  it('opens create task modal when clicking New Task', () => {
    render(<App />);
    const newTaskBtn = screen.getByRole('button', { name: /new task/i });
    fireEvent.click(newTaskBtn);
    expect(screen.getByText('Create New Task')).toBeDefined();
    expect(screen.getByPlaceholderText(/e\.g\. Implement user authentication/i)).toBeDefined();
  });
});

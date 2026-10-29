export const INITIAL_TASKS = [
  {
    id: "task-101",
    title: "Redesign User Onboarding Flow",
    description: "Design high-converting onboarding wizard with micro-interactions and interactive product tour.",
    status: "in-progress",
    priority: "high",
    category: "Design",
    dueDate: "2026-11-05",
    createdAt: "2026-10-25T09:00:00Z",
    assignee: {
      name: "Sophia Martinez",
      avatarColor: "#8b5cf6",
      role: "Product Designer"
    },
    subtasks: [
      { id: "st-1", text: "Create wireframes in Figma", completed: true },
      { id: "st-2", text: "Review user flow with team", completed: true },
      { id: "st-3", text: "Export tokens and assets", completed: false }
    ]
  },
  {
    id: "task-102",
    title: "Implement OAuth 2.0 & SSO Auth",
    description: "Integrate Google and GitHub single sign-on with secure JWT refresh token rotation.",
    status: "todo",
    priority: "urgent",
    category: "Engineering",
    dueDate: "2026-11-02",
    createdAt: "2026-10-26T10:30:00Z",
    assignee: {
      name: "Alex Rivera",
      avatarColor: "#6366f1",
      role: "Backend Engineer"
    },
    subtasks: [
      { id: "st-4", text: "Configure Auth0 provider", completed: false },
      { id: "st-5", text: "Implement token exchange route", completed: false },
      { id: "st-6", text: "Write unit tests for auth middleware", completed: false }
    ]
  },
  {
    id: "task-103",
    title: "Q4 Marketing Product Launch Campaign",
    description: "Coordinate with copywriting and sales for product release email sequence and social assets.",
    status: "review",
    priority: "medium",
    category: "Marketing",
    dueDate: "2026-11-10",
    createdAt: "2026-10-20T14:15:00Z",
    assignee: {
      name: "Emma Watson",
      avatarColor: "#ec4899",
      role: "Growth Lead"
    },
    subtasks: [
      { id: "st-7", text: "Draft newsletter sequence", completed: true },
      { id: "st-8", text: "Design promotional banners", completed: true }
    ]
  },
  {
    id: "task-104",
    title: "Optimize PostgreSQL Query Performance",
    description: "Add indexing on composite tenant tables to reduce dashboard analytics latency under 100ms.",
    status: "completed",
    priority: "high",
    category: "Engineering",
    dueDate: "2026-10-28",
    createdAt: "2026-10-18T11:00:00Z",
    assignee: {
      name: "Marcus Chen",
      avatarColor: "#10b981",
      role: "Database Architect"
    },
    subtasks: [
      { id: "st-9", text: "Run EXPLAIN ANALYZE on slow queries", completed: true },
      { id: "st-10", text: "Apply partial indexes", completed: true },
      { id: "st-11", text: "Benchmark read throughput", completed: true }
    ]
  },
  {
    id: "task-105",
    title: "SOC2 Compliance Security Audit",
    description: "Audit role-based access control policies, encryption at rest, and automated audit logs.",
    status: "todo",
    priority: "medium",
    category: "Operations",
    dueDate: "2026-11-18",
    createdAt: "2026-10-27T08:00:00Z",
    assignee: {
      name: "Liam O'Connor",
      avatarColor: "#f59e0b",
      role: "Security Officer"
    },
    subtasks: [
      { id: "st-12", text: "Review AWS IAM role boundaries", completed: false },
      { id: "st-13", text: "Audit log retention policies", completed: false }
    ]
  },
  {
    id: "task-106",
    title: "Mobile Responsiveness Polish",
    description: "Fix hamburger navigation alignment and table overflow on iOS Safari and mobile Chrome.",
    status: "completed",
    priority: "low",
    category: "Design",
    dueDate: "2026-10-29",
    createdAt: "2026-10-22T16:45:00Z",
    assignee: {
      name: "Sophia Martinez",
      avatarColor: "#8b5cf6",
      role: "Product Designer"
    },
    subtasks: [
      { id: "st-14", text: "Test on iPhone 15 Pro viewport", completed: true },
      { id: "st-15", text: "Resolve touch target spacing issues", completed: true }
    ]
  }
];

export const CATEGORIES = ["Engineering", "Design", "Marketing", "Operations", "Product"];

export const PRIORITIES = [
  { value: "low", label: "Low", color: "var(--accent-emerald)" },
  { value: "medium", label: "Medium", color: "var(--accent-cyan)" },
  { value: "high", label: "High", color: "var(--accent-amber)" },
  { value: "urgent", label: "Urgent", color: "var(--accent-rose)" }
];

export const STATUS_COLUMNS = [
  { id: "todo", label: "To Do", dotClass: "dot-todo" },
  { id: "in-progress", label: "In Progress", dotClass: "dot-in-progress" },
  { id: "review", label: "In Review", dotClass: "dot-review" },
  { id: "completed", label: "Completed", dotClass: "dot-completed" }
];

export const TEAM_MEMBERS = [
  { name: "Alex Rivera", role: "Backend Engineer", avatarColor: "#6366f1" },
  { name: "Sophia Martinez", role: "Product Designer", avatarColor: "#8b5cf6" },
  { name: "Emma Watson", role: "Growth Lead", avatarColor: "#ec4899" },
  { name: "Marcus Chen", role: "Database Architect", avatarColor: "#10b981" },
  { name: "Liam O'Connor", role: "Security Officer", avatarColor: "#f59e0b" }
];

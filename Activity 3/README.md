# TaskFlow — Cloud Native DevOps CI/CD & IaC Project
**Activity 3 — Cloud Native DevOps (MDM)**

A cloud-native task management application built with **React 19**, containerized with **Docker & Nginx**, automated with a **Jenkins CI/CD Pipeline**, and provisioned using **Terraform Infrastructure as Code (IaC)**.

---

## 📌 Project Architecture

```
                    ┌─────────────────────────┐
                    │  Developer Git Push     │
                    │  to GitHub Repository   │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Jenkins CI/CD Server  │
                    │   (Automated Webhook)   │
                    └────────────┬────────────┘
                                 │
    ┌────────────────┬───────────┴───────────┬────────────────┐
    ▼                ▼                       ▼                ▼
[Stage 1-2]      [Stage 3-4]             [Stage 5-6]      [Stage 7-8]
Checkout &       Linting &               Build & Docker   Deploy & Smoke
Install Deps     Vitest Unit Tests       Packaging        Test (Port 80)
                                                              │
                                 ┌────────────────────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │ AWS Cloud Infrastructure│
                    │ Provisioned by Terraform│
                    │   (VPC, Subnet, EC2)    │
                    └─────────────────────────┘
```

---

## 🚀 Features of TaskFlow Web Application

- **Interactive Kanban Board**: 4-column workflow (`To Do`, `In Progress`, `In Review`, `Completed`) with HTML5 Drag & Drop and quick-move actions.
- **Dual View Modes**: Switch seamlessly between visual Kanban Board and structured List/Table view.
- **Dynamic Task Filtering & Search**: Instant filtering by status, priority (`Urgent`, `High`, `Medium`, `Low`), category (`Engineering`, `Design`, `Marketing`, etc.), and real-time text search.
- **Task Management CRUD**: Full support for creating, editing, completing, and deleting tasks with confirmation modals and undo/toast alerts.
- **Subtasks & Progress Tracking**: Checklist progress bars per task and overall workspace completion velocity metrics.
- **Dark & Light Mode**: Sleek glassmorphism UI with persistent theme toggle.

---

## 📂 Project Structure

```
Activity 3/
├── .dockerignore            # Excluded files for Docker build context
├── Dockerfile               # Multi-stage production build (Node.js + Nginx)
├── Jenkinsfile              # Declarative 8-stage CI/CD pipeline
├── nginx.conf               # High-performance Nginx SPA reverse proxy config
├── package.json             # NPM dependencies, scripts, and build metadata
├── package-lock.json        # Deterministic dependency lockfile
├── vite.config.js           # Vite build & Vitest test runner configuration
├── index.html               # Main HTML entry with Google Fonts & SEO tags
├── src/
│   ├── main.jsx             # React application mount entry
│   ├── App.jsx              # Core application state, filters, and routing
│   ├── App.css              # Glassmorphic CSS design system and tokens
│   ├── index.css            # Base typography, reset, and theme variables
│   ├── components/
│   │   ├── Navbar.jsx       # Header bar, logo, theme toggle & create task button
│   │   ├── StatsCards.jsx   # Metrics overview cards and velocity progress bar
│   │   ├── FilterToolbar.jsx# Search bar, status/priority/category dropdowns & view toggle
│   │   ├── KanbanBoard.jsx  # Drag-and-drop Kanban columns layout
│   │   ├── TaskCard.jsx     # Individual task card with badges, subtasks & actions
│   │   ├── TaskListView.jsx # Tabular list view for structured management
│   │   ├── TaskModal.jsx    # Create and Edit modal with checklist builder
│   │   ├── DeleteConfirmModal.jsx # Destructive action confirmation dialog
│   │   └── Toast.jsx        # Floating notifications system
│   ├── data/
│   │   └── initialTasks.js  # Pre-seeded realistic demo data and categories
│   └── test/
│       ├── setup.js         # Vitest DOM cleanup setup
│       └── App.test.jsx     # Comprehensive automated unit tests
└── terraform/
    ├── provider.tf          # AWS provider & Terraform minimum version
    ├── variables.tf         # Input variable definitions with defaults
    ├── main.tf              # VPC, Subnet, Route Table, Security Group, EC2 Instance
    ├── outputs.tf           # Provisioned infrastructure outputs (IPs, URLs)
    └── terraform.tfvars     # Variable values for deployment
```

---

## 💻 Local Development & Testing

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **NPM**: v9+ or v10+

### 2. Setup Instructions
```bash
# Clone the repository
git clone https://github.com/jagdishbabalsure/CLOUD-NATIVE-DEVOPS-MDM.git
cd "CLOUD-NATIVE-DEVOPS-MDM/Activity 3"

# Install dependencies
npm install

# Run automated tests
npm test

# Run local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🐳 Docker Containerization

The application uses a **multi-stage build** to optimize size, build reproducibility, and security.

### Stage 1: Build Stage (`node:20-alpine`)
- Installs dependencies deterministically using `npm ci`.
- Runs unit tests (`npm test`).
- Compiles the minified production bundle into `/dist` (`npm run build`).

### Stage 2: Production Stage (`nginx:1.25-alpine`)
- Serves static assets using ultra-lightweight Nginx alpine base (~25MB image).
- Enables Gzip compression, client-side caching, and SPA fallback routing.

### Build and Run Docker Container Locally
```bash
# Build the Docker image
docker build -t taskflow-app:latest .

# Run container on port 80
docker run -d -p 80:80 --name taskflow-dashboard taskflow-app:latest

# Verify running container
docker ps

# Access application
curl http://localhost:80
```

---

## 🔄 Jenkins CI/CD Pipeline

The `Jenkinsfile` provides a complete **Declarative Pipeline** with automated stages:

| Stage | Name | Description |
|---|---|---|
| 1 | **Checkout SCM** | Clones the latest commit from the GitHub repository `main` branch. |
| 2 | **Install Dependencies** | Installs project dependencies using `npm ci`. |
| 3 | **Code Linting** | Runs static analysis via `npm run lint`. |
| 4 | **Automated Testing** | Executes unit tests via `npm test` (Vitest). Fails build if tests fail. |
| 5 | **Build Production** | Compiles minified production distribution via `npm run build`. |
| 6 | **Build Docker Image** | Builds Docker image tagged with build number and `latest`. |
| 7 | **Container Deployment** | Gracefully stops existing container and deploys updated container. |
| 8 | **Health Verification** | Executes curl smoke test against deployed container. |

### Setting Up the Jenkins Pipeline
1. In Jenkins Dashboard, click **New Item** -> Select **Pipeline** -> Name: `TaskFlow-CI-CD`.
2. Under **Pipeline Definition**, select **Pipeline script from SCM**.
3. SCM: **Git** -> Repository URL: `https://github.com/jagdishbabalsure/CLOUD-NATIVE-DEVOPS-MDM.git`.
4. Branch Specifier: `*/main`.
5. Script Path: `Activity 3/Jenkinsfile`.
6. Click **Save** and trigger **Build Now**.

---

## ☁️ Terraform Infrastructure as Code (IaC)

The `terraform/` directory provisions the cloud infrastructure required to host the TaskFlow application on AWS.

### Resources Provisioned:
1. **Custom VPC** (`10.0.0.0/16`) with DNS support and hostname assignment.
2. **Internet Gateway (IGW)** attached to the VPC for internet access.
3. **Public Subnet** (`10.0.1.0/24`) with automatic public IP assignment.
4. **Route Table & Association** directing `0.0.0.0/0` outbound traffic through the IGW.
5. **Security Group**:
   - Inbound Port 80 (HTTP for TaskFlow Web Application).
   - Inbound Port 8080 (Jenkins CI/CD server).
   - Inbound Port 22 (SSH administrative access).
   - Outbound all traffic (`0.0.0.0/0`).
6. **EC2 Instance** (`t3.micro`, Ubuntu 22.04 LTS) with automated `user_data` bootstrapping script installing Docker and launching the application.

### Terraform Execution Steps
```bash
cd terraform

# 1. Initialize working directory and download AWS provider
terraform init

# 2. Validate configuration files
terraform validate

# 3. Preview execution plan
terraform plan

# 4. Apply configuration to provision AWS resources
terraform apply -auto-approve

# 5. Review outputs (Public IP & Application URL)
terraform output app_url

# 6. Destroy infrastructure when finished
terraform destroy -auto-approve
```

---

## 📝 Assignment Submission Summary

- **Repository**: [https://github.com/jagdishbabalsure/CLOUD-NATIVE-DEVOPS-MDM](https://github.com/jagdishbabalsure/CLOUD-NATIVE-DEVOPS-MDM)
- **Activity**: Activity 3
- **Artifacts Included**:
  - React source code with complete features (Create, Edit, Delete, Filter, Drag & Drop).
  - Automated unit test suite (`src/test/App.test.jsx`).
  - Production `Dockerfile` and `nginx.conf`.
  - Automated CI/CD `Jenkinsfile`.
  - Complete Terraform Infrastructure as Code (`terraform/` directory).
  - Comprehensive `README.md`.

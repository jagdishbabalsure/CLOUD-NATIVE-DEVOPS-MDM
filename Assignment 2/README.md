# Containerization & Kubernetes Deployment Challenge

**Student:** Jagdish Babalsure  
**Course:** Cloud Native Development (MDM) — Final Year  

## Project Structure

```
Assignment 2/
|-- Assignment2_Containerization_Kubernetes.docx  # Final submission document with screenshots & logs
|-- Dockerfile                                   # Optimized Docker image definition (Maintainer: Jagdish Babalsure)
|-- deploy.ps1                                   # Automated one-click deployment script
|-- index.html                                   # Assignment overview landing page (Jagdish Babalsure)
|-- store.html                                   # Complete eCommerce fashion web app (all-in-one standalone file)
|-- style.css                                    # Modular design system & responsive styles
|-- app.js                                       # eCommerce catalog, cart & checkout logic
|-- hero.jpg                                     # Banner asset for store
|-- nginx.conf                                   # Custom Nginx configuration (gzip, caching)
|-- README.md                                    # This documentation file
\-- k8s/
    |-- deployment.yaml                          # Kubernetes Deployment (3 replicas, probes, limits)
    \-- service.yaml                             # Kubernetes NodePort Service (Port 30080)
```

---

## Prerequisites

| Tool | Version Verified | Check Command |
| :--- | :--- | :--- |
| **Docker** | 28.4.0+ | `docker --version` |
| **kubectl** | v1.34.1+ | `kubectl version --client` |
| **Minikube** | v1.37.0+ | `minikube version` |

---

## Deployment & Verification Steps

Ensure your terminal (PowerShell) is open inside this directory:
```powershell
# Open terminal inside the assignment directory
Set-Location -Path $PSScriptRoot  # or navigate to your Assignment 2 folder
```

### Option A - Automated One-Click Deployment (Recommended)

Simply execute the included PowerShell deployment script:
```powershell
.\deploy.ps1
```
This script automatically:
1. Starts the Minikube cluster (`--driver=docker`).
2. Configures the Docker CLI to use Minikube's internal Docker daemon.
3. Builds the `nginx-assignment:1.0` image directly into the cluster.
4. Applies `k8s/deployment.yaml` and `k8s/service.yaml`.
5. Waits for all 3 replicas to reach `Running` state.
6. Displays pod status, service info, and opens the service URL in your browser.

---

### Option B - Manual Step-by-Step Execution

#### 1. Start Minikube Cluster
```powershell
minikube start --driver=docker
```
Verify the cluster status:
```powershell
minikube status
```

#### 2. Configure Docker CLI to Use Minikube's Docker Daemon
*(This ensures images built locally are immediately visible to Kubernetes without needing an external registry like Docker Hub).*
```powershell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

#### 3. Build the Docker Image
```powershell
docker build -t nginx-assignment:1.0 .
```

#### 4. Verify Image Creation
```powershell
docker images nginx-assignment
```
Expected output:
```
REPOSITORY         TAG   IMAGE ID       CREATED        SIZE
nginx-assignment   1.0   a6881a4bcd64   ...            48.3MB
```

#### 5. Deploy to Kubernetes
```powershell
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

#### 6. Wait for Rollout Completion
```powershell
kubectl rollout status deployment/nginx-assignment-deployment --timeout=90s
```
Expected output:
```
deployment "nginx-assignment-deployment" successfully rolled out
```

#### 7. Verify Pods, Service, and Resources
```powershell
# Check pods (all 3 must show 1/1 Running)
kubectl get pods -l app=nginx-assignment -o wide

# Check service (NodePort 80:30080/TCP)
kubectl get service nginx-assignment-service

# Check all resources together
kubectl get all -l app=nginx-assignment
```

#### 8. Access the Running Application in Browser

**Method 1 (Minikube Service URL - Preferred):**
```powershell
minikube service nginx-assignment-service
```

**Method 2 (Port-Forwarding to Localhost):**
```powershell
kubectl port-forward service/nginx-assignment-service 8080:80
```
Then open your browser at: **http://localhost:8080**  
*(To view the eCommerce store page, visit: **http://localhost:8080/store.html**)*

---

## Useful Verification & Management Commands

```powershell
# 1. View live pod logs (shows HTTP 200 health checks)
kubectl logs -l app=nginx-assignment --tail=20

# 2. Inspect deployment events, health probes, and replica specifications
kubectl describe deployment nginx-assignment-deployment

# 3. Inspect individual pods
kubectl describe pods -l app=nginx-assignment

# 4. Scale up to 5 replicas dynamically
kubectl scale deployment nginx-assignment-deployment --replicas=5
kubectl get pods -l app=nginx-assignment

# 5. Scale back to 3 replicas
kubectl scale deployment nginx-assignment-deployment --replicas=3

# 6. Check container health probes inside pod
kubectl get pods -l app=nginx-assignment -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.phase}{"\t"}{.status.containerStatuses[0].ready}{"\n"}{end}'
```

---

## Cleanup / Tear Down

When you are finished demonstrating:
```powershell
# Delete deployment and service from cluster
kubectl delete -f k8s/deployment.yaml
kubectl delete -f k8s/service.yaml

# Stop Minikube cluster
minikube stop
```

# deploy.ps1 — Full deployment script for the assignment
# Run this script from the project root directory

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Containerization & Kubernetes Deployment Script " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Step 1: Start Minikube
Write-Host "`n[1/6] Starting Minikube..." -ForegroundColor Yellow
minikube start --driver=docker
if ($LASTEXITCODE -ne 0) { Write-Error "Minikube failed to start"; exit 1 }

# Step 2: Point Docker CLI to Minikube's daemon so the image is available inside the cluster
Write-Host "`n[2/6] Configuring Docker to use Minikube's Docker daemon..." -ForegroundColor Yellow
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Step 3: Build Docker image inside Minikube's Docker daemon
Write-Host "`n[3/6] Building Docker image: nginx-assignment:1.0 ..." -ForegroundColor Yellow
docker build -t nginx-assignment:1.0 .
if ($LASTEXITCODE -ne 0) { Write-Error "Docker build failed"; exit 1 }
Write-Host "  Image built successfully." -ForegroundColor Green

# Step 4: Apply Kubernetes manifests
Write-Host "`n[4/6] Applying Kubernetes Deployment..." -ForegroundColor Yellow
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Step 5: Wait for pods to be ready
Write-Host "`n[5/6] Waiting for pods to become Running (up to 90s)..." -ForegroundColor Yellow
kubectl rollout status deployment/nginx-assignment-deployment --timeout=90s

# Step 6: Show status
Write-Host "`n[6/6] Deployment complete! Current status:" -ForegroundColor Green
Write-Host "`n--- Pods ---" -ForegroundColor Cyan
kubectl get pods -l app=nginx-assignment -o wide
Write-Host "`n--- Service ---" -ForegroundColor Cyan
kubectl get service nginx-assignment-service
Write-Host "`n--- Deployment ---" -ForegroundColor Cyan
kubectl get deployment nginx-assignment-deployment

Write-Host "`n Opening app in browser..." -ForegroundColor Magenta
minikube service nginx-assignment-service

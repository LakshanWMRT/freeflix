# FreeFlix - GitOps Deployment with ArgoCD & K3s

Automated CI/CD and GitOps deployment pipeline for **FreeFlix** to a Raspberry Pi **k3s** Kubernetes cluster using **Docker Hub**, **GitHub Actions**, and **ArgoCD**.

---

## 🏗️ Architecture Overview

```
                      ┌────────────────────────┐
                      │   Git Push to `main`   │
                      └───────────┬────────────┘
                                  │
                                  ▼
                      ┌────────────────────────┐
                      │  GitHub Actions CI/CD  │
                      └─────┬────────────┬─────┘
                            │            │
         Builds multi-arch  │            │ Auto-updates
         (amd64 + arm/v7)   │            │ image tag & commits
                            ▼            ▼
             ┌─────────────────────┐   ┌─────────────────────┐
             │ Docker Hub Registry │   │ GitHub Repo (`k8s`) │
             │  r466670/freeflix   │   └──────────┬──────────┘
             └──────────┬──────────┘              │
                        │                         │ Monitors for
                        │                         │ Git changes
                        │                         ▼
                        │             ┌──────────────────────┐
                        │             │   ArgoCD on K3s      │
                        │             │   (Raspberry Pi)     │
                        │             └───────────┬──────────┘
                        │                         │ Reconciles
                        ▼                         ▼
             ┌───────────────────────────────────────────────┐
             │            Raspberry Pi K3s Cluster           │
             │   - Deployment: freeflix (Next.js Standalone) │
             │   - Service: ClusterIP (Port 80 -> 3000)      │
             │   - Ingress: Traefik (Port 80)                │
             └───────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
.
├── .github/workflows/
│   └── deploy.yml              # Multi-arch Docker build & push + GitOps tag updater
├── argocd/
│   └── application.yaml        # ArgoCD Application CRD for GitOps sync
├── k8s/
│   ├── namespace.yaml          # Creates `freeflix` namespace
│   ├── configmap.yaml          # Next.js & Jellyfin environment config
│   ├── deployment.yaml         # Lightweight Deployment with health probes
│   ├── service.yaml            # ClusterIP Service on port 80
│   ├── ingress.yaml            # Traefik Ingress routing
│   └── kustomization.yaml      # Kustomize manifest bundle
├── scripts/
│   └── build-and-push.sh       # Local multi-arch build script (optional)
├── Dockerfile                  # Multi-stage standalone Alpine image (~84MB)
└── next.config.mjs             # Next.js config with standalone output enabled
```

---

## 🚀 Setup Guide

### 1. Push to GitHub

Initialize and push this repository to your GitHub account:

```bash
git add .
git commit -m "feat: complete ArgoCD, Docker Hub, and K3s GitOps integration"
git branch -M main

# If you haven't linked a remote yet (adjust username if needed):
git remote add origin https://github.com/LakshanWMRT/freeflix.git
git push -u origin main
```

---

### 2. Configure GitHub Secrets for Docker Hub

Go to your repository on GitHub:
**Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret Name | Value | Description |
| :--- | :--- | :--- |
| `DOCKERHUB_USERNAME` | `r466670` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | `<your-docker-pat-or-password>` | Docker Hub Personal Access Token |

> **Workflow Permissions Note:** Under **Settings** → **Actions** → **General** → **Workflow permissions**, ensure **"Read and write permissions"** is selected so the workflow can update `k8s/kustomization.yaml`.

---

### 3. Install ArgoCD on your Raspberry Pi K3s (If not already installed)

SSH into your Raspberry Pi or run against your k3s cluster:

```bash
# Create the argocd namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for ArgoCD server to be ready
kubectl wait --for=condition=available --timeout=300s deployment/argocd-server -n argocd
```

#### Accessing ArgoCD UI:
```bash
# Get the initial admin password:
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo

# Port-forward to access UI:
kubectl port-forward svc/argocd-server -n argocd 8080:443
# Access at: https://localhost:8080 (Username: admin)
```

---

### 4. Deploy the FreeFlix ArgoCD Application

Apply the ArgoCD Application manifest to your cluster:

```bash
kubectl apply -f argocd/application.yaml
```

ArgoCD will automatically:
1. Connect to your Git repository.
2. Read `k8s/kustomization.yaml`.
3. Create the `freeflix` namespace.
4. Deploy the ConfigMap, Deployment, Service, and Ingress.
5. Continuously self-heal and auto-sync whenever new commits land on `main`!

---

### 5. Accessing FreeFlix on your Local Network

The Ingress is configured for K3s's built-in **Traefik**:

- By default, you can access the app directly via your Raspberry Pi's IP:
  `http://<RASPBERRY_PI_IP>/`
- Or add a local DNS entry in your `/etc/hosts` (or router):
  `<RASPBERRY_PI_IP>  freeflix.local`
  and navigate to: `http://freeflix.local`

---

### 🛠️ Manual Build & Push (Alternative to GitHub Actions)

If you wish to build and push directly from your local terminal:

```bash
./scripts/build-and-push.sh latest
```

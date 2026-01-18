# Kubernetes Deployment Guide

## Prerequisites

1. K3s cluster running
2. cert-manager installed
3. GitHub secrets configured:
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN`
   - `KUBECONFIG_K3S`
   - `MONGODB_URI`
   - `JWT_SECRET`

## DNS Configuration

Add these A records pointing to your server IP:
- `fitverse.codewithxjohn.com`
- `api.fitverse.codewithxjohn.com`

## Deployment

Push to main branch to trigger automatic deployment via GitHub Actions.

### Manual Deployment

```bash
# Apply all manifests
kubectl apply -f kubernetes/

# Check status
kubectl get pods
kubectl get ingress
kubectl get certificate
```

## Accessing the Application

- Frontend: https://fitverse.codewithxjohn.com
- Backend API: https://api.fitverse.codewithxjohn.com

## SSL Certificates

Initially uses staging certificates. After verifying everything works:

1. Edit `kubernetes/ingress.yml`
2. Change `letsencrypt-staging` to `letsencrypt-prod`
3. Delete old certificate: `kubectl delete certificate mern-fit-verse-tls`
4. Push changes

## Troubleshooting

```bash
# Check pod logs
kubectl logs -l app=mern-fit-verse-backend
kubectl logs -l app=mern-fit-verse-frontend

# Check certificate status
kubectl get certificate
kubectl describe certificate mern-fit-verse-tls

# Check ingress
kubectl describe ingress mern-fit-verse
```

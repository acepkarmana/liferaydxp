# Docker Deployment Guide

Deploy the Liferay Admin Dashboard alongside Liferay DXP using Docker.

## 🐳 Quick Start with Docker Compose

### 1. Create `docker-compose.yml`

```yaml
version: '3.8'

services:
  liferay:
    image: liferay/dxp:2026.q1.0
    container_name: liferay-dxp
    ports:
      - "8080:8080"
    environment:
      - LIFERAY_JDBC_PERIOD_DEFAULT_PERIOD_DRIVER_UPPERCASEC_LASS_UPPERCASEN_AME=org.postgresql.Driver
      - LIFERAY_JDBC_PERIOD_DEFAULT_PERIOD_URL=jdbc:postgresql://db:5432/lportal
      - LIFERAY_JDBC_PERIOD_DEFAULT_PERIOD_USERNAME=liferay
      - LIFERAY_JDBC_PERIOD_DEFAULT_PERIOD_PASSWORD=liferay
    volumes:
      - liferay-data:/opt/liferay/data
      - ./deploy:/opt/liferay/deploy
      - ./liferay-admin-dashboard.zip:/opt/liferay/deploy/liferay-admin-dashboard.zip
    depends_on:
      - db
    networks:
      - liferay-net

  db:
    image: postgres:15
    container_name: liferay-db
    environment:
      - POSTGRES_DB=lportal
      - POSTGRES_USER=liferay
      - POSTGRES_PASSWORD=liferay
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - liferay-net

volumes:
  liferay-data:
  db-data:

networks:
  liferay-net:
    driver: bridge
```

### 2. Build and Start

```bash
# Build the client extension
./build-cx.sh

# Start the stack
docker-compose up -d

# Check logs
docker-compose logs -f liferay
```

### 3. Access

- **Liferay Portal**: http://localhost:8080
- **Admin Dashboard**: Available as a Client Extension after deployment

---

## 🏗️ Multi-Stage Docker Build

For a self-contained deployment:

### `Dockerfile`

```dockerfile
# Stage 1: Build the Client Extension
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Create the CX package
FROM alpine:latest AS packager

WORKDIR /package
COPY --from=builder /app/dist ./static
COPY client-extension.yaml .
RUN apk add --no-cache zip && \
    zip -r /liferay-admin-dashboard.zip .

# Stage 3: Liferay DXP with the extension
FROM liferay/dxp:2026.q1.0

COPY --from=packager /liferay-admin-dashboard.zip /opt/liferay/deploy/

EXPOSE 8080
```

### Build and Run

```bash
docker build -t liferay-with-admin-dashboard .
docker run -p 8080:8080 liferay-with-admin-dashboard
```

---

## 🔄 Hot Reload Development

For development with hot reload:

### `docker-compose.dev.yml`

```yaml
version: '3.8'

services:
  liferay:
    image: liferay/dxp:2026.q1.0
    ports:
      - "8080:8080"
    volumes:
      - ./deploy:/opt/liferay/deploy
    environment:
      - LIFERAY_JDBC_PERIOD_DEFAULT_PERIOD_DRIVER_UPPERCASEC_LASS_UPPERCASEN_AME=org.hsqldb.jdbcDriver
      - LIFERAY_JDBC_PERIOD_DEFAULT_PERIOD_URL=jdbc:hsqldb:file:/opt/liferay/data/hsql/lportal

  admin-dashboard:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - .:/app
      - /app/node_modules
    command: sh -c "npm install && npm run dev"
    ports:
      - "3000:3000"
    environment:
      - VITE_LIFERAY_URL=http://liferay:8080
```

### Development Workflow

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# In another terminal, watch for changes
docker-compose -f docker-compose.dev.yml exec admin-dashboard npm run dev

# Build and deploy when ready
docker-compose -f docker-compose.dev.yml exec admin-dashboard npm run build
cp dist/* deploy/  # Copy to Liferay deploy folder
```

---

## 📊 Kubernetes Deployment

### `k8s/deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: liferay-dxp
  labels:
    app: liferay
spec:
  replicas: 2
  selector:
    matchLabels:
      app: liferay
  template:
    metadata:
      labels:
        app: liferay
    spec:
      containers:
        - name: liferay
          image: liferay/dxp:2026.q1.0
          ports:
            - containerPort: 8080
          env:
            - name: LIFERAY_JDBC_PERIOD_DEFAULT_PERIOD_URL
              value: "jdbc:postgresql://postgres:5432/lportal"
          volumeMounts:
            - name: deploy
              mountPath: /opt/liferay/deploy
      initContainers:
        - name: deploy-cx
          image: busybox
          command: ['sh', '-c', 'cp /cx/liferay-admin-dashboard.zip /deploy/']
          volumeMounts:
            - name: cx-package
              mountPath: /cx
            - name: deploy
              mountPath: /deploy
      volumes:
        - name: deploy
          emptyDir: {}
        - name: cx-package
          configMap:
            name: admin-dashboard-cx
---
apiVersion: v1
kind: Service
metadata:
  name: liferay-service
spec:
  selector:
    app: liferay
  ports:
    - port: 80
      targetPort: 8080
  type: LoadBalancer
```

### Deploy to Kubernetes

```bash
# Build the CX package
./build-cx.sh

# Create ConfigMap from the zip
kubectl create configmap admin-dashboard-cx \
  --from-file=liferay-admin-dashboard.zip=./liferay-admin-dashboard.zip

# Apply the deployment
kubectl apply -f k8s/
```

---

## 🌐 Nginx Reverse Proxy

### `nginx.conf`

```nginx
upstream liferay {
    server liferay:8080;
}

server {
    listen 80;
    server_name portal.example.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name portal.example.com;

    ssl_certificate /etc/ssl/certs/portal.crt;
    ssl_certificate_key /etc/ssl/private/portal.key;

    # Proxy to Liferay
    location / {
        proxy_pass http://liferay;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Client Extension static assets
    location /o/admin-dashboard/ {
        proxy_pass http://liferay;
        proxy_cache_valid 200 1d;
        add_header Cache-Control "public, max-age=86400";
    }
}
```

---

## 🔒 Production Security Checklist

- [ ] Use HTTPS/TLS
- [ ] Set strong database passwords
- [ ] Configure OAuth2 (not Basic Auth)
- [ ] Enable CORS only for trusted origins
- [ ] Set up proper firewall rules
- [ ] Use secrets management for tokens
- [ ] Enable audit logging
- [ ] Configure rate limiting
- [ ] Set up health checks
- [ ] Enable monitoring/alerting

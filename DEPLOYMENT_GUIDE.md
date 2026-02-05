# 🚀 BioCompute Admin Portal - Setup & Deployment Guide

## 📋 Table of Contents
- [Local Setup](#local-setup)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment Options](#cloud-deployment-options)
- [Production Considerations](#production-considerations)
- [Maintenance & Monitoring](#maintenance--monitoring)

---

## 🏠 Local Setup

### Prerequisites
- Node.js 20+ installed
- Docker Desktop installed and running
- Git installed

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd BioCompute_Admin_Portal
```

### Step 2: Environment Configuration
The `.env` and `.env.production` files are already configured, but you can customize:

```env
NEON_URL="postgresql://myuser:mypassword@localhost:5432/jobportal?schema=public"
JWT_SECRET="your-secret-key-here"
```

**⚠️ Important:** For production, generate a strong JWT secret:
```bash
# Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Linux/Mac
openssl rand -hex 32
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Start with Docker
```bash
# Start both PostgreSQL and the application
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop everything
docker-compose -f docker-compose.dev.yml down
```

### Step 5: Access the Application
- **Application**: http://localhost:8001
- **Admin Login**: http://localhost:8001/admin/login
- **Public Jobs**: http://localhost:8001/jobs
- **API**: http://localhost:8001/api/jobs

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

**Your current setup is perfect for deployment!** The `docker-compose.dev.yml` file manages both PostgreSQL and the Next.js app.

#### Quick Start
```bash
# Build and start
docker-compose -f docker-compose.dev.yml up -d --build

# Check status
docker-compose -f docker-compose.dev.yml ps

# View logs
docker-compose -f docker-compose.dev.yml logs -f app

# Stop
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose -f docker-compose.dev.yml down -v
```

### Production Docker Compose (Recommended for VPS)

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: biocompute_postgres
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    networks:
      - biocompute_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 30s
      timeout: 10s
      retries: 5

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: biocompute_app
    restart: always
    ports:
      - "80:3000"
    environment:
      - NEON_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?schema=public
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - biocompute_network
    command: npm start

networks:
  biocompute_network:
    driver: bridge

volumes:
  postgres_data:
```

Create `.env.production`:
```env
POSTGRES_USER=your_secure_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=jobportal
JWT_SECRET=your_generated_secret_key
```

---

## ☁️ Cloud Deployment Options

### Option 1: DigitalOcean App Platform (Easiest) 💎

**Why DigitalOcean:**
- ✅ Easy Docker Compose deployment
- ✅ Managed PostgreSQL database
- ✅ Automatic SSL certificates
- ✅ $5-10/month for starter apps
- ✅ One-click deploy from GitHub

**Steps:**
1. Push your code to GitHub
2. Go to [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
3. Click "Create App" → Select GitHub repository
4. DigitalOcean auto-detects Dockerfile
5. Add PostgreSQL database (managed)
6. Set environment variables:
   - `NEON_URL` (auto-provided by DO)
   - `JWT_SECRET`
   - `NODE_ENV=production`
7. Deploy! ✨

**Cost:** ~$12/month ($5 app + $7 database)

---

### Option 2: Railway.app (Developer Friendly) 🚂

**Why Railway:**
- ✅ Free tier available ($5 credit/month)
- ✅ GitHub integration
- ✅ One-click PostgreSQL
- ✅ Automatic SSL
- ✅ Simple pricing

**Steps:**
1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select repository
4. Add PostgreSQL service (one click)
5. Set environment variables
6. Deploy automatically

**Cost:** Pay-as-you-go (~$5-15/month)

---

### Option 3: AWS EC2 + Docker (Full Control) 🏢

**Why AWS:**
- ✅ Industry standard
- ✅ Full control
- ✅ Scalable
- ✅ Free tier available (12 months)

**Steps:**

1. **Launch EC2 Instance**
   - Ubuntu Server 22.04 LTS
   - t2.micro (free tier) or t3.small
   - Security Group: Open ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

2. **SSH into Server**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Docker**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker ubuntu

   # Install Docker Compose
   sudo apt install docker-compose -y

   # Verify
   docker --version
   docker-compose --version
   ```

4. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd BioCompute_Admin_Portal
   ```

5. **Configure Environment**
   ```bash
   nano .env.production
   # Add your production variables
   ```

6. **Deploy**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

7. **Setup Nginx (Optional but Recommended)**
   ```bash
   sudo apt install nginx -y
   sudo nano /etc/nginx/sites-available/biocompute
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:8001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable:
   ```bash
   sudo ln -s /etc/nginx/sites-available/biocompute /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com
   ```

**Cost:** 
- Free tier: $0/month (12 months)
- After: ~$10-20/month (t3.small)

---

### Option 4: Azure Container Instances 🔷

**Steps:**
1. Install Azure CLI
2. Login: `az login`
3. Create resource group:
   ```bash
   az group create --name biocompute-rg --location eastus
   ```
4. Deploy:
   ```bash
   az container create \
     --resource-group biocompute-rg \
     --name biocompute-app \
     --image your-docker-image \
     --dns-name-label biocompute \
     --ports 80
   ```

**Cost:** ~$15-30/month

---

### Option 5: Google Cloud Run 🌐

**Why Cloud Run:**
- ✅ Serverless (pay only when used)
- ✅ Auto-scaling
- ✅ Generous free tier
- ✅ Built-in SSL

**Steps:**
1. Install Google Cloud SDK
2. Build and push image:
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/biocompute-app
   ```
3. Deploy:
   ```bash
   gcloud run deploy biocompute-app \
     --image gcr.io/PROJECT_ID/biocompute-app \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```
4. Add Cloud SQL PostgreSQL database

**Cost:** Free tier up to 2M requests/month, then pay-per-use

---

### Option 6: Render.com (Simple & Modern) 🎨

**Why Render:**
- ✅ Free tier available
- ✅ Automatic SSL
- ✅ GitHub auto-deploy
- ✅ Managed PostgreSQL

**Steps:**
1. Go to [Render.com](https://render.com)
2. Connect GitHub repository
3. Create PostgreSQL database
4. Create Web Service (auto-detects Dockerfile)
5. Set environment variables
6. Deploy!

**Cost:** 
- Free tier: $0/month (with limitations)
- Paid: $7/month (web) + $7/month (database)

---

## 🎯 Recommended Setup for Your Use Case

### For Development/Testing:
**Use:** Local Docker Compose
- **Command:** `docker-compose -f docker-compose.dev.yml up -d`
- **Cost:** Free
- **Pros:** Full control, instant feedback

### For Small-Scale Production (Best Option):
**Use:** Railway.app or DigitalOcean App Platform
- **Why:** Simple, affordable, managed database
- **Cost:** $10-15/month
- **Setup Time:** 10 minutes
- **Maintenance:** Minimal

### For Enterprise/Large-Scale:
**Use:** AWS EC2 + RDS or Google Cloud
- **Why:** Scalability, full control
- **Cost:** $50-200+/month
- **Setup Time:** 1-2 hours
- **Maintenance:** Regular

---

## 🔒 Production Considerations

### Security Checklist
- [ ] Change default database credentials
- [ ] Generate strong JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Enable database backups
- [ ] Use environment variables (never commit secrets)

### Environment Variables
Create `.env.production` on your server:
```env
NEON_URL=postgresql://user:password@host:5432/dbname?schema=public
JWT_SECRET=your-super-secret-key-min-32-chars
NODE_ENV=production
```

### Database Backups
```bash
# Backup
docker exec biocompute_postgres pg_dump -U myuser jobportal > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i biocompute_postgres psql -U myuser jobportal < backup_20260204.sql

# Automated daily backup (crontab)
0 2 * * * docker exec biocompute_postgres pg_dump -U myuser jobportal > /backups/backup_$(date +\%Y\%m\%d).sql
```

---

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ubuntu
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd BioCompute_Admin_Portal
            git pull origin main
            docker-compose -f docker-compose.prod.yml down
            docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 📊 Maintenance & Monitoring

### Check Logs
```bash
# Application logs
docker-compose -f docker-compose.dev.yml logs -f app

# Database logs
docker-compose -f docker-compose.dev.yml logs -f postgres

# Last 100 lines
docker-compose -f docker-compose.dev.yml logs --tail=100
```

### Monitor Resources
```bash
# Container stats
docker stats

# Disk usage
docker system df

# Clean up
docker system prune -a
```

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.dev.yml up -d --build

# Or rebuild specific service
docker-compose -f docker-compose.dev.yml up -d --build app
```

---

## 🆘 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose -f docker-compose.dev.yml logs app

# Restart
docker-compose -f docker-compose.dev.yml restart app

# Rebuild from scratch
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d --build
```

### Database connection issues
```bash
# Check if database is healthy
docker-compose -f docker-compose.dev.yml ps

# Test connection
docker exec -it biocompute_postgres psql -U myuser -d jobportal -c "SELECT 1;"
```

### Port already in use
```bash
# Find process using port 8001
netstat -ano | findstr :8001

# Kill process (Windows PowerShell)
Stop-Process -Id <PID> -Force

# Or change port in docker-compose.dev.yml
ports:
  - "8002:3000"  # Use different port
```

---

## 📞 Quick Reference

### Essential Commands
```bash
# Start everything
docker-compose -f docker-compose.dev.yml up -d

# Stop everything
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Restart application
docker-compose -f docker-compose.dev.yml restart app

# Rebuild
docker-compose -f docker-compose.dev.yml up -d --build

# Database backup
docker exec biocompute_postgres pg_dump -U myuser jobportal > backup.sql
```

### Access URLs
- **Local:** http://localhost:8001
- **Admin:** http://localhost:8001/admin/login
- **API Jobs:** http://localhost:8001/api/jobs
- **API Applications:** http://localhost:8001/api/applications

---

## 💡 My Recommendation

**For your use case (can't run on your device all the time):**

1. **Best Choice: Railway.app** ($5-15/month)
   - Easiest setup (5 minutes)
   - GitHub auto-deploy
   - Managed PostgreSQL
   - Free tier to start
   - [Deploy Now →](https://railway.app)

2. **Alternative: DigitalOcean App Platform** ($12/month)
   - Very reliable
   - Good documentation
   - Managed database
   - [Deploy Now →](https://www.digitalocean.com/products/app-platform)

3. **Budget Option: Oracle Cloud Free Tier** (FREE forever)
   - Always free tier
   - 24GB RAM free
   - More complex setup
   - [Sign Up →](https://www.oracle.com/cloud/free/)

**Start with Railway.app - you can deploy in under 10 minutes!**

---

## 🎉 You're Ready!

Your application is production-ready. Choose a deployment option above and follow the steps. If you need help, refer to this guide or reach out for support.

**Good luck with your deployment! 🚀**

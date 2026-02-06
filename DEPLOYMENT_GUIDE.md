# 🚀 BioCompute Admin Portal - Deployment Guide

## 📋 Table of Contents
- [Production Deployment (Render + Supabase)](#production-deployment-render--supabase)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Database Management](#database-management)
- [Troubleshooting](#troubleshooting)

---

## 🌐 Production Deployment (Render + Supabase)

This is the **recommended** approach for production deployment. It's cost-effective, scalable, and requires minimal DevOps knowledge.

### Prerequisites
- GitHub account with your code pushed
- Supabase account: https://supabase.com (FREE tier available)
- Render account: https://render.com (FREE tier available)

### Step 1: Set Up Supabase Database 🗄️

1. **Create Supabase Project:**
   - Go to https://supabase.com/dashboard
   - Click **"New Project"**
   - Name: `biocompute-portal`
   - Set a strong database password
   - Choose region closest to your users
   - Click **"Create new project"** (takes ~2 minutes)

2. **Get Connection String:**
   - In your project dashboard, go to **Settings** → **Database**
   - Find **Connection String** section
   - Select **"URI"** format
   - Copy the connection string (looks like):
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
     ```
   - Replace `[YOUR-PASSWORD]` with your actual password

3. **Enable Connection Pooler (Recommended):**
   - In **Settings** → **Database**
   - Scroll to **Connection Pooling**
   - Note the pooler connection string for better performance:
     ```
     postgresql://postgres:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
     ```

### Step 2: Deploy to Render 🎨

1. **Create Web Service:**
   - Go to https://dashboard.render.com
   - Click **"New +"** → **"Web Service"**
   - Click **"Build and deploy from a Git repository"**
   - Connect your GitHub account if not already connected
   - Select your repository: `BioCompute_Admin_Portal`
   - Click **"Connect"**

2. **Configure Service:**
   - **Name**: `biocompute-portal` (or your choice)
   - **Region**: Choose same region as Supabase (or closest)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave blank
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npx prisma generate && npx prisma migrate deploy && npm run build
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```
   - **Instance Type**: 
     - Free (for testing)
     - Starter ($7/month - recommended for production)

3. **Add Environment Variables:**
   Click **"Advanced"** → **"Environment Variables"** and add:
   
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Your Supabase connection string (with pooler if available) |
   | `JWT_SECRET` | Generate with command below |
   | `NODE_ENV` | `production` |

   **Generate JWT Secret:**
   ```bash
   # Windows PowerShell
   [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
   
   # Linux/Mac/Git Bash
   openssl rand -hex 32
   ```

4. **Create Web Service:**
   - Click **"Create Web Service"**
   - Render will automatically:
     - Clone your repository
     - Install dependencies
     - Run Prisma migrations
     - Build Next.js
     - Deploy your application
   - This takes 3-5 minutes for first deployment

5. **Initial Setup - Seed Database:**
   
   After first deployment, seed the database with initial admin user:
   
   **Option A: Using Render Shell**
   - In your Render dashboard, go to your service
   - Click **"Shell"** tab
   - Run:
     ```bash
     npm run seed
     ```
   
   **Option B: Using Supabase SQL Editor**
   - Go to Supabase dashboard → **SQL Editor**
   - Copy content from `prisma/seed.ts` and convert to SQL
   - Or manually insert admin user:
     ```sql
     INSERT INTO "Admin" (email, password, name, "createdAt", "updatedAt")
     VALUES (
       'admin@biocompute.com',
       '$2a$10$...', -- Use bcrypt to hash 'admin123'
       'Admin User',
       NOW(),
       NOW()
     );
     ```

6. **Access Your Application:**
   - Your app is now live at: `https://biocompute-portal.onrender.com`
   - Admin panel: `https://biocompute-portal.onrender.com/admin/login`
   - API: `https://biocompute-portal.onrender.com/api/jobs`

### Step 3: Configure Custom Domain (Optional)

1. In Render dashboard, go to **Settings** → **Custom Domain**
2. Add your domain (e.g., `portal.biocompute.com`)
3. Follow DNS instructions provided by Render
4. SSL is automatically provisioned (free)

### Step 4: Set Up Automatic Deployments

Already configured! Render automatically deploys when you:
- Push to your main branch
- Merge a pull request
- Manually trigger via dashboard

---

## 🏠 Local Development

### Prerequisites
- Node.js 20+ installed
- Git installed
- Supabase account (or local PostgreSQL)

### Option 1: With Supabase (Recommended)

1. **Clone Repository:**
   ```bash
   git clone <your-repository-url>
   cd BioCompute_Admin_Portal
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Create Supabase Project:**
   - Follow Step 1 from Production Deployment
   - Or use your existing Supabase project

4. **Configure Environment:**
   Create `.env` file:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   JWT_SECRET="your-local-secret-key"
   NODE_ENV="development"
   ```

5. **Run Migrations:**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   npm run seed
   ```

6. **Start Development Server:**
   ```bash
   npm run dev
   ```

7. **Access Application:**
   - App: http://localhost:3000
   - Admin: http://localhost:3000/admin/login
   - API: http://localhost:3000/api/jobs

---

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Supabase or PostgreSQL connection string | `postgresql://postgres:pass@...` |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | Generated with openssl/PowerShell |
| `NODE_ENV` | Environment (development/production) | `production` |

### Generate Secure Secrets

```bash
# Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Linux/Mac/Git Bash
openssl rand -hex 32

# Or online (use carefully):
# https://generate-secret.now.sh/32
```

---

## 🗄️ Database Management

### Using Supabase Dashboard

1. **View Data:**
   - Go to Supabase Dashboard → **Table Editor**
   - Browse tables: Admin, Job, Application, ApplicationComment

2. **Run Queries:**
   - Go to **SQL Editor**
   - Run custom SQL queries
   - View query history

3. **Backups:**
   - Automatic daily backups (on paid plans)
   - Manual backups via **Database** → **Backups**
   - Download or restore from backup

4. **Monitoring:**
   - **Database** → **Performance**
   - View connection count
   - Monitor query performance
   - Check storage usage

### Using Prisma Studio (Local)

```bash
# Open Prisma Studio
npx prisma studio

# Access at http://localhost:5555
```

### Manual Backup and Restore

**Backup from Supabase:**
```bash
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" > backup_$(date +%Y%m%d).sql
```

**Restore:**
```bash
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" < backup.sql
```

**Automated Daily Backups (for self-hosted PostgreSQL):**
If you're running your own PostgreSQL server, set up automated backups with cron:
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" > /backups/backup_$(date +\%Y\%m\%d).sql
```

---

## 🔄 Database Migrations

### Creating New Migrations

```bash
# Create a new migration
npx prisma migrate dev --name add_new_field

# This will:
# 1. Generate migration SQL
# 2. Apply to database
# 3. Regenerate Prisma Client
```

### Deploying Migrations (Production)

```bash
# Deploy pending migrations
npx prisma migrate deploy

# Reset database (⚠️ DESTRUCTIVE - deletes all data)
npx prisma migrate reset
```

### On Render:
Migrations run automatically during deployment via build command:
```bash
npx prisma migrate deploy
```

---

## 📊 Monitoring & Maintenance

### Render Dashboard

**Application Logs:**
- View real-time logs in Render dashboard
- Search and filter logs
- Download logs for analysis

**Monitoring:**
- CPU and memory usage
- Request count and latency
- Deploy history
- Custom domains and SSL status

**Auto-Deploy:**
- Automatic deployments on git push
- Manual deploy button for rollbacks
- Deploy hooks for CI/CD

### Supabase Dashboard

**Database Monitoring:**
- Connection pooler stats
- Active connections
- Storage usage
- API requests

**Query Performance:**
- Slow query log
- Query analyzer
- Index suggestions

**Logs:**
- PostgreSQL logs
- API logs
- Auth logs (if using Supabase Auth)

### Health Check

Your app includes a health check endpoint:
```bash
curl https://your-app.onrender.com/api/health
```

Response:
```json
{
  "status": "healthy",
  "service": "BioCompute Admin Portal",
  "timestamp": "2026-02-06T12:00:00.000Z"
}
```

---

## 🔒 Security Best Practices

### Required for Production

- [ ] **Change default admin credentials** (email/password in seed.ts)
- [ ] **Generate strong JWT_SECRET** (minimum 32 characters)
- [ ] **Use HTTPS/SSL** (automatic on Render, manual for self-hosted)
- [ ] **Enable Render's deploy protection** (prevent accidental deploys)
- [ ] **Set up Supabase IP restrictions** (if needed)
- [ ] **Regular security updates** (dependencies and packages)
- [ ] **Environment variables** (never commit secrets to git)
- [ ] **Enable database backups** (automatic on Supabase paid plans)

### Additional Security Measures

- Enable rate limiting (implement with `express-rate-limit`)
- Use strong passwords for database and admin accounts
- Regularly audit application logs
- Keep dependencies updated: `npm audit fix`
- Enable Supabase Row Level Security (RLS) if needed
- Use Render's persistent disk for file uploads (if needed)
- Set up monitoring and alerts

- Set up monitoring and alerts

---

## 🐛 Troubleshooting

### Render Deployment Issues

**Build Fails:**
```bash
# Check build logs in Render dashboard
# Common issues:
# 1. Missing environment variables
# 2. Prisma generation failure
# 3. Database connection during build

# Solution: Ensure build command includes:
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

**Application Won't Start:**
- Check environment variables are set correctly
- Verify DATABASE_URL format and credentials
- Check start command: `npm start`
- Review application logs in Render dashboard

**Database Connection Errors:**
- Verify Supabase project is active
- Check connection string is correct (including password)
- Ensure SSL mode: `?sslmode=require` or use pooler connection
- Test connection locally first

**502 Bad Gateway:**
- Application might be crashing on startup
- Check logs for errors
- Verify Next.js build completed successfully
- Check if port 3000 is exposed in application

### Supabase Issues

**Connection Timeout:**
```bash
# Check if connection pooler is enabled
# Use pooler connection string instead:
postgresql://postgres:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Too Many Connections:**
- Enable connection pooling in Supabase
- Use Prisma connection pool settings:
  ```prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
    connectionLimit = 10
  }
  ```

**Migration Errors:**
```bash
# Reset migrations (⚠️ local only, destructive)
npx prisma migrate reset

# Force deploy migrations
npx prisma migrate deploy --force

# Generate Prisma Client
npx prisma generate
```

### Common Application Issues

**Prisma Client Not Generated:**
```bash
npx prisma generate
```

**Admin Login Not Working:**
```bash
# Verify admin user exists
npx prisma studio
# Or check via Supabase SQL Editor

# Reset admin password
npm run seed
```

**CORS Errors:**
- Check API route handlers have proper CORS headers
- Verify origin is allowed in API responses

---

## 🚀 Performance Optimization

### For Render + Supabase

1. **Use Connection Pooling:**
   - Enable Supabase connection pooler
   - Use pooler connection string in production

2. **Optimize Database Queries:**
   - Add indexes for frequently queried fields (already in schema)
   - Use Prisma's query optimization features
   - Monitor slow queries in Supabase dashboard

3. **Enable Caching:**
   - Implement Next.js caching strategies
   - Use Supabase's built-in caching

4. **Choose Right Instance:**
   - Render Starter ($7/month) for production workloads
   - Free tier for testing only (spins down after inactivity)

5. **Same Region:**
   - Deploy Render service in same region as Supabase project
   - Reduces latency significantly

### Next.js Optimizations

```typescript
// In next.config.ts
const nextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  // Add other optimizations
}
```

---

## 📈 Scaling Considerations

### When to Scale Up

**Signs you need to upgrade:**
- Response times > 2 seconds consistently
- CPU usage > 80% regularly
- Memory usage approaching limit
- Database connection pool exhausted

### Scaling Options

**Vertical Scaling (Render):**
- Upgrade to higher instance type
- Standard ($25/month) - 1 GB RAM
- Pro ($85/month) - 4 GB RAM

**Horizontal Scaling:**
- Multiple Render instances (load balanced automatically)
- Supabase automatically scales database

**Database Scaling (Supabase):**
- Free tier: Up to 500MB, 2 GB data transfer
- Pro tier: 8GB database, 50GB transfer ($25/month)
- Team/Enterprise: Custom scaling options

---

## 🔄 CI/CD Setup (Advanced)

### Automatic Deploy from GitHub

Render automatically deploys when you push to main branch. To customize:

1. Go to Render Dashboard → Settings
2. Configure auto-deploy settings
3. Set deploy hooks for specific branches
4. Add deploy notifications (Slack, Discord, etc.)

### Manual Deploy Hooks

Generate a deploy hook URL:
```bash
# In Render dashboard: Settings → Deploy Hook
# Copy the webhook URL

# Trigger deploy via curl:
curl -X POST https://api.render.com/deploy/srv-xxxxx?key=xxxxx
```

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render Deploy
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## 📞 Quick Reference

### Essential Commands

```bash
# Local Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server
npm run lint            # Lint code
npm run seed            # Seed database

# Prisma Commands
npx prisma studio       # Open Prisma Studio
npx prisma generate     # Generate Prisma Client
npx prisma migrate dev  # Create and apply migration
npx prisma migrate deploy  # Deploy migrations (production)
```

### Access URLs

**Local Development:**
- App: http://localhost:3000
- Admin: http://localhost:3000/admin/login
- API: http://localhost:3000/api/jobs
- Health: http://localhost:3000/api/health

**Production (Render):**
- App: https://your-app.onrender.com
- Admin: https://your-app.onrender.com/admin/login
- API: https://your-app.onrender.com/api/jobs

### Default Credentials

```
Email: admin@biocompute.com
Password: admin123
```

⚠️ **CHANGE THESE IN PRODUCTION!**

---

## 💰 Cost Breakdown

### Render + Supabase (Recommended)

**Free Tier (Testing):**
- Supabase: FREE (500MB database, 2GB transfer)
- Render: FREE (spins down after inactivity)
- Total: **$0/month**

**Production Setup:**
- Supabase Free: $0/month (sufficient for small apps)
- Render Starter: $7/month (always on, 512MB RAM)
- Total: **$7/month**

**Scaling Up:**
- Supabase Pro: $25/month (8GB database, better performance)
- Render Standard: $25/month (1GB RAM)
- Total: **$50/month**

### Self-Hosted (VPS)

**Basic VPS Options:**
- DigitalOcean Droplet: $6/month (1GB RAM)
- Linode: $5/month (1GB RAM)
- Vultr: $6/month (1GB RAM)
- Oracle Cloud: **FREE** forever (4GB RAM)

**+ Supabase Free:** $0/month
**Total: $5-6/month** (or FREE with Oracle Cloud)

---

## 🎯 Recommended Setup

### For Testing/Development:
**Use:** Render Free + Supabase Free
- Cost: $0/month
- Setup time: 15 minutes
- Perfect for testing and demos

### For Small Production (< 1000 users):
**Use:** Render Starter + Supabase Free
- Cost: $7/month
- Always-on service
- Sufficient for most small applications
- Easy maintenance

### For Growing Business (< 10,000 users):
**Use:** Render Standard + Supabase Pro
- Cost: $50/month
- Better performance and reliability
- Automatic backups (Supabase Pro)
- 24/7 support

### For Enterprise:
**Use:** Custom setup with dedicated resources
- Render Pro or custom deployment
- Supabase Team/Enterprise
- Custom SLAs and support

---

## 🎉 Deployment Checklist

Before going live, ensure:

- [ ] Supabase project created and database is accessible
- [ ] All environment variables set in Render
- [ ] Database migrations deployed successfully
- [ ] Admin user seeded (run `npm run seed`)
- [ ] Default admin password changed
- [ ] Application accessible via HTTPS
- [ ] Health check endpoint working (`/api/health`)
- [ ] All API endpoints tested
- [ ] Admin login working
- [ ] Job creation and application submission tested
- [ ] Database backups configured (for paid Supabase plans)
- [ ] Monitoring set up (Render + Supabase dashboards)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Error tracking set up (optional: Sentry, etc.)

---

## 🆘 Getting Help

### Documentation Links
- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

### Community Support
- [Render Community](https://community.render.com)
- [Supabase Discord](https://discord.supabase.com)
- [Next.js Discussions](https://github.com/vercel/next.js/discussions) (maintained by Vercel but framework-agnostic)

### Troubleshooting Steps
1. Check application logs (Render dashboard)
2. Verify environment variables
3. Test database connection
4. Review this troubleshooting section
5. Check official documentation
6. Search community forums
7. Open support ticket (for paid plans)

---

## ✅ You're All Set!

Congratulations! You now have a comprehensive guide to deploy and maintain your BioCompute Admin Portal using Render and Supabase.

**Quick Start:** Jump to [Production Deployment](#production-deployment-render--supabase) to get your app live in 15 minutes!

**Questions?** Review the [Troubleshooting](#troubleshooting) section or check the documentation links above.

**Happy deploying! 🚀**

---

**Last Updated:** February 6, 2026  
**Version:** 2.0 - Updated for Render + Supabase deployment

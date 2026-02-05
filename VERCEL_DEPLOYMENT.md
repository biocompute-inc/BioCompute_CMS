# 🚀 Vercel + Neon DB Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free): https://vercel.com
- Neon account (free): https://neon.tech

---

## Step 1: Create Neon Database (FREE)

1. Go to https://console.neon.tech
2. Sign up/Login with GitHub
3. Click **"Create Project"**
4. Name your project: `biocompute-portal`
5. Select region closest to you
6. Click **"Create Project"**

### Get Your Connection Strings

In your Neon dashboard, you'll see two connection strings:

**Pooled Connection** (for queries):
```
postgres://username:password@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
```

**Direct Connection** (for migrations):
```
postgres://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

⚠️ **IMPORTANT**: Copy BOTH strings - you'll need them in Vercel!

---

## Step 2: Push Code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Prepare for Vercel deployment"

# Push to GitHub
git remote add origin https://github.com/yourusername/yourrepo.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel (FREE)

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your GitHub repo
4. Click **"Import"**

### Configure Environment Variables

In the Vercel deployment screen, add these environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your **Pooled Connection** string from Neon |
| `DIRECT_URL` | Your **Direct Connection** string from Neon |
| `JWT_SECRET` | Generate with: `openssl rand -hex 32` |
| `NODE_ENV` | `production` |

5. Click **"Deploy"**

Wait 2-3 minutes for deployment to complete! ☕

---

## Step 4: Run Database Migrations

After deployment, you need to create the database tables:

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy

# Seed database (optional - creates admin user)
npx prisma db seed
```

### Option B: Using Neon SQL Editor

1. Go to your Neon dashboard
2. Click **"SQL Editor"**
3. Copy the contents of `prisma/migrations/[latest]/migration.sql`
4. Paste and run in the SQL editor

---

## Step 5: Test Your Deployment

Your app is live! Visit your Vercel URL:
- **Homepage**: `https://your-app.vercel.app`
- **Jobs API**: `https://your-app.vercel.app/api/jobs`
- **Admin Login**: `https://your-app.vercel.app/admin/login`

### Create Admin User (if not seeded)

Run this in Neon SQL Editor:

```sql
INSERT INTO "Admin" (id, email, password_hash, "createdAt")
VALUES (
  gen_random_uuid(),
  'admin@biocompute.com',
  '$2a$10$YourHashedPasswordHere',
  NOW()
);
```

Generate password hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```

---

## 🎉 You're Done!

### What You Get (100% FREE):
- ✅ Vercel hosting (free tier: unlimited bandwidth)
- ✅ Neon database (free tier: 512MB storage, 10GB data transfer/month)
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments on git push

### Usage Limits (Free Tier):
- **Vercel**: 100GB bandwidth/month, unlimited API requests
- **Neon**: 512MB database, 10GB transfer, 100 compute hours/month

For a small job portal, this should be more than enough!

---

## Updating Your App

Just push to GitHub:
```bash
git add .
git commit -m "Update features"
git push
```

Vercel auto-deploys in 2-3 minutes! 🚀

---

## Troubleshooting

### Database Connection Errors
- Check environment variables in Vercel dashboard
- Ensure you used the **Pooled** connection for `DATABASE_URL`
- Ensure you used the **Direct** connection for `DIRECT_URL`

### Migrations Not Applied
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

### Can't Login to Admin
Seed the database or manually insert admin user (see Step 5)

---

## Cost Breakdown

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Vercel | 100GB bandwidth | $20/mo - Unlimited |
| Neon | 512MB storage | $19/mo - 10GB |
| **Total** | **$0/month** 🎉 | $39/mo+ if needed |

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Prisma Docs: https://www.prisma.io/docs

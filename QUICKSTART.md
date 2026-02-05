# Quick Start - Local Development (No Docker)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create Neon DB account (FREE):**
   - Go to https://console.neon.tech
   - Create a new project
   - Copy both connection strings (Pooled + Direct)

3. **Configure environment:**
   ```bash
   # Copy and edit .env file
   DATABASE_URL="postgres://user:pass@ep-xxx-pooler.neon.tech/neondb?sslmode=require"
   DIRECT_URL="postgres://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
   JWT_SECRET="generate-with-openssl-rand-hex-32"
   ```

4. **Run migrations:**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   npx prisma db seed
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Access the app:**
   - App: http://localhost:3000
   - Admin: http://localhost:3000/admin/login
   - API: http://localhost:3000/api/jobs

## Default Admin Credentials
- Email: `admin@biocompute.com`
- Password: `admin123`

## Deploy to Vercel
See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for complete deployment guide.

**TL;DR:**
1. Push to GitHub
2. Import to Vercel
3. Add env variables
4. Deploy! 🚀

# Quick Start - Local Development

## Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create Supabase account (FREE):**
   - Go to https://supabase.com
   - Create a new project
   - Go to **Settings** → **Database**
   - Copy your connection string

3. **Configure environment:**
   Create `.env` file in the project root:
   ```bash
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   JWT_SECRET="generate-with-command-below"
   NODE_ENV="development"
   ```

   Generate JWT secret:
   ```bash
   # Windows PowerShell
   [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
   
   # Linux/Mac/Git Bash
   openssl rand -hex 32
   ```

4. **Run migrations:**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   npm run seed
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Access the app:**
   - App: http://localhost:3000
   - Admin: http://localhost:3000/admin/login
   - API: http://localhost:3000/api/jobs
   - Health: http://localhost:3000/api/health

## Default Admin Credentials
- Email: `admin@biocompute.com`
- Password: `admin123`

⚠️ **Change these in production!**

## Deploy to Render

For production deployment with Supabase + Render:

1. **Set up Supabase:**
   - Create a project at https://supabase.com
   - Get your connection string from **Settings** → **Database**

2. **Deploy to Render:**
   - Push code to GitHub
   - Go to https://dashboard.render.com
   - Click **New** → **Web Service**
   - Connect your GitHub repository
   - Configure:
     - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
     - **Start Command**: `npm start`
   - Add environment variables:
     - `DATABASE_URL`: Your Supabase connection string
     - `JWT_SECRET`: Generated secret key
     - `NODE_ENV`: `production`
   - Click **Create Web Service**

3. **Run seed script:**
   - Use Render Shell or Supabase SQL Editor
   - Run: `npm run seed`

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## Troubleshooting

### Prisma Client Not Found
```bash
npx prisma generate
```

### Migration Errors
```bash
npx prisma migrate reset  # ⚠️ This will delete all data
npx prisma migrate deploy
```

### Database Connection Issues
- Verify your DATABASE_URL is correct
- Check Supabase project is active
- Ensure SSL mode is included in connection string

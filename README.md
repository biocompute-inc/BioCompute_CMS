# 🧬 BioCompute Admin Portal

A comprehensive job portal and application management system built with Next.js, featuring an admin dashboard for managing job postings, reviewing applications, and tracking candidate progress.

## ✨ Features

- 📋 **Job Management**: Create, edit, and manage job postings (full-time/part-time)
- 👥 **Application Tracking**: Review applications with role-based filtering
- 💬 **Comments System**: Add comments and fitment tags to applications
- 🔐 **Secure Admin Panel**: JWT-based authentication
- 🌐 **Public API**: RESTful APIs for external integration with CORS support
- ☁️ **Cloud-Native**: Deployed on Render with Supabase PostgreSQL
- 📱 **Responsive Design**: Modern UI with Tailwind CSS

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables (see below)
cp .env.example .env

# Run Prisma migrations
npx prisma migrate dev

# Seed database (optional)
npm run seed

# Start development server
npm run dev
```

Access the application at:
- **Application**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin/login
- **Jobs API**: http://localhost:3000/api/jobs

## 📚 Documentation

- **[Complete Deployment Guide](DEPLOYMENT_GUIDE.md)** - Render & Supabase setup
- **[Security Documentation](SECURITY.md)** - Security best practices
- **[Quick Start Guide](QUICKSTART.md)** - Get up and running quickly

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.6 (React)
- **Database**: Supabase PostgreSQL with Prisma ORM
- **Hosting**: Render (Web Service)
- **Authentication**: JWT with jose library
- **Styling**: Tailwind CSS
- **ORM**: Prisma

## 🌐 API Endpoints

### Public APIs
- `GET /api/jobs` - List all active jobs
- `GET /api/jobs/[id]` - Get job details
- `POST /api/applications` - Submit job application
- `GET /api/health` - Health check endpoint

### Admin APIs (Authentication Required)
- `GET /api/admin/jobs` - Manage jobs
- `POST /api/admin/jobs` - Create new job
- `GET /api/admin/applications` - Review applications
- `POST /api/admin/applications/[id]/comments` - Add comments
- `POST /api/admin/login` - Admin authentication

## 🔐 Environment Variables

### For Supabase Connection

Create `.env` file for local development:

```env
# Supabase Database Connection
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# JWT Secret (generate with command below)
JWT_SECRET="your-secure-secret-key-min-32-chars"

# Node Environment
NODE_ENV="development"
```

### For Production (Render)

Set these environment variables in your Render dashboard:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET=your-production-secret-key
NODE_ENV=production
```

### Generate Secure JWT Secret:

```bash
# Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Linux/Mac/Git Bash
openssl rand -hex 32
```

## 📦 Deployment to Render

### Prerequisites
1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **GitHub Repository**: Code pushed to GitHub

### Step 1: Set Up Supabase Database

1. Create a new project in Supabase
2. Go to **Project Settings** → **Database**
3. Copy your connection string:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```
4. Ensure connection pooler is enabled (for better performance)

### Step 2: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `biocompute-portal`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free or Starter

5. Add Environment Variables:
   - `DATABASE_URL`: Your Supabase connection string
   - `JWT_SECRET`: Your generated secret key
   - `NODE_ENV`: `production`

6. Click **Create Web Service**

### Step 3: Initial Database Setup

After deployment, run migrations:

```bash
# Using Render Shell
npm run seed
```

Or connect directly via Supabase SQL Editor and run the seed script.

### Using Deployment Scripts

**Windows:**
```bash
deploy.bat
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🗄️ Database Management

### Supabase Dashboard
- Access your database via [Supabase Dashboard](https://supabase.com/dashboard)
- Use **Table Editor** for visual data management
- Use **SQL Editor** for custom queries

### Prisma Studio (Local)
```bash
npx prisma studio
```

### Backup & Restore

**Backup via Supabase:**
- Automatic daily backups on paid plans
- Manual export via SQL Editor

**Local Backup:**
```bash
# Using pg_dump (install PostgreSQL tools)
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" > backup.sql
```

**Restore:**
```bash
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" < backup.sql
```

## 📊 Project Structure

```
BioCompute_Admin_Portal/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   │   ├── applications/  # Application review
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── jobs/          # Job management
│   │   └── login/         # Admin login
│   ├── api/               # API routes
│   │   ├── admin/         # Protected admin APIs
│   │   ├── applications/  # Public application APIs
│   │   ├── jobs/          # Public job APIs
│   │   └── health/        # Health check
│   ├── jobs/              # Public job pages
│   ├── apply/             # Application form
│   └── layout.tsx         # Root layout
├── lib/                   # Utility functions
│   ├── auth.ts           # JWT authentication
│   ├── prisma.ts         # Database client
│   └── middleware.ts     # Auth middleware
├── prisma/               # Database schema & migrations
│   ├── schema.prisma     # Database schema
│   ├── seed.ts          # Database seeding
│   └── migrations/       # Migration history
└── public/              # Static assets
```

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Lint code
npm run lint

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio

# Seed database
npm run seed

# Type check
npx tsc --noEmit
```

## 🔄 Database Migrations

### Creating a New Migration
```bash
npx prisma migrate dev --name your_migration_name
```

### Deploying Migrations (Production)
```bash
npx prisma migrate deploy
```

### Reset Database (⚠️ Destructive)
```bash
npx prisma migrate reset
```

## 📝 Admin Credentials

**Development Default:**
- Email: `admin@biocompute.com`
- Password: `admin123`

⚠️ **IMPORTANT**: Change these credentials in production! Update the seed script or create new admin users via Supabase.

## 🔒 Security Features

- JWT-based authentication with httpOnly cookies
- Password hashing with bcryptjs
- SQL injection protection via Prisma ORM
- CORS configuration for API endpoints
- Environment variable protection
- Rate limiting (ready to implement)

## 🚀 Performance Tips

### For Render Deployment:
- Use connection pooling with Supabase
- Enable Render's free SSL
- Set appropriate instance type based on traffic
- Use Render's persistent disk for file uploads (if needed)

### For Supabase:
- Enable connection pooler for better performance
- Use appropriate indexes (defined in Prisma schema)
- Monitor query performance via Supabase Dashboard
- Utilize Supabase's built-in caching

## 📈 Monitoring

### Render Dashboard
- View application logs
- Monitor resource usage
- Set up deploy notifications
- Configure custom domains

### Supabase Dashboard
- Monitor database queries
- View connection stats
- Set up database backups
- Check storage usage

## 🐛 Troubleshooting

### Build Failures on Render
```bash
# Ensure Prisma is generated before build
npm install && npx prisma generate && npm run build
```

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Ensure SSL mode is enabled
- Verify firewall/IP restrictions in Supabase

### Migration Errors
```bash
# Reset migrations (⚠️ local only)
npx prisma migrate reset

# Deploy pending migrations
npx prisma migrate deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for BioCompute Inc.

## 🆘 Support

For deployment help and troubleshooting:
- Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions
- Review [SECURITY.md](SECURITY.md) for security best practices
- Consult [Render Documentation](https://render.com/docs)
- Visit [Supabase Documentation](https://supabase.com/docs)

## 🔗 Useful Links

- [Render Dashboard](https://dashboard.render.com)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Built with ❤️ by BioCompute Inc.**

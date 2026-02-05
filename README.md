# 🧬 BioCompute Admin Portal

A comprehensive job portal and application management system built with Next.js, featuring an admin dashboard for managing job postings, reviewing applications, and tracking candidate progress.

## ✨ Features

- 📋 **Job Management**: Create, edit, and manage job postings (full-time/part-time)
- 👥 **Application Tracking**: Review applications with role-based filtering
- 💬 **Comments System**: Add comments and fitment tags to applications
- 🔐 **Secure Admin Panel**: JWT-based authentication
- 🌐 **Public API**: RESTful APIs for external integration with CORS support
- 🐳 **Docker Ready**: Containerized deployment with PostgreSQL
- 📱 **Responsive Design**: Modern UI with Tailwind CSS

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Start both PostgreSQL and the application
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop
docker-compose -f docker-compose.dev.yml down
```

Access the application at:
- **Application**: http://localhost:8001
- **Admin Dashboard**: http://localhost:8001/admin/login
- **Jobs API**: http://localhost:8001/api/jobs

### Manual Setup

```bash
# Install dependencies
npm install

# Start PostgreSQL (Docker)
docker-compose -f docker-compose.dev.yml up -d postgres

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

## 📚 Documentation

- **[Complete Deployment Guide](DEPLOYMENT_GUIDE.md)** - Detailed setup and cloud deployment options
- **[Security Documentation](SECURITY.md)** - Security best practices
- **[Docker Setup](DOCKER_SETUP.md)** - Container configuration details

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.6 (React)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with jose library
- **Styling**: Tailwind CSS
- **Containerization**: Docker & Docker Compose
- **Rate Limiting**: Express-rate-limit middleware

## 🌐 API Endpoints

### Public APIs
- `GET /api/jobs` - List all active jobs
- `GET /api/jobs/[id]` - Get job details
- `POST /api/applications` - Submit job application

### Admin APIs (Authentication Required)
- `GET /api/admin/jobs` - Manage jobs
- `GET /api/admin/applications` - Review applications
- `POST /api/admin/applications/[id]/comments` - Add comments

## 🔐 Environment Variables

Create `.env.production` for production deployment:

```env
NEON_URL=postgresql://user:password@host:5432/jobportal?schema=public
JWT_SECRET=your-secure-secret-key-min-32-chars
NODE_ENV=production
```

Generate secure secrets:
```bash
# Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Linux/Mac
openssl rand -hex 32
```

## 📦 Deployment

### Quick Deploy Options

1. **Railway.app** (Easiest) - [Deploy Guide](DEPLOYMENT_GUIDE.md#option-2-railwayapp-developer-friendly-)
2. **DigitalOcean** - [Deploy Guide](DEPLOYMENT_GUIDE.md#option-1-digitalocean-app-platform-easiest-)
3. **AWS EC2** - [Deploy Guide](DEPLOYMENT_GUIDE.md#option-3-aws-ec2--docker-full-control-)

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

### Backup
```bash
# Manual backup
docker exec biocompute_postgres pg_dump -U myuser jobportal > backup.sql

# Using backup script
chmod +x backup.sh
./backup.sh
```

### Restore
```bash
docker exec -i biocompute_postgres psql -U myuser jobportal < backup.sql
```

## 📊 Project Structure

```
BioCompute_Admin_Portal/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── jobs/              # Public job pages
│   └── apply/             # Application form
├── lib/                   # Utility functions
│   ├── auth.ts           # JWT authentication
│   ├── prisma.ts         # Database client
│   └── middleware.ts     # Auth middleware
├── prisma/               # Database schema & migrations
├── docker-compose.dev.yml  # Development setup
├── docker-compose.prod.yml # Production setup
└── Dockerfile            # Container configuration
```

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

## 📝 Admin Credentials

**Development Default:**
- Email: `admin@biocompute.com`
- Password: `admin123`

⚠️ **Change these in production!**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is proprietary software for BioCompute Inc.

## 🆘 Support

For deployment help, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Documentation](https://docs.docker.com)

---

Built with ❤️ by BioCompute Inc.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

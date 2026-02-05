# BioCompute Job Portal - Docker Setup

## Quick Start with Docker

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Running the Application

1. **Build and start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Database: localhost:5432

3. **View logs:**
   ```bash
   docker-compose logs -f app
   ```

4. **Stop all services:**
   ```bash
   docker-compose down
   ```

5. **Stop and remove all data:**
   ```bash
   docker-compose down -v
   ```

### API Endpoints for External Use

Your main website can consume these public APIs:

#### Get All Active Jobs
```
GET http://localhost:3000/api/jobs
```
Returns array of active job listings.

#### Get Single Job
```
GET http://localhost:3000/api/jobs/{jobId}
```
Returns job details including description, requirements, and how to apply.

#### Submit Application
```
POST http://localhost:3000/api/applications
Content-Type: application/json

{
  "jobId": "uuid-here",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "linkedIn": "https://linkedin.com/in/johndoe",
  "resume": "https://drive.google.com/file/...",
  "coverLetter": "Optional cover letter text"
}
```

### Admin Access
- Login: http://localhost:3000/admin/login
- Default credentials:
  - Email: `admin@jobboard.com`
  - Password: `securepassword123`

### Environment Variables

Update `.env.production` or docker-compose.yml for production:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens (generate a new one!)
- `NODE_ENV`: Set to "production"

### Production Deployment

For production, make sure to:
1. Change the JWT_SECRET in docker-compose.yml
2. Change the database password
3. Use proper SSL certificates
4. Set up a reverse proxy (nginx/traefik)
5. Enable CORS for your main website domain

### Troubleshooting

**Database connection issues:**
```bash
docker-compose logs postgres
```

**Application errors:**
```bash
docker-compose logs app
```

**Rebuild after code changes:**
```bash
docker-compose up -d --build
```

**Reset database:**
```bash
docker-compose down -v
docker-compose up -d
```

### CORS Configuration

To allow your main website to access the APIs, add CORS headers in `middleware.ts` or create a custom API route wrapper that includes:
```typescript
response.headers.set("Access-Control-Allow-Origin", "https://yourdomain.com");
response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
response.headers.set("Access-Control-Allow-Headers", "Content-Type");
```

# BioCompute Job Portal - Security & Features

## Implemented Features

### Admin Features
- **Dashboard** (`/admin/dashboard`) - Overview with job and application counts
- **Manage Jobs** (`/admin/jobs`) - Full CRUD operations for job postings
  - Create new jobs
  - Edit existing jobs
  - Delete jobs
  - View application counts per job
- **View Applications** (`/admin/applications`) - Review and manage candidate applications
  - Filter by status (pending, reviewed, rejected)
  - Update application status
  - View candidate details and resumes
  - Delete applications

### Public Features
- **Jobs Listing** (`/jobs`) - Browse all active job postings
- **Job Details & Apply** (`/jobs/[id]`) - View job details and submit applications
  - Application form (name, email, resume URL)
  - Success confirmation
  - Resume link submission

## Security Implementation

### ✅ HTTP-Only Cookies
- Admin authentication uses HTTP-only cookies (`admin_token`)
- Cookies are not accessible via JavaScript (XSS protection)
- Secure flag enabled in production (HTTPS only)
- SameSite: strict (CSRF protection)
- 24-hour expiration

### ✅ Rate Limiting
Implemented in `middleware.ts`:
- **Login endpoint**: 5 attempts per 15 minutes per IP
- **Application submissions**: 10 per hour per IP
- **General API**: 100 requests per 15 minutes per IP
- Returns 429 status when limit exceeded

### ✅ CSRF Protection
- SameSite: strict cookie attribute
- Prevents cross-site request forgery attacks
- Cookies only sent with same-site requests

### ✅ Additional Security Headers
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS filter
- `Referrer-Policy: strict-origin-when-cross-origin` - Referrer control

### ✅ Route Protection
- Middleware redirects unauthenticated admin access to login
- All admin API endpoints verify JWT token
- Public endpoints (jobs, applications) don't require auth
- Admin-only endpoints return 401 if unauthorized

## API Endpoints

### Public Endpoints
- `GET /api/jobs` - List active jobs
- `GET /api/jobs/[id]` - Get single job
- `POST /api/applications` - Submit application

### Protected Admin Endpoints
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/jobs` - List all jobs
- `POST /api/admin/jobs` - Create job
- `PUT /api/admin/jobs/[id]` - Update job
- `DELETE /api/admin/jobs/[id]` - Delete job
- `GET /api/admin/applications` - List applications
- `PUT /api/admin/applications/[id]` - Update application status
- `DELETE /api/admin/applications/[id]` - Delete application

## Database Schema
- **Admin** - Authentication and user management
- **Job** - Job postings with status tracking
- **Application** - Candidate applications linked to jobs

## Production Recommendations
1. Replace in-memory rate limiting with Redis
2. Add CSRF tokens for state-changing operations
3. Implement file upload for resumes (instead of URLs)
4. Add email notifications for applications
5. Enable HTTPS in production
6. Add logging and monitoring
7. Implement proper session management
8. Add input validation and sanitization
9. Set up backup and recovery procedures

# Complaint Management System

Microservices-based complaint management platform with a React frontend and a Spring Boot backend behind an API Gateway.

## Architecture
- **Frontend**: React + Vite (`frontend/`)
- **API Gateway**: Spring Cloud Gateway (`backend/Api-Gateway`)
- **Auth Service**: Handles registration/login + JWT (`backend/Auth-Service`)
- **Complaint Service**: User complaint CRUD (`backend/Complaint-Service`)
- **Admin Service**: Admin-only complaint moderation (`backend/admin-Service`)
- **Service Discovery**: Eureka (`backend/eureka-server`)

The frontend calls the API Gateway on `http://localhost:8080/api/v1`.

## Prerequisites
- Node.js 18+ (for frontend)
- Java 17+ (for backend services)
- Maven (or use the Maven wrapper in each service)
- MySQL (local or Docker)
- Docker (optional, for running services via compose)

## Quick Start (Docker)
From the repo root:
```
cd backend
docker-compose up --build
```
This starts:
- API Gateway: `http://localhost:8080`
- Auth Service: `http://localhost:8081`
- Complaint Service: `http://localhost:8082`
- Admin Service: `http://localhost:8083`

Note: MySQL must be available at `host.docker.internal:3306` with databases:
`auth_db`, `complaint_db`, `admin_db`.

## Frontend (Vite)
From the repo root:
```
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:5173`.

### Vite Proxy
`frontend/vite.config.js` proxies `/api` to `http://localhost:8080` to avoid CORS issues.
The frontend uses a relative API base URL by default:

```
VITE_API_BASE_URL=/api/v1
```

You can override it via `.env` in `frontend/` if needed.

## API Documentation
Base URL (via API Gateway):
```
http://localhost:8080/api/v1
```

All secured routes require:
```
Authorization: Bearer <JWT>
```

### Auth
**Register**
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Login**
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Login Response**
```
{
  "token": "<JWT>",
  "role": "USER" | "ADMIN",
  "id": "<UUID>"
}
```

### Complaints (User)
**Create Complaint**
```
POST /complaints
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "title": "Internet not working",
  "description": "No connectivity in hostel block A."
}
```

**Get My Complaints**
```
GET /complaints/user
Authorization: Bearer <JWT>
```

**Complaint Object**
```
{
  "id": "<UUID>",
  "title": "Internet not working",
  "description": "No connectivity in hostel block A.",
  "status": "OPEN" | "IN_PROGRESS" | "RESOLVED",
  "userId": "<UUID>",
  "createdAt": "2026-02-09T12:34:56.000"
}
```

### Admin
**Get All Complaints (Admin only)**
```
GET /admin/complaints
Authorization: Bearer <JWT>
```

**Update Complaint Status (Admin only)**
```
PUT /admin/complaints/{id}/status
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "status": "OPEN" | "IN_PROGRESS" | "RESOLVED"
}
```

## Environment Variables (Backend)
Docker compose passes these to services:
- `DB_URL`, `DB_USER`, `DB_PASS`
- `JWT_SECRET`, `ACCESS_TOKEN_EXP` (Auth Service)
- `AUTH_SERVICE_URL` (Complaint/Admin Services)

## Troubleshooting
- **CORS errors**: Use the Vite proxy and avoid hardcoding `http://localhost:8080` in the frontend.
- **401 Unauthorized**: Ensure you are sending `Authorization: Bearer <JWT>`.
- **403 Forbidden (Admin routes)**: Token must contain role `ADMIN`.


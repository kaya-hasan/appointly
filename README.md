# Appointly

Appointly is a full-stack appointment management system for small businesses and hair salons.

It helps a business owner manage:
- customers
- appointments
- appointment statuses
- daily booking flow

The project is built as a portfolio-oriented MVP with production-readiness improvements on top of the core CRUD flow.

## Highlights

- JWT-based authentication
- Owner-scoped customer and appointment data
- Appointment conflict prevention
- PostgreSQL + Alembic migration flow
- React dashboard and management screens
- Search and filter support on the frontend
- Basic security hardening for local-to-production transition

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- Pydantic

### Frontend
- React
- Vite
- React Router

## Core Features

### Authentication
- User registration
- User login
- JWT access token
- Protected API routes

### Customers
- Create customer
- List customers
- Update customer
- Delete customer
- Prevent delete when related appointments exist

### Appointments
- Create appointment
- List appointments
- Update appointment
- Update appointment status
- Delete appointment
- Prevent overlapping appointments for the same owner

### Frontend
- Dashboard overview
- Customer management page
- Appointment management page
- Search and filter tools
- TR / EN language toggle
- Automatic logout on expired or invalid token

## Security and Data Integrity

The current version includes these practical protections:

- Password hashing with `bcrypt`
- JWT-based route protection
- Owner-based data isolation
- Input validation with Pydantic
- Basic rate limiting middleware
- Configurable CORS origins
- DB-level appointment overlap protection
- DB check constraint for appointment time order
- Duplicate customer protection per owner

## Project Structure

```text
appointly/
├── backend/
│   ├── alembic/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── README.md
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/kaya-hasan/appointly.git
cd appointly
```

### 2. Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/` based on `.env.example`.

Then run:

```bash
alembic upgrade head
uvicorn app.main:app --reload
```

Backend default local URL:

```text
http://127.0.0.1:8000
```

Swagger docs:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend default local URL:

```text
http://127.0.0.1:5173
```

## Environment Variables

Example backend environment values:

```env
APP_NAME=Appointly
ENVIRONMENT=dev
DEBUG=true
DATABASE_URL=postgresql+psycopg://YOUR_USER:YOUR_PASSWORD@localhost:5433/appointly
SECRET_KEY=replace-with-a-long-random-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
ALLOWED_ORIGINS=http://localhost:5173
```

## API Notes

### Auth endpoints
- `POST /auth/register`
- `POST /auth/login`

### Main resource endpoints
- `GET /customers/`
- `POST /customers/`
- `PATCH /customers/{customer_id}`
- `DELETE /customers/{customer_id}`
- `GET /appointments/`
- `POST /appointments/`
- `PATCH /appointments/{appointment_id}`
- `PATCH /appointments/{appointment_id}/status`
- `DELETE /appointments/{appointment_id}`

### Pagination format

List endpoints return:

```json
{
  "items": [],
  "total": 0,
  "limit": 50,
  "offset": 0
}
```

## Current Status

The project is beyond simple CRUD MVP level and now includes:

- auth flow
- owner scoping
- conflict protection
- pagination response standardization
- validation hardening
- responsive login flow

It is still not a fully finished SaaS product. It is currently a strong portfolio project and a solid technical base for further development.

## Production Checklist

Before real deployment, complete these items:

- Move secrets to a secure environment manager
- Replace in-memory rate limiting with Redis-backed rate limiting
- Add refresh token flow
- Add role model if staff accounts will exist
- Enforce stricter phone normalization strategy
- Add test coverage for auth and business rules
- Add structured logging
- Add monitoring and error tracking
- Add Docker setup and deployment pipeline
- Add HTTPS and reverse proxy configuration
- Review nullable legacy fields such as `owner_id`

## Next Possible Improvements

- calendar view
- availability management
- working hours / break rules
- service duration templates
- staff accounts
- analytics and reporting
- email or WhatsApp reminders

## License

This project is currently shared for learning and portfolio purposes.

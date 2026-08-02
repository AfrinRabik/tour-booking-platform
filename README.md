# Wayfarer Tours — Tour Package Booking and Payment Platform

A full-stack tour booking app: customers browse packages, book, pay (simulated),
and view booking history; admins manage packages and see revenue/booking stats.

- **Backend:** Java 17, Spring Boot 3, Spring Data JPA, PostgreSQL
- **Frontend:** React 18 + Vite, React Router, Axios
- **Deploy target:** Backend + DB on Render, frontend on Vercel

No AI/LLM API key is used anywhere in this project.

## Deploying tonight — step by step

### 1. Push to GitHub
```bash
cd tour-booking-platform
git init
git add .
git commit -m "Initial commit"
```
Create a new empty repo on GitHub, then:
```bash
git remote add origin https://github.com/<you>/<repo>.git
git branch -M main
git push -u origin main
```

### 2. Deploy the backend + database on Render (one click via Blueprint)
1. Go to Render → **New** → **Blueprint**
2. Connect your GitHub repo — Render will detect `render.yaml` at the repo root
3. It automatically provisions:
   - A free PostgreSQL database (`tour-booking-db`)
   - The Spring Boot web service, wired to that database's host/port/name/user/password automatically
4. Click **Apply** and wait for the build to finish (first build takes a few minutes)
5. Copy the backend's live URL, e.g. `https://tour-booking-backend.onrender.com`

> Free-tier note: Render spins the service down after inactivity. The first
> request after idle can take 30-60 seconds to wake back up — that's normal,
> not a bug.

### 3. Deploy the frontend on Vercel
1. Go to Vercel → **Add New** → **Project** → import the same GitHub repo
2. Set **Root Directory** to `frontend`
3. Framework preset: Vite (auto-detected)
4. Under **Environment Variables**, add:
   ```
   VITE_API_URL = https://tour-booking-backend.onrender.com/api
   ```
   (use your actual Render URL from step 2, keep the `/api` suffix)
5. Deploy. Copy the live Vercel URL, e.g. `https://your-app.vercel.app`

### 4. Connect the two (final step — don't skip this)
Your backend currently only allows `http://localhost:5173` to call it. Go back
to Render → your backend service → **Environment**, and update:
```
ALLOWED_ORIGINS = https://your-app.vercel.app
```
Save, which triggers an automatic redeploy. Without this step, every API call
from your live frontend will fail with a CORS error in the browser console.

That's it — open the Vercel URL and the whole flow (browse → book → pay →
confirm → admin dashboard) runs against the live Render backend and Postgres
database.

## Local development (optional)

```bash
# Backend - needs env vars pointed at any Postgres instance (local or remote)
cd backend
DB_HOST=localhost DB_PORT=5432 DB_NAME=tourbooking DB_USER=postgres DB_PASSWORD=yourpassword \
  mvn spring-boot:run

# Frontend
cd frontend
cp .env.example .env   # points at localhost:8080 by default
npm install
npm run dev
```

## Project structure

```
render.yaml              Render Blueprint - provisions DB + backend together

backend/
  src/main/java/com/tourbooking/
    entity/       TourPackage, Booking, Payment + enums
    dto/          Request/response objects (never expose entities directly)
    repository/   Spring Data JPA interfaces
    service/      Business logic (pricing, status transitions, dashboard math)
    controller/   REST endpoints
    config/       CORS (env-driven) + DataSeeder (seeds sample packages once)
    exception/    Centralized error handling
  src/main/resources/
    application.properties   All env-var driven, no hardcoded credentials

frontend/
  .env.example           Documents VITE_API_URL
  src/
    api/api.js           Axios calls, base URL from VITE_API_URL
    components/          Navbar, Footer, PackageCard
    pages/                Home, PackageList, PackageDetails, BookingForm,
                          PaymentPage, Confirmation, MyBookings, AdminDashboard
    App.jsx               Routes
    index.css / App.css   Design tokens + component styles
```

## API reference

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/packages` | List all packages |
| GET | `/api/packages/{id}` | Package details |
| POST | `/api/admin/packages` | Create a package |
| PUT | `/api/admin/packages/{id}` | Update a package |
| DELETE | `/api/admin/packages/{id}` | Delete a package |
| POST | `/api/bookings` | Create a booking (status: `PENDING`) |
| GET | `/api/bookings/{id}` | Get one booking |
| GET | `/api/bookings/history/{email}` | Booking history for a customer |
| PUT | `/api/bookings/{id}/cancel` | Cancel a booking |
| POST | `/api/payments` | Process payment → generates transaction ID, flips booking to `CONFIRMED` on success |
| GET | `/api/admin/bookings` | All bookings (admin) |
| GET | `/api/admin/dashboard` | Totals, revenue, payment status breakdown |

## What's intentionally left out (v1 scope)

Not built yet, but the architecture (DTOs, layered services, a mock-payment
method you can swap for Razorpay) is designed so each one slots in without a
rewrite:

- User authentication (customer login, admin login/roles) — admin endpoints
  under `/api/admin/**` have **no auth guard yet**; add Spring Security before
  this holds any real customer data
- Real payment gateway integration — `PaymentService.processPayment` is the
  one method to change; it currently always succeeds
- Email confirmation, coupons, search filters beyond destination name,
  AI-based recommendations, live availability

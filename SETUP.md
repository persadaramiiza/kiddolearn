# KiddoLearn Setup Guide

KiddoLearn adalah platform pembelajaran berbasis webtoon untuk anak-anak, dengan frontend Next.js dan backend NestJS.

## Prasyarat

- Node.js v18 atau lebih tinggi
- pnpm (package manager)
- PostgreSQL 12+

## Instalasi Dependencies

```bash
# Install dependencies untuk backend dan frontend
pnpm install
```

## Setup Backend

### 1. Database Setup

Pastikan PostgreSQL sudah berjalan dan buat database:

```sql
CREATE DATABASE kiddolearn;
```

### 2. Environment Variables

Buat file `.env` di root project (copy dari `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi Anda:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=kiddolearn
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=24h
FRONTEND_URL=http://localhost:3333
```

### 3. Database Migration

```bash
# Run migrations
pnpm run migration:run
```

### 4. Jalankan Backend

```bash
# Development mode
pnpm run start:dev

# Atau production mode
pnpm run build
pnpm run start:prod
```

Backend akan berjalan di `http://localhost:3000`

**Swagger Documentation**: http://localhost:3000/api/docs

## Setup Frontend

### 1. Environment Variables

Frontend sudah dikonfigurasi, tapi pastikan file `.env.local` ada di folder `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Jalankan Frontend

Dari root project:

```bash
# Development mode
cd frontend
pnpm run dev

# Atau dari root dengan custom script (jika sudah di-setup)
pnpm run dev:frontend
```

Frontend akan berjalan di `http://localhost:3333`

## Scripts yang Tersedia

### Backend Scripts

```bash
pnpm run build              # Build backend
pnpm run start              # Run production
pnpm run start:dev          # Run development mode
pnpm run start:debug        # Debug mode
pnpm run lint               # Lint code
pnpm run format             # Format code dengan prettier
pnpm run test               # Run unit tests
pnpm run test:watch         # Watch mode testing
pnpm run test:cov           # Coverage report
pnpm run test:e2e           # End-to-end tests
```

### Frontend Scripts

```bash
cd frontend
pnpm run dev                # Development server
pnpm run build              # Build for production
pnpm run start              # Start production server
pnpm run lint               # Lint code
```

## Fitur Utama

### Backend (NestJS)

- ✅ Authentication & Authorization (JWT)
- ✅ User Management
- ✅ Video Management
- ✅ Quiz Management
- ✅ User Profiles
- ✅ Watch History
- ✅ Health Check
- ✅ Swagger API Documentation
- ✅ Input Validation
- ✅ Error Handling
- ✅ Security (Helmet, CORS)

### Frontend (Next.js)

- ✅ User Authentication
- ✅ Dashboard
- ✅ Video Player
- ✅ Quiz Interface
- ✅ User Profiles
- ✅ Report System
- ✅ Responsive Design

## API Documentation

Setelah backend berjalan, akses Swagger documentation di:

```
http://localhost:3000/api/docs
```

## Struktur Project

```
kiddolearn/
├── frontend/                 # Next.js frontend
│   ├── app/                  # Pages & layouts
│   ├── components/           # React components
│   ├── contexts/             # Context API
│   ├── lib/                  # Utilities & API calls
│   └── public/               # Static assets
├── src/
│   └── backend/              # NestJS backend
│       ├── auth/             # Authentication module
│       ├── users/            # Users module
│       ├── profiles/         # Profiles module
│       ├── videos/           # Videos module
│       ├── quizzes/          # Quizzes module
│       ├── common/           # Common utilities
│       ├── health/           # Health check
│       └── main.ts           # Entry point
├── test/                     # E2E tests
├── package.json              # Root dependencies
├── .env.example              # Environment template
└── README.md                 # Original documentation
```

## Troubleshooting

### Port sudah digunakan

Jika port 3000 atau 3333 sudah digunakan:

**Backend**: Ubah di `.env`
```env
PORT=3001
```

**Frontend**: Ubah di `frontend/package.json`
```json
"dev": "next dev --port 3334"
```

### Database Connection Error

Pastikan:
- PostgreSQL service berjalan
- Credentials di `.env` benar
- Database `kiddolearn` sudah dibuat

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Development Workflow

1. **Backend Development**
   - Edit files di `src/backend/`
   - Backend auto-reload saat development (`start:dev`)
   - Check API di Swagger: http://localhost:3000/api/docs

2. **Frontend Development**
   - Edit files di `frontend/`
   - Frontend auto-reload saat development
   - Check aplikasi di http://localhost:3333

3. **Testing**
   ```bash
   # Backend tests
   pnpm run test
   
   # E2E tests
   pnpm run test:e2e
   ```

## Production Deployment

1. **Build Backend & Frontend**
   ```bash
   pnpm run build
   ```

2. **Setup Environment**
   - Buat `.env` dengan production values
   - Setup database production
   - Generate JWT secret yang aman

3. **Start Application**
   ```bash
   pnpm run start:prod
   ```

## Support

Untuk bantuan lebih lanjut, silakan buka issue atau hubungi tim development.

---

Happy Coding! 🚀

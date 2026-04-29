# 🚀 KiddoLearn Backend - API Testing Guide

## ✅ Current Status

**Server**: Running at http://localhost:3000  
**Swagger Docs**: http://localhost:3000/api/docs

### Currently Available Modules ✓
- ✅ **Auth** - User registration, login, profile
- ✅ **Users** - User profile management  
- ✅ **AI** - Educational AI features

### Ready to Enable (Waiting for Database) ⏳
- ⏳ **Profiles** - Child profile management
- ⏳ **Videos** - Video management
- ⏳ **Quizzes** - Quiz creation and submission
- ⏳ **Watch History** - Video progress tracking
- ⏳ **Health** - Health check endpoints

---

## 📋 Step-by-Step Setup Guide

### Step 1: Setup PostgreSQL Database

#### Option A: Using Docker (Recommended)

```bash
# Navigate to project directory
cd be-kiddolearn

# Start PostgreSQL using docker-compose
docker-compose up -d

# Wait for PostgreSQL to be ready (2-3 seconds)
```

**Output yang diharapkan:**
```
Creating kiddolearn-postgres ... done
```

#### Option B: Manual PostgreSQL Installation

Jika Anda sudah memiliki PostgreSQL terinstall:

```bash
# Create database
createdb -U postgres kiddolearn

# Verify connection
psql -U postgres -d kiddolearn -c "SELECT 1"
```

**Pastikan kredensial di `.env` cocok:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=kiddolearn
```

---

### Step 2: Enable Additional Modules

Edit file [src/app.module.ts](src/app.module.ts) dan uncomment modules yang ingin diaktifkan:

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ ... }),
    // Uncomment modules below:
    AuthModule,
    UsersModule,
    ProfilesModule,        // ← Uncomment ini
    VideosModule,          // ← Uncomment ini
    QuizzesModule,         // ← Uncomment ini
    WatchHistoryModule,    // ← Uncomment ini
    HealthModule,          // ← Uncomment ini
    AiModule,
  ],
  // ...
})
```

---

### Step 3: Add TypeORM Configuration

Edit [src/app.module.ts](src/app.module.ts) dan tambahkan TypeOrmModule kembali ke imports:

```typescript
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

// Di dalam @Module imports array, tambahkan:
TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST') || 'localhost',
    port: configService.get('DB_PORT') || 5432,
    username: configService.get('DB_USER') || 'postgres',
    password: configService.get('DB_PASS') || 'postgres',
    database: configService.get('DB_NAME') || 'kiddolearn',
    autoLoadEntities: true,
    synchronize: true, // Auto-create tables from entities
    logging: false,
  }),
}),
```

---

### Step 4: Restart Development Server

```bash
# Kill existing server (Ctrl+C or use terminal command)
# Then restart:
npm run start:dev
```

**Output yang diharapkan:**
```
[NestFactory] Starting Nest application...
[InstanceLoader] TypeOrmModule dependencies initialized +30ms
[InstanceLoader] ProfilesModule dependencies initialized +120ms
[InstanceLoader] VideosModule dependencies initialized +150ms
[InstanceLoader] QuizzesModule dependencies initialized +180ms
[InstanceLoader] WatchHistoryModule dependencies initialized +200ms
[InstanceLoader] HealthModule dependencies initialized +50ms

🚀 Application running on: http://localhost:3000
📚 Swagger docs: http://localhost:3000/api/docs
```

---

### Step 5: Test APIs in Swagger

1. Buka http://localhost:3000/api/docs
2. Klik **"Authorize"** button (kanan atas)
3. Lakukan **Login** dengan endpoint `POST /api/auth/login`
4. Copy JWT token dari response
5. Paste di Authorize dialog
6. Klik **"Try it out"** di setiap endpoint untuk testing

---

## 🔗 Complete API Endpoints

### Authentication (`/api/auth`)
```
POST   /api/auth/register     - Register user
POST   /api/auth/login        - Login user
GET    /api/auth/me           - Get current user (protected)
```

### Users (`/api/users`)
```
GET    /api/users/profile     - Get user profile (protected)
PATCH  /api/users/profile     - Update user profile (protected)
```

### Profiles (`/api/profiles`) - **Requires DB**
```
POST   /api/profiles                    - Create child profile (protected)
GET    /api/profiles                    - List child profiles (protected)
GET    /api/profiles/:id                - Get profile details (protected)
PATCH  /api/profiles/:id                - Update profile (protected)
DELETE /api/profiles/:id                - Delete profile (protected)
GET    /api/profiles/:profileId/quiz-attempts - Get quiz attempts (protected)
```

### Videos (`/api/videos`) - **Requires DB**
```
GET    /api/videos                      - List published videos (protected)
POST   /api/videos                      - Create video (protected, creator only)
PATCH  /api/videos/:id                  - Update video (protected, creator only)
DELETE /api/videos/:id                  - Delete video (protected, creator only)
GET    /api/videos/:videoId/quizzes     - Get quizzes for video (protected)
GET    /api/videos/:videoId/quizzes/random/:profileId - Get random quizzes (protected)
```

### Quizzes (`/api/quizzes`) - **Requires DB**
```
POST   /api/quizzes              - Create quiz (protected, creator only)
GET    /api/quizzes/:id          - Get quiz by ID (protected)
DELETE /api/quizzes/:id          - Delete quiz (protected, creator only)
POST   /api/quizzes/submit       - Submit quiz answer (protected)
```

### Watch History (`/api/video`) - **Requires DB**
```
POST   /api/video/progress              - Save video progress (protected)
GET    /api/video/:videoId/progress     - Get video progress (protected)
```

### AI (`/api/ai`)
```
GET    /api/ai/status           - Check AI service status
POST   /api/ai/chat             - Chat with EduBot (protected)
POST   /api/ai/explain-quiz     - Get quiz explanation (protected)
POST   /api/ai/quiz-hint        - Get quiz hint (protected)
POST   /api/ai/summarize        - Summarize video (protected)
POST   /api/ai/generate-quiz    - Generate quiz (protected)
```

### Health (`/api/health`) - **Requires DB**
```
GET    /api/health              - Health check with DB
GET    /api/health/ping         - Simple ping
```

---

## 🐳 Docker Compose Commands

```bash
# Start PostgreSQL
docker-compose up -d

# View logs
docker-compose logs -f postgres

# Stop PostgreSQL
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

---

## 🔑 Authentication

Semua endpoint yang ditandai `(protected)` memerlukan JWT token di header:

```bash
curl -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  http://localhost:3000/api/users/profile
```

---

## 🧪 Testing Workflow

### 1. Register User
```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "role": "parent"
}
```

### 2. Login
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
# Response: { "access_token": "eyJhbGc..." }
```

### 3. Get User Profile
```bash
GET /api/users/profile
Header: Authorization: Bearer <access_token>
```

### 4. Create Child Profile (Jika Video Module Enabled)
```bash
POST /api/profiles
Header: Authorization: Bearer <access_token>
{
  "name": "Anak Saya",
  "age_group": "6-8",
  "avatar_url": "https://..."
}
```

---

## ⚠️ Troubleshooting

### Database Connection Error
```
error: password authentication failed for user "postgres"
```

**Solution:**
- Pastikan PostgreSQL sedang berjalan
- Verifikasi kredensial di `.env`
- Coba `docker-compose up -d` lagi

### Modules Not Loading
```
ERROR: Unknown module ProfilesModule
```

**Solution:**
- Pastikan TypeOrmModule sudah ditambahkan ke imports
- Pastikan nama modul tidak typo
- Restart development server

### Port Already in Use
```
Error: listen EADDRINUSE :::3000
```

**Solution:**
```bash
# Kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
# Atau gunakan port berbeda
PORT=3001 npm run start:dev
```

---

## 📝 Notes

- Gunakan Swagger UI untuk testing yang mudah
- JWT token default expires dalam 7 hari (bisa diubah di `.env`)
- Rate limiting: 60 requests per 60 detik
- Database synchronize otomatis dalam development mode

---

**Last Updated**: April 29, 2026  
**Status**: ✅ Auth & AI Ready | ⏳ Database Modules Disabled

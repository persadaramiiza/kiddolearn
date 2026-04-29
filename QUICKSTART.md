# 🎓 KiddoLearn Backend - Quick Start

> **Status**: ✅ **Ready for Testing** - API Server Running  
> **Server**: http://localhost:3000  
> **Swagger UI**: http://localhost:3000/api/docs

---

## ⚡ Quick Start (5 minutes)

### 1️⃣ Start Server (Already Running)
```bash
npm run start:dev
```

### 2️⃣ Open Swagger UI
Visit: **http://localhost:3000/api/docs**

### 3️⃣ Test Auth API
1. Click `POST /api/auth/register`
2. Click **"Try it out"**
3. Enter test credentials:
```json
{
  "email": "test@example.com",
  "password": "password123",
  "role": "parent"
}
```
4. Click **"Execute"**

### 4️⃣ Get JWT Token
1. Click `POST /api/auth/login`
2. Click **"Try it out"**
3. Enter same credentials:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
4. Copy the `access_token` from response

### 5️⃣ Authorize in Swagger
1. Click **"Authorize"** button (top right)
2. Paste token with `Bearer ` prefix:
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
3. Click **"Authorize"** → **"Close"**

### 6️⃣ Test Protected Endpoints
Now you can test any protected endpoint!

---

## 📊 Currently Available APIs

| Module | Status | Endpoints | Protected |
|--------|--------|-----------|-----------|
| **Auth** | ✅ Ready | 3 | 1/3 |
| **Users** | ✅ Ready | 2 | 2/2 |
| **AI** | ✅ Ready | 6 | 5/6 |
| **Profiles** | ⏳ Needs DB | 6 | 6/6 |
| **Videos** | ⏳ Needs DB | 6 | 5/6 |
| **Quizzes** | ⏳ Needs DB | 4 | 4/4 |
| **Watch History** | ⏳ Needs DB | 2 | 2/2 |
| **Health** | ⏳ Needs DB | 2 | 0/2 |

**Total Currently Available**: 12 endpoints ✅

---

## 🔄 Enable All Modules (Optional)

Jika Anda ingin mengaktifkan semua modules termasuk Profile, Video, Quiz, dll:

### Prerequisites
1. **Docker** harus terinstall
2. atau PostgreSQL server sudah berjalan di `localhost:5432`

### Setup (3 steps)

**Step 1: Start PostgreSQL with Docker**
```bash
docker-compose up -d
```

**Step 2: Uncomment modules dalam `src/app.module.ts`**
```typescript
imports: [
  // ... other modules
  ProfilesModule,        // ← Uncomment
  VideosModule,          // ← Uncomment
  QuizzesModule,         // ← Uncomment
  WatchHistoryModule,    // ← Uncomment
  HealthModule,          // ← Uncomment
]
```

**Step 3: Restart server**
```bash
# Kill current server (Ctrl+C)
npm run start:dev
```

✅ Done! All modules now available.

---

## 📚 API Documentation

### 🔐 Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (get JWT)
- `GET /api/auth/me` - Get current user profile

**Example:**
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "pass123",
    "role": "parent"
  }'

# Response:
{
  "id": 1,
  "email": "user@example.com",
  "role": "parent"
}
```

### 👤 Users
- `GET /api/users/profile` - Get user profile (protected)
- `PATCH /api/users/profile` - Update user profile (protected)

### 🤖 AI Features (No DB needed!)
- `GET /api/ai/status` - Check AI availability
- `POST /api/ai/chat` - Chat with EduBot
- `POST /api/ai/explain-quiz` - Get quiz explanation
- `POST /api/ai/quiz-hint` - Get quiz hint
- `POST /api/ai/summarize` - Summarize video
- `POST /api/ai/generate-quiz` - Generate quiz questions

**Example:**
```bash
curl -X POST http://localhost:3000/api/ai/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 👨‍👧 Profiles (Database required)
- `POST /api/profiles` - Create child profile
- `GET /api/profiles` - List child profiles
- `GET /api/profiles/:id` - Get profile details
- `PATCH /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile
- `GET /api/profiles/:id/quiz-attempts` - Get attempts

### 📺 Videos (Database required)
- `GET /api/videos` - List videos
- `POST /api/videos` - Create video (creator only)
- `PATCH /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video
- `GET /api/videos/:id/quizzes` - Get quizzes for video
- `GET /api/videos/:id/quizzes/random/:profileId` - Get random quizzes

### 🎓 Quizzes (Database required)
- `POST /api/quizzes` - Create quiz
- `GET /api/quizzes/:id` - Get quiz
- `DELETE /api/quizzes/:id` - Delete quiz
- `POST /api/quizzes/submit` - Submit answer

### ⏱️ Watch History (Database required)
- `POST /api/video/progress` - Save progress
- `GET /api/video/:id/progress` - Get progress

### ❤️ Health (Database required)
- `GET /api/health` - Health check with DB
- `GET /api/health/ping` - Simple ping

---

## 🛠️ Development Commands

```bash
# Start development server
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Run tests
npm run test

# Run end-to-end tests
npm run test:e2e

# Format code
npm run format

# Lint code
npm run lint
```

---

## 🗂️ Project Structure

```
be-kiddolearn/
├── src/
│   ├── app.controller.ts       # Main controller
│   ├── app.module.ts           # Root module (enable/disable modules here)
│   ├── app.service.ts          # Main service
│   ├── main.ts                 # Application entry point
│   ├── auth/                   # Authentication module ✅
│   ├── users/                  # Users module ✅
│   ├── ai/                     # AI module ✅
│   ├── profiles/               # Profiles module ⏳
│   ├── videos/                 # Videos module ⏳
│   ├── quizzes/                # Quizzes module ⏳
│   ├── watch-history/          # Watch history module ⏳
│   ├── health/                 # Health module ⏳
│   └── common/                 # Shared utilities
├── docker-compose.yml          # PostgreSQL configuration
├── SETUP_GUIDE.md              # Detailed setup guide
├── SWAGGER_ENDPOINTS.md        # Complete API reference
└── package.json                # Dependencies
```

---

## 🔑 Key Files to Edit

| File | Purpose |
|------|---------|
| `src/app.module.ts` | Enable/disable modules |
| `src/main.ts` | Swagger configuration, CORS settings |
| `.env` | Environment variables, database credentials |
| `docker-compose.yml` | PostgreSQL configuration |

---

## 🐛 Troubleshooting

### Server won't start
```
Error: listen EADDRINUSE :::3000
```
**Solution**: Port 3000 sudah digunakan
```bash
# Gunakan port lain
PORT=3001 npm run start:dev
```

### Database error (after enabling modules)
```
error: password authentication failed for user "postgres"
```
**Solution**: PostgreSQL tidak running atau kredensial salah
```bash
# Start PostgreSQL
docker-compose up -d

# Verifikasi koneksi
docker-compose logs postgres
```

### Module not found
```
Cannot find module 'ProfilesModule'
```
**Solution**: Module mungkin belum di-import atau ada typo
- Pastikan module di-uncomment di `src/app.module.ts`
- Pastikan file ada di folder module

---

## 📱 Testing with Curl

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","role":"parent"}'

# Login and get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}' | jq -r '.access_token')

# Get user profile with token
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/users/profile
```

---

## 📖 More Documentation

- **Detailed Setup**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Complete API Reference**: See [SWAGGER_ENDPOINTS.md](SWAGGER_ENDPOINTS.md)
- **Swagger UI**: http://localhost:3000/api/docs

---

## ✨ Next Steps

1. ✅ Test Auth endpoints
2. ✅ Get JWT token
3. ✅ Test protected endpoints
4. 📋 Read [SETUP_GUIDE.md](SETUP_GUIDE.md) to enable database modules
5. 🚀 Deploy when ready!

---

**Happy Testing! 🎉**

For issues or questions, check the troubleshooting section or see detailed guides.

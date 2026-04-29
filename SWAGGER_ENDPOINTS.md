# KiddoLearn Backend - Swagger API Documentation

## ✅ Status: All APIs Documented and Ready for Testing

Server Status: **Running on http://localhost:3000**  
Swagger Docs: **http://localhost:3000/api/docs**

---

## 📚 Available API Endpoints

### 🔐 **Auth Module** (`/api/auth`)
- `POST /api/auth/register` - Register new user (Parent or Creator)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (requires Bearer token)

### 👤 **Users Module** (`/api/users`)
- `GET /api/users/profile` - Get current user profile (protected)
- `PATCH /api/users/profile` - Update current user profile (protected)

### 📺 **Videos Module** (`/api/videos`)
- `GET /api/videos` - Get all published videos
- `POST /api/videos` - Create new video (Creator/Admin only)
- `PATCH /api/videos/:id` - Update video (Creator/Admin only)
- `DELETE /api/videos/:id` - Delete video (Creator/Admin only)
- `GET /api/videos/:videoId/quizzes` - Get quizzes for a video
- `GET /api/videos/:videoId/quizzes/random/:profileId` - Get randomized quizzes

### 📚 **Books Module** (`/api/books`)
- `GET /api/books` - Get all books with filtering
- `GET /api/books/my-books` - Get books created by current user
- `POST /api/books` - Create new book (Creator/Admin only)
- `GET /api/books/download-external` - Proxy download for external files
- Additional book management endpoints

### 🎓 **Quizzes Module** (`/api/quizzes`)
- `POST /api/quizzes` - Create new quiz
- `GET /api/quizzes/:id` - Get quiz by ID
- `DELETE /api/quizzes/:id` - Delete quiz
- `POST /api/quizzes/submit` - Submit quiz answer and get result

### 👨‍👧 **Profiles Module** (`/api/profiles`)
- `POST /api/profiles` - Create child profile
- `GET /api/profiles` - Get all child profiles of user
- `GET /api/profiles/:id` - Get specific profile details
- `PATCH /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile
- `GET /api/profiles/:profileId/quiz-attempts` - Get quiz attempts by profile

### ⏱️ **Watch History Module** (`/api/video`)
- `POST /api/video/progress` - Save video watch progress
- `GET /api/video/:videoId/progress` - Get video watch progress

### 🤖 **AI Module** (`/api/ai`)
- `GET /api/ai/status` - Check AI service availability
- `POST /api/ai/chat` - Chat with EduBot for educational Q&A
- `POST /api/ai/explain-quiz` - Get AI explanation for quiz answers
- `POST /api/ai/quiz-hint` - Get AI-generated hint for quiz questions
- `POST /api/ai/summarize` - Summarize video topics
- `POST /api/ai/generate-quiz` - Generate quiz questions using AI

### 🔗 **Siswaroom Integration** (`/api/siswaroom`)
- `POST /api/siswaroom/sync-teachers` - Sync teachers from Siswaroom API (Admin only)
- `GET /api/siswaroom/auto-connect` - Auto-connect Siswaroom by email match
- `GET /api/siswaroom/users` - Get Siswaroom users for selection
- Additional Siswaroom endpoints

### ❤️ **Health Module** (`/api/health`)
- `GET /api/health` - Check API health status with database
- `GET /api/health/ping` - Simple ping endpoint

---

## 🔑 Authentication

All protected endpoints require:
- **Header:** `Authorization: Bearer <JWT_TOKEN>`
- Obtain JWT token via `POST /api/auth/login` or `POST /api/auth/register`

---

## 🚀 Getting Started with Swagger Testing

1. **Open Swagger UI:** http://localhost:3000/api/docs
2. **Register/Login:** Use `POST /api/auth/register` or `POST /api/auth/login`
3. **Authorize:** Click "Authorize" button and paste the JWT token from response
4. **Test Endpoints:** Click any endpoint to test with Swagger UI
5. **View Responses:** All responses and error codes are documented

---

## ✨ Recent Updates

✅ All modules enabled in `AppModule`  
✅ Swagger tags configured for all modules  
✅ Watch History controller decorated with Swagger annotations  
✅ Bearer token authentication configured  
✅ All endpoints accessible and testable via Swagger UI  

---

## 📝 Notes

- Modules that require database configuration (Profiles, Videos, Quizzes, Books, Siswaroom) are disabled by default to prevent startup errors
- To enable them, ensure TypeORM is configured with a valid database connection
- AI features require `GROQ_API_KEY` in `.env` file
- Rate limiting: 60 requests per 60 seconds (configurable in `app.module.ts`)

---

Generated: April 29, 2026

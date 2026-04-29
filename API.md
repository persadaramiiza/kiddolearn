# API Documentation - KiddoLearn

Dokumentasi lengkap API KiddoLearn dengan Swagger.

## Akses Swagger Documentation

Setelah backend berjalan, akses dokumentasi API di:

```
http://localhost:3000/api/docs
```

## Setup Backend untuk Development

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Konfigurasi Environment

Buat file `.env` di root project:

```bash
cp .env.example .env
```

Isi dengan konfigurasi Anda (terutama database credentials):

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=kiddolearn
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
JWT_EXPIRATION=24h
FRONTEND_URL=http://localhost:3333
```

### 3. Setup Database

Buat database PostgreSQL:

```sql
CREATE DATABASE kiddolearn;
```

Jika ada migration files, jalankan:

```bash
pnpm run migration:run
```

### 4. Jalankan Backend

```bash
# Development mode dengan auto-reload
pnpm run start:dev
```

Backend akan berjalan di `http://localhost:3000`

## API Endpoints

### Authentication (`/api/auth`)

- `POST /auth/register` - Register user baru
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh JWT token

**Headers Required**: `Authorization: Bearer <token>`

### Users (`/api/users`)

- `GET /users` - Get daftar users (admin only)
- `GET /users/:id` - Get user details
- `PUT /users/:id` - Update user info
- `DELETE /users/:id` - Delete user (admin only)

### Profiles (`/api/profiles`)

- `GET /profiles` - Get user profiles
- `POST /profiles` - Create profile baru
- `GET /profiles/:id` - Get profile details
- `PUT /profiles/:id` - Update profile
- `DELETE /profiles/:id` - Delete profile

### Videos (`/api/videos`)

- `GET /videos` - Get daftar videos
- `GET /videos/:id` - Get video details
- `POST /videos` - Create video (admin only)
- `PUT /videos/:id` - Update video (admin only)
- `DELETE /videos/:id` - Delete video (admin only)
- `GET /videos/:id/progress` - Get watch progress

### Quizzes (`/api/quizzes`)

- `GET /quizzes` - Get daftar quizzes
- `GET /quizzes/:id` - Get quiz details
- `POST /quizzes` - Create quiz (admin only)
- `PUT /quizzes/:id` - Update quiz (admin only)
- `DELETE /quizzes/:id` - Delete quiz (admin only)
- `POST /quizzes/:id/attempt` - Submit quiz attempt

### Health (`/api/health`)

- `GET /health` - Health check endpoint

## Swagger Features

### Authentication di Swagger

1. Klik tombol **Authorize** di atas dokumentasi
2. Masukkan JWT token: `Bearer <your_token>`
3. Setiap request akan otomatis menambahkan Authorization header

### Testing API Endpoints

1. Buka endpoint yang ingin di-test
2. Klik tombol **Try it out**
3. Isi request body (jika diperlukan)
4. Klik **Execute**
5. Lihat response dan status code

## Example Requests

### 1. Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123",
    "name": "John Doe"
  }'
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### 3. Get Videos (dengan Authorization)

```bash
curl -X GET http://localhost:3000/api/videos \
  -H "Authorization: Bearer <your_token>"
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Video Title",
    "description": "Video Description",
    "url": "https://example.com/video.mp4",
    "thumbnail": "https://example.com/thumb.jpg",
    "category": "Math",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

## Error Responses

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": ["validation error 1", "validation error 2"],
  "error": "Bad Request"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

## Security Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **CORS** - Cross-Origin Resource Sharing configured
- ✅ **Helmet** - HTTP security headers
- ✅ **Input Validation** - Request validation dengan class-validator
- ✅ **Rate Limiting** - Throttling untuk prevent abuse
- ✅ **Role-Based Access Control** - Admin vs User roles

## Running Tests

### Unit Tests

```bash
pnpm run test
```

### Watch Mode

```bash
pnpm run test:watch
```

### Coverage Report

```bash
pnpm run test:cov
```

### E2E Tests

```bash
pnpm run test:e2e
```

## Development Tips

### 1. Enable Logging

Di `src/backend/main.ts`, ubah logger config:

```typescript
const app = await NestFactory.create(AppModule, {
  logger: ['error', 'warn', 'log', 'debug', 'verbose'], // Verbose logging
});
```

### 2. Add New Endpoint

1. Buat controller method baru
2. Tambahkan decorator `@ApiOperation`, `@ApiResponse`
3. Update module dengan provider/controller
4. Swagger akan otomatis update

Contoh:
```typescript
@Post('example')
@ApiOperation({ summary: 'Create example' })
@ApiResponse({ status: 201, description: 'Example created' })
async createExample(@Body() dto: CreateExampleDto) {
  return this.service.create(dto);
}
```

### 3. Database Queries

Gunakan TypeORM untuk queries:

```typescript
const videos = await this.videosRepository.find({
  where: { category: 'Math' },
  order: { createdAt: 'DESC' }
});
```

## Troubleshooting

### 1. Swagger tidak muncul

- Pastikan backend berjalan di port 3000
- Coba akses ulang di `http://localhost:3000/api/docs`
- Check console untuk error messages

### 2. JWT Token Error

- Pastikan `.env` memiliki `JWT_SECRET` yang valid
- Restart backend setelah mengubah `.env`
- Token harus diformat dengan `Bearer <token>`

### 3. Database Connection Error

```bash
# Cek connection
psql -U postgres -h localhost -d kiddolearn

# Restart PostgreSQL service
# Windows: Restart service PostgreSQL
# Mac: brew services restart postgresql
# Linux: sudo service postgresql restart
```

## API Performance

### Caching

Endpoints dengan caching (50 detik):
- `GET /videos`
- `GET /quizzes`
- `GET /profiles`

### Rate Limiting

Default: 60 requests per minute per IP

### Pagination

Support pagination pada list endpoints:
```bash
GET /api/videos?page=1&limit=10&sort=-createdAt
```

## Support

Untuk pertanyaan atau issues, silakan:
1. Cek Swagger documentation: http://localhost:3000/api/docs
2. Review error message dan status code
3. Check database logs
4. Lihat application logs di console

---

Happy Coding! 🚀

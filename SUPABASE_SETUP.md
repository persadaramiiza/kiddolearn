# Supabase Database Setup Guide - KiddoLearn

## ✅ Status: Database Connection Configured

Aplikasi KiddoLearn sudah dikonfigurasi untuk terhubung dengan Supabase PostgreSQL database.

## 📋 Setup Steps yang Sudah Dilakukan

### 1. **Environment Variables (.env)**
File `.env` sudah dikonfigurasi dengan Supabase credentials:
```
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_PORT=5432
DB_USER=postgres.yohevwfqqapqasjybkkn
DB_PASS=[YOUR-PASSWORD]  ← Ganti dengan password Supabase Anda
DB_NAME=postgres
DB_SSL=true
```

### 2. **Database Configuration (app.module.ts)**
- TypeORM sudah dikonfigurasi dengan PostgreSQL driver
- Konfigurasi menggunakan environment variables dari `.env`
- Auto-synchronize enabled untuk development (synchronize: NODE_ENV !== 'production')

### 3. **Entities yang akan disinkronisasi:**
- User
- Profile
- Video
- Quiz
- QuizOption
- QuizAttempt
- WatchHistory

## 🚀 Cara Menjalankan

### Development Mode:
```bash
# Install dependencies
pnpm install

# Update .env dengan password Supabase Anda
# Edit file .env dan ganti [YOUR-PASSWORD] dengan password yang benar

# Jalankan backend
pnpm run start:dev

# Atau jalankan frontend + backend bersamaan
pnpm run dev
```

### Production Mode:
```bash
# Build
pnpm run build:all

# Jalankan production
NODE_ENV=production pnpm run start:prod
```

## ⚙️ Configuration Details

**Database Parameters:**
- **Host:** aws-1-ap-southeast-1.pooler.supabase.com (Supabase Session Pooler)
- **Port:** 5432 (Default PostgreSQL)
- **User:** postgres (Default Supabase user)
- **Database:** postgres (Default database)
- **Driver:** pg (Node.js PostgreSQL client)
- **SSL:** set `DB_SSL=true` untuk koneksi Supabase

**TypeORM Settings:**
- **Synchronize:** true (development), false (production)
  - Otomatis membuat/update schema database sesuai entities
  - Disable di production untuk keamanan
- **Logging:** false (dapat diubah ke true untuk debug)

## 🔐 Security Notes

1. **Password Management:**
   - Jangan commit `.env` file ke git (sudah ada di `.gitignore`)
   - Gunakan `.env.example` untuk template

2. **Production Deployment:**
   ```bash
   # Di production, gunakan environment variables:
   NODE_ENV=production
   DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
   DB_PORT=5432
   DB_USER=postgres.yohevwfqqapqasjybkkn
   DB_PASS=your_actual_password
   DB_NAME=postgres
   ```

3. **SSL Connection (Production):**
   - Supabase menggunakan SSL untuk koneksi database
   - Set `DB_SSL=true` di `.env`

## 🧪 Testing Connection

1. **Jalankan aplikasi:**
   ```bash
   pnpm run start:dev
   ```

2. **Cek health endpoint:**
   ```bash
   curl http://localhost:3000/health
   ```

3. **Database migration otomatis:**
   - TypeORM akan otomatis membuat/update semua tables saat aplikasi start
   - Cek di Supabase dashboard → SQL Editor untuk verifikasi

## 📊 Verifikasi di Supabase Dashboard

1. Masuk ke [https://app.supabase.com](https://app.supabase.com)
2. Pilih project Anda
3. Buka **SQL Editor**
4. Jalankan query untuk verify tables:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

## 🐛 Troubleshooting

### Connection Error
```
Error: connect ENOTFOUND db.<PROJECT_REF>.supabase.co
```
**Solution:**
- Verify `.env` credentials
- Check internet connection
- Verify Supabase project is active

### Authentication Failed
```
Error: password authentication failed for user "postgres"
```
**Solution:**
- Double-check password di `.env`
- Reset password di Supabase dashboard jika diperlukan

### SSL Certificate Error (Production)
```
Error: self signed certificate
```
**Solution:**
- Pastikan `DB_SSL=true` di `.env`

## 📝 Next Steps

1. ✅ Setup environment variables - DONE
2. ✅ Configure TypeORM - DONE
3. ⏭️ Run `pnpm install` dan `pnpm run start:dev`
4. ⏭️ Verify database tables dibuat di Supabase
5. ⏭️ Test API endpoints
6. ⏭️ Deploy ke production

---

**Created:** May 2, 2026
**Framework:** NestJS + TypeORM + PostgreSQL (Supabase)

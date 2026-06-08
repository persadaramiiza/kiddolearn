# Deploy KiddoLearn

Project ini terdiri dari:

- Backend: NestJS di root repository
- Frontend: Next.js di `frontend/`
- Database: PostgreSQL, cocok memakai Supabase atau Neon

## Opsi Deployment

### Opsi 1: Vercel Backend + Vercel Frontend + Supabase

Backend NestJS sudah disiapkan untuk Vercel melalui `api/index.ts` dan `vercel.json`.

Gunakan opsi ini kalau targetnya semua aplikasi web berada di Vercel:

- Backend NestJS: Vercel Function
- Frontend Next.js: Vercel project terpisah dengan root `frontend/`
- Database PostgreSQL: Supabase

Catatan: NestJS di Vercel berjalan sebagai serverless function, jadi request pertama bisa terkena cold start.

### Opsi 2: Vercel + Render + Supabase

Ini opsi paling mudah untuk demo:

- Frontend Next.js: Vercel Hobby
- Backend NestJS: Render Free Web Service
- Database PostgreSQL: Supabase Free

Kekurangannya: backend Render Free akan sleep setelah idle, jadi request pertama bisa lambat.

### Opsi 3: Vercel + Koyeb + Neon

Lebih cocok kalau ingin backend tetap pada free instance kecil:

- Frontend Next.js: Vercel Hobby
- Backend NestJS: Koyeb free instance
- Database PostgreSQL: Neon Free

Kekurangannya: resource backend free kecil, jadi cocok untuk demo atau traffic ringan.

### Opsi 4: Railway

Railway mudah untuk full stack, tetapi free tier utamanya berbasis kredit kecil. Cocok untuk testing singkat, bukan pilihan gratis jangka panjang.

## Deploy Backend ke Vercel

1. Push repository ke GitHub.
2. Import repository di Vercel sebagai project backend.
3. Root directory: kosongkan, gunakan root repository.
4. Framework preset: Other.
5. Pastikan Vercel membaca `vercel.json` di root.
6. Tambahkan environment variables:
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://domain-frontend.vercel.app`
   - `DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com`
   - `DB_PORT=5432`
   - `DB_USER=postgres.yohevwfqqapqasjybkkn`
   - `DB_PASS`
   - `DB_NAME=postgres`
   - `DB_SSL=true`
   - `JWT_SECRET`
   - `JWT_EXPIRATION=24h`
   - `GEMINI_API_KEY`
7. Setelah deploy sukses, cek endpoint:
   - `https://domain-backend.vercel.app/api/health/ping`
   - `https://domain-backend.vercel.app/api/docs`

## Deploy Backend ke Render

1. Push repository ke GitHub.
2. Buka Render Dashboard.
3. Pilih `New` > `Blueprint` jika ingin memakai `render.yaml`, atau `New` > `Web Service`.
4. Hubungkan repository.
5. Gunakan setting berikut jika membuat Web Service manual:
   - Root directory: kosongkan
   - Runtime: Node
   - Build command: `npm ci && npm run build`
   - Start command: `npm run start:prod`
   - Instance type: Free
6. Tambahkan environment variables:
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://domain-frontend.vercel.app`
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASS`
   - `DB_NAME`
   - `JWT_SECRET`
   - `JWT_EXPIRATION=24h`
   - `GEMINI_API_KEY`
7. Setelah deploy sukses, cek endpoint:
   - `https://nama-service.onrender.com/api/health/ping`
   - `https://nama-service.onrender.com/api/docs`

## Deploy Frontend ke Vercel

1. Import repository di Vercel.
2. Set `Root Directory` ke `frontend`.
3. Framework preset: Next.js.
4. Tambahkan environment variable:
   - `NEXT_PUBLIC_API_URL=https://domain-backend.vercel.app/api`
5. Deploy.

## Catatan Database

Supabase cocok jika database sudah dibuat di sana. Ambil connection info dari Supabase dashboard dan isi ke env backend:

- `DB_HOST`: host database Supabase
- `DB_PORT`: biasanya `5432`
- `DB_USER`: user database
- `DB_PASS`: password database
- `DB_NAME`: nama database

Untuk Neon, gunakan detail koneksi PostgreSQL dari Neon dashboard dengan mapping env yang sama.

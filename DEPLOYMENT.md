# Deploy KiddoLearn

Target deployment yang dipakai:

- Backend: NestJS di Render
- Frontend: Next.js di Vercel
- Database: Supabase PostgreSQL

## 1. Deploy Backend ke Render

Repo ini sudah punya `render.yaml`, jadi opsi paling mudah adalah memakai Blueprint.

1. Push repository ke GitHub.
2. Buka Render Dashboard.
3. Pilih `New` > `Blueprint`.
4. Hubungkan repository `persadaramiiza/kiddolearn`.
5. Render akan membaca `render.yaml` dan membuat web service `kiddolearn-api`.
6. Tambahkan environment variables berikut di Render:

```env
NODE_ENV=production
FRONTEND_URL=https://domain-frontend.vercel.app
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_PORT=5432
DB_USER=postgres.yohevwfqqapqasjybkkn
DB_PASS=<password-supabase>
DB_NAME=postgres
DB_SSL=true
JWT_SECRET=<secret-yang-kuat>
JWT_EXPIRATION=24h
GEMINI_API_KEY=<gemini-api-key>
```

Jika membuat Web Service manual, gunakan:

```bash
npm ci && npm run build
```

Start command:

```bash
npm run start:prod
```

Health check path:

```text
/api/health/ping
```

Setelah deploy sukses, cek:

```text
https://nama-service.onrender.com/api/health/ping
https://nama-service.onrender.com/api/docs
```

## 2. Deploy Frontend ke Vercel

1. Import repository yang sama di Vercel.
2. Set `Root Directory` ke `frontend`.
3. Framework preset: Next.js.
4. Tambahkan environment variable:

```env
NEXT_PUBLIC_API_URL=https://nama-service.onrender.com/api
```

5. Deploy.

## 3. Update CORS Backend

Setelah frontend Vercel punya domain final, update env backend Render:

```env
FRONTEND_URL=https://domain-frontend.vercel.app
```

Jika ada lebih dari satu domain, pisahkan dengan koma:

```env
FRONTEND_URL=https://domain-frontend.vercel.app,https://custom-domain.com
```

## Catatan Supabase

Project Supabase `kiddolearn` memakai Session Pooler agar kompatibel dengan jaringan IPv4:

```env
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_USER=postgres.yohevwfqqapqasjybkkn
DB_SSL=true
```

Jangan commit `.env` karena berisi password database dan API key.

'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body>
        <main className="min-h-screen bg-white text-slate-900 flex items-center justify-center px-6">
          <section className="max-w-md text-center">
            <h1 className="text-2xl font-bold mb-3">Terjadi kesalahan</h1>
            <p className="text-slate-600 mb-6">
              Halaman gagal dimuat. Coba muat ulang halaman ini.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-md bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600"
            >
              Muat ulang
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}

'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BarChart3, CheckCircle2, CircleHelp, PlayCircle, ShieldCheck, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui';
import { LoadingPage } from '@/components/ui/Loading';

const parentSteps = [
  {
    icon: UserPlus,
    title: 'Buat profil anak',
    description: 'Masuk ke dashboard, lalu tambahkan nama dan usia anak agar rekomendasi video sesuai umur.',
  },
  {
    icon: PlayCircle,
    title: 'Pilih video belajar',
    description: 'Pilih profil anak, buka daftar video, lalu mulai tontonan edukatif yang tersedia.',
  },
  {
    icon: CheckCircle2,
    title: 'Dampingi quiz interaktif',
    description: 'Quiz muncul saat anak menonton. Gunakan hasilnya untuk melihat bagian yang sudah dipahami.',
  },
  {
    icon: BarChart3,
    title: 'Pantau laporan',
    description: 'Buka halaman profil atau report untuk melihat progress belajar dan riwayat aktivitas anak.',
  },
];

const parentTips = [
  'Gunakan satu profil untuk setiap anak supaya progress tidak tercampur.',
  'Sesuaikan video dengan usia anak sebelum mulai menonton.',
  'Cek laporan secara berkala untuk melihat pola belajar.',
  'Jika anak kesulitan menjawab quiz, ulangi bagian video yang relevan.',
];

export default function ParentsGuidePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role === 'creator' || user.role === 'admin') {
      router.push('/guide/creator');
    }
  }, [isLoading, router, user]);

  if (isLoading) {
    return <LoadingPage text="Memuat panduan..." />;
  }

  if (!user || user.role !== 'parent') {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#FFF9F0] px-4 py-8 text-[#4A4A4A]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border-b-8 border-[#FFE0B2] bg-white p-5 shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <Link href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm font-black text-[#8B7355] hover:text-[#FF7A00]">
              <ArrowLeft size={18} strokeWidth={3} />
              Kembali ke Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF5E5] text-[#FF7A00]">
                <CircleHelp size={30} strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#4A4A4A] sm:text-4xl">Parents Help Guide</h1>
                <p className="mt-1 font-bold text-[#8B7355]">Panduan khusus orang tua untuk mengelola belajar anak.</p>
              </div>
            </div>
          </div>
          <Link href="/dashboard">
            <Button className="w-full rounded-full sm:w-auto">Buka Dashboard</Button>
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {parentSteps.map((step, index) => (
            <article key={step.title} className="rounded-[2rem] border-4 border-[#FFE0B2] bg-white p-6 shadow-lg">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF7A00] text-white shadow-md">
                  <step.icon size={24} strokeWidth={3} />
                </div>
                <span className="rounded-full bg-[#FFF5E5] px-3 py-1 text-sm font-black text-[#D94D2B]">
                  Langkah {index + 1}
                </span>
              </div>
              <h2 className="mb-2 text-2xl font-black text-[#4A4A4A]">{step.title}</h2>
              <p className="font-bold leading-relaxed text-[#8B7355]">{step.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border-4 border-[#FFE0B2] bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <ShieldCheck className="text-[#D94D2B]" size={28} strokeWidth={3} />
              <h2 className="text-2xl font-black">Checklist Orang Tua</h2>
            </div>
            <div className="grid gap-3">
              {parentTips.map((tip) => (
                <div key={tip} className="flex gap-3 rounded-2xl bg-[#FFF9F0] p-4 font-bold text-[#8B7355]">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#FF7A00]" size={20} strokeWidth={3} />
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border-4 border-[#FFE0B2] bg-[#4A4A4A] p-6 text-white shadow-lg">
            <h2 className="mb-3 text-2xl font-black">Butuh mulai cepat?</h2>
            <p className="mb-6 font-bold leading-relaxed text-white/80">
              Mulai dari dashboard parent, buat profil anak pertama, lalu pilih profil tersebut untuk masuk ke daftar video.
            </p>
            <Link href="/dashboard">
              <Button className="w-full rounded-full bg-[#FFD93D] text-[#4A4A4A] hover:bg-white">Mulai dari Dashboard</Button>
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}

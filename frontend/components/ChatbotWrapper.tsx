'use client';

import { usePathname } from 'next/navigation';
import Chatbot from './Chatbot'; // Sesuaikan import jika foldernya berbeda

export default function ChatbotWrapper() {
  const pathname = usePathname();

  // Daftar rute di mana chatbot TIDAK BOLEH muncul
  const hiddenRoutes = ['/', '/login', '/register'];

  // Kalau path saat ini ada di dalam hiddenRoutes, jangan render apa-apa
  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  // Kalau di halaman lain (dashboard, profile, dll), render chatbot-nya
  return <Chatbot />;
}
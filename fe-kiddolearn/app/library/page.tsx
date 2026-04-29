'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { booksService, Book } from '@/lib/books';
import { Button } from '@/components/ui';
import { LoadingPage } from '@/components/ui/Loading';
import { ArrowLeft, Search, BookOpen, Download, Eye, ExternalLink, Home } from 'lucide-react';
import Image from 'next/image';

export default function BooksLibraryPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [sourceFilter, setSourceFilter] = useState<'all' | 'internal' | 'siswaroom'>('all');

  const categories = [
    { value: 'all', label: '📚 Semua' },
    { value: 'catatan', label: '📝 Catatan' },
    { value: 'Matematika', label: '📐 Matematika' },
    { value: 'Sains', label: '🔬 Sains' },
    { value: 'Bahasa', label: '📖 Bahasa' },
    { value: 'Seni', label: '🎨 Seni' },
    { value: 'Musik', label: '🎵 Musik' },
    { value: 'Cerita', label: '📚 Cerita' },
  ];

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) {
      loadBooks();
    }
  }, [user]);

  useEffect(() => {
    filterBooks();
  }, [books, searchQuery, selectedCategory, sourceFilter]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await booksService.getAll();
      setBooks(data);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = [...books];

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(book => book.source === sourceFilter);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => 
        book.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.description?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query)
      );
    }

    setFilteredBooks(filtered);
  };

  const handleOpenBook = (book: Book) => {
    setSelectedBook(book);
  };

  const handleDownloadBook = async (book: Book) => {
    try {
      await booksService.downloadBook(book);
    } catch (error) {
      console.error('Error downloading book:', error);
      alert('Gagal mendownload buku. Silakan coba lagi.');
    }
  };

  if (isLoading || loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return null;
  }

  const internalCount = books.filter(b => b.source === 'internal').length;
  const siswaroomCount = books.filter(b => b.source === 'siswaroom').length;

  return (
    <div className="min-h-screen bg-[#FFF9F0] font-sans text-[#4A4A4A]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b-2 border-[#FFE0B2] shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-[#8B7355] hover:text-[#FF7A00] transition-colors group font-bold"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <div className="h-6 w-px bg-[#FFE0B2]"></div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-[#FF7A00]" />
              <h1 className="text-xl font-black text-[#D94D2B]">Perpustakaan Buku</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 border-4 border-[#FFE0B2] shadow-lg">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-2xl font-black text-[#4A4A4A]">{books.length}</div>
            <div className="text-xs text-[#8B7355] font-bold">Total Buku</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border-4 border-[#E8F5E9] shadow-lg">
            <div className="text-3xl mb-2">🏠</div>
            <div className="text-2xl font-black text-[#2E7D32]">{internalCount}</div>
            <div className="text-xs text-[#2E7D32] font-bold">Internal</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border-4 border-[#E3F2FD] shadow-lg">
            <div className="text-3xl mb-2">🌐</div>
            <div className="text-2xl font-black text-[#1565C0]">{siswaroomCount}</div>
            <div className="text-xs text-[#1565C0] font-bold">SiswaRoom</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border-4 border-[#F3E5F5] shadow-lg">
            <div className="text-3xl mb-2">🔍</div>
            <div className="text-2xl font-black text-[#7B1FA2]">{filteredBooks.length}</div>
            <div className="text-xs text-[#7B1FA2] font-bold">Hasil Filter</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355] w-5 h-5" />
            <input
              type="text"
              placeholder="Cari judul, deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-[#FFE0B2] rounded-xl font-bold focus:outline-none focus:border-[#FF7A00] transition-all"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
                sourceFilter === 'all'
                  ? 'bg-[#FF7A00] text-white shadow-lg'
                  : 'bg-white text-[#8B7355] border-2 border-[#FFE0B2] hover:bg-[#FFF5E5]'
              }`}
            >
              🌟 Semua Sumber
            </button>
            <button
              onClick={() => setSourceFilter('internal')}
              className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
                sourceFilter === 'internal'
                  ? 'bg-[#2E7D32] text-white shadow-lg'
                  : 'bg-white text-[#8B7355] border-2 border-[#E8F5E9] hover:bg-[#E8F5E9]'
              }`}
            >
              🏠 Internal
            </button>
            <button
              onClick={() => setSourceFilter('siswaroom')}
              className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
                sourceFilter === 'siswaroom'
                  ? 'bg-[#1565C0] text-white shadow-lg'
                  : 'bg-white text-[#8B7355] border-2 border-[#E3F2FD] hover:bg-[#E3F2FD]'
              }`}
            >
              🌐 SiswaRoom
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-[#FF7A00] text-white shadow-lg'
                    : 'bg-white text-[#8B7355] border-2 border-[#FFE0B2] hover:bg-[#FFF5E5]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-16 text-center border-4 border-[#FFE0B2] shadow-xl">
            <div className="text-8xl mb-6">📚</div>
            <h3 className="text-3xl font-black text-[#4A4A4A] mb-2">Tidak Ada Hasil</h3>
            <p className="text-[#8B7355] font-bold max-w-md mx-auto">
              Coba ubah filter pencarian Anda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl border-4 border-[#FFE0B2] shadow-lg overflow-hidden hover:-translate-y-2 transition-all duration-300 cursor-pointer relative"
                onClick={() => handleOpenBook(book)}
              >
                <div className={`absolute top-2 left-2 z-10 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-black shadow-lg ${
                  book.source === 'siswaroom' 
                    ? 'bg-[#1565C0] text-white' 
                    : 'bg-[#2E7D32] text-white'
                }`}>
                  {book.source === 'siswaroom' ? (
                    <>
                      <ExternalLink className="w-3 h-3" />
                      SiswaRoom
                    </>
                  ) : (
                    <>
                      <Home className="w-3 h-3" />
                      Internal
                    </>
                  )}
                </div>

                <div className="aspect-[3/4] bg-[#FFF5E5] relative flex items-center justify-center">
                  {book.cover_image_url ? (
                    <Image
                      src={book.source === 'siswaroom' ? book.cover_image_url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${book.cover_image_url}`}
                      alt={book.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="text-6xl">
                      {book.source === 'siswaroom' ? '📝' : '📖'}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-black text-[#4A4A4A] line-clamp-2 mb-2">{book.title}</h3>
                  
                  {book.description && (
                    <p className="text-xs text-[#8B7355] line-clamp-2 mb-2">{book.description}</p>
                  )}

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {book.category && (
                      <span className="bg-[#E3F2FD] text-[#1565C0] px-2 py-1 rounded-lg text-xs font-black">
                        {book.category}
                      </span>
                    )}
                    {book.course_id && (
                      <span className="bg-[#FFF3E0] text-[#E65100] px-2 py-1 rounded-lg text-xs font-black">
                        Course #{book.course_id}
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadBook(book);
                    }}
                    className="w-full font-black rounded-xl py-2 flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#E66E00] text-white"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedBook(null)}>
          <div className="w-full max-w-2xl bg-[#FFF9F0] rounded-[2rem] border-8 border-[#FFE0B2] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative p-8">
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#8B7355] hover:text-[#D94D2B] hover:bg-[#FFF5E5] transition-all shadow-lg"
              >
                ✕
              </button>

              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black mb-4 ${
                selectedBook.source === 'siswaroom'
                  ? 'bg-[#E3F2FD] text-[#1565C0]'
                  : 'bg-[#E8F5E9] text-[#2E7D32]'
              }`}>
                {selectedBook.source === 'siswaroom' ? (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    Sumber: SiswaRoom
                  </>
                ) : (
                  <>
                    <Home className="w-4 h-4" />
                    Sumber: Internal
                  </>
                )}
              </div>

              <h2 className="text-3xl font-black text-[#4A4A4A] mb-4">{selectedBook.title}</h2>
              
              {selectedBook.description && (
                <p className="text-[#4A4A4A] font-medium mb-6 leading-relaxed">
                  {selectedBook.description}
                </p>
              )}

              <div className="flex flex-wrap gap-3 mb-6">
                {selectedBook.category && (
                  <span className="bg-[#E3F2FD] text-[#1565C0] px-4 py-2 rounded-xl text-sm font-black">
                    📚 {selectedBook.category}
                  </span>
                )}
                {selectedBook.course_id && (
                  <span className="bg-[#FFF3E0] text-[#E65100] px-4 py-2 rounded-xl text-sm font-black">
                    🎓 Course #{selectedBook.course_id}
                  </span>
                )}
                {selectedBook.author && (
                  <span className="bg-[#F3E5F5] text-[#7B1FA2] px-4 py-2 rounded-xl text-sm font-black">
                    ✍️ {selectedBook.author}
                  </span>
                )}
              </div>

              <Button
                onClick={() => handleDownloadBook(selectedBook)}
                className="w-full font-black rounded-xl py-4 text-lg flex items-center justify-center gap-3 shadow-lg bg-[#FF7A00] hover:bg-[#E66E00] text-white"
              >
                <Download className="w-5 h-5" />
                Download & Baca PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
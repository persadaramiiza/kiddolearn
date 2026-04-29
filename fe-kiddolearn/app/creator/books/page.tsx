'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { booksService, Book, CreateBookFormData } from '@/lib/books';
import { Button } from '@/components/ui';
import { LoadingPage } from '@/components/ui/Loading';
import { ArrowLeft, X, BookOpen, Upload, FileText, Image as ImageIcon, Eye } from 'lucide-react';
import Image from 'next/image';

export default function CreatorBooksPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [showAddBook, setShowAddBook] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [minAge, setMinAge] = useState(5);
  const [maxAge, setMaxAge] = useState(12);
  const [pageCount, setPageCount] = useState(0);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user && user.role !== 'creator' && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) {
      loadBooks();
    }
  }, [user]);

  const loadBooks = async () => {
    try {
      const data = await booksService.getMyBooks();
      // Only show internal books (creator's own books)
      const internalBooks = data.filter(book => book.source === 'internal');
      setBooks(internalBooks);
    } catch (error) {
      console.error('Error loading books:', error);
      setBooks([]);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('File harus berformat PDF');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setError('Ukuran file PDF maksimal 50MB');
        return;
      }
      setPdfFile(file);
      setPdfPreview(file.name);
      setError('');
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Cover harus berformat JPG, PNG, atau WEBP');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran cover maksimal 5MB');
        return;
      }
      setCoverFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAuthor('');
    setCategory('');
    setMinAge(5);
    setMaxAge(12);
    setPageCount(0);
    setPdfFile(null);
    setCoverFile(null);
    setPdfPreview('');
    setCoverPreview('');
    setError('');
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      if (!pdfFile && !editingBook) {
        setError('File PDF harus diupload');
        setIsSubmitting(false);
        return;
      }

      if (editingBook) {
        if (typeof editingBook.id !== 'number') {
          setError('Tidak dapat mengedit buku eksternal');
          setIsSubmitting(false);
          return;
        }

        await booksService.update(editingBook.id as number, {
          title,
          description,
          author,
          category,
          min_age: minAge,
          max_age: maxAge,
          page_count: pageCount || 0,
        });
      } else {
        const formData: CreateBookFormData = {
          title,
          description,
          author,
          category,
          min_age: minAge,
          max_age: maxAge,
          page_count: pageCount || 0,
          pdf: pdfFile!,
          cover: coverFile || undefined,
        };

        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(interval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        await booksService.uploadBook(formData);
        
        clearInterval(interval);
        setUploadProgress(100);
      }
      
      setShowAddBook(false);
      resetForm();
      setEditingBook(null);
      loadBooks();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gagal menyimpan buku');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (book: Book) => {
    if (typeof book.id !== 'number') {
      alert('Tidak dapat mengedit buku eksternal');
      return;
    }

    setEditingBook(book);
    setTitle(book.title);
    setDescription(book.description || '');
    setAuthor(book.author || '');
    setCategory(book.category || '');
    setMinAge(book.min_age);
    setMaxAge(book.max_age);
    setPageCount(book.page_count || 0);
    setCoverPreview(book.cover_image_url || '');
    setPdfPreview('File PDF sudah ada');
    setShowAddBook(true);
  };

  const handlePublish = async (id: number | string) => {
    if (typeof id !== 'number') {
      alert('Tidak dapat mempublish buku eksternal');
      return;
    }

    try {
      await booksService.publish(id as number);
      loadBooks();
    } catch (error) {
      console.error('Error publishing book:', error);
      alert('Gagal publish buku');
    }
  };

  const handleArchive = async (id: number | string) => {
    if (typeof id !== 'number') {
      alert('Tidak dapat mengarsip buku eksternal');
      return;
    }

    try {
      await booksService.archive(id as number);
      loadBooks();
    } catch (error) {
      console.error('Error archiving book:', error);
      alert('Gagal archive buku');
    }
  };

  const handleDelete = async (id: number | string) => {
    if (typeof id !== 'number') {
      alert('Tidak dapat menghapus buku eksternal');
      return;
    }

    if (confirm('Yakin ingin menghapus buku ini?')) {
      try {
        await booksService.delete(id as number);
        loadBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Gagal hapus buku');
      }
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return null;
  }

  const publishedCount = books.filter(b => b.status === 'published').length;
  const draftCount = books.filter(b => b.status === 'draft').length;
  const totalReads = books.reduce((acc, b) => acc + b.read_count, 0);

  return (
    <div className="min-h-screen bg-[#FFF9F0] font-sans text-[#4A4A4A]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b-2 border-[#FFE0B2] shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/creator')}
              className="flex items-center gap-2 text-[#8B7355] hover:text-[#FF7A00] transition-colors group font-bold"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <div className="h-6 w-px bg-[#FFE0B2]"></div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-[#FF7A00]" />
              <h1 className="text-xl font-black text-[#D94D2B]">Kelola Buku PDF</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Buku', value: books.length, icon: '📚', bg: 'bg-purple-50' },
            { label: 'Published', value: publishedCount, icon: '✅', bg: 'bg-green-50' },
            { label: 'Draft', value: draftCount, icon: '📝', bg: 'bg-orange-50' },
            { label: 'Total Dibaca', value: totalReads.toLocaleString(), icon: '👁', bg: 'bg-blue-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-6 border-4 border-[#FFE0B2] shadow-xl relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full -translate-y-1/2 translate-x-1/2 opacity-50`}></div>
              <div className="relative z-10">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-black text-[#4A4A4A] mb-1">{stat.value}</div>
                <div className="text-[#8B7355] font-bold text-sm uppercase">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Book Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-[#4A4A4A] mb-1">Buku Saya</h2>
            <p className="text-[#8B7355] font-bold">Upload dan kelola koleksi buku PDF Anda</p>
          </div>
          <Button
            onClick={() => {
              setEditingBook(null);
              resetForm();
              setShowAddBook(true);
            }}
            className="bg-[#FF7A00] hover:bg-[#E66E00] text-white font-black rounded-full px-6 py-6 shadow-lg"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Buku
          </Button>
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-16 text-center border-4 border-[#FFE0B2] shadow-xl">
            <div className="text-8xl mb-6">📚</div>
            <h3 className="text-3xl font-black text-[#4A4A4A] mb-2">Belum Ada Buku</h3>
            <p className="text-[#8B7355] font-bold max-w-md mx-auto mb-8">
              Klik &quot;Upload Buku&quot; untuk mulai upload buku PDF edukatif Anda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl border-4 border-[#FFE0B2] shadow-lg overflow-hidden hover:-translate-y-2 transition-all duration-300"
              >
                {/* Cover */}
                <div className="aspect-[3/4] bg-[#FFF5E5] relative">
                  {book.cover_image_url ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${book.cover_image_url}`}
                      alt={book.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      📖
                    </div>
                  )}
                  
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black border-2 ${
                      book.status === 'published'
                        ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]'
                        : book.status === 'draft'
                        ? 'bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]'
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}>
                      {book.status}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2 bg-white/95 px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Eye className="w-3 h-3 text-[#8B7355]" />
                    <span className="text-xs font-black text-[#4A4A4A]">{book.read_count}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-black text-[#4A4A4A] line-clamp-2 mb-2">{book.title}</h3>
                  
                  {book.author && (
                    <p className="text-xs text-[#8B7355] font-bold mb-2">oleh {book.author}</p>
                  )}

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {book.category && (
                      <span className="bg-[#E3F2FD] text-[#1565C0] px-2 py-1 rounded-lg text-xs font-black">
                        {book.category}
                      </span>
                    )}
                    <span className="bg-[#FFF3E0] text-[#E65100] px-2 py-1 rounded-lg text-xs font-black">
                      {book.min_age}-{book.max_age} th
                    </span>
                    {book.page_count > 0 && (
                      <span className="bg-[#F3E5F5] text-[#7B1FA2] px-2 py-1 rounded-lg text-xs font-black">
                        {book.page_count} hal
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {book.status === 'draft' && (
                      <button
                        onClick={() => handlePublish(book.id)}
                        className="flex-1 bg-[#E8F5E9] text-[#2E7D32] px-3 py-2 rounded-xl font-black hover:bg-[#C8E6C9] transition"
                        title="Publish"
                      >
                        ✓
                      </button>
                    )}
                    {book.status === 'published' && (
                      <button
                        onClick={() => handleArchive(book.id)}
                        className="flex-1 bg-[#FFF8E1] text-[#F57F17] px-3 py-2 rounded-xl font-black hover:bg-[#FFECB3] transition"
                        title="Archive"
                      >
                        📦
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(book)}
                      className="flex-1 bg-[#E3F2FD] text-[#1565C0] px-3 py-2 rounded-xl font-black hover:bg-[#BBDEFB] transition"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="flex-1 bg-[#FFEBEE] text-[#C62828] px-3 py-2 rounded-xl font-black hover:bg-[#FFCDD2] transition"
                      title="Hapus"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {showAddBook && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#FFF9F0] rounded-[2rem] border-8 border-[#FFE0B2] shadow-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-black text-[#4A4A4A]">
                {editingBook ? '✏️ Edit Buku' : '📚 Upload Buku Baru'}
              </h3>
              <button
                onClick={() => {
                  setShowAddBook(false);
                  setEditingBook(null);
                  resetForm();
                }}
                className="text-[#8B7355] hover:text-[#D94D2B] transition-colors"
              >
                <X size={32} strokeWidth={3} />
              </button>
            </div>

            {error && (
              <div className="bg-[#FFEBEE] border-2 border-[#EF5350] text-[#C62828] px-4 py-3 rounded-xl mb-6 font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* PDF Upload */}
              {!editingBook && (
                <div>
                  <label className="block text-sm font-black text-[#4A4A4A] mb-2">
                    Upload File PDF * (Max 50MB)
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#FFE0B2] rounded-xl cursor-pointer bg-[#FFF5E5] hover:bg-[#FFE0B2] transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className="w-10 h-10 text-[#FF7A00] mb-3" />
                      <p className="mb-2 text-sm font-bold text-[#8B7355]">
                        {pdfPreview || 'Klik untuk upload PDF'}
                      </p>
                      <p className="text-xs text-[#8B7355]/70">PDF (max 50MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,application/pdf"
                      onChange={handlePdfChange}
                      required={!editingBook}
                    />
                  </label>
                </div>
              )}

              {editingBook && pdfPreview && (
                <div className="bg-[#FFF5E5] border-2 border-[#FFE0B2] rounded-xl p-4">
                  <p className="text-sm font-bold text-[#8B7355] flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {pdfPreview}
                  </p>
                  <p className="text-xs text-[#8B7355]/70 mt-1">
                    💡 File PDF tidak bisa diubah. Untuk ganti PDF, hapus dan upload ulang.
                  </p>
                </div>
              )}

              {/* Cover Upload */}
              <div>
                <label className="block text-sm font-black text-[#4A4A4A] mb-2">
                  Upload Cover (Optional, Max 5MB)
                </label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#FFE0B2] rounded-xl cursor-pointer bg-[#FFF5E5] hover:bg-[#FFE0B2] transition-all">
                  {coverPreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={coverPreview.startsWith('data:') ? coverPreview : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${coverPreview}`}
                        alt="Cover preview"
                        fill
                        className="object-contain p-2"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-10 h-10 text-[#FF7A00] mb-3" />
                      <p className="text-sm font-bold text-[#8B7355]">
                        Klik untuk upload cover
                      </p>
                      <p className="text-xs text-[#8B7355]/70">JPG, PNG, WEBP (max 5MB)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleCoverChange}
                  />
                </label>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-black text-[#4A4A4A] mb-2">Judul Buku *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul buku"
                  required
                  className="w-full px-4 py-3 border-2 border-[#FFE0B2] rounded-xl font-bold focus:outline-none focus:border-[#FF7A00]"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-black text-[#4A4A4A] mb-2">Penulis</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Nama penulis"
                  className="w-full px-4 py-3 border-2 border-[#FFE0B2] rounded-xl font-bold focus:outline-none focus:border-[#FF7A00]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-black text-[#4A4A4A] mb-2">Deskripsi</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi singkat tentang buku"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-[#FFE0B2] rounded-xl font-bold focus:outline-none focus:border-[#FF7A00]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-black text-[#4A4A4A] mb-2">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#FFE0B2] rounded-xl font-bold focus:outline-none focus:border-[#FF7A00]"
                >
                  <option value="">Pilih kategori</option>
                  <option value="Matematika">📐 Matematika</option>
                  <option value="Sains">🔬 Sains</option>
                  <option value="Bahasa">📖 Bahasa</option>
                  <option value="Seni">🎨 Seni</option>
                  <option value="Musik">🎵 Musik</option>
                  <option value="Cerita">📚 Cerita</option>
                </select>
              </div>

              {/* Page Count */}
              <div>
                <label className="block text-sm font-black text-[#4A4A4A] mb-2">Jumlah Halaman</label>
                <input
                  type="number"
                  min="0"
                  value={pageCount}
                  onChange={(e) => setPageCount(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-4 py-3 border-2 border-[#FFE0B2] rounded-xl font-bold focus:outline-none focus:border-[#FF7A00]"
                />
              </div>

              {/* Age Range */}
              <div className="grid grid-cols-2 gap-6 bg-[#FFF5E5] p-4 rounded-2xl border-2 border-[#FFE0B2]">
                <div>
                  <label className="block text-sm font-black text-[#4A4A4A] mb-2">Usia Min</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="18"
                      value={minAge}
                      onChange={(e) => setMinAge(Number(e.target.value))}
                      className="flex-1 accent-[#FF7A00]"
                    />
                    <span className="w-12 text-center font-black text-[#FF7A00]">{minAge}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-black text-[#4A4A4A] mb-2">Usia Max</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="18"
                      value={maxAge}
                      onChange={(e) => setMaxAge(Number(e.target.value))}
                      className="flex-1 accent-[#FF7A00]"
                    />
                    <span className="w-12 text-center font-black text-[#FF7A00]">{maxAge}</span>
                  </div>
                </div>
              </div>

              {/* Upload Progress */}
              {isSubmitting && uploadProgress > 0 && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-[#4A4A4A]">Uploading...</span>
                    <span className="text-sm font-bold text-[#FF7A00]">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-[#FFE0B2] rounded-full h-3">
                    <div
                      className="bg-[#FF7A00] h-3 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowAddBook(false);
                    setEditingBook(null);
                    resetForm();
                  }}
                  className="flex-1 text-[#8B7355] font-black hover:bg-[#FFF5E5]"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#FF7A00] hover:bg-[#E66E00] text-white font-black"
                >
                  {isSubmitting ? 'Uploading...' : editingBook ? 'Update' : 'Upload Buku'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
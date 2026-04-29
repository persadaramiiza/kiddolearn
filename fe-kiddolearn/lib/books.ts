import api from './api';
import { siswaroomService, type SiswaroomLibraryItem } from './siswaroom';

export interface Creator {
  id: number;
  full_name: string;
  email: string;
}

export interface Book {
  id: number | string;
  title: string;
  description: string;
  pdf_url: string;
  cover_image_url?: string;
  author?: string;
  category: string;
  min_age: number;
  max_age: number;
  page_count: number;
  read_count: number;
  status: 'draft' | 'published' | 'archived';
  creator_id: number;
  creator: Creator;
  created_at: string;
  published_at?: string;
  source: 'internal' | 'siswaroom';
  course_id?: number;
}

export interface CreateBookFormData {
  title: string;
  description: string;
  author?: string;
  category: string;
  min_age: number;
  max_age: number;
  page_count?: number;
  pdf: File;
  cover?: File;
}

export type UpdateBookData = Partial<Omit<CreateBookFormData, 'pdf' | 'cover'>>;

const parseBookResponse = (data: any, source: 'internal' | 'siswaroom'): Book => {
  if (!data) {
    throw new Error('Invalid book data');
  }

  if (source === 'siswaroom') {
    // Parse SiswaRoom library item as book
    const fileUrl = data.file_url || '';
    const description = data.short_description || data.description || data.content || '';
    
    return {
      id: `siswa-${data.id}`,
      title: data.title || 'Untitled',
      description: description,
      pdf_url: fileUrl,
      cover_image_url: undefined,
      author: 'SiswaRoom',
      category: data.type || 'Umum',
      min_age: 5,
      max_age: 18,
      page_count: 0,
      read_count: 0,
      status: 'published',
      creator_id: 0,
      creator: { id: 0, full_name: 'SiswaRoom', email: '' },
      created_at: data.created_at || new Date().toISOString(),
      source: 'siswaroom',
      course_id: data.course_id,
    };
  }

  return {
    id: data.id,
    title: data.title || '',
    description: data.description || '',
    pdf_url: data.pdf_url || '',
    cover_image_url: data.cover_image_url,
    author: data.author,
    category: data.category || '',
    min_age: data.min_age || 0,
    max_age: data.max_age || 18,
    page_count: data.page_count || 0,
    read_count: data.read_count || 0,
    status: data.status || 'draft',
    creator_id: data.creator_id || 0,
    creator: data.creator || { id: 0, full_name: 'Unknown', email: '' },
    created_at: data.created_at || new Date().toISOString(),
    published_at: data.published_at,
    source: 'internal',
  };
};

class BooksService {
  // ==================== COMBINED: INTERNAL + SISWAROOM ====================
  async getAll(params?: {
    search?: string;
    category?: string;
    minAge?: number;
    maxAge?: number;
  }): Promise<Book[]> {
    try {
      console.log('📚 Fetching all books (internal + SiswaRoom)');

      let internalBooks: Book[] = [];
      try {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.category) queryParams.append('category', params.category);
        if (params?.minAge) queryParams.append('minAge', params.minAge.toString());
        if (params?.maxAge) queryParams.append('maxAge', params.maxAge.toString());

        const internalUrl = `/books${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const internalResponse = await api.get(internalUrl);
        
        internalBooks = (Array.isArray(internalResponse.data) ? internalResponse.data : [])
          .map(book => parseBookResponse(book, 'internal'));
        
        console.log(`✅ Fetched ${internalBooks.length} internal books`);
      } catch (error) {
        console.warn('⚠️ Internal API error:', error);
      }

      let siswaroomBooks: Book[] = [];
      try {
        const libraryItems = await siswaroomService.getLibrary();
        
        siswaroomBooks = libraryItems
          .filter(item => item.file_url && item.file_url.trim() !== '') // Only items with valid PDF files
          .map(item => parseBookResponse(item, 'siswaroom'));
        
        console.log(`✅ Fetched ${siswaroomBooks.length} SiswaRoom books`);
      } catch (error) {
        console.warn('⚠️ SiswaRoom API error:', error);
      }

      let allBooks = [...internalBooks, ...siswaroomBooks];

      // Client-side filtering for SiswaRoom books
      if (params?.search) {
        const query = params.search.toLowerCase();
        allBooks = allBooks.filter(book =>
          book.title.toLowerCase().includes(query) ||
          book.description?.toLowerCase().includes(query) ||
          book.author?.toLowerCase().includes(query)
        );
      }

      if (params?.category) {
        allBooks = allBooks.filter(book => book.category === params.category);
      }

      if (params?.minAge !== undefined) {
        allBooks = allBooks.filter(book => book.min_age >= params.minAge!);
      }

      if (params?.maxAge !== undefined) {
        allBooks = allBooks.filter(book => book.max_age <= params.maxAge!);
      }

      console.log(`📚 Total books: ${allBooks.length} (${internalBooks.length} internal + ${siswaroomBooks.length} SiswaRoom)`);
      return allBooks;
    } catch (error) {
      console.error('❌ Error in getAll:', error);
      throw error;
    }
  }

  async getById(id: number | string): Promise<Book> {
    try {
      if (typeof id === 'string' && id.startsWith('siswa-')) {
        console.log(`📖 Fetching SiswaRoom library item ${id}`);
        const originalId = parseInt(id.replace('siswa-', ''));
        
        const libraryItems = await siswaroomService.getLibrary();
        const item = libraryItems.find(item => item.id === originalId);
        
        if (!item) {
          throw new Error('Library item not found');
        }

        return parseBookResponse(item, 'siswaroom');
      }

      console.log(`📖 Fetching internal book ${id}`);
      const response = await api.get(`/books/${id}`);
      return parseBookResponse(response.data, 'internal');
    } catch (error) {
      console.error(`❌ Error fetching book ${id}:`, error);
      throw error;
    }
  }

  // ==================== INTERNAL BOOKS ONLY ====================
  async getMyBooks(): Promise<Book[]> {
    try {
      console.log('📚 Fetching my books');
      const response = await api.get('/books/my-books');
      const books = (Array.isArray(response.data) ? response.data : [])
        .map(book => parseBookResponse(book, 'internal'));
      console.log(`✅ Fetched ${books.length} books`);
      return books;
    } catch (error) {
      console.error('❌ Error fetching my books:', error);
      throw error;
    }
  }

  async uploadBook(formData: CreateBookFormData): Promise<Book> {
    try {
      console.log('📤 Uploading book:', formData.title);
      
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('author', formData.author || '');
      data.append('category', formData.category);
      data.append('min_age', formData.min_age.toString());
      data.append('max_age', formData.max_age.toString());
      data.append('page_count', (formData.page_count || 0).toString());
      data.append('pdf', formData.pdf);
      
      if (formData.cover) {
        data.append('cover', formData.cover);
      }

      const response = await api.post('/books/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Book uploaded successfully');
      return parseBookResponse(response.data, 'internal');
    } catch (error) {
      console.error('❌ Error uploading book:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateBookData): Promise<Book> {
    try {
      console.log(`📝 Updating book ${id}`);
      const response = await api.patch(`/books/${id}`, data);
      return parseBookResponse(response.data, 'internal');
    } catch (error) {
      console.error('❌ Error updating book:', error);
      throw error;
    }
  }

  async publish(id: number): Promise<Book> {
    try {
      console.log(`📤 Publishing book ${id}`);
      const response = await api.patch(`/books/${id}/publish`);
      return parseBookResponse(response.data, 'internal');
    } catch (error) {
      console.error('❌ Error publishing book:', error);
      throw error;
    }
  }

  async archive(id: number): Promise<Book> {
    try {
      console.log(`📦 Archiving book ${id}`);
      const response = await api.patch(`/books/${id}/archive`);
      return parseBookResponse(response.data, 'internal');
    } catch (error) {
      console.error('❌ Error archiving book:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      console.log(`🗑️ Deleting book ${id}`);
      await api.delete(`/books/${id}`);
    } catch (error) {
      console.error('❌ Error deleting book:', error);
      throw error;
    }
  }

  // ==================== NEW: DOWNLOAD BOOK (WORKS FOR BOTH SOURCES) ====================
  async downloadBook(book: Book): Promise<void> {
    try {
      if (book.source === 'siswaroom') {
        console.log(`📥 Downloading SiswaRoom file via proxy: ${book.title}`);
        
        const proxyUrl = `${process.env.NEXT_PUBLIC_API_URL}/books/download-external?url=${encodeURIComponent(book.pdf_url)}&filename=${encodeURIComponent(book.title + '.pdf')}`;
        
        const link = document.createElement('a');
        link.href = proxyUrl;
        link.download = `${book.title}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ SiswaRoom download started');
      } else {
        console.log(`📥 Downloading internal file: ${book.title}`);
        
        const fullUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${book.pdf_url}`;
        
        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = `${book.title}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ Internal download started');
      }
    } catch (error) {
      console.error('❌ Error downloading book:', error);
      throw error;
    }
  }
}

export const booksService = new BooksService();
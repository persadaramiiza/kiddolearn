import axios from 'axios';

const EXTERNAL_API_URL = process.env.NEXT_PUBLIC_LIBRARY_API_URL || 'https://api.example.com';

export interface LibraryItem {
  id: number | string;
  title: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  author?: string;
  url?: string;
  type?: 'book' | 'video' | 'article' | 'game';
  rating?: number;
  age_range?: string;
  published_year?: number;
  pages?: number;
}

export interface LibraryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  type?: string;
}

class LibraryService {
  private api = axios.create({
    baseURL: EXTERNAL_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });

  /**
   * Get library items (books only) from external API or mock data
   */
  async getLibraryItems(params?: LibraryParams): Promise<{
    data: LibraryItem[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      console.log('📚 Fetching library items:', params);
      
      // Try to fetch from external API
      const response = await this.api.get('/library', { params });
      
      // Filter to only books
      const books = (response.data.data || response.data || []).filter(
        (item: LibraryItem) => item.type === 'book'
      );
      
      return {
        data: books,
        total: books.length,
        page: response.data.page || params?.page || 1,
        limit: response.data.limit || params?.limit || 20,
      };
    } catch (error) {
      console.warn('⚠️ External API unavailable, using mock data:', error);
      
      // Return mock data for development
      return this.getMockBooks(params);
    }
  }

  /**
   * Get library item detail
   */
  async getLibraryItemById(id: string | number): Promise<LibraryItem> {
    try {
      console.log('📖 Fetching library item:', id);
      const response = await this.api.get(`/library/${id}`);
      return response.data;
    } catch (error) {
      console.warn('⚠️ External API unavailable for item detail');
      
      // Find from mock data
      const mockData = this.getMockBooks();
      const item = mockData.data.find(book => book.id === id);
      
      if (!item) {
        throw new Error('Book not found');
      }
      
      return item;
    }
  }

  /**
   * Mock books data for development (BOOKS ONLY)
   */
  private getMockBooks(params?: LibraryParams): {
    data: LibraryItem[];
    total: number;
    page: number;
    limit: number;
  } {
    const allBooks: LibraryItem[] = [
      {
        id: 1,
        title: 'Belajar Matematika Dasar',
        description: 'Panduan lengkap belajar matematika untuk anak usia 5-7 tahun. Dilengkapi dengan ilustrasi menarik dan latihan soal yang menyenangkan.',
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
        category: 'Matematika',
        author: 'Prof. Budi Santoso',
        url: 'https://example.com/book/matematika-dasar',
        type: 'book',
        rating: 4.5,
        age_range: '5-7 tahun',
        published_year: 2023,
        pages: 120,
      },
      {
        id: 2,
        title: 'Petualangan Si Kancil',
        description: 'Kumpulan cerita rakyat tentang kecerdikan Si Kancil yang menghibur sekaligus mendidik anak-anak tentang nilai-nilai moral.',
        thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        category: 'Cerita',
        author: 'Ibu Siti Rahmawati',
        url: 'https://example.com/book/kancil',
        type: 'book',
        rating: 4.8,
        age_range: '5-10 tahun',
        published_year: 2022,
        pages: 80,
      },
      {
        id: 3,
        title: 'Sains untuk Anak: Tata Surya',
        description: 'Buku sains yang menjelaskan tentang tata surya dengan bahasa sederhana dan gambar yang mudah dipahami anak.',
        thumbnail: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400',
        category: 'Sains',
        author: 'Dr. Agus Wijaya',
        url: 'https://example.com/book/tata-surya',
        type: 'book',
        rating: 4.7,
        age_range: '7-12 tahun',
        published_year: 2023,
        pages: 150,
      },
      {
        id: 4,
        title: 'Belajar Bahasa Inggris Yuk!',
        description: 'Buku pembelajaran bahasa Inggris untuk pemula dengan metode fun dan interaktif. Cocok untuk anak SD.',
        thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400',
        category: 'Bahasa',
        author: 'Miss Sarah Johnson',
        url: 'https://example.com/book/english',
        type: 'book',
        rating: 4.6,
        age_range: '7-10 tahun',
        published_year: 2023,
        pages: 100,
      },
      {
        id: 5,
        title: 'Mengenal Hewan dan Habitatnya',
        description: 'Ensiklopedia mini tentang berbagai jenis hewan dan tempat tinggalnya. Lengkap dengan foto dan fakta menarik.',
        thumbnail: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400',
        category: 'Sains',
        author: 'Dr. Rina Kusuma',
        url: 'https://example.com/book/hewan',
        type: 'book',
        rating: 4.9,
        age_range: '6-12 tahun',
        published_year: 2022,
        pages: 200,
      },
      {
        id: 6,
        title: 'Dongeng Nusantara',
        description: 'Kumpulan dongeng dari berbagai daerah di Indonesia. Mengajarkan nilai budaya dan kearifan lokal.',
        thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        category: 'Cerita',
        author: 'Pak Joko Widodo',
        url: 'https://example.com/book/dongeng',
        type: 'book',
        rating: 4.7,
        age_range: '5-10 tahun',
        published_year: 2023,
        pages: 180,
      },
      {
        id: 7,
        title: 'Ayo Menggambar!',
        description: 'Buku panduan menggambar untuk anak dengan teknik sederhana dan fun. Lengkap dengan template untuk dipraktikkan.',
        thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
        category: 'Seni',
        author: 'Kak Dina Mariana',
        url: 'https://example.com/book/menggambar',
        type: 'book',
        rating: 4.5,
        age_range: '5-12 tahun',
        published_year: 2023,
        pages: 90,
      },
      {
        id: 8,
        title: 'Perkalian & Pembagian Mudah',
        description: 'Metode cepat dan mudah belajar perkalian dan pembagian dengan trik-trik matematika yang menyenangkan.',
        thumbnail: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=400',
        category: 'Matematika',
        author: 'Prof. Andi Surya',
        url: 'https://example.com/book/perkalian',
        type: 'book',
        rating: 4.8,
        age_range: '8-12 tahun',
        published_year: 2022,
        pages: 110,
      },
      {
        id: 9,
        title: 'Eksperimen Sains Seru',
        description: 'Buku berisi 50+ eksperimen sains sederhana yang bisa dilakukan di rumah dengan bahan-bahan mudah didapat.',
        thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
        category: 'Sains',
        author: 'Dr. Lisa Wijaya',
        url: 'https://example.com/book/eksperimen',
        type: 'book',
        rating: 4.9,
        age_range: '8-14 tahun',
        published_year: 2023,
        pages: 160,
      },
      {
        id: 10,
        title: 'Legenda Malin Kundang',
        description: 'Cerita klasik tentang Malin Kundang yang mengajarkan pentingnya berbakti kepada orang tua.',
        thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        category: 'Cerita',
        author: 'Nenek Suri',
        url: 'https://example.com/book/malin-kundang',
        type: 'book',
        rating: 4.6,
        age_range: '6-12 tahun',
        published_year: 2022,
        pages: 60,
      },
      {
        id: 11,
        title: 'Belajar Musik untuk Anak',
        description: 'Pengenalan dasar-dasar musik, not balok, dan alat musik dengan cara yang menyenangkan.',
        thumbnail: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400',
        category: 'Musik',
        author: 'Maestro Ahmad',
        url: 'https://example.com/book/musik',
        type: 'book',
        rating: 4.4,
        age_range: '7-14 tahun',
        published_year: 2023,
        pages: 130,
      },
      {
        id: 12,
        title: 'Atlas Indonesia untuk Anak',
        description: 'Mengenal provinsi, suku, budaya, dan keunikan setiap daerah di Indonesia dengan peta dan ilustrasi menarik.',
        thumbnail: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400',
        category: 'Sains',
        author: 'Tim Geografi',
        url: 'https://example.com/book/atlas',
        type: 'book',
        rating: 4.7,
        age_range: '8-14 tahun',
        published_year: 2022,
        pages: 220,
      },
    ];

    // Apply filters
    let filtered = allBooks;

    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(
        book =>
          book.title.toLowerCase().includes(search) ||
          book.description?.toLowerCase().includes(search) ||
          book.author?.toLowerCase().includes(search)
      );
    }

    if (params?.category) {
      filtered = filtered.filter(book => book.category === params.category);
    }

    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    return {
      data: paginated,
      total: filtered.length,
      page,
      limit,
    };
  }
}

export const libraryService = new LibraryService();
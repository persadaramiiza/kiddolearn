import api from './api';

/**
 * Interface untuk Siswaroom Integration
 * Skema 5.a: Menampilkan video pada setiap materi untuk setiap akun Siswaroom
 */

// ==================== EXISTING INTERFACES (Direct API) ====================
export interface SiswaroomLibraryItem {
  id: number;
  title: string;
  type: string;
  short_description?: string;
  course_id: number;
  file_url: string;
  created_at: string;
}

export interface SiswaroomResponse {
  data: SiswaroomLibraryItem[];
  message?: string;
  success?: boolean;
}

// ==================== NEW INTERFACES (Via Backend) ====================
export interface SiswaroomAccount {
  id: number;
  siswaroom_user_id: number;
  siswaroom_email: string;
  siswaroom_name: string;
  is_active: boolean;
  created_at: string;
}

export interface SiswaroomCourse {
  id: number;
  title: string;
  description: string;
  thumbnail_url?: string;
  instructor_id: number;
  created_at: string;
  updated_at: string;
}

export interface SiswaroomMaterial {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  video_url?: string;
  file_url?: string; 
  content?: string;
  order: number;
  duration_minutes?: number;
  course?: SiswaroomCourse;
  created_at: string;
  updated_at: string;
}

export interface SiswaroomVideoItem {
  id: number;
  material_id: number;
  material_title: string;
  course_id: number;
  course_title: string;
  video_url: string;
  description?: string;
  duration_minutes?: number;
  source: 'siswaroom';
}

export interface SiswaroomAccountWithMaterials {
  account_id: number;
  siswaroom_user_id: number;
  siswaroom_email: string;
  siswaroom_name: string;
  materials: SiswaroomMaterial[];
  videos: SiswaroomVideoItem[];
}

export interface ConnectSiswaroomData {
  siswaroom_user_id: number;
  siswaroom_email: string;
  siswaroom_name?: string;
}

export interface SiswaroomUser {
  id: number;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

// ==================== STATISTICS INTERFACES (Skema 2.a) ====================
export interface SiswaroomQuizAttempt {
  id: number;
  quiz_id: number;
  user_id: number;
  score: number;
  total_questions: number;
  correct_answers: number;
  started_at: string;
  finished_at?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  quiz?: {
    id: number;
    title: string;
    course_id: number;
  };
}

export interface StudentStatistics {
  user: SiswaroomUser;
  courses_enrolled: number;
  quiz_attempts: number;
  average_score: number;
  total_correct_answers: number;
  total_questions_attempted: number;
  completed_quizzes: number;
  recent_attempts: SiswaroomQuizAttempt[];
  education_level: 'SD' | 'SMP' | 'SMA' | 'Unknown';
}

export interface StatisticsSummary {
  total_students: number;
  smp_students: number;
  sma_students: number;
  sd_students: number;
  average_score_all: number;
  total_quiz_attempts: number;
  students: StudentStatistics[];
}

// ==================== SERVICE ====================
export const siswaroomService = {
  /**
   * Auto connect berdasarkan email yang sama
   */
  async autoConnect(): Promise<{ connected: boolean; account?: SiswaroomAccount; message?: string }> {
    console.log('🔄 Auto-connecting Siswaroom...');
    const response = await api.get<{ connected: boolean; account?: SiswaroomAccount; message?: string }>('/siswaroom/auto-connect');
    console.log('✅ Auto-connect result:', response.data);
    return response.data;
  },

  async getAllMaterialsFromAccounts(): Promise<SiswaroomAccountWithMaterials[]> {
    try {
      console.log('📚 Fetching all materials from Siswaroom accounts...');
      const response = await api.get<SiswaroomAccountWithMaterials[]>('/siswaroom/materials-all');
      console.log(`✅ Fetched materials from ${response.data.length} accounts`);
      return response.data;
    } catch (error) {
      console.warn('⚠️ Error fetching Siswaroom materials:', error);
      return [];
    }
  },

  /**
   * GET library items (buku) dari Siswaroom API /library
   */
  async getLibrary(): Promise<SiswaroomLibraryItem[]> {
    try {
      console.log('📚 Fetching Siswaroom library...');
      const response = await api.get<SiswaroomLibraryItem[]>('/siswaroom/library');
      const items = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ Fetched ${items.length} library items from Siswaroom`);
      return items;
    } catch (error) {
      console.warn('⚠️ Error fetching Siswaroom library:', error);
      return [];
    }
  },

  /**
   * Get list users Siswaroom
   */
  async getSiswaroomUsers(): Promise<SiswaroomUser[]> {
    console.log('👥 Fetching Siswaroom users...');
    const response = await api.get<SiswaroomUser[]>('/siswaroom/users');
    console.log(`✅ Found ${response.data.length} Siswaroom users`);
    return response.data;
  },

  /**
   * Connect akun Siswaroom dengan akun Edutoon
   */
  async connectAccount(data: ConnectSiswaroomData): Promise<SiswaroomAccount> {
    console.log('🔗 Connecting Siswaroom account...');
    const response = await api.post<SiswaroomAccount>('/siswaroom/connect', data);
    console.log('✅ Siswaroom account connected:', response.data);
    return response.data;
  },

  /**
   * Get semua akun Siswaroom yang terhubung
   */
  async getConnectedAccounts(): Promise<SiswaroomAccount[]> {
    console.log('📋 Fetching connected Siswaroom accounts...');
    const response = await api.get<SiswaroomAccount[]>('/siswaroom/accounts');
    console.log(`✅ Found ${response.data.length} connected accounts`);
    return response.data;
  },

  /**
   * Disconnect akun Siswaroom
   */
  async disconnectAccount(accountId: number): Promise<void> {
    console.log(`🔓 Disconnecting Siswaroom account: ${accountId}`);
    await api.delete(`/siswaroom/accounts/${accountId}`);
    console.log('✅ Account disconnected');
  },

  /**
   * GET semua video dari semua akun Siswaroom
   * Skema 5.a: Tampilin setiap video pada setiap materi untuk setiap akun
   */
  async getAllVideos(): Promise<SiswaroomAccountWithMaterials[]> {
    console.log('🎬 Fetching all Siswaroom videos...');
    const response = await api.get<SiswaroomAccountWithMaterials[]>('/siswaroom/videos');
    console.log(`✅ Fetched videos from ${response.data.length} accounts`);
    return response.data;
  },

  /**
   * GET materials untuk akun Siswaroom tertentu
   */
  async getMaterialsForAccount(
    accountId: number,
    courseId?: number
  ): Promise<SiswaroomMaterial[]> {
    console.log(`📚 Fetching materials for account ${accountId}...`);
    const params = courseId ? `?courseId=${courseId}` : '';
    const response = await api.get<SiswaroomMaterial[]>(
      `/siswaroom/accounts/${accountId}/materials${params}`
    );
    console.log(`✅ Fetched ${response.data.length} materials`);
    return response.data;
  },

  /**
   * GET courses untuk akun Siswaroom tertentu
   */
  async getCoursesForAccount(accountId: number): Promise<SiswaroomCourse[]> {
    console.log(`📖 Fetching courses for account ${accountId}...`);
    const response = await api.get<SiswaroomCourse[]>(
      `/siswaroom/accounts/${accountId}/courses`
    );
    console.log(`✅ Fetched ${response.data.length} courses`);
    return response.data;
  },

  /**
   * Flatten semua video dari semua akun menjadi satu array
   * Untuk tampilan yang lebih mudah
   */
  flattenAllVideos(
    accountsData: SiswaroomAccountWithMaterials[]
  ): (SiswaroomVideoItem & { account_email: string; account_name: string })[] {
    return accountsData.flatMap((account) =>
      account.videos.map((video) => ({
        ...video,
        account_email: account.siswaroom_email,
        account_name: account.siswaroom_name,
      }))
    );
  },

  // ==================== STATISTICS METHODS (Skema 2.a) ====================

  /**
   * GET statistik siswa SMP/SMA dari Siswaroom
   * Skema 2.a: Mengambil statistik anak SMP/SMA
   */
  async getStatistics(level?: 'SMP' | 'SMA'): Promise<StatisticsSummary> {
    console.log(`📊 Fetching student statistics${level ? ` for ${level}` : ''}...`);
    const params = level ? { level } : {};
    const response = await api.get<StatisticsSummary>('/siswaroom/statistics', { params });
    console.log(`✅ Fetched statistics for ${response.data.total_students} students`);
    return response.data;
  },

  /**
   * GET detail statistik untuk satu siswa
   */
  async getStudentStatistics(studentId: number): Promise<StudentStatistics> {
    console.log(`📊 Fetching statistics for student ${studentId}...`);
    const response = await api.get<StudentStatistics>(`/siswaroom/statistics/${studentId}`);
    console.log(`✅ Fetched statistics for ${response.data.user.full_name}`);
    return response.data;
  },
};

export default siswaroomService;
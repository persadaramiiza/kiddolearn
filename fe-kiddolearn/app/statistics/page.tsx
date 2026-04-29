'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { siswaroomService, StatisticsSummary, StudentStatistics } from '@/lib/siswaroom';
import { Button } from '@/components/ui';
import { 
  ArrowLeft, 
  Users, 
  Trophy, 
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';

export default function StatisticsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [statistics, setStatistics] = useState<StatisticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStudent, setExpandedStudent] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && (user.role === 'parent' || user.role === 'admin')) {
      loadStatistics();
    }
  }, [user, authLoading]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await siswaroomService.getStatistics();
      setStatistics(data);
    } catch (err: any) {
      console.error('Error loading statistics:', err);
      setError(err.response?.data?.message || 'Gagal mengambil statistik');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = statistics?.students.filter(student => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      student.user.full_name.toLowerCase().includes(query) ||
      student.user.email.toLowerCase().includes(query)
    );
  }) || [];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F0]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📊</div>
          <div className="animate-pulse text-2xl font-black text-[#FF7A00]">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'parent' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F0]">
        <div className="text-center">
          <div className="text-8xl mb-6">🔒</div>
          <h2 className="text-3xl font-black text-[#4A4A4A] mb-2">Akses Ditolak</h2>
          <p className="text-[#8B7355] mb-6">Halaman ini hanya untuk Parent atau Admin</p>
          <Button onClick={() => router.push('/dashboard')} className="bg-[#FF7A00] text-white">
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F0] to-[#FFE0B2]">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-[#FF7A00]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              className="bg-[#FFF5E5] text-[#FF7A00] hover:bg-[#FFE0B2] rounded-full p-2"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-black text-[#4A4A4A]">📊 Statistik Siswa</h1>
              <p className="text-sm text-[#8B7355] font-bold">Data dari SiswaRoom</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Summary Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-4 shadow-lg border-b-4 border-[#FF7A00]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FFF5E5] rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-[#FF7A00]" />
                </div>
                <div>
                  <p className="text-2xl font-black text-[#4A4A4A]">{statistics.total_students}</p>
                  <p className="text-xs font-bold text-[#8B7355]">Total Siswa</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-lg border-b-4 border-amber-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-black text-[#4A4A4A]">{statistics.average_score_all}%</p>
                  <p className="text-xs font-bold text-[#8B7355]">Rata-rata Skor</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-lg border-b-4 border-teal-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-2xl font-black text-[#4A4A4A]">{statistics.total_quiz_attempts}</p>
                  <p className="text-xs font-bold text-[#8B7355]">Total Percobaan</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8B7355]" />
              <input
                type="text"
                placeholder="Cari nama atau email siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#FFE0B2] focus:border-[#FF7A00] focus:outline-none font-bold text-[#4A4A4A]"
              />
            </div>

            {/* Refresh Button */}
            <Button
              onClick={loadStatistics}
              disabled={loading}
              className="bg-[#FF7A00] hover:bg-[#E66E00] text-white font-bold px-6 py-3 rounded-xl"
            >
              {loading ? '⏳ Loading...' : '🔄 Refresh'}
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6 text-center">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-red-600 font-bold">{error}</p>
            <Button onClick={loadStatistics} className="mt-4 bg-red-500 text-white">
              Coba Lagi
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <div className="text-6xl mb-4 animate-bounce">📊</div>
            <p className="text-xl font-black text-[#FF7A00] animate-pulse">
              Mengambil data dari SiswaRoom...
            </p>
          </div>
        )}

        {/* Students Table */}
        {!loading && statistics && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 border-b-2 border-[#FFE0B2]">
              <h2 className="text-xl font-black text-[#4A4A4A] flex items-center gap-2">
                <Users className="h-6 w-6 text-[#FF7A00]" />
                Daftar Siswa ({filteredStudents.length})
              </h2>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-[#8B7355] font-bold">Tidak ada siswa yang ditemukan</p>
              </div>
            ) : (
              <div className="divide-y divide-[#FFE0B2]">
                {filteredStudents.map((student) => (
                  <StudentRow
                    key={student.user.id}
                    student={student}
                    isExpanded={expandedStudent === student.user.id}
                    onToggle={() => setExpandedStudent(
                      expandedStudent === student.user.id ? null : student.user.id
                    )}
                    getScoreColor={getScoreColor}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Separated component for student row
function StudentRow({
  student,
  isExpanded,
  onToggle,
  getScoreColor,
}: {
  student: StudentStatistics;
  isExpanded: boolean;
  onToggle: () => void;
  getScoreColor: (score: number) => string;
}) {
  return (
    <div className="hover:bg-[#FFF9F0] transition-colors">
      {/* Main Row */}
      <div 
        className="p-4 flex items-center gap-4 cursor-pointer"
        onClick={onToggle}
      >
        {/* Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#FFB366] rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0">
          {student.user.full_name.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-[#4A4A4A] truncate">{student.user.full_name}</h3>
          <p className="text-sm text-[#8B7355] truncate">{student.user.email}</p>
        </div>

        {/* Score */}
        <div className={`px-4 py-2 rounded-xl text-center ${getScoreColor(student.average_score)}`}>
          <p className="text-lg font-black">{student.average_score}%</p>
          <p className="text-xs font-bold">Rata-rata</p>
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          <div className="text-center">
            <p className="font-black text-[#4A4A4A]">{student.quiz_attempts}</p>
            <p className="text-xs text-[#8B7355]">Percobaan</p>
          </div>
          <div className="text-center">
            <p className="font-black text-[#4A4A4A]">{student.completed_quizzes}</p>
            <p className="text-xs text-[#8B7355]">Selesai</p>
          </div>
          <div className="text-center">
            <p className="font-black text-green-600">{student.total_correct_answers}</p>
            <p className="text-xs text-[#8B7355]">Benar</p>
          </div>
        </div>

        {/* Expand Button */}
        <button className="p-2 hover:bg-[#FFE0B2] rounded-full transition-colors">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-[#8B7355]" />
          ) : (
            <ChevronDown className="h-5 w-5 text-[#8B7355]" />
          )}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 bg-[#FFF9F0]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-xl p-3 border border-[#FFE0B2]">
              <p className="text-xs text-[#8B7355] font-bold">Kursus Diikuti</p>
              <p className="text-xl font-black text-[#4A4A4A]">{student.courses_enrolled}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-[#FFE0B2]">
              <p className="text-xs text-[#8B7355] font-bold">Total Soal</p>
              <p className="text-xl font-black text-[#4A4A4A]">{student.total_questions_attempted}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-[#FFE0B2]">
              <p className="text-xs text-[#8B7355] font-bold">Jawaban Benar</p>
              <p className="text-xl font-black text-green-600">{student.total_correct_answers}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-[#FFE0B2]">
              <p className="text-xs text-[#8B7355] font-bold">Akurasi</p>
              <p className="text-xl font-black text-[#FF7A00]">
                {student.total_questions_attempted > 0 
                  ? Math.round((student.total_correct_answers / student.total_questions_attempted) * 100)
                  : 0}%
              </p>
            </div>
          </div>

          {/* Recent Attempts */}
          {student.recent_attempts.length > 0 && (
            <div>
              <h4 className="font-black text-[#4A4A4A] mb-2">📝 Percobaan Terakhir</h4>
              <div className="space-y-2">
                {student.recent_attempts.map((attempt) => (
                  <div 
                    key={attempt.id}
                    className="bg-white rounded-xl p-3 border border-[#FFE0B2] flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-[#4A4A4A]">
                        {attempt.quiz?.title || `Quiz #${attempt.quiz_id}`}
                      </p>
                      <p className="text-xs text-[#8B7355]">
                        {new Date(attempt.started_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        attempt.status === 'completed' 
                          ? 'bg-green-100 text-green-700'
                          : attempt.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {attempt.status === 'completed' ? '✅ Selesai' : 
                         attempt.status === 'in_progress' ? '⏳ Berlangsung' : '❌ Ditinggalkan'}
                      </span>
                      <div className={`px-3 py-1 rounded-lg ${getScoreColor(attempt.score)}`}>
                        <span className="font-black">{attempt.score}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

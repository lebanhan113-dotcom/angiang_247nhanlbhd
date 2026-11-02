import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  FileText, 
  UploadCloud, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Send, 
  RotateCcw, 
  Sliders, 
  Database, 
  Sparkles, 
  History, 
  TrendingUp, 
  Users, 
  Play, 
  X,
  FileCheck2,
  Calendar,
  Layers,
  Archive,
  RefreshCw,
  Settings2,
  Trash2,
  ExternalLink,
  Globe
} from 'lucide-react';
import { Exam, ExamSubmission, ExamStats, SupabaseConfig } from '../types/exam';
import { StorageService } from '../utils/storage';
import { CLOUD_LINKS, SupabaseSyncService } from '../utils/supabaseSync';
import { ExamReviewModal } from './ExamReviewModal';
import { WordImportModal } from './WordImportModal';
import { SupabaseConfigModal } from './SupabaseConfigModal';
import { SubmissionsView } from './SubmissionsView';
import { ExamInfoEditModal } from './ExamInfoEditModal';

interface TeacherPortalProps {
  exams: Exam[];
  submissions: ExamSubmission[];
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
  supabaseConfig: SupabaseConfig;
  onUpdateSupabaseConfig: (cfg: SupabaseConfig) => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  exams,
  submissions,
  isAuthenticated,
  onLogin,
  onLogout,
  supabaseConfig,
  onUpdateSupabaseConfig,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active view tab in teacher portal
  const [teacherTab, setTeacherTab] = useState<'exams' | 'submissions' | 'release_log'>('exams');

  // Filter for exam list
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_review' | 'approved' | 'published' | 'closed'>('all');

  // Modals
  const [reviewingExam, setReviewingExam] = useState<Exam | null>(null);
  const [editingExamInfo, setEditingExamInfo] = useState<Exam | null>(null);
  const [deletingExam, setDeletingExam] = useState<Exam | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  // Cloud sync states
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [cloudSyncMessage, setCloudSyncMessage] = useState<string | null>(null);

  const handleDirectCloudSync = async () => {
    setIsSyncingCloud(true);
    setCloudSyncMessage(null);
    try {
      const resExams = await SupabaseSyncService.syncExamsToCloud(exams, supabaseConfig);
      const resSubs = await SupabaseSyncService.syncSubmissionsToCloud(submissions, supabaseConfig);
      const nowStr = new Date().toLocaleTimeString('vi-VN');
      setCloudSyncMessage(
        `Đã tự động đồng bộ ${resExams.count} đề thi và ${resSubs.count} bài nộp lên Supabase Cloud (${CLOUD_LINKS.SUPABASE_PROJECT_ID}) lúc ${nowStr}!`
      );
      onUpdateSupabaseConfig({
        ...supabaseConfig,
        lastSyncedAt: new Date().toISOString(),
        isConnected: true,
      });
    } catch (e) {
      setCloudSyncMessage('Lỗi khi đồng bộ đám mây. Vui lòng kiểm tra kết nối.');
    } finally {
      setIsSyncingCloud(false);
    }
  };

  // Stats
  const stats = StorageService.getStats();

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '123123') {
      onLogin();
      setPinError('');
    } else {
      setPinError('Mật khẩu không chính xác. Vui lòng thử lại.');
    }
  };

  const handleTogglePublish = (exam: Exam) => {
    const isCurrentlyPublished = exam.status === 'published';
    const nextStatus = isCurrentlyPublished ? 'closed' : 'published';

    const updated: Exam = {
      ...exam,
      status: nextStatus,
      publishedAt: nextStatus === 'published' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : exam.publishedAt,
    };

    StorageService.updateExam(updated);
  };

  const handleToggleAnswersVisible = (exam: Exam) => {
    const nextVal = !exam.answersVisible;
    const confirmMsg = nextVal
      ? `Bật công bố đáp án cho "${exam.code}"? Học sinh dùng Mã tra cứu sẽ xem được toàn bộ đáp án và lời giải chi tiết.`
      : `Khóa công bố đáp án cho "${exam.code}"? Học sinh sẽ không thể xem lại bài làm chi tiết từ máy chủ.`;

    if (window.confirm(confirmMsg)) {
      StorageService.toggleAnswersVisibility(exam.id, nextVal);
    }
  };

  const handleCreateNewVersion = (exam: Exam) => {
    const curVerNum = parseFloat(exam.version.replace('v', '')) || 11.2;
    const nextVer = `v${(curVerNum + 0.1).toFixed(1)}`;

    const updated: Exam = {
      ...exam,
      version: nextVer,
      description: `${exam.description || ''} (Cập nhật phiên bản ${nextVer})`,
    };

    StorageService.updateExam(updated);
    alert(`Đã nâng cấp mã đề "${exam.code}" lên phiên bản ${nextVer}. Snapshot phiên bản cũ đã được bảo lưu.`);
  };

  const handlePublishAllApproved = () => {
    const approved = exams.filter((e) => e.status === 'approved');
    if (approved.length === 0) {
      alert('Không có đề thi nào đang ở trạng thái "Đã duyệt" để phát hành.');
      return;
    }

    approved.forEach((e) => {
      StorageService.updateExam({
        ...e,
        status: 'published',
        publishedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });
    });

    alert(`Đã phát hành đồng thời ${approved.length} đề thi đủ điều kiện lên Cổng học sinh!`);
  };

  const handleCreateNewExamTemplate = () => {
    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      code: `KT-HOA10-${Math.floor(Math.random() * 900 + 100)}`,
      title: 'Đề Kiểm Tra Định Kỳ - Hóa Học 10',
      subject: 'Hóa Học',
      grade: 'Lớp 10',
      durationMinutes: 45,
      version: 'v11.2',
      status: 'pending_review',
      answersVisible: false,
      semester: 'Giữa Học Kỳ I',
      academicYear: '2026 - 2027',
      creator: 'Thầy Lê Bá Nhẫn (Tổ Hóa Học)',
      reviewedBy: 'Tổ Chuyên Môn THPT Hòn Đất',
      totalScore: 10.0,
      description: 'Đề thi 3 phần chuẩn khảo thí THPT Hòn Đất',
      instructions: 'Thí sinh làm bài nghiêm túc, được sử dụng máy tính cầm tay theo danh mục Bộ GD&ĐT.',
      allowedAttempts: 1,
      shuffleOptions: false,
      sections: [
        {
          section: 1,
          title: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN',
          subtitle: 'Thí sinh làm các câu trắc nghiệm đơn.',
          totalPoints: 4.5,
          pointsPerQuestion: 0.25,
        },
        {
          section: 2,
          title: 'PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG - SAI',
          subtitle: 'Thí sinh chọn Đúng hoặc Sai cho mỗi ý.',
          totalPoints: 4.0,
          scoringRule: 'moet_true_false',
        },
        {
          section: 3,
          title: 'PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN',
          subtitle: 'Thí sinh điền kết quả dạng số.',
          totalPoints: 1.5,
          pointsPerQuestion: 0.375,
        },
      ],
      questions: [],
    };
    setEditingExamInfo(newExam);
  };

  const filteredExams = exams.filter((e) => {
    if (statusFilter === 'all') return true;
    return e.status === statusFilter;
  });

  const publishedExamsCount = exams.filter((e) => e.status === 'published').length;
  const pendingReviewCount = exams.filter((e) => e.status === 'pending_review').length;

  // 1. PIN AUTHENTICATION GATE
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 animate-fadeIn">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center space-y-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mx-auto border border-blue-200 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-blue-700" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Đăng Nhập Chế Độ Giáo Viên
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Nhập mật khẩu để truy cập khu vực quản trị khảo thí
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Mật khẩu:
              </label>
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full text-center tracking-widest text-lg font-mono font-bold px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none"
              />
              {pinError && (
                <p className="text-xs text-rose-600 font-semibold text-center">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-sm shadow-md transition"
            >
              Đăng Nhập
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED TEACHER DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Top Welcome and Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Kho Đề Thi
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {exams.length} <span className="text-xs font-normal text-slate-500">đề</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm bg-emerald-50/20">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            Đang Phát Hành
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {publishedExamsCount} <span className="text-xs font-normal text-slate-500">đề mở</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm bg-amber-50/20">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
            Chờ Duyệt
          </span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            {pendingReviewCount} <span className="text-xs font-normal text-slate-500">đề</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Lượt Truy Cập
          </span>
          <div className="text-2xl font-extrabold text-blue-900 mt-1">
            {stats.visitors} <span className="text-xs font-normal text-slate-500">lượt</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Lượt Bắt Đầu
          </span>
          <div className="text-2xl font-extrabold text-indigo-700 mt-1">
            {stats.participations} <span className="text-xs font-normal text-slate-500">lượt</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Bài Đã Nộp
          </span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            {submissions.length} <span className="text-xs font-normal text-slate-500">bài</span>
          </div>
        </div>
      </div>

      {/* Cloud Integration Hub Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-4 sm:p-5 text-white shadow-md border border-blue-900/40 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                SUPABASE CLOUD: {CLOUD_LINKS.SUPABASE_PROJECT_ID}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                • Tự động liên kết GitHub & Vercel
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              Cơ Sở Dữ Liệu Đám Mây & Triển Khai Trực Tuyến THPT Hòn Đất
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleDirectCloudSync}
              disabled={isSyncingCloud}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md disabled:opacity-50 flex items-center gap-1.5"
              title="Đồng bộ ngay đề thi và bài nộp lên Supabase Cloud wzcosdniivggetnkdhmn"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin' : ''}`} />
              <span>{isSyncingCloud ? 'Đang đồng bộ...' : 'Đồng Bộ Lên Supabase Cloud Ngay'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSupabaseModal(true)}
              className="px-3.5 py-2 bg-blue-900/60 hover:bg-blue-800 text-blue-200 font-semibold rounded-xl text-xs transition border border-blue-700/50 flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-blue-300" />
              <span>Cấu Hình & SQL</span>
            </button>
          </div>
        </div>

        {/* 3 Cloud destination links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
          <a
            href={CLOUD_LINKS.GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/80 hover:border-slate-500 transition group"
          >
            <div className="flex items-center gap-2 truncate">
              <svg className="w-4 h-4 fill-current text-white shrink-0" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="font-mono text-slate-200 truncate">lebanhan113-dotcom/247nhanlbonline</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0 ml-1" />
          </a>

          <a
            href={CLOUD_LINKS.VERCEL_DASHBOARD}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/80 hover:border-slate-500 transition group"
          >
            <div className="flex items-center gap-2 truncate">
              <svg className="w-4 h-4 fill-current text-white shrink-0" viewBox="0 0 24 24">
                <path d="M12 1L24 22H0L12 1Z" />
              </svg>
              <span className="font-mono text-slate-200 truncate">le-nhan/247nhanlbonline</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0 ml-1" />
          </a>

          <a
            href={CLOUD_LINKS.SUPABASE_DASHBOARD}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 bg-emerald-950/70 hover:bg-emerald-900/70 rounded-xl border border-emerald-600/40 hover:border-emerald-400 transition group"
          >
            <div className="flex items-center gap-2 truncate">
              <Database className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-mono text-emerald-200 truncate">Supabase: wzcosdniivggetnkdhmn</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-300 group-hover:text-white shrink-0 ml-1" />
          </a>
        </div>

        {cloudSyncMessage && (
          <div className="p-2.5 bg-emerald-950/80 rounded-xl border border-emerald-500/50 text-xs text-emerald-200 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{cloudSyncMessage}</span>
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTeacherTab('exams')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              teacherTab === 'exams'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Kho Đề & Duyệt Đề</span>
          </button>

          <button
            onClick={() => setTeacherTab('submissions')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              teacherTab === 'submissions'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Quản Lý Bài Nộp ({submissions.length})</span>
          </button>

          <button
            onClick={() => setTeacherTab('release_log')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              teacherTab === 'release_log'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Nhật Ký Phát Hành</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCreateNewExamTemplate}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
            title="Nhập thông tin đề thi mới và cấu hình quy chế"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nhập Thông Tin Đề Mới</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Nhập Đề Word/PDF</span>
          </button>

          <button
            onClick={handlePublishAllApproved}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
            title="Phát hành đồng loạt các đề đã được duyệt"
          >
            <Send className="w-4 h-4" />
            <span>Giao Tất Cả Đề Đủ ĐK</span>
          </button>

          <button
            onClick={() => setShowSupabaseModal(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition border border-slate-300"
            title="Mở cấu hình kết nối Supabase"
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Đồng Bộ Supabase</span>
          </button>
        </div>
      </div>

      {/* TAB 1: EXAM REPOSITORY & MANAGEMENT */}
      {teacherTab === 'exams' && (
        <div className="space-y-5">
          {/* Status filter bar */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-semibold mr-1">Trạng thái:</span>
              {[
                { id: 'all', label: `Tất cả (${exams.length})` },
                { id: 'published', label: `Đang phát hành (${publishedExamsCount})` },
                { id: 'approved', label: 'Đã duyệt' },
                { id: 'pending_review', label: `Chưa duyệt (${pendingReviewCount})` },
                { id: 'closed', label: 'Đã đóng' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id as any)}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    statusFilter === st.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <span className="text-slate-400 text-xs">
              Mỗi đề có exam_id và trạng thái độc lập
            </span>
          </div>

          {/* Exam Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredExams.map((exam) => {
              const isPublished = exam.status === 'published';
              const isPending = exam.status === 'pending_review';
              const p1 = exam.questions.filter((q) => q.section === 1).length;
              const p2 = exam.questions.filter((q) => q.section === 2).length;
              const p3 = exam.questions.filter((q) => q.section === 3).length;

              return (
                <div
                  key={exam.id}
                  className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition"
                >
                  {/* Card top */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                          {exam.code}
                        </span>
                        <span className="font-mono text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {exam.version}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base mt-2 line-clamp-1">
                        {exam.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 flex-wrap">
                        {exam.semester && (
                          <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded border border-blue-200 font-medium">
                            {exam.semester} ({exam.academicYear || '2026-2027'})
                          </span>
                        )}
                        {exam.creator && (
                          <span>• Ra đề: <strong className="text-slate-700">{exam.creator}</strong></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {exam.description || 'Đề thi trắc nghiệm khách quan 3 phần'}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0 text-right">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-md border inline-block ${
                          isPublished
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : isPending
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        {isPublished
                          ? 'Đang phát hành'
                          : isPending
                          ? 'Chưa duyệt'
                          : exam.status === 'approved'
                          ? 'Đã duyệt'
                          : 'Đã đóng'}
                      </span>
                      {exam.publishedAt && isPublished && (
                        <span className="text-[10px] text-slate-400 block mt-1">
                          Từ: {exam.publishedAt}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Section Breakdown and Duration */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-center text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Phần I</span>
                      <span className="font-bold text-slate-800">{p1} câu TN</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Phần II</span>
                      <span className="font-bold text-slate-800">{p2} câu Đ/S</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Phần III</span>
                      <span className="font-bold text-slate-800">{p3} câu ngắn</span>
                    </div>
                  </div>

                  {/* Security Control: Answers Visibility Switch */}
                  <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-blue-950 flex items-center gap-1.5">
                        {exam.answersVisible ? (
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        <span>Công bố đáp án (answers_visible)</span>
                      </div>
                      <span className="text-[11px] text-blue-800/80">
                        {exam.answersVisible
                          ? 'Học sinh tra cứu được xem đáp án & lời giải'
                          : 'Đang khóa (học sinh nộp chỉ nhận biên lai)'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleAnswersVisible(exam)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                        exam.answersVisible
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                      }`}
                    >
                      {exam.answersVisible ? 'ĐANG MỞ' : 'ĐANG TẮT'}
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => setEditingExamInfo(exam)}
                        className="px-3 py-2 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 font-bold rounded-xl text-xs transition flex items-center gap-1 border border-slate-200"
                        title="Chỉnh sửa thông tin, tiêu đề, mã đề, học kỳ, giáo viên ra đề"
                      >
                        <Settings2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Sửa Thông Tin Đề</span>
                      </button>

                      <button
                        onClick={() => setReviewingExam(exam)}
                        className="px-3 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Duyệt Đề & Biểu Điểm</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCreateNewVersion(exam)}
                        className="px-2.5 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl text-xs font-semibold transition"
                        title="Tăng version và lưu snapshot phiên bản cũ"
                      >
                        + Version
                      </button>

                      <button
                        onClick={() => handleTogglePublish(exam)}
                        className={`px-4 py-2 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm ${
                          isPublished
                            ? 'bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {isPublished ? (
                          <>
                            <Archive className="w-3.5 h-3.5" />
                            <span>Đóng Đề</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Phát Hành</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setDeletingExam(exam)}
                        className="p-2 text-rose-600 hover:text-white hover:bg-rose-600 rounded-xl text-xs font-semibold transition border border-rose-200 hover:border-rose-600 shadow-sm"
                        title="Xóa đề thi khỏi kho quản trị"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SUBMISSIONS & GRADEBOOK */}
      {teacherTab === 'submissions' && (
        <SubmissionsView submissions={submissions} exams={exams} />
      )}

      {/* TAB 3: RELEASE LOG (Phụ lục A) */}
      {teacherTab === 'release_log' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">
              Nhật Ký Phát Hành & Phiên Bản (Phụ Lục A - Sổ Tay V11.2)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ghi nhận phiên bản ứng dụng, các đề thi đã phát hành và người duyệt đề
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Ngày / Giờ</th>
                  <th className="py-2.5 px-4">App Version</th>
                  <th className="py-2.5 px-4">Mã Đề / Phiên bản</th>
                  <th className="py-2.5 px-4">Người Duyệt</th>
                  <th className="py-2.5 px-4">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 text-slate-600">2026-11-01 08:00</td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">V11.2</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    Nguon GK1 Hoa 10-001 (v11.2)
                  </td>
                  <td className="py-3 px-4 text-slate-700">Thầy Lê Bá Nhẫn</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[11px]">
                      Đã phát hành
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-600">2026-11-01 08:30</td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">V11.2</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    Nguon HK1 Hoa 10-002 (v11.2)
                  </td>
                  <td className="py-3 px-4 text-slate-700">Tổ Chuyên Môn Hóa</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[11px]">
                      Đã phát hành
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingExam && (
        <ExamReviewModal
          exam={reviewingExam}
          onClose={() => setReviewingExam(null)}
          onSave={(updated, shouldPublish) => {
            StorageService.updateExam(updated);
            setReviewingExam(null);
            alert(
              shouldPublish
                ? `Đề "${updated.code}" đã được duyệt và phát hành thành công!`
                : `Đề "${updated.code}" đã được lưu ở trạng thái ĐÃ DUYỆT.`
            );
          }}
        />
      )}

      {/* Edit Exam Information Modal */}
      {editingExamInfo && (
        <ExamInfoEditModal
          exam={editingExamInfo}
          onClose={() => setEditingExamInfo(null)}
          onSave={(updated) => {
            StorageService.updateExam(updated);
            setEditingExamInfo(null);
            alert(`Đã lưu thông tin đề thi "${updated.title}" (${updated.code}) thành công!`);
          }}
        />
      )}

      {/* Word / PDF Import Modal */}
      {showImportModal && (
        <WordImportModal
          onClose={() => setShowImportModal(false)}
          onImportComplete={(newExam) => {
            StorageService.updateExam(newExam);
            setShowImportModal(false);
            // Immediately transition to review modal as specified in BƯỚC 09 & CÂU LỆNH 07!
            setReviewingExam(newExam);
          }}
        />
      )}

      {/* Supabase Config Modal */}
      {showSupabaseModal && (
        <SupabaseConfigModal
          config={supabaseConfig}
          onClose={() => setShowSupabaseModal(false)}
          onSave={(cfg) => {
            onUpdateSupabaseConfig(cfg);
          }}
        />
      )}

      {/* Delete Exam Confirmation Modal */}
      {deletingExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Xác nhận xóa đề thi?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hành động này sẽ xóa đề thi khỏi kho quản trị
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block">Tên đề thi:</span>
                <span className="font-bold text-slate-900 text-sm">{deletingExam.title}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">Mã đề:</span>
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {deletingExam.code}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trạng thái:</span>
                <span className="font-bold text-slate-800">
                  {deletingExam.status === 'published' ? 'Đang phát hành' : deletingExam.status === 'pending_review' ? 'Chưa duyệt' : 'Đã duyệt / Đóng'}
                </span>
              </div>

              {deletingExam.status === 'published' && (
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-medium">
                  ⚠️ Lưu ý: Đề thi đang mở phát hành. Sau khi xóa, học sinh sẽ không còn thấy đề thi này trên Cổng thí sinh.
                </div>
              )}

              {submissions.filter((s) => s.examId === deletingExam.id).length > 0 && (
                <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 font-medium">
                  ⚠️ Cảnh báo: Hiện có {submissions.filter((s) => s.examId === deletingExam.id).length} bài nộp của học sinh gắn liền với mã đề này.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingExam(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  StorageService.deleteExam(deletingExam.id);
                  setDeletingExam(null);
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xác Nhận Xóa Đề Thi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

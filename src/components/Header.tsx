import React from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Search, 
  FileCheck2, 
  CheckCircle2, 
  Database,
  Lock,
  Unlock,
  BookOpen
} from 'lucide-react';
import { SupabaseConfig } from '../types/exam';

interface HeaderProps {
  currentTab: 'student' | 'lookup' | 'teacher' | 'handbook';
  onSelectTab: (tab: 'student' | 'lookup' | 'teacher' | 'handbook') => void;
  isTeacherAuthenticated: boolean;
  onLogoutTeacher: () => void;
  supabaseConfig: SupabaseConfig;
  onOpenSupabaseConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  isTeacherAuthenticated,
  onLogoutTeacher,
  supabaseConfig,
  onOpenSupabaseConfig,
}) => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl border-b border-blue-900/50 sticky top-0 z-40">
      {/* Top institution bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 border-b border-blue-800/40 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                  THPT HÒN ĐẤT
                </span>
                <span className="text-xs font-medium text-blue-300">
                  Tỉnh An Giang
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                HỆ THỐNG PHÒNG THI TRỰC TUYẾN
                <span className="text-xs font-mono font-bold bg-blue-600/60 text-blue-100 px-2 py-0.5 rounded-full border border-blue-400/30">
                  V11.2
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Direct links to GitHub, Vercel, Supabase */}
            <a
              href="https://github.com/lebanhan113-dotcom/247nhanlbonline"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 transition shadow-sm"
              title="Mở mã nguồn GitHub: lebanhan113-dotcom/247nhanlbonline"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="font-semibold hidden lg:inline">GitHub</span>
            </a>

            <a
              href="https://vercel.com/le-nhan/247nhanlbonline"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 transition shadow-sm"
              title="Mở Bảng điều khiển triển khai Vercel: le-nhan/247nhanlbonline"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 1L24 22H0L12 1Z" />
              </svg>
              <span className="font-semibold hidden lg:inline">Vercel</span>
            </a>

            <a
              href="https://supabase.com/dashboard/project/wzcosdniivggetnkdhmn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-600/50 hover:border-emerald-400 transition shadow-sm"
              title="Mở Bảng điều khiển Supabase Cloud: wzcosdniivggetnkdhmn"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold">Supabase Cloud</span>
              <span className="hidden xl:inline text-[10px] text-emerald-200 font-mono bg-emerald-900/80 px-1 py-0.2 rounded">
                wzcosdniivggetnkdhmn
              </span>
            </a>

            <button
              onClick={onOpenSupabaseConfig}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all ${
                supabaseConfig.isConnected
                  ? 'bg-blue-950/70 text-blue-300 border-blue-600/40 hover:bg-blue-900/60'
                  : 'bg-amber-950/60 text-amber-300 border-amber-600/40 hover:bg-amber-900/60'
              }`}
              title="Cấu hình & Đồng bộ chi tiết cơ sở dữ liệu Supabase"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium">Đồng Bộ</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
              <span>Tác giả:</span>
              <span className="font-semibold text-white">Thầy Lê Bá Nhẫn</span>
            </div>

            {isTeacherAuthenticated && (
              <button
                onClick={onLogoutTeacher}
                className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-700 transition"
              >
                <Unlock className="w-3.5 h-3.5 text-amber-400" />
                <span>Thoát Quản Trị</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center justify-between overflow-x-auto py-2 scrollbar-none gap-2">
          <nav className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => onSelectTab('student')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                currentTab === 'student'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/40'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-blue-300" />
              <span>Cổng Thí Sinh Làm Bài</span>
            </button>

            <button
              onClick={() => onSelectTab('lookup')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                currentTab === 'lookup'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/40'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-300" />
              <span>Tra Cứu Kết Quả</span>
            </button>

            <button
              onClick={() => onSelectTab('teacher')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                currentTab === 'teacher'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/40'
              }`}
            >
              {isTeacherAuthenticated ? (
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              ) : (
                <Lock className="w-4 h-4 text-amber-400" />
              )}
              <span>Khu Quản Trị Giáo Viên</span>
              {isTeacherAuthenticated && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('handbook')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                currentTab === 'handbook'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/40'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-300" />
              <span>Sổ Tay & 25 Tiêu Chí</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

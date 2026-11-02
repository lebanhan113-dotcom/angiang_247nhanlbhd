import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StudentPortal } from './components/StudentPortal';
import { StudentLookup } from './components/StudentLookup';
import { TeacherPortal } from './components/TeacherPortal';
import { HandbookChecklist } from './components/HandbookChecklist';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { StorageService } from './utils/storage';
import { Exam, ExamSubmission, SupabaseConfig } from './types/exam';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'student' | 'lookup' | 'teacher' | 'handbook'>('student');
  const [exams, setExams] = useState<Exam[]>(() => StorageService.getExams());
  const [submissions, setSubmissions] = useState<ExamSubmission[]>(() => StorageService.getSubmissions());
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => StorageService.getSupabaseConfig());
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState<boolean>(false);

  // Pre-filled state for lookup portal when student navigates from submission receipt
  const [lookupPrefill, setLookupPrefill] = useState<{
    code: string;
    name: string;
    className: string;
  }>({
    code: '',
    name: '',
    className: '10A1',
  });

  // Sync state when storage updates via events
  useEffect(() => {
    const handleExamsUpdate = (e: any) => {
      if (e.detail) setExams([...e.detail]);
    };
    const handleSubsUpdate = (e: any) => {
      if (e.detail) setSubmissions([...e.detail]);
    };
    const handleSupabaseUpdate = (e: any) => {
      if (e.detail) setSupabaseConfig({ ...e.detail });
    };

    window.addEventListener('thpt_exams_updated', handleExamsUpdate);
    window.addEventListener('thpt_submissions_updated', handleSubsUpdate);
    window.addEventListener('thpt_supabase_updated', handleSupabaseUpdate);

    return () => {
      window.removeEventListener('thpt_exams_updated', handleExamsUpdate);
      window.removeEventListener('thpt_submissions_updated', handleSubsUpdate);
      window.removeEventListener('thpt_supabase_updated', handleSupabaseUpdate);
    };
  }, []);

  const handleSubmissionComplete = (newSub: ExamSubmission) => {
    setSubmissions((prev) => [newSub, ...prev]);
  };

  const handleNavigateToLookup = (lookupCode: string, name: string, className: string) => {
    setLookupPrefill({ code: lookupCode, name, className });
    setCurrentTab('lookup');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Institution Navigation Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isTeacherAuthenticated={isTeacherAuthenticated}
        onLogoutTeacher={() => setIsTeacherAuthenticated(false)}
        supabaseConfig={supabaseConfig}
        onOpenSupabaseConfig={() => setShowSupabaseModal(true)}
      />

      {/* Main Workspace Body */}
      <main className="flex-1">
        {currentTab === 'student' && (
          <StudentPortal
            exams={exams}
            onSubmissionComplete={handleSubmissionComplete}
            onNavigateToLookup={handleNavigateToLookup}
          />
        )}

        {currentTab === 'lookup' && (
          <StudentLookup
            initialLookupCode={lookupPrefill.code}
            initialName={lookupPrefill.name}
            initialClass={lookupPrefill.className}
            exams={exams}
          />
        )}

        {currentTab === 'teacher' && (
          <TeacherPortal
            exams={exams}
            submissions={submissions}
            isAuthenticated={isTeacherAuthenticated}
            onLogin={() => setIsTeacherAuthenticated(true)}
            onLogout={() => setIsTeacherAuthenticated(false)}
            supabaseConfig={supabaseConfig}
            onUpdateSupabaseConfig={(cfg) => {
              StorageService.saveSupabaseConfig(cfg);
              setSupabaseConfig(cfg);
            }}
          />
        )}

        {currentTab === 'handbook' && <HandbookChecklist />}
      </main>

      {/* Global Supabase Modal */}
      {showSupabaseModal && (
        <SupabaseConfigModal
          config={supabaseConfig}
          onClose={() => setShowSupabaseModal(false)}
          onSave={(cfg) => {
            StorageService.saveSupabaseConfig(cfg);
            setSupabaseConfig(cfg);
          }}
        />
      )}

      {/* Official Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <div className="text-slate-200 font-bold text-sm">
              TRƯỜNG THPT HÒN ĐẤT • HỆ THỐNG PHÒNG THI TRỰC TUYẾN (PHIÊN BẢN V11.2)
            </div>
            <p className="text-slate-400">
              Giải pháp số hóa đề thi AI: ChatGPT + Google AI Studio + Supabase • Tác giả: Thầy Lê Bá Nhẫn (Tỉnh An Giang)
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <button
              onClick={() => setCurrentTab('handbook')}
              className="hover:text-blue-400 transition"
            >
              25 Tiêu Chí Nghiệm Thu
            </button>
            <span>•</span>
            <button
              onClick={() => setShowSupabaseModal(true)}
              className="hover:text-blue-400 transition"
            >
              Cơ Sở Dữ Liệu SQL V11
            </button>
            <span>•</span>
            <span className="font-mono text-slate-500">Build: V11.2-PROD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

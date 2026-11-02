import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Download, 
  Check, 
  ShieldCheck, 
  Radio, 
  Cpu, 
  Lock,
  ExternalLink,
  RefreshCw,
  Globe,
  ArrowRight,
  Server
} from 'lucide-react';
import { SupabaseConfig } from '../types/exam';
import { SUPABASE_SETUP_SQL_V11 } from '../data/supabaseSql';
import { CLOUD_LINKS, SupabaseSyncService } from '../utils/supabaseSync';
import { StorageService } from '../utils/storage';

interface SupabaseConfigModalProps {
  config: SupabaseConfig;
  onClose: () => void;
  onSave: (cfg: SupabaseConfig) => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  config,
  onClose,
  onSave,
}) => {
  const [projectUrl, setProjectUrl] = useState(
    config.projectUrl || CLOUD_LINKS.SUPABASE_DEFAULT_URL
  );
  const [publishableKey, setPublishableKey] = useState(config.publishableKey || '');
  const [mode, setMode] = useState<'local' | 'cloud'>(config.mode || 'cloud');

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs: number;
    message: string;
  } | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const [copiedSql, setCopiedSql] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const testCfg: SupabaseConfig = {
      projectUrl: projectUrl.trim(),
      publishableKey: publishableKey.trim(),
      isConnected: true,
      mode,
    };

    const res = await SupabaseSyncService.testConnection(testCfg);
    setIsTesting(false);
    setTestResult({
      success: res.success,
      latencyMs: res.latencyMs,
      message: res.message,
    });
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncStatus(null);

    const currentCfg: SupabaseConfig = {
      projectUrl: projectUrl.trim(),
      publishableKey: publishableKey.trim(),
      isConnected: true,
      mode: 'cloud',
      projectRef: CLOUD_LINKS.SUPABASE_PROJECT_ID,
      dashboardUrl: CLOUD_LINKS.SUPABASE_DASHBOARD,
      githubUrl: CLOUD_LINKS.GITHUB,
      vercelUrl: CLOUD_LINKS.VERCEL_DASHBOARD,
      lastSyncedAt: new Date().toISOString(),
    };

    const exams = StorageService.getExams();
    const submissions = StorageService.getSubmissions();

    const examsRes = await SupabaseSyncService.syncExamsToCloud(exams, currentCfg);
    const subsRes = await SupabaseSyncService.syncSubmissionsToCloud(submissions, currentCfg);

    setIsSyncing(false);
    setSyncStatus(`Đồng bộ thành công ${examsRes.count} đề thi và ${subsRes.count} bài nộp lên Supabase Cloud (${CLOUD_LINKS.SUPABASE_PROJECT_ID})!`);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL_V11);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([SUPABASE_SETUP_SQL_V11], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'supabase_setup_v11.sql';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveConfig = () => {
    const updated: SupabaseConfig = {
      projectUrl: projectUrl.trim(),
      publishableKey: publishableKey.trim(),
      isConnected: true,
      lastTestedAt: new Date().toISOString(),
      mode,
      projectRef: CLOUD_LINKS.SUPABASE_PROJECT_ID,
      dashboardUrl: CLOUD_LINKS.SUPABASE_DASHBOARD,
      githubUrl: CLOUD_LINKS.GITHUB,
      vercelUrl: CLOUD_LINKS.VERCEL_DASHBOARD,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600/30 rounded-xl border border-emerald-400/40">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-400/20 px-2 py-0.5 rounded border border-emerald-400/40">
                  SUPABASE CLOUD • V11.2
                </span>
                <span className="text-[11px] font-mono text-blue-200 bg-blue-900/60 px-1.5 py-0.5 rounded border border-blue-400/30">
                  ID: wzcosdniivggetnkdhmn
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Cấu Hình & Tự Động Đồng Bộ Supabase Cloud (THPT Hòn Đất)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Cloud Integration Hub Cards (GitHub, Vercel, Supabase) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* GitHub Card */}
            <a
              href={CLOUD_LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-slate-900 text-white rounded-2xl border border-slate-700 hover:border-slate-500 transition shadow-sm group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span className="font-bold text-xs">Mã Nguồn GitHub</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
                </div>
                <div className="text-[11px] font-mono text-slate-300 truncate">
                  lebanhan113-dotcom/247nhanlbonline
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 mt-2 font-medium flex items-center gap-1">
                <Check className="w-3 h-3" /> Đã kết nối tự động
              </span>
            </a>

            {/* Vercel Card */}
            <a
              href={CLOUD_LINKS.VERCEL_DASHBOARD}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-slate-900 text-white rounded-2xl border border-slate-700 hover:border-slate-500 transition shadow-sm group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M12 1L24 22H0L12 1Z" />
                    </svg>
                    <span className="font-bold text-xs">Triển Khai Vercel</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
                </div>
                <div className="text-[11px] font-mono text-slate-300 truncate">
                  le-nhan/247nhanlbonline
                </div>
              </div>
              <span className="text-[10px] text-blue-400 mt-2 font-medium flex items-center gap-1">
                <Globe className="w-3 h-3" /> 247nhanlbonline.vercel.app
              </span>
            </a>

            {/* Supabase Dashboard Card */}
            <a
              href={CLOUD_LINKS.SUPABASE_DASHBOARD}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-2xl border border-emerald-600/40 hover:border-emerald-400 transition shadow-sm group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs">Supabase Dashboard</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
                </div>
                <div className="text-[11px] font-mono text-emerald-200 truncate">
                  project: wzcosdniivggetnkdhmn
                </div>
              </div>
              <span className="text-[10px] text-emerald-300 mt-2 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Sẵn sàng đồng bộ
              </span>
            </a>
          </div>

          {/* Mode switch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setMode('cloud')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                mode === 'cloud'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900 text-sm">
                  Chế Độ Dự Án Supabase Cloud (wzcosdniivggetnkdhmn)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đồng bộ trực tiếp với máy chủ đám mây Supabase. Hỗ trợ hàng trăm học sinh thi đồng thời và lưu bài tập trung.
              </p>
            </div>

            <div
              onClick={() => setMode('local')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                mode === 'local'
                  ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-900 text-sm">
                  Chế Độ Bộ Nhớ Cục Bộ V11.2 (Offline Cache)
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Lưu trữ và chạy độc lập trên trình duyệt. Dữ liệu tự động đồng bộ khi chuyển sang Supabase Cloud.
              </p>
            </div>
          </div>

          {/* Supabase credentials inputs */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Thông Số Dự Án Supabase: wzcosdniivggetnkdhmn</span>
              </h4>
              <div className="flex items-center gap-2 text-xs">
                <a
                  href={CLOUD_LINKS.SUPABASE_API_SETTINGS}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                  title="Mở cài đặt API trên Supabase để lấy anon public key"
                >
                  <span>Lấy Khóa API (Project Settings → API)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={CLOUD_LINKS.SUPABASE_SQL_EDITOR}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                >
                  <span>Mở SQL Editor</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Project URL (Địa chỉ dự án Supabase Cloud):
                </label>
                <input
                  type="text"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="https://wzcosdniivggetnkdhmn.supabase.co"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Publishable / Anon Public Key:
                </label>
                <input
                  type="text"
                  value={publishableKey}
                  onChange={(e) => setPublishableKey(e.target.value)}
                  placeholder="Dán mã khóa Anon Key lấy từ Supabase Settings → API..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Test connection & Sync buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Radio className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Đang ping kết nối...' : 'Kiểm Tra Kết Nối Cloud'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSyncNow}
                  disabled={isSyncing}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Đang đẩy dữ liệu...' : 'Đồng Bộ Lên Supabase Cloud Ngay'}</span>
                </button>
              </div>

              {testResult && (
                <div
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${
                    testResult.success
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  <span>
                    {testResult.message} {testResult.latencyMs > 0 ? `(${testResult.latencyMs}ms)` : ''}
                  </span>
                </div>
              )}
            </div>

            {syncStatus && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{syncStatus}</span>
              </div>
            )}
          </div>

          {/* SQL Setup Script Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Tệp SQL Cài Đặt Bảng & RLS Cho Dự Án: <code className="text-blue-700">wzcosdniivggetnkdhmn</code>
                </h4>
                <p className="text-xs text-slate-500">
                  Dán nội dung này vào <a href={CLOUD_LINKS.SUPABASE_SQL_EDITOR} target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">SQL Editor trên Supabase</a> và bấm <strong>Run</strong> để tự động tạo cấu trúc bảng thi cử chuẩn THPT Hòn Đất.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                >
                  {copiedSql ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedSql ? 'Đã sao chép' : 'Sao chép SQL'}</span>
                </button>
                <button
                  onClick={handleDownloadSql}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition border border-blue-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải tệp .sql</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 text-emerald-300 font-mono text-[11px] p-4 rounded-2xl max-h-52 overflow-y-auto leading-relaxed border border-slate-800 select-all">
              <pre>{SUPABASE_SETUP_SQL_V11}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Dự án: <span className="font-mono font-bold text-slate-800">wzcosdniivggetnkdhmn</span> • THPT Hòn Đất
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition"
            >
              Đóng
            </button>
            <button
              onClick={handleSaveConfig}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Lưu & Kích Hoạt Cấu Hình</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

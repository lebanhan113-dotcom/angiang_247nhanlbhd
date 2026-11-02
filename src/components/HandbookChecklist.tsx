import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  Terminal,
  Filter,
  Sparkles,
  Info
} from 'lucide-react';
import { ChecklistItem } from '../types/exam';
import { HANDBOOK_PROMPTS, INITIAL_CHECKLIST_ITEMS } from '../data/handbookData';
import { StorageService } from '../utils/storage';

interface HandbookChecklistProps {
  onRunSelfVerification?: () => void;
}

export const HandbookChecklist: React.FC<HandbookChecklistProps> = () => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'prompts' | 'guide'>('checklist');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => StorageService.getChecklist());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedPromptId, setCopiedPromptId] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, passed: !item.passed } : item
    );
    setChecklist(updated);
    StorageService.saveChecklist(updated);
  };

  const handleCopyPrompt = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const filteredChecklist = checklist.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const passedCount = checklist.filter((item) => item.passed).length;
  const totalCount = checklist.length;
  const percentage = Math.round((passedCount / totalCount) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/30">
              SỔ TAY THỰC HÀNH V11.2
            </span>
            <span className="text-xs text-blue-300">
              Tác giả: Thầy Lê Bá Nhẫn – THPT Hòn Đất
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Phiếu Nghiệm Thu 25 Tiêu Chí & Bộ 14 Câu Lệnh Sẵn Dùng
          </h2>
          <p className="text-blue-200 text-sm max-w-2xl leading-relaxed">
            Tài liệu hướng dẫn "cầm tay chỉ việc" dành cho giáo viên kiểm thử và nghiệm thu phòng thi trực tuyến trước khi phát hành chính thức cho học sinh.
          </p>

          {/* Progress bar */}
          <div className="pt-2 max-w-md">
            <div className="flex justify-between text-xs font-bold text-blue-200 mb-1.5">
              <span>Tiến độ nghiệm thu hệ thống:</span>
              <span className="text-amber-400">{passedCount}/{totalCount} tiêu chí đạt ({percentage}%)</span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-blue-800">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'checklist'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Phiếu Nghiệm Thu (25 Tiêu Chí)</span>
        </button>

        <button
          onClick={() => setActiveTab('prompts')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'prompts'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4 text-purple-400" />
          <span>Bộ Câu Lệnh Sẵn Dùng (14 Câu Lệnh)</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'guide'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>Quy Trình & Sổ Tay Vận Hành</span>
        </button>
      </div>

      {/* TAB 1: 25 CHECKLIST ITEMS */}
      {activeTab === 'checklist' && (
        <div className="space-y-5">
          {/* Category filter */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-500 font-semibold flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Lọc theo nhóm:
              </span>
              {[
                { id: 'all', label: 'Tất cả 25 tiêu chí' },
                { id: 'parsing', label: 'Nhận diện đề & Word' },
                { id: 'exam_control', label: 'Quản lý & Duyệt đề' },
                { id: 'security', label: 'Bảo mật & RLS' },
                { id: 'database', label: 'Cơ sở dữ liệu Supabase' },
                { id: 'student_flow', label: 'Trải nghiệm học sinh' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                const updated = checklist.map((c) => ({ ...c, passed: true }));
                setChecklist(updated);
                StorageService.saveChecklist(updated);
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold"
            >
              Đánh dấu Đạt tất cả
            </button>
          </div>

          {/* List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {filteredChecklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer transition ${
                  item.passed ? 'bg-white hover:bg-slate-50' : 'bg-rose-50/20 hover:bg-rose-50/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs font-bold transition ${
                      item.passed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600 border border-slate-300'
                    }`}
                  >
                    {item.passed ? <Check className="w-4 h-4" /> : item.id}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        Tiêu chí #{item.id.toString().padStart(2, '0')}
                      </span>
                      {item.systemVerified && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                          Hệ thống đã kiểm chứng
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                    {item.verificationEvidence && (
                      <div className="text-[11px] text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-md mt-2 inline-flex items-center gap-1 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Bằng chứng: {item.verificationEvidence}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 self-center">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      item.passed
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}
                  >
                    {item.passed ? 'ĐẠT' : 'CHƯA ĐẠT'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: 14 PROMPT TEMPLATES */}
      {activeTab === 'prompts' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <p>
              Mỗi câu lệnh dưới đây tương ứng với một bước chuẩn hóa đề hoặc xây dựng giao diện trong sổ tay. Thầy/Cô có thể sao chép nguyên khối và dán vào ChatGPT hoặc Google AI Studio theo đúng tiến trình.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {HANDBOOK_PROMPTS.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {prompt.code}
                      </span>
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        Dán vào: {prompt.destination}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      {prompt.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {prompt.instruction}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopyPrompt(prompt.id, prompt.content)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition border border-blue-200 shrink-0"
                  >
                    {copiedPromptId === prompt.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedPromptId === prompt.id ? 'Đã sao chép' : 'Sao chép lệnh'}</span>
                  </button>
                </div>

                <div className="bg-slate-900 text-slate-100 font-mono text-xs p-3.5 rounded-xl whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto select-all">
                  {prompt.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GUIDE & OPERATIONAL PROTOCOLS */}
      {activeTab === 'guide' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              Quy Trình Vận Hành Phòng Thi Trực Tuyến THPT Hòn Đất
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Trích từ Phần VII - Vận hành mỗi đợt kiểm tra (Phiên bản V11.2)
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-blue-900 mb-2">1. Trước giờ thi</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                <li>Sao lưu dữ liệu, kiểm tra mạng internet và đăng nhập quản trị giáo viên.</li>
                <li>Rà soát số câu, biểu điểm và đáp án của đề sắp mở; chỉ mở đề đã được duyệt.</li>
                <li>Kiểm tra cờ <code>answers_visible = false</code> trên trang học sinh.</li>
                <li>Mở một thiết bị phụ nộp thử một bài mẫu để kiểm tra tính thông suốt hai chiều.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-blue-900 mb-2">2. Trong giờ thi</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                <li>Theo dõi số phiên truy cập và số học sinh bắt đầu làm bài theo thời gian thực.</li>
                <li>Theo dõi bài đã nộp theo lớp và mã đề; xử lý sự cố mạng theo quy trình.</li>
                <li>Tuyệt đối không chỉnh sửa đề đang diễn ra nếu không tạo version mới.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-blue-900 mb-2">3. Sau giờ thi</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                <li>Đóng đề tương ứng (đóng Đề A không làm ảnh hưởng Đề B đang mở).</li>
                <li>Đối chiếu số học sinh dự thi với số bài nộp trong hệ thống.</li>
                <li>Xuất file Excel (.xlsx), sao lưu cơ sở dữ liệu và ghi nhật ký phát hành.</li>
                <li>Chỉ bật công bố đáp án cho đề khi đã hoàn thành toàn bộ các ca thi.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

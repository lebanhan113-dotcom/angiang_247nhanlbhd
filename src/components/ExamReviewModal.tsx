import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  FileCheck2, 
  Send, 
  Tag, 
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { Exam, Question } from '../types/exam';

interface ExamReviewModalProps {
  exam: Exam;
  onClose: () => void;
  onSave: (updatedExam: Exam, shouldPublishImmediately: boolean) => void;
}

export const ExamReviewModal: React.FC<ExamReviewModalProps> = ({
  exam,
  onClose,
  onSave,
}) => {
  const [activeSection, setActiveSection] = useState<1 | 2 | 3>(1);
  const [reviewedExam, setReviewedExam] = useState<Exam>({ ...exam });

  // Scoring rules
  const [part1Points, setPart1Points] = useState<number>(
    exam.sections.find((s) => s.section === 1)?.totalPoints ?? 4.5
  );
  const [part2Points, setPart2Points] = useState<number>(
    exam.sections.find((s) => s.section === 2)?.totalPoints ?? 4.0
  );
  const [part3Points, setPart3Points] = useState<number>(
    exam.sections.find((s) => s.section === 3)?.totalPoints ?? 1.5
  );
  const [part2Rule, setPart2Rule] = useState<'moet_true_false' | 'equal_per_statement'>('moet_true_false');

  const part1Qs = reviewedExam.questions.filter((q) => q.section === 1);
  const part2Qs = reviewedExam.questions.filter((q) => q.section === 2);
  const part3Qs = reviewedExam.questions.filter((q) => q.section === 3);

  const flaggedQuestions = reviewedExam.questions.filter((q) => q.reviewStatus === 'needs_review');

  const handleResolveFlag = (qId: string) => {
    setReviewedExam((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === qId ? { ...q, reviewStatus: 'verified' as const } : q
      ),
    }));
  };

  const handleApplyApproval = (publish: boolean) => {
    const updatedSections = reviewedExam.sections.map((s) => {
      if (s.section === 1) {
        return {
          ...s,
          totalPoints: part1Points,
          pointsPerQuestion: part1Qs.length > 0 ? part1Points / part1Qs.length : 0.25,
        };
      } else if (s.section === 2) {
        return {
          ...s,
          totalPoints: part2Points,
          scoringRule: part2Rule,
        };
      } else {
        return {
          ...s,
          totalPoints: part3Points,
          pointsPerQuestion: part3Qs.length > 0 ? part3Points / part3Qs.length : 0.375,
        };
      }
    });

    const finalExam: Exam = {
      ...reviewedExam,
      sections: updatedSections,
      status: publish ? 'published' : 'approved',
      publishedAt: publish ? new Date().toISOString().replace('T', ' ').substring(0, 16) : reviewedExam.publishedAt,
      reviewedBy: 'Giáo viên thẩm định (Tổ bộ môn)',
      reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      totalScore: part1Points + part2Points + part3Points,
    };

    onSave(finalExam, publish);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-scaleUp overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 rounded-xl border border-blue-400/40">
              <FileCheck2 className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded">
                  {reviewedExam.code}
                </span>
                <span className="text-xs text-blue-200">v{reviewedExam.version}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Màn Hình Duyệt Đề & Biểu Điểm (BƯỚC 05 & BƯỚC 09)
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
          {/* Flagged Review Warning Banner (If any) */}
          {flaggedQuestions.length > 0 && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-900 space-y-1">
                <div className="font-bold text-amber-950">
                  Cảnh báo chuyên môn: Có {flaggedQuestions.length} câu cần giáo viên duyệt kỹ
                </div>
                <p>
                  Theo khuyến nghị từ Sổ tay V11.2 (BƯỚC 05), các câu có nguy cơ đa đáp án (như biến đổi bán kính nguyên tử) hoặc thuật ngữ sodium/potassium iodate/iodide cần được giáo viên xác nhận trước khi phát hành.
                </p>
              </div>
            </div>
          )}

          {/* Configuration of Points and Rules */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Thiết Lập Biểu Điểm & Quy Tắc Chấm (CÂU LỆNH 08)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">
                  Điểm Phần I ({part1Qs.length} câu TN)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.25"
                    value={part1Points}
                    onChange={(e) => setPart1Points(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-800"
                  />
                  <span className="text-slate-500">đ</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ≈ {(part1Points / (part1Qs.length || 1)).toFixed(2)}đ / câu
                </span>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">
                  Điểm Phần II ({part2Qs.length} câu Đ/S)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    value={part2Points}
                    onChange={(e) => setPart2Points(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-800"
                  />
                  <span className="text-slate-500">đ</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ≈ {(part2Points / (part2Qs.length || 1)).toFixed(1)}đ / câu
                </span>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">
                  Điểm Phần III ({part3Qs.length} câu ngắn)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.25"
                    value={part3Points}
                    onChange={(e) => setPart3Points(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-800"
                  />
                  <span className="text-slate-500">đ</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ≈ {(part3Points / (part3Qs.length || 1)).toFixed(3)}đ / câu
                </span>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">
                  Quy tắc chấm Phần II
                </label>
                <select
                  value={part2Rule}
                  onChange={(e) => setPart2Rule(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-800"
                >
                  <option value="moet_true_false">Chuẩn Bộ GD&ĐT (1-2-3-4 ý)</option>
                  <option value="equal_per_statement">Chia đều theo ý</option>
                </select>
                <span className="text-[10px] text-blue-600 block mt-0.5">
                  1 ý: 0.1đ • 2 ý: 0.25đ • 3 ý: 0.5đ • 4 ý: 1.0đ
                </span>
              </div>
            </div>

            <div className="text-xs text-right font-bold text-slate-700 pt-1">
              Tổng điểm đề thi:{' '}
              <span className="text-blue-700 text-sm">
                {(part1Points + part2Points + part3Points).toFixed(1)} điểm
              </span>
            </div>
          </div>

          {/* Section Selector */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setActiveSection(1)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeSection === 1
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Phần I: Nhiều lựa chọn</span>
              <span className="px-1.5 py-0.5 rounded-full bg-blue-800/40 text-blue-200 text-xs">
                {part1Qs.length} câu
              </span>
            </button>

            <button
              onClick={() => setActiveSection(2)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeSection === 2
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Phần II: Đúng - Sai</span>
              <span className="px-1.5 py-0.5 rounded-full bg-blue-800/40 text-blue-200 text-xs">
                {part2Qs.length} câu (8 ý)
              </span>
            </button>

            <button
              onClick={() => setActiveSection(3)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeSection === 3
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Phần III: Trả lời ngắn</span>
              <span className="px-1.5 py-0.5 rounded-full bg-blue-800/40 text-blue-200 text-xs">
                {part3Qs.length} câu
              </span>
            </button>
          </div>

          {/* Questions List for Current Section */}
          <div className="space-y-4">
            {reviewedExam.questions
              .filter((q) => q.section === activeSection)
              .map((q) => (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 border-2 transition ${
                    q.reviewStatus === 'needs_review'
                      ? 'border-amber-400 bg-amber-50/20'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">
                        Câu {q.orderNumber}:
                      </span>
                      {q.reviewStatus === 'needs_review' ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>CẦN DUYỆT</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Đã xác thực</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">Nguồn nhận diện:</span>
                      <span className="font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {q.sourceAnswer === 'red_underline'
                          ? 'Đỏ + Gạch chân Word'
                          : q.sourceAnswer === 'key_line'
                          ? 'Dòng "Đáp án: ..."'
                          : 'Giáo viên thiết lập'}
                      </span>
                    </div>
                  </div>

                  {/* Stem */}
                  <div className="text-sm text-slate-800 font-medium mb-3">
                    {q.stem}
                  </div>

                  {/* Review warning message & resolution */}
                  {q.reviewStatus === 'needs_review' && (
                    <div className="bg-amber-100/70 p-3 rounded-xl border border-amber-200 text-xs text-amber-950 mb-3 flex items-center justify-between gap-2">
                      <div>
                        <strong>Ghi chú phản biện: </strong>
                        <span>{q.reviewNote}</span>
                      </div>
                      <button
                        onClick={() => handleResolveFlag(q.id)}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shrink-0 transition"
                      >
                        Xác nhận đạt
                      </button>
                    </div>
                  )}

                  {/* Options or Statements */}
                  {q.section === 1 && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-lg border flex items-center justify-between ${
                            opt.isCorrect
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                              : 'border-slate-200 bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded flex items-center justify-center bg-white border font-bold">
                              {opt.id}
                            </span>
                            <span>{opt.content}</span>
                          </div>
                          {opt.isCorrect && (
                            <span className="text-[10px] text-emerald-700 font-mono">
                              ✓ Đáp án Word
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.section === 2 && q.statements && (
                    <div className="space-y-1.5 text-xs">
                      {q.statements.map((st) => (
                        <div
                          key={st.id}
                          className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-blue-900">{st.id})</span>
                            <span>{st.content}</span>
                          </div>
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                              st.isCorrect
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {st.isCorrect ? 'ĐÚNG (Đỏ gạch chân)' : 'SAI (Không gạch)'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.section === 3 && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                      <span className="text-slate-600">Đáp án trích xuất:</span>
                      <span className="font-mono font-bold text-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                        {q.shortAnswer}
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            * Sau khi duyệt, đề có thể phát hành ngay hoặc lưu trong kho để mở sau.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleApplyApproval(false)}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-sm transition"
            >
              Lưu Đã Duyệt (Chưa Phát Hành)
            </button>
            <button
              onClick={() => handleApplyApproval(true)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Duyệt & Phát Hành Lên Cổng Học Sinh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Lock, 
  Eye, 
  Award, 
  Check, 
  X, 
  HelpCircle,
  Clock,
  Calendar,
  User,
  GraduationCap
} from 'lucide-react';
import { ExamSubmission, Exam } from '../types/exam';
import { StorageService } from '../utils/storage';

interface StudentLookupProps {
  initialLookupCode?: string;
  initialName?: string;
  initialClass?: string;
  exams: Exam[];
}

export const StudentLookup: React.FC<StudentLookupProps> = ({
  initialLookupCode = '',
  initialName = '',
  initialClass = '10A1',
  exams,
}) => {
  const [lookupCode, setLookupCode] = useState(initialLookupCode);
  const [studentName, setStudentName] = useState(initialName);
  const [studentClass, setStudentClass] = useState(initialClass);

  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<ExamSubmission | null>(null);
  const [associatedExam, setAssociatedExam] = useState<Exam | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupCode.trim() || !studentName.trim() || !studentClass.trim()) return;

    setSearched(true);
    const sub = StorageService.findSubmission(lookupCode, studentName, studentClass);
    if (sub) {
      setResult(sub);
      const ex = exams.find((e) => e.id === sub.examId) || StorageService.getExamById(sub.examId);
      setAssociatedExam(ex || null);
    } else {
      setResult(null);
      setAssociatedExam(null);
    }
  };

  const isAnswersVisible = associatedExam?.answersVisible ?? false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
          <Search className="w-3.5 h-3.5" />
          <span>Tra Cứu Khảo Thí Trực Tuyến</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Tra Cứu Kết Quả & Bài Làm Của Thí Sinh
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Nhập chính xác Mã tra cứu được cấp khi nộp bài kèm Họ tên và Lớp để kiểm tra trạng thái bài thi và điểm số.
        </p>
      </div>

      {/* Lookup Form */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Mã tra cứu bài thi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value.toUpperCase())}
              placeholder="VD: HD-2026-N89B2"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none transition text-sm font-mono font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Họ và tên học sinh <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="VD: Nguyễn Văn An"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none transition text-sm font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Lớp <span className="text-rose-500">*</span>
            </label>
            <select
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none transition text-sm font-semibold"
            >
              <option value="10A1">10A1</option>
              <option value="10A2">10A2</option>
              <option value="10A3">10A3</option>
              <option value="10A4">10A4</option>
              <option value="11B1">11B1</option>
              <option value="11B2">11B2</option>
              <option value="12C1">12C1</option>
              <option value="12C2">12C2</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Tra Cứu Bài Làm</span>
          </button>
        </div>
      </form>

      {/* Results presentation */}
      {searched && !result && (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 space-y-3">
          <AlertCircle className="w-12 h-12 mx-auto text-amber-500" />
          <h4 className="text-base font-bold text-slate-800">
            Không tìm thấy bài thi phù hợp
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Vui lòng kiểm tra lại chính xác Mã tra cứu (ví dụ: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-600">HD-2026-N89B2</code>), cùng họ tên và lớp đã đăng ký khi vào phòng thi.
          </p>
        </div>
      )}

      {result && associatedExam && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md">
                  {result.lookupCode}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  {result.examTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Mã đề: {result.examCode} • Phiên bản: {result.examVersion}
                </p>
              </div>

              {/* Status Badge */}
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Bài đã nộp hợp lệ</span>
                </span>
                <span className="text-xs text-slate-400 block mt-1">
                  Nộp lúc: {result.submittedAt}
                </span>
              </div>
            </div>

            {/* Student info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 block">Thí sinh:</span>
                <span className="font-bold text-slate-800">{result.studentName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Lớp học:</span>
                <span className="font-bold text-slate-800">{result.studentClass}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Thời gian làm bài:</span>
                <span className="font-semibold text-slate-800">
                  {Math.floor(result.timeSpentSeconds / 60)} phút {result.timeSpentSeconds % 60} giây
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Tình trạng công bố:</span>
                <span className={`font-bold ${isAnswersVisible ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {isAnswersVisible ? 'Đã mở đáp án' : 'Đang tạm khóa'}
                </span>
              </div>
            </div>

            {/* CASE 1: ANSWERS ARE HIDDEN (Security rule adherence!) */}
            {!isAnswersVisible ? (
              <div className="bg-amber-50/80 border-2 border-dashed border-amber-300 rounded-2xl p-6 sm:p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-amber-950">
                  Giáo viên chưa mở công bố đáp án và điểm chi tiết
                </h4>
                <p className="text-sm text-amber-900/80 max-w-lg mx-auto leading-relaxed">
                  Hệ thống xác nhận bài nộp của bạn đã được ghi nhận đầy đủ trên cơ sở dữ liệu. Theo quy định tại Sổ tay V11.2 (BƯỚC 11 & BƯỚC 16), đáp án, thang điểm và lời giải chi tiết chỉ được giải mã và trả về khi giáo viên bật nút công bố trên khu quản trị.
                </p>
                <div className="inline-block bg-white px-4 py-2 rounded-xl border border-amber-200 text-xs font-semibold text-slate-600">
                  Vui lòng quay lại sau khi giáo viên hoàn tất ca thi!
                </div>
              </div>
            ) : (
              /* CASE 2: ANSWERS ARE VISIBLE - Full graded exam display! */
              <div className="space-y-6 pt-2">
                {/* Score Summary Box */}
                <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                        KẾT QUẢ ĐẠT ĐƯỢC
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl sm:text-5xl font-extrabold text-amber-400">
                          {result.grading?.totalScore ?? 0}
                        </span>
                        <span className="text-lg text-blue-200 font-semibold">/ 10.0 điểm</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                        <span className="text-blue-200 block mb-1">Phần I</span>
                        <span className="text-base font-bold text-white">
                          {result.grading?.part1Score ?? 0}
                        </span>
                        <span className="text-[10px] text-blue-300 block">/ 4.5đ</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                        <span className="text-blue-200 block mb-1">Phần II</span>
                        <span className="text-base font-bold text-white">
                          {result.grading?.part2Score ?? 0}
                        </span>
                        <span className="text-[10px] text-blue-300 block">/ 4.0đ</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                        <span className="text-blue-200 block mb-1">Phần III</span>
                        <span className="text-base font-bold text-white">
                          {result.grading?.part3Score ?? 0}
                        </span>
                        <span className="text-[10px] text-blue-300 block">/ 1.5đ</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question-by-question Review */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span>Chi Tiết Từng Câu Hỏi & Lời Giải</span>
                  </h4>

                  <div className="space-y-4">
                    {associatedExam.questions.map((q) => {
                      const gradingDetail = result.grading?.details.find((d) => d.questionId === q.id);
                      const isCorrect = gradingDetail?.isFullyCorrect ?? false;
                      const earned = gradingDetail?.earnedPoints ?? 0;

                      return (
                        <div
                          key={q.id}
                          className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4"
                        >
                          {/* Question header */}
                          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">
                                Câu {q.orderNumber}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">
                                (Phần {q.section})
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                  isCorrect
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {isCorrect ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <X className="w-3 h-3" />
                                )}
                                <span>+{earned}đ</span>
                              </span>
                            </div>
                          </div>

                          {/* Stem */}
                          <div className="text-sm font-medium text-slate-800">
                            {q.stem}
                          </div>

                          {/* Part I Details */}
                          {q.section === 1 && q.options && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {q.options.map((opt) => {
                                const isUserChoice = result.answers.part1[q.id] === opt.id;
                                const isKey = opt.isCorrect;

                                let borderClass = 'border-slate-200 bg-slate-50';
                                if (isKey) borderClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                                if (isUserChoice && !isKey) borderClass = 'border-rose-400 bg-rose-50 text-rose-950';

                                return (
                                  <div
                                    key={opt.id}
                                    className={`p-3 rounded-lg border flex items-center justify-between gap-2 ${borderClass}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold">{opt.id}.</span>
                                      <span>{opt.content}</span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                      {isUserChoice && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                                          Bạn chọn
                                        </span>
                                      )}
                                      {isKey && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-200 text-emerald-900 rounded">
                                          Đáp án đúng
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Part II Details */}
                          {q.section === 2 && q.statements && (
                            <div className="space-y-2 text-xs">
                              {q.statements.map((st) => {
                                const userVal = result.answers.part2[q.id]?.[st.id];
                                const isItemCorrect = userVal === st.isCorrect;

                                return (
                                  <div
                                    key={st.id}
                                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-3"
                                  >
                                    <div className="flex items-start gap-2">
                                      <span className="font-bold text-blue-900">{st.id})</span>
                                      <span>{st.content}</span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className="text-slate-500">
                                        Bạn chọn: <strong className={userVal === true ? 'text-emerald-600' : 'text-rose-600'}>
                                          {userVal === true ? 'ĐÚNG' : userVal === false ? 'SAI' : 'Chưa chọn'}
                                        </strong>
                                      </span>
                                      <span className="text-slate-400">|</span>
                                      <span className="text-slate-700">
                                        Đáp án: <strong className="text-emerald-700">{st.isCorrect ? 'ĐÚNG' : 'SAI'}</strong>
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Part III Details */}
                          {q.section === 3 && (
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex items-center justify-between gap-3">
                              <div>
                                <span className="text-slate-500">Câu trả lời của bạn: </span>
                                <strong className="text-blue-900 font-mono text-sm">
                                  {result.answers.part3[q.id] || '(Bỏ trống)'}
                                </strong>
                              </div>
                              <div>
                                <span className="text-slate-500">Đáp án chuẩn: </span>
                                <strong className="text-emerald-700 font-mono text-sm">
                                  {q.shortAnswer}
                                </strong>
                              </div>
                            </div>
                          )}

                          {/* Solution Note */}
                          {q.solution && (
                            <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-xs text-blue-950">
                              <span className="font-bold text-blue-800">💡 Hướng dẫn giải: </span>
                              <span>{q.solution}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

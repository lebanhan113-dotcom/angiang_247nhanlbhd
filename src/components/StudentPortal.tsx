import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Sparkles,
  FileText,
  User,
  GraduationCap,
  Save,
  RotateCcw,
  Check,
  X,
  Eye,
  KeyRound,
  Copy,
  Info
} from 'lucide-react';
import { Exam, Question, StudentAnswers, ExamSubmission } from '../types/exam';
import { StorageService } from '../utils/storage';
import { calculateSubmissionScore } from '../utils/scoring';

interface StudentPortalProps {
  exams: Exam[];
  onSubmissionComplete: (submission: ExamSubmission) => void;
  onNavigateToLookup: (lookupCode: string, name: string, className: string) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  exams,
  onSubmissionComplete,
  onNavigateToLookup,
}) => {
  // Only published exams are available to students!
  const publishedExams = exams.filter((e) => e.status === 'published');

  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('10A1');
  const [isExamStarted, setIsExamStarted] = useState(false);

  // Exam state
  const [currentSection, setCurrentSection] = useState<1 | 2 | 3>(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<StudentAnswers>({
    part1: {},
    part2: {},
    part3: {},
  });
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(45 * 60);
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<ExamSubmission | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Record visitor on mount
  useEffect(() => {
    StorageService.recordVisitor();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isExamStarted || submittedReceipt) return;

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleForceSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExamStarted, submittedReceipt]);

  // Local auto-save simulation
  useEffect(() => {
    if (!isExamStarted || !selectedExam || submittedReceipt) return;

    const interval = setInterval(() => {
      const now = new Date();
      setLastSavedTime(
        `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
      );
      // Persist draft in localStorage to resist accidental refresh
      try {
        localStorage.setItem(
          `draft_${selectedExam.id}_${studentName}`,
          JSON.stringify({ answers, flaggedQuestions, secondsRemaining })
        );
      } catch (e) {}
    }, 15000);

    return () => clearInterval(interval);
  }, [isExamStarted, selectedExam, answers, flaggedQuestions, studentName]);

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam || !studentName.trim() || !studentClass.trim()) return;

    // Check for existing draft
    try {
      const savedDraft = localStorage.getItem(`draft_${selectedExam.id}_${studentName}`);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.flaggedQuestions) setFlaggedQuestions(parsed.flaggedQuestions);
        if (parsed.secondsRemaining) setSecondsRemaining(parsed.secondsRemaining);
      } else {
        setSecondsRemaining(selectedExam.durationMinutes * 60);
      }
    } catch (err) {
      setSecondsRemaining(selectedExam.durationMinutes * 60);
    }

    startTimeRef.current = Date.now();
    setIsExamStarted(true);
    StorageService.incrementParticipation(selectedExam.id);
  };

  const handleAnswerPart1 = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      part1: { ...prev.part1, [questionId]: optionId },
    }));
  };

  const handleAnswerPart2 = (questionId: string, statementId: string, isTrue: boolean) => {
    setAnswers((prev) => {
      const current = prev.part2[questionId] || {};
      return {
        ...prev,
        part2: {
          ...prev.part2,
          [questionId]: {
            ...current,
            [statementId]: isTrue,
          },
        },
      };
    });
  };

  const handleAnswerPart3 = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      part3: { ...prev.part3, [questionId]: text },
    }));
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleForceSubmit = () => {
    executeSubmission();
  };

  const executeSubmission = () => {
    if (!selectedExam) return;

    const timeSpent = Math.max(10, Math.floor((Date.now() - startTimeRef.current) / 1000));
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const lookupCode = `HD-2026-${randomHex}`;

    const grading = calculateSubmissionScore(selectedExam, answers);

    const submission: ExamSubmission = {
      id: `sub-${Date.now()}`,
      lookupCode,
      examId: selectedExam.id,
      examCode: selectedExam.code,
      examTitle: selectedExam.title,
      examVersion: selectedExam.version,
      studentName: studentName.trim(),
      studentClass: studentClass.trim(),
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      timeSpentSeconds: timeSpent,
      answers,
      grading,
    };

    StorageService.addSubmission(submission);
    onSubmissionComplete(submission);
    setSubmittedReceipt(submission);
    setShowConfirmSubmit(false);

    // Clean up draft
    try {
      localStorage.removeItem(`draft_${selectedExam.id}_${studentName}`);
    } catch (e) {}

    // Confetti effect
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Section questions
  const sectionQuestions = selectedExam
    ? selectedExam.questions.filter((q) => q.section === currentSection)
    : [];

  const currentQuestion = sectionQuestions[currentQuestionIndex] || sectionQuestions[0];

  // Answer status checks
  const isQuestionAnswered = (q: Question): boolean => {
    if (q.section === 1) {
      return !!answers.part1[q.id];
    } else if (q.section === 2) {
      const qAns = answers.part2[q.id];
      if (!qAns) return false;
      const count = Object.keys(qAns).filter((k) => qAns[k] !== null && qAns[k] !== undefined).length;
      return count === (q.statements?.length || 4);
    } else if (q.section === 3) {
      return !!(answers.part3[q.id] && answers.part3[q.id].trim());
    }
    return false;
  };

  const countTotalAnswered = (): number => {
    if (!selectedExam) return 0;
    return selectedExam.questions.filter(isQuestionAnswered).length;
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const copyLookupCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // 1. SUBMISSION RECEIPT SCREEN (When exam is finished)
  if (submittedReceipt && selectedExam) {
    const isAnswersVisible = selectedExam.answersVisible;

    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 text-white text-center relative">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-emerald-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold">NỘP BÀI THÀNH CÔNG</h2>
            <p className="text-blue-200 text-sm mt-1">
              Bài thi của bạn đã được hệ thống tiếp nhận và lưu trữ an toàn
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Lookup Code Badge */}
            <div className="bg-amber-50 border-2 border-amber-300/80 rounded-xl p-5 text-center shadow-inner">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                MÃ TRA CỨU BÀI THI CỦA BẠN (LƯU LẠI ĐỂ XEM ĐIỂM)
              </span>
              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="text-3xl font-mono font-extrabold text-blue-950 tracking-wider">
                  {submittedReceipt.lookupCode}
                </span>
                <button
                  onClick={() => copyLookupCode(submittedReceipt.lookupCode)}
                  className="p-2 text-slate-600 hover:text-blue-700 hover:bg-amber-100 rounded-lg transition"
                  title="Sao chép mã tra cứu"
                >
                  {copiedCode ? (
                    <Check className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-amber-900/80 mt-2">
                Chụp ảnh màn hình hoặc ghi nhớ mã này để đối chiếu kết quả khi giáo viên công bố.
              </p>
            </div>

            {/* Submission metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs text-slate-500 block">Thí sinh:</span>
                <span className="font-bold text-slate-800">{submittedReceipt.studentName}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Lớp:</span>
                <span className="font-bold text-slate-800">{submittedReceipt.studentClass}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Thời gian nộp:</span>
                <span className="font-semibold text-slate-800">{submittedReceipt.submittedAt}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Thời gian làm:</span>
                <span className="font-semibold text-slate-800">
                  {Math.floor(submittedReceipt.timeSpentSeconds / 60)} phút {submittedReceipt.timeSpentSeconds % 60} giây
                </span>
              </div>
            </div>

            {/* Security Notice regarding Answers Visibility (BƯỚC 11 & BƯỚC 16) */}
            {!isAnswersVisible ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-900">
                  <h4 className="font-bold text-blue-950 mb-1">
                    Chế độ bảo mật: Đáp án và lời giải đang được giáo viên tạm khóa
                  </h4>
                  <p className="leading-relaxed">
                    Theo quy chế phòng thi THPT Hòn Đất (Phiên bản V11.2), đáp án và kết quả chi tiết chỉ hiển thị sau khi toàn bộ ca thi kết thúc và được giáo viên mở công bố. Bạn có thể quay lại mục <strong>"Tra Cứu Kết Quả"</strong> với Mã tra cứu này để xem lại bài làm sau đó.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-sm text-emerald-900">
                  <h4 className="font-bold text-emerald-950 mb-1">
                    Giáo viên đã mở công bố đáp án cho đề thi này!
                  </h4>
                  <p className="leading-relaxed">
                    Bạn có thể xem chi tiết điểm số, đối chiếu từng câu đúng/sai và xem lời giải phân tích chi tiết ngay bây giờ.
                  </p>
                  <button
                    onClick={() =>
                      onNavigateToLookup(
                        submittedReceipt.lookupCode,
                        submittedReceipt.studentName,
                        submittedReceipt.studentClass
                      )
                    }
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Xem Kết Quả & Lời Giải Chi Tiết</span>
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setSelectedExam(null);
                  setIsExamStarted(false);
                  setSubmittedReceipt(null);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition text-center"
              >
                Về Danh Sách Đề Thi
              </button>
              <button
                onClick={() =>
                  onNavigateToLookup(
                    submittedReceipt.lookupCode,
                    submittedReceipt.studentName,
                    submittedReceipt.studentClass
                  )
                }
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Mở Trang Tra Cứu Bài Làm</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. EXAM WORKSPACE (During the exam)
  if (isExamStarted && selectedExam) {
    const totalQuestions = selectedExam.questions.length;
    const answeredCount = countTotalAnswered();
    const isWarningTime = secondsRemaining < 300; // < 5 mins

    return (
      <div className="min-h-screen bg-slate-100 pb-16">
        {/* Sticky Exam Top Bar */}
        <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 sm:px-6 py-3">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-blue-900 text-white p-2 rounded-lg font-bold text-xs">
                {selectedExam.grade}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                  {selectedExam.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="font-semibold text-blue-950">
                    Thí sinh: {studentName} ({studentClass})
                  </span>
                  <span>•</span>
                  <span>Mã đề: {selectedExam.code}</span>
                  <span>•</span>
                  <span className="font-mono text-slate-400">v{selectedExam.version}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              {/* Auto save badge */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                <Save className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {lastSavedTime ? `Đã tự lưu: ${lastSavedTime}` : 'Đang tự lưu...'}
                </span>
              </div>

              {/* Countdown Timer */}
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono font-bold text-base sm:text-lg border transition-all ${
                  isWarningTime
                    ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                    : 'bg-slate-900 text-amber-300 border-slate-800 shadow-inner'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{formatTimer(secondsRemaining)}</span>
              </div>

              {/* Submit button */}
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow-md transition"
              >
                <Send className="w-4 h-4" />
                <span>Nộp Bài ({answeredCount}/{totalQuestions})</span>
              </button>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="max-w-7xl mx-auto flex items-center gap-2 mt-3 overflow-x-auto scrollbar-none pt-2 border-t border-slate-100">
            {selectedExam.sections.map((sec) => {
              const secQs = selectedExam.questions.filter((q) => q.section === sec.section);
              const secAnswered = secQs.filter(isQuestionAnswered).length;
              const isActive = currentSection === sec.section;

              return (
                <button
                  key={sec.section}
                  onClick={() => {
                    setCurrentSection(sec.section);
                    setCurrentQuestionIndex(0);
                  }}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{sec.title.split('.')[0]}</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-blue-800 text-blue-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {secAnswered}/{secQs.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Exam Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Display Column (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            {currentQuestion && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
                {/* Section title & question header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
                      {selectedExam.sections.find((s) => s.section === currentSection)?.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-extrabold text-slate-900">
                        Câu {currentQuestion.orderNumber}:
                      </span>
                      <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                        {currentQuestion.points} điểm
                      </span>
                    </div>
                  </div>

                  {/* Bookmark / Flag button */}
                  <button
                    onClick={() => toggleFlag(currentQuestion.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                      flaggedQuestions[currentQuestion.id]
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        flaggedQuestions[currentQuestion.id]
                          ? 'fill-amber-500 text-amber-500'
                          : ''
                      }`}
                    />
                    <span>
                      {flaggedQuestions[currentQuestion.id] ? 'Đã đánh dấu' : 'Đánh dấu xem lại'}
                    </span>
                  </button>
                </div>

                {/* Question Stem (with chemistry notation support) */}
                <div className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium">
                  {currentQuestion.stem}
                </div>

                {/* Answer Options according to Section Type */}
                <div className="pt-2">
                  {/* PHẦN I: Multiple Choice Options */}
                  {currentQuestion.section === 1 && currentQuestion.options && (
                    <div className="space-y-3">
                      {currentQuestion.options.map((opt) => {
                        const isSelected = answers.part1[currentQuestion.id] === opt.id;
                        return (
                          <label
                            key={opt.id}
                            onClick={() => handleAnswerPart1(currentQuestion.id, opt.id)}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-50/70 border-blue-600 text-blue-950 shadow-sm'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition ${
                                isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white text-slate-700 border border-slate-300'
                              }`}
                            >
                              {opt.id}
                            </div>
                            <span className="text-base font-medium">{opt.content}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* PHẦN II: True/False 4 Statements (a, b, c, d) */}
                  {currentQuestion.section === 2 && currentQuestion.statements && (
                    <div className="space-y-4">
                      <div className="text-xs font-semibold text-slate-500 italic mb-2">
                        Chọn [Đúng] hoặc [Sai] cho từng ý sau:
                      </div>
                      {currentQuestion.statements.map((st) => {
                        const val = answers.part2[currentQuestion.id]?.[st.id];

                        return (
                          <div
                            key={st.id}
                            className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="flex items-start gap-3">
                              <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {st.id}
                              </span>
                              <span className="text-sm sm:text-base text-slate-800 font-medium">
                                {st.content}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => handleAnswerPart2(currentQuestion.id, st.id, true)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                                  val === true
                                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                                    : 'bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>ĐÚNG</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleAnswerPart2(currentQuestion.id, st.id, false)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                                  val === false
                                    ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                                    : 'bg-white text-rose-700 border border-rose-300 hover:bg-rose-50'
                                }`}
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>SAI</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* PHẦN III: Short Answer Text Input */}
                  {currentQuestion.section === 3 && (
                    <div className="space-y-4">
                      <div className="text-xs font-semibold text-slate-500 mb-2">
                        Nhập số nguyên, số thập phân hoặc giá trị yêu cầu:
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={answers.part3[currentQuestion.id] || ''}
                          onChange={(e) => handleAnswerPart3(currentQuestion.id, e.target.value)}
                          placeholder="Ví dụ: 13 hoặc 73 hoặc 23..."
                          className="w-full text-lg font-mono font-semibold px-4 py-3.5 bg-slate-50 border-2 border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none transition shadow-inner"
                        />
                      </div>
                      <p className="text-xs text-slate-400">
                        * Gợi ý: Có thể sử dụng dấu phẩy (,) hoặc dấu chấm (.) cho số thập phân.
                      </p>
                    </div>
                  )}
                </div>

                {/* Question Navigation Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (currentQuestionIndex > 0) {
                        setCurrentQuestionIndex((prev) => prev - 1);
                      } else if (currentSection > 1) {
                        const prevSec = (currentSection - 1) as 1 | 2;
                        setCurrentSection(prevSec);
                        const prevQs = selectedExam.questions.filter((q) => q.section === prevSec);
                        setCurrentQuestionIndex(prevQs.length - 1);
                      }
                    }}
                    disabled={currentSection === 1 && currentQuestionIndex === 0}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Câu trước</span>
                  </button>

                  <div className="text-xs text-slate-400 font-medium">
                    Câu {currentQuestion.orderNumber} / {totalQuestions}
                  </div>

                  <button
                    onClick={() => {
                      if (currentQuestionIndex < sectionQuestions.length - 1) {
                        setCurrentQuestionIndex((prev) => prev + 1);
                      } else if (currentSection < 3) {
                        const nextSec = (currentSection + 1) as 2 | 3;
                        setCurrentSection(nextSec);
                        setCurrentQuestionIndex(0);
                      }
                    }}
                    disabled={currentSection === 3 && currentQuestionIndex === sectionQuestions.length - 1}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed text-sm shadow-sm"
                  >
                    <span>Câu tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Question Palette Drawer Column (1 col) */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 sticky top-48">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h4 className="font-bold text-slate-900 text-sm">Bảng Điều Hướng Câu Hỏi</h4>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {answeredCount}/{totalQuestions} đã làm
                </span>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-3 gap-2 text-[11px] mb-4 text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-500"></span>
                  <span>Đã làm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-400"></span>
                  <span>Xem lại</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-slate-200"></span>
                  <span>Chưa làm</span>
                </div>
              </div>

              {/* Question buttons grouped by sections */}
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                {selectedExam.sections.map((sec) => {
                  const qList = selectedExam.questions.filter((q) => q.section === sec.section);
                  return (
                    <div key={sec.section}>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        {sec.title.split('.')[0]} ({qList.length} câu)
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {qList.map((q) => {
                          const isAnswered = isQuestionAnswered(q);
                          const isFlagged = !!flaggedQuestions[q.id];
                          const isCurrent = currentQuestion && currentQuestion.id === q.id;

                          let bgClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                          if (isAnswered) bgClass = 'bg-emerald-500 text-white font-bold';
                          if (isFlagged) bgClass = 'bg-amber-400 text-amber-950 font-bold';

                          return (
                            <button
                              key={q.id}
                              onClick={() => {
                                setCurrentSection(q.section);
                                const idx = selectedExam.questions
                                  .filter((x) => x.section === q.section)
                                  .findIndex((x) => x.id === q.id);
                                setCurrentQuestionIndex(idx >= 0 ? idx : 0);
                              }}
                              className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${bgClass} ${
                                isCurrent
                                  ? 'ring-2 ring-blue-600 ring-offset-1 scale-105'
                                  : ''
                              }`}
                            >
                              {q.orderNumber}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Submit */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => setShowConfirmSubmit(true)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Xác Nhận Nộp Bài</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Confirm Submit */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Xác nhận nộp bài thi?</h3>
                  <p className="text-xs text-slate-500">
                    Kiểm tra kỹ tình trạng các câu hỏi trước khi hoàn tất
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Thí sinh:</span>
                  <span className="font-bold text-slate-800">{studentName} ({studentClass})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Số câu đã hoàn thành:</span>
                  <span className="font-bold text-emerald-600">
                    {answeredCount} / {totalQuestions} câu
                  </span>
                </div>
                {answeredCount < totalQuestions && (
                  <div className="p-2.5 bg-amber-50 rounded-lg text-xs text-amber-800 font-medium border border-amber-200">
                    ⚠️ Chú ý: Bạn còn {totalQuestions - answeredCount} câu chưa trả lời. Bạn có chắc chắn muốn nộp không?
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition"
                >
                  Quay lại làm tiếp
                </button>
                <button
                  onClick={executeSubmission}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm shadow-md transition flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Xác Nhận Nộp</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. EXAM SELECTION & REGISTRATION SCREEN (Step 1 & 2)
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center">
          <GraduationCap className="w-80 h-80 text-white transform translate-x-16" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Phòng Thi Khảo Thí Trực Tuyến THPT Hòn Đất</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Cổng Thí Sinh Vào Phòng Thi
          </h2>
          <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
            Học sinh chọn đề thi đang phát hành, điền đầy đủ Họ tên và Lớp để bắt đầu làm bài theo cấu trúc chuẩn 3 phần.
          </p>
        </div>
      </div>

      {/* Available Exams List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Danh Sách Đề Thi Đang Phát Hành ({publishedExams.length})</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Tự động cập nhật theo thời gian thực
          </span>
        </div>

        {publishedExams.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-300 text-slate-500">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">Hiện chưa có đề thi nào đang được phát hành</p>
            <p className="text-xs text-slate-400 mt-1">
              Giáo viên cần vào "Khu Quản Trị Giáo Viên" để Duyệt và Phát hành đề thi cho học sinh.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publishedExams.map((exam) => {
              const isSelected = selectedExam?.id === exam.id;

              return (
                <div
                  key={exam.id}
                  onClick={() => setSelectedExam(exam)}
                  className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 ring-4 ring-blue-50 shadow-lg'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {exam.subject} • {exam.grade}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {exam.version}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base mb-1.5 line-clamp-2">
                    {exam.title}
                  </h4>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2 flex-wrap">
                    {exam.semester && (
                      <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded font-medium border border-blue-200">
                        {exam.semester} ({exam.academicYear || '2026-2027'})
                      </span>
                    )}
                    {exam.creator && (
                      <span>• Ra đề: <strong>{exam.creator}</strong></span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {exam.description || 'Đề thi trắc nghiệm khách quan 3 phần'}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1 font-semibold text-blue-950">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{exam.durationMinutes} phút</span>
                    </div>
                    <span>{exam.questions.length} câu hỏi (3 phần)</span>
                    <span className="font-bold text-emerald-600">Đang mở thi</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Student Registration Form (When an exam is picked) */}
      {selectedExam && (
        <form
          onSubmit={handleStartExam}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6 animate-scaleUp"
        >
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Thông Tin Thí Sinh Dự Thi</span>
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 flex-wrap">
              <span>Đề thi: <strong className="text-slate-900">{selectedExam.title}</strong></span>
              <span>•</span>
              <span>Thời gian: <strong className="text-blue-700">{selectedExam.durationMinutes} phút</strong></span>
              {selectedExam.semester && (
                <>
                  <span>•</span>
                  <span>{selectedExam.semester}</span>
                </>
              )}
              {selectedExam.creator && (
                <>
                  <span>•</span>
                  <span>Ra đề: <strong>{selectedExam.creator}</strong></span>
                </>
              )}
            </div>
            {selectedExam.instructions && (
              <div className="mt-2.5 p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950 font-medium">
                📋 <strong>Lưu ý từ giáo viên:</strong> {selectedExam.instructions}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Họ và tên học sinh <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn An"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none transition text-sm font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Lớp học <span className="text-rose-500">*</span>
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

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <p className="font-bold">Lưu ý trước khi bấm "Bắt đầu làm bài":</p>
            <p>1. Đồng hồ đếm ngược sẽ bắt đầu chạy ngay khi mở phòng thi.</p>
            <p>2. Hệ thống tự động sao lưu câu trả lời vào thiết bị sau mỗi 15 giây.</p>
            <p>3. Khi hết giờ, bài làm sẽ tự động được gửi về máy chủ khảo thí.</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedExam(null)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition"
            >
              Chọn đề khác
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Bắt Đầu Làm Bài</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

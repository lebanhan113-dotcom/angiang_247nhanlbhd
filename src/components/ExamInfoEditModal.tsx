import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Calendar, 
  Clock, 
  User, 
  GraduationCap, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Settings2,
  BookOpen,
  Shuffle,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Exam } from '../types/exam';

interface ExamInfoEditModalProps {
  exam: Exam;
  onClose: () => void;
  onSave: (updatedExam: Exam) => void;
}

export const ExamInfoEditModal: React.FC<ExamInfoEditModalProps> = ({
  exam,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(exam.title);
  const [code, setCode] = useState(exam.code);
  const [subject, setSubject] = useState(exam.subject);
  const [grade, setGrade] = useState(exam.grade);
  const [durationMinutes, setDurationMinutes] = useState(exam.durationMinutes);
  const [semester, setSemester] = useState(exam.semester || 'Giữa Học Kỳ I');
  const [academicYear, setAcademicYear] = useState(exam.academicYear || '2026 - 2027');
  const [creator, setCreator] = useState(exam.creator || exam.reviewedBy || 'Thầy Lê Bá Nhẫn (Tổ Hóa Học)');
  const [reviewedBy, setReviewedBy] = useState(exam.reviewedBy || 'Tổ Chuyên Môn - THPT Hòn Đất');
  const [totalScore, setTotalScore] = useState(exam.totalScore || 10.0);
  const [description, setDescription] = useState(exam.description || '');
  const [instructions, setInstructions] = useState(
    exam.instructions ||
      'Thí sinh không được sử dụng tài liệu hay Bảng tuần hoàn. Được sử dụng máy tính cầm tay theo danh mục quy định của Bộ GD&ĐT.'
  );
  const [allowedAttempts, setAllowedAttempts] = useState(exam.allowedAttempts || 1);
  const [shuffleOptions, setShuffleOptions] = useState(exam.shuffleOptions || false);
  const [answersVisible, setAnswersVisible] = useState(exam.answersVisible);
  const [startTime, setStartTime] = useState(exam.startTime || '2026-11-01 07:30');
  const [endTime, setEndTime] = useState(exam.endTime || '2026-11-01 11:30');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) {
      alert('Vui lòng nhập đầy đủ Tiêu đề và Mã đề thi!');
      return;
    }

    const updatedExam: Exam = {
      ...exam,
      title: title.trim(),
      code: code.trim(),
      subject,
      grade,
      durationMinutes: Number(durationMinutes) || 45,
      semester,
      academicYear,
      creator: creator.trim(),
      reviewedBy: reviewedBy.trim(),
      totalScore: Number(totalScore) || 10.0,
      description: description.trim(),
      instructions: instructions.trim(),
      allowedAttempts: Number(allowedAttempts) || 1,
      shuffleOptions,
      answersVisible,
      startTime,
      endTime,
    };

    onSave(updatedExam);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 rounded-xl border border-blue-400/40">
              <Settings2 className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/40">
                QUẢN TRỊ KHẢO THÍ V11.2
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                Nhập & Cập Nhật Thông Tin Đề Thi
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Identifiers */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Thông Tin Nhận Diện Đề Thi</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tiêu đề đề thi chính thức <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Đề Kiểm Tra Giữa Học Kỳ I - Hóa Học 10"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Mã đề thi (Code) <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Ví dụ: GK1-HOA10-001"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-blue-700 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Môn học:
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:border-blue-600 focus:outline-none"
                  >
                    <option value="Hóa Học">Hóa Học</option>
                    <option value="Vật Lí">Vật Lí</option>
                    <option value="Sinh Học">Sinh Học</option>
                    <option value="Toán Học">Toán Học</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Lịch Sử">Lịch Sử</option>
                    <option value="Địa Lí">Địa Lí</option>
                    <option value="Giáo Dục Kinh Tế & Pháp Luật">GD Kinh Tế & Pháp Luật</option>
                    <option value="Tin Học">Tin Học</option>
                    <option value="Công Nghệ">Công Nghệ</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Academic & Scheduling Information */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Khối Lớp, Học Kỳ & Thời Lượng</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Khối lớp:</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800"
                >
                  <option value="Lớp 10">Lớp 10</option>
                  <option value="Lớp 11">Lớp 11</option>
                  <option value="Lớp 12">Lớp 12</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Học kỳ:</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800"
                >
                  <option value="Giữa Học Kỳ I">Giữa Học Kỳ I</option>
                  <option value="Cuối Học Kỳ I">Cuối Học Kỳ I</option>
                  <option value="Giữa Học Kỳ II">Giữa Học Kỳ II</option>
                  <option value="Cuối Học Kỳ II">Cuối Học Kỳ II</option>
                  <option value="Khảo Sát Chuyên Đề">Khảo Sát Chuyên Đề</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Năm học:</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2026 - 2027"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Thời lượng làm bài:
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 45)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-blue-700 text-center"
                  />
                  <span className="text-slate-500 font-medium">phút</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Giáo viên ra đề:</label>
                <input
                  type="text"
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                  placeholder="Thầy Lê Bá Nhẫn (Tổ Hóa Học)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Người thẩm định / duyệt:</label>
                <input
                  type="text"
                  value={reviewedBy}
                  onChange={(e) => setReviewedBy(e.target.value)}
                  placeholder="Tổ Chuyên Môn THPT Hòn Đất"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Exam Rules & Security Options */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Quy Chế & Bảo Mật Phòng Thi</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-800 block">Số lượt làm bài tối đa:</span>
                    <span className="text-slate-500 text-[11px]">Quy định số lần thí sinh được nộp bài</span>
                  </div>
                  <select
                    value={allowedAttempts}
                    onChange={(e) => setAllowedAttempts(parseInt(e.target.value) || 1)}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg font-bold text-blue-700"
                  >
                    <option value="1">1 lần (Chính thức)</option>
                    <option value="2">2 lần</option>
                    <option value="99">Không giới hạn (Luyện tập)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-800 block">Hoán vị phương án (A/B/C/D):</span>
                    <span className="text-slate-500 text-[11px]">Trộn thứ tự phương án giữa các học sinh</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={shuffleOptions}
                    onChange={(e) => setShuffleOptions(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Công bố đáp án (answers_visible):</span>
                    <span className="text-slate-500 text-[11px]">
                      {answersVisible ? 'Học sinh xem được lời giải chi tiết' : 'Đang tạm khóa lời giải chi tiết'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnswersVisible(!answersVisible)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                      answersVisible
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {answersVisible ? 'ĐANG MỞ' : 'ĐANG KHÓA'}
                  </button>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Khung giờ mở phòng thi:</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Bắt đầu:</span>
                      <input
                        type="text"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        placeholder="2026-11-01 07:30"
                        className="w-full px-2 py-1 bg-slate-50 border rounded font-mono text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 block">Kết thúc:</span>
                      <input
                        type="text"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        placeholder="2026-11-01 11:30"
                        className="w-full px-2 py-1 bg-slate-50 border rounded font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions for Students */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-700 block">
              Hướng dẫn & Ghi chú làm bài hiển thị cho thí sinh:
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Nhập lưu ý cho học sinh trước khi bấm bắt đầu làm bài..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Thông Tin Đề Thi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

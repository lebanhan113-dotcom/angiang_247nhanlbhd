import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Eye, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  Filter,
  FileSpreadsheet,
  X,
  Check,
  Award
} from 'lucide-react';
import { ExamSubmission, Exam } from '../types/exam';
import { exportSubmissionsToExcel } from '../utils/excelExport';

interface SubmissionsViewProps {
  submissions: ExamSubmission[];
  exams: Exam[];
}

export const SubmissionsView: React.FC<SubmissionsViewProps> = ({
  submissions,
  exams,
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingSub, setInspectingSub] = useState<ExamSubmission | null>(null);

  // Filter logic
  const filteredSubmissions = submissions.filter((sub) => {
    if (selectedExamId !== 'all' && sub.examId !== selectedExamId) return false;
    if (selectedClass !== 'all' && sub.studentClass !== selectedClass) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sub.studentName.toLowerCase().includes(q);
      const matchCode = sub.lookupCode.toLowerCase().includes(q);
      const matchExam = sub.examCode.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchExam) return false;
    }
    return true;
  });

  // Calculate statistics
  const totalSubs = filteredSubmissions.length;
  const avgScore = totalSubs > 0
    ? (
        filteredSubmissions.reduce((acc, cur) => acc + (cur.grading?.totalScore ?? 0), 0) /
        totalSubs
      ).toFixed(2)
    : '0.00';

  const handleExport = () => {
    const examObj = exams.find((e) => e.id === selectedExamId);
    exportSubmissionsToExcel(filteredSubmissions, examObj?.title || 'TOAN_TRUONG');
  };

  const associatedExam = inspectingSub
    ? exams.find((e) => e.id === inspectingSub.examId)
    : null;

  return (
    <div className="space-y-6">
      {/* Top Filter and Action Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs flex-1">
          {/* Search box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên học sinh, mã tra cứu..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none text-xs"
            />
          </div>

          {/* Exam Filter */}
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-xs text-slate-700"
          >
            <option value="all">Tất cả đề thi ({exams.length})</option>
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.code} - {ex.title.substring(0, 30)}...
              </option>
            ))}
          </select>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-xs text-slate-700"
          >
            <option value="all">Tất cả các lớp</option>
            <option value="10A1">Lớp 10A1</option>
            <option value="10A2">Lớp 10A2</option>
            <option value="10A3">Lớp 10A3</option>
            <option value="11B1">Lớp 11B1</option>
            <option value="12C1">Lớp 12C1</option>
          </select>
        </div>

        {/* Export Excel Button (Criterion 22) */}
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition shrink-0"
          title="Xuất danh sách điểm ra định dạng Microsoft Excel (.xlsx)"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Xuất Bảng Điểm Excel (.xlsx)</span>
        </button>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-sm">
            Danh Sách Bài Nộp Thu Được ({filteredSubmissions.length})
          </h4>
          <span className="text-xs text-slate-500">
            Điểm trung bình: <strong className="text-blue-700 font-bold">{avgScore}đ</strong>
          </span>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Không có bài nộp nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">STT</th>
                  <th className="py-3 px-4">Mã tra cứu</th>
                  <th className="py-3 px-4">Họ và tên</th>
                  <th className="py-3 px-4">Lớp</th>
                  <th className="py-3 px-4">Mã đề / Version</th>
                  <th className="py-3 px-3 text-center">Phần I (4.5đ)</th>
                  <th className="py-3 px-3 text-center">Phần II (4.0đ)</th>
                  <th className="py-3 px-3 text-center">Phần III (1.5đ)</th>
                  <th className="py-3 px-4 text-center font-extrabold text-blue-900">Tổng điểm</th>
                  <th className="py-3 px-4">Thời gian nộp</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map((sub, idx) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {sub.lookupCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {sub.studentName}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {sub.studentClass}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 line-clamp-1">{sub.examCode}</div>
                      <span className="text-[10px] text-slate-400 font-mono">v{sub.examVersion}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">
                      {sub.grading?.part1Score ?? 0}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">
                      {sub.grading?.part2Score ?? 0}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">
                      {sub.grading?.part3Score ?? 0}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                        {sub.grading?.totalScore ?? 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {sub.submittedAt.substring(11, 19)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setInspectingSub(sub)}
                        className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold rounded-lg transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem bài</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Paper Inspection Modal */}
      {inspectingSub && associatedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            <div className="bg-gradient-to-r from-blue-950 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {inspectingSub.lookupCode}
                </span>
                <h3 className="text-lg font-bold text-white">
                  Bài Làm: {inspectingSub.studentName} ({inspectingSub.studentClass})
                </h3>
              </div>
              <button
                onClick={() => setInspectingSub(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between text-xs text-blue-950">
                <span>Tổng điểm: <strong className="text-base text-blue-700">{inspectingSub.grading?.totalScore}đ</strong> / 10.0đ</span>
                <span>Thời gian làm bài: {Math.floor(inspectingSub.timeSpentSeconds / 60)}m {inspectingSub.timeSpentSeconds % 60}s</span>
                <span>Nộp lúc: {inspectingSub.submittedAt}</span>
              </div>

              {/* Questions list */}
              <div className="space-y-3">
                {associatedExam.questions.map((q) => {
                  const detail = inspectingSub.grading?.details.find((d) => d.questionId === q.id);
                  const isCorrect = detail?.isFullyCorrect ?? false;

                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Câu {q.orderNumber} (Phần {q.section})</span>
                        <span className={`px-2 py-0.5 rounded font-bold ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {detail?.earnedPoints} / {detail?.maxPoints}đ
                        </span>
                      </div>
                      <div className="text-slate-800 font-medium">{q.stem}</div>
                      
                      {q.section === 1 && (
                        <div className="text-slate-600">
                          Học sinh chọn: <strong className="text-blue-900 font-bold">{inspectingSub.answers.part1[q.id] || '(Chưa chọn)'}</strong> • 
                          Đáp án đúng: <strong className="text-emerald-700 font-bold">{q.options?.find(o => o.isCorrect)?.id}</strong>
                        </div>
                      )}

                      {q.section === 2 && (
                        <div className="text-slate-600">
                          {q.statements?.map(st => (
                            <span key={st.id} className="mr-3">
                              {st.id}: {inspectingSub.answers.part2[q.id]?.[st.id] === true ? 'Đ' : 'S'} (Đáp án: {st.isCorrect ? 'Đ' : 'S'})
                            </span>
                          ))}
                        </div>
                      )}

                      {q.section === 3 && (
                        <div className="text-slate-600">
                          Học sinh điền: <strong className="font-mono text-blue-900">{inspectingSub.answers.part3[q.id] || '(Trống)'}</strong> • 
                          Đáp án đúng: <strong className="font-mono text-emerald-700">{q.shortAnswer}</strong>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-100 px-6 py-3 border-t flex justify-end">
              <button
                onClick={() => setInspectingSub(null)}
                className="px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold rounded-xl text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

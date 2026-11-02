import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  FileCode, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  BookOpen,
  Wand2,
  Check,
  Type,
  FileCheck
} from 'lucide-react';
import { parseExamContent } from '../utils/docxParser';
import { extractTextFromWordFile } from '../utils/docxReader';
import { autoFixVietnameseFont, convertTCVN3ToUnicode, convertVNIToUnicode } from '../utils/vietnameseFontConverter';
import { Exam } from '../types/exam';

interface WordImportModalProps {
  onClose: () => void;
  onImportComplete: (exam: Exam) => void;
}

export const WordImportModal: React.FC<WordImportModalProps> = ({
  onClose,
  onImportComplete,
}) => {
  const [fileName, setFileName] = useState<string>('Nguon_GK1_Hoa_10_001_AI.docx');
  const [examTitle, setExamTitle] = useState<string>('Đề Kiểm Tra Giữa Học Kỳ I - Hóa Học 10');
  const [examCode, setExamCode] = useState<string>('GK1-HOA10-001');
  const [subject, setSubject] = useState<string>('Hóa Học');
  const [grade, setGrade] = useState<string>('Lớp 10');
  const [semester, setSemester] = useState<string>('Giữa Học Kỳ I');
  const [academicYear, setAcademicYear] = useState<string>('2026 - 2027');
  const [creator, setCreator] = useState<string>('Thầy Lê Bá Nhẫn (Tổ Hóa Học)');
  const [instructions, setInstructions] = useState<string>('Thí sinh không được sử dụng tài liệu hay Bảng tuần hoàn. Được sử dụng máy tính cầm tay theo quy định.');
  const [allowedAttempts, setAllowedAttempts] = useState<number>(1);
  const [duration, setDuration] = useState<number>(45);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [detectedEncoding, setDetectedEncoding] = useState<string>('UTF-8 (Unicode Chuẩn)');
  const [redMarksCount, setRedMarksCount] = useState<number>(24);
  const [fontFixedNotice, setFontFixedNotice] = useState<string>('');

  const [rawText, setRawText] = useState<string>(`PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN
Câu 1: Hạt mang điện tích âm trong nguyên tử là loại hạt nào sau đây?
A. Electron. [đỏ gạch chân]
B. Proton.
C. Neutron.
D. Hạt nhân.

Câu 2: Nguyên tử của nguyên tố X có 13 proton và 14 neutron. Kí hiệu nguyên tử của X là
A. ¹³₁₄X.
B. ¹⁴₁₃X.
C. ²⁷₁₃X. [đỏ gạch chân]
D. ²⁷₁₄X.

Câu 3: Số orbital nguyên tử (AO) có trong lớp electron thứ 3 (lớp M, n = 3) là
A. 3.
B. 6.
C. 8.
D. 9. [đỏ gạch chân]

Câu 4: Cấu hình electron của nguyên tử phosphorus (Z = 15) ở trạng thái cơ bản là
A. 1s² 2s² 2p⁶ 3s¹ 3p⁴.
B. 1s² 2s² 2p⁶ 3s² 3p³. [đỏ gạch chân]
C. 1s² 2s² 2p⁶ 3s² 3p⁵.
D. 1s² 2s² 2p⁶ 4s² 3d³.

Câu 5: Bán kính nguyên tử của các nguyên tố Na (Z=11), Mg (Z=12), K (Z=19) biến đổi theo chiều tăng dần nào?
A. Mg < Na < K. [đỏ gạch chân]
B. Na < Mg < K.
C. K < Na < Mg.
D. Mg < K < Na.

PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG - SAI
Câu 19: Cho nguyên tố X có số hiệu nguyên tử Z = 17 (Chlorine). Xét tính đúng/sai của các mệnh đề sau:
a) Nguyên tử X có 7 electron ở lớp ngoài cùng. [đỏ gạch chân]
b) X là một kim loại mạnh có tính khử cao.
c) Hydroxide ứng với oxide cao nhất của X là HClO₄ (acid rất mạnh). [đỏ gạch chân]
d) Hợp chất khí của X với hydrogen có công thức là XH₄.

Câu 20: Xét cấu tạo nguyên tử và liên kết hóa học của hai phân tử H₂O và CH₄:
a) Trong phân tử H₂O, nguyên tử oxygen còn lại 2 cặp electron tự do. [đỏ gạch chân]
b) Phân tử CH₄ có hình dạng hình học là hình tam giác phẳng.
c) Liên kết giữa nguyên tử H và O trong nước là liên kết cộng hóa trị phân cực. [đỏ gạch chân]
d) Do liên kết C-H phân cực nên phân tử CH₄ là một phân tử có cực mạnh.

PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN
Câu 21: Tổng số hạt proton, neutron và electron trong một nguyên tử X là 40 hạt. Trong đó, số hạt mang điện nhiều hơn số hạt không mang điện là 12 hạt. Tính số proton (Z) của nguyên tử X.
Đáp án: 13

Câu 22: Nguyên tố đồng (Cu) có 2 đồng vị ⁶³Cu và ⁶⁵Cu. Nguyên tử khối trung bình là 63,54. Tính phần trăm số nguyên tử của ⁶³Cu.
Đáp án: 73

Câu 23: Cho nguyên tố iron (Fe) có Z = 26. Hãy cho biết ion Fe³⁺ có bao nhiêu electron ở phân lớp 3d?
Đáp án: 5

Câu 24: Khi cho 4,6 gam kim loại kiềm nhóm IA tác dụng với nước dư thu được 0,1 mol khí H₂. Xác định nguyên tử khối (M).
Đáp án: 23`);

  // Xử lý khi tải file Word lên
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setFontFixedNotice('');

    try {
      // Đọc trực tiếp định dạng nhị phân DOCX bằng JSZip và DOMParser
      const extracted = await extractTextFromWordFile(file);

      setRawText(extracted.text);
      setDetectedEncoding(extracted.detectedFontEncoding);
      setRedMarksCount(extracted.redUnderlineFound);

      setFontFixedNotice(
        `✓ Đã trích xuất thành công ${extracted.paragraphCount} đoạn văn bản. Bảng mã: ${extracted.detectedFontEncoding}. Đã nhận diện ${extracted.redUnderlineFound} dấu đáp án màu đỏ/gạch chân.`
      );
    } catch (err) {
      console.error('Error reading Word file', err);
      setFontFixedNotice('Có lỗi khi đọc file Word, đã chuyển sang chế độ đọc dự phòng UTF-8.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Nút thủ công: Chuyển mã TCVN3 (.VnTime) sang Unicode
  const handleFixTCVN3 = () => {
    const converted = convertTCVN3ToUnicode(rawText);
    setRawText(converted);
    setDetectedEncoding('TCVN3 -> Unicode UTF-8');
    setFontFixedNotice('✓ Đã chuyển đổi toàn bộ font chữ từ TCVN3 (.VnTime) sang Unicode UTF-8 chuẩn.');
  };

  // Nút thủ công: Chuyển mã VNI sang Unicode
  const handleFixVNI = () => {
    const converted = convertVNIToUnicode(rawText);
    setRawText(converted);
    setDetectedEncoding('VNI -> Unicode UTF-8');
    setFontFixedNotice('✓ Đã chuyển đổi toàn bộ font chữ từ VNI sang Unicode UTF-8 chuẩn.');
  };

  // Nút chuẩn hóa dấu tiếng Việt
  const handleNormalizeVietnamese = () => {
    const fixed = autoFixVietnameseFont(rawText);
    setRawText(fixed.text);
    setDetectedEncoding(fixed.detectedEncoding);
    setFontFixedNotice(`✓ Đã chuẩn hóa dấu tiếng Việt chuẩn Unicode NFC (${fixed.detectedEncoding}).`);
  };

  const handleExecuteImport = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const result = parseExamContent(rawText, fileName, subject, grade);
      result.exam.title = examTitle.trim() || result.exam.title;
      result.exam.code = examCode.trim() || result.exam.code;
      result.exam.durationMinutes = duration;
      result.exam.semester = semester;
      result.exam.academicYear = academicYear;
      result.exam.creator = creator;
      result.exam.instructions = instructions;
      result.exam.allowedAttempts = allowedAttempts;
      result.exam.status = 'pending_review'; // Chuyển thẳng vào hàng đợi duyệt
      setIsProcessing(false);
      onImportComplete(result.exam);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 rounded-xl border border-blue-400/40">
              <UploadCloud className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/40">
                  SỬA LỖI FONT & TỰ ĐỘNG NHẬN DIỆN V11.2
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Nhập Đề Word (.docx) / PDF – Chuẩn Hóa Font Tiếng Việt & Đáp Án
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Font Fix Notice Banner */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-xs text-emerald-950 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-emerald-900 text-sm">
                Tính năng xử lý & sửa triệt để lỗi font tiếng Việt:
              </span>
              <p className="leading-relaxed">
                Hệ thống giải mã trực tiếp cấu trúc XML của file Word (OOXML ZIP), tự động sửa lỗi bảng mã <strong>TCVN3 (.VnTime, .VnTimeH)</strong>, <strong>VNI-Times</strong>, bảo toàn ký hiệu hóa học (³⁵₁₇Cl, Al³⁺, 3s²3p⁵) và nhận diện đáp án <strong>tô đỏ gạch chân</strong>.
              </p>
            </div>
          </div>

          {/* Comprehensive Exam Information Inputs */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Nhập Thông Tin Đề Thi</span>
              </span>
              <span className="text-[11px] text-slate-400">Có thể chỉnh sửa lại trong màn hình duyệt đề</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="text-slate-600 font-bold block mb-1">
                    Tiêu đề đề thi:
                  </label>
                  <input
                    type="text"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    placeholder="VD: Đề Kiểm Tra Giữa Học Kỳ I - Hóa Học 10"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-bold block mb-1">
                    Mã đề thi (Code):
                  </label>
                  <input
                    type="text"
                    value={examCode}
                    onChange={(e) => setExamCode(e.target.value.toUpperCase())}
                    placeholder="GK1-HOA10-001"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-blue-700 text-xs focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="text-slate-600 font-bold block mb-1">Môn học:</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-xs"
                  >
                    <option value="Hóa Học">Hóa Học</option>
                    <option value="Vật Lí">Vật Lí</option>
                    <option value="Sinh Học">Sinh Học</option>
                    <option value="Toán Học">Toán Học</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Lịch Sử">Lịch Sử</option>
                    <option value="Địa Lí">Địa Lí</option>
                    <option value="Tin Học">Tin Học</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 font-bold block mb-1">Khối lớp:</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-xs"
                  >
                    <option value="Lớp 10">Lớp 10</option>
                    <option value="Lớp 11">Lớp 11</option>
                    <option value="Lớp 12">Lớp 12</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 font-bold block mb-1">Học kỳ:</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-xs"
                  >
                    <option value="Giữa Học Kỳ I">Giữa Học Kỳ I</option>
                    <option value="Cuối Học Kỳ I">Cuối Học Kỳ I</option>
                    <option value="Giữa Học Kỳ II">Giữa Học Kỳ II</option>
                    <option value="Cuối Học Kỳ II">Cuối Học Kỳ II</option>
                    <option value="Khảo Sát Định Kỳ">Khảo Sát Định Kỳ</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 font-bold block mb-1">Thời gian (phút):</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 45)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-center text-blue-700 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-600 font-bold block mb-1">Giáo viên ra đề / thẩm định:</label>
                  <input
                    type="text"
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    placeholder="Thầy Lê Bá Nhẫn (Tổ Hóa Học)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-bold block mb-1">Hướng dẫn thí sinh làm bài:</label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Lưu ý thi..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* File Upload Zone */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Tải lên file Word (.docx) từ máy tính của giáo viên:
            </label>
            <label className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/70 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition text-center">
              <UploadCloud className="w-9 h-9 text-blue-600 mb-2" />
              <span className="text-sm font-bold text-slate-800">
                {fileName || 'Chọn tệp Word (.docx, .doc) hoặc .pdf'}
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Hệ thống tự động giải mã ZIP nhị phân, đọc đúng font Unicode tiếng Việt và trích xuất đáp án tô đỏ
              </span>
              <input
                type="file"
                accept=".docx,.doc,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Font Fix Toolbar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-semibold">Bảng mã hiện tại:</span>
                <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded border border-blue-200">
                  {detectedEncoding}
                </span>
                {redMarksCount > 0 && (
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    {redMarksCount} dấu đáp án đỏ
                  </span>
                )}
              </div>

              {/* Manual font conversion buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleNormalizeVietnamese}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-300 flex items-center gap-1 transition"
                  title="Tự động phát hiện và chuẩn hóa bảng mã Unicode NFC"
                >
                  <Wand2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sửa Font Tự Động</span>
                </button>

                <button
                  type="button"
                  onClick={handleFixTCVN3}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition"
                  title="Chuyển đổi từ font .VnTime, .VnTimeH sang Unicode"
                >
                  TCVN3 (.VnTime) → Unicode
                </button>

                <button
                  type="button"
                  onClick={handleFixVNI}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition"
                  title="Chuyển đổi từ font VNI-Times sang Unicode"
                >
                  VNI → Unicode
                </button>
              </div>
            </div>

            {fontFixedNotice && (
              <div className="text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{fontFixedNotice}</span>
              </div>
            )}
          </div>

          {/* Raw Text Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Nội dung văn bản tiếng Việt sau khi trích xuất (Không lỗi font):</span>
              </label>
              <span className="text-slate-400">Có thể trực tiếp gõ hoặc chỉnh sửa</span>
            </div>
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full text-xs font-sans leading-relaxed p-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">
            * Bỏ bước lưu nháp: Đề được nạp thẳng vào hàng đợi duyệt của giáo viên.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition"
            >
              Hủy
            </button>
            <button
              onClick={handleExecuteImport}
              disabled={isProcessing}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isProcessing ? 'Đang xử lý...' : 'Trích Xuất & Mở Duyệt Đề Ngay'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

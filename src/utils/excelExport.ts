import * as XLSX from 'xlsx';
import { ExamSubmission } from '../types/exam';

export function exportSubmissionsToExcel(submissions: ExamSubmission[], examTitle?: string) {
  const fileName = `BANG_DIEM_THI_${(examTitle || 'THPT_HON_DAT')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;

  const rows = submissions.map((sub, index) => {
    const minutes = Math.floor(sub.timeSpentSeconds / 60);
    const seconds = sub.timeSpentSeconds % 60;
    const durationStr = `${minutes}m ${seconds}s`;

    return {
      STT: index + 1,
      'Mã tra cứu': sub.lookupCode,
      'Họ và tên học sinh': sub.studentName,
      'Lớp': sub.studentClass,
      'Mã đề': sub.examCode,
      'Phiên bản đề': sub.examVersion,
      'Điểm Phần I (/4.5đ)': sub.grading?.part1Score ?? 0,
      'Điểm Phần II (/4.0đ)': sub.grading?.part2Score ?? 0,
      'Điểm Phần III (/1.5đ)': sub.grading?.part3Score ?? 0,
      'Tổng điểm (/10.0đ)': sub.grading?.totalScore ?? 0,
      'Thời gian làm bài': durationStr,
      'Thời điểm nộp bài': sub.submittedAt,
      'Trạng thái': 'Đã hoàn thành',
    };
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 6 },  // STT
    { wch: 18 }, // Mã tra cứu
    { wch: 25 }, // Họ và tên
    { wch: 10 }, // Lớp
    { wch: 28 }, // Mã đề
    { wch: 14 }, // Phiên bản
    { wch: 20 }, // Phần I
    { wch: 20 }, // Phần II
    { wch: 20 }, // Phần III
    { wch: 18 }, // Tổng điểm
    { wch: 18 }, // Thời gian làm bài
    { wch: 22 }, // Thời điểm nộp
    { wch: 16 }, // Trạng thái
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bảng Điểm Thu Bài');

  // Trigger download
  XLSX.writeFile(workbook, fileName);
}

import { Exam, ExamSubmission, ExamStats, SupabaseConfig, ChecklistItem } from '../types/exam';
import { SAMPLE_EXAMS } from '../data/sampleExam';
import { INITIAL_CHECKLIST_ITEMS } from '../data/handbookData';

const STORAGE_KEYS = {
  EXAMS: 'thpt_hd_exams_v11_2',
  SUBMISSIONS: 'thpt_hd_submissions_v11_2',
  SUPABASE_CONFIG: 'thpt_hd_supabase_config_v11_2',
  STATS: 'thpt_hd_stats_v11_2',
  CHECKLIST: 'thpt_hd_checklist_v11_2',
  VISITOR_FLAG: 'thpt_hd_visitor_logged',
};

// Seed realistic sample submissions
const INITIAL_SUBMISSIONS: ExamSubmission[] = [
  {
    id: 'sub-001',
    lookupCode: 'HD-2026-N89B2',
    examId: 'exam-gk1-hoa10-001',
    examCode: 'Nguon GK1 Hoa 10-001 - TRONDE - 3P - AI',
    examTitle: 'Đề Kiểm Tra Giữa Học Kỳ I - Hóa Học 10 (Mẫu Chuẩn 3 Phần)',
    examVersion: 'v11.2',
    studentName: 'Nguyễn Văn An',
    studentClass: '10A1',
    submittedAt: '2026-11-01 08:35:12',
    timeSpentSeconds: 2140,
    answers: {
      part1: { q1: 'A', q2: 'C', q3: 'D', q4: 'B', q5: 'B', q6: 'C', q7: 'A', q8: 'C', q9: 'A', q10: 'D', q11: 'A', q12: 'B', q13: 'C', q14: 'B', q15: 'D', q16: 'C', q17: 'A', q18: 'D' },
      part2: {
        q19: { a: true, b: false, c: true, d: false },
        q20: { a: true, b: false, c: true, d: false },
      },
      part3: { q21: '13', q22: '73', q23: '5', q24: '23' },
    },
    grading: {
      part1Score: 4.5,
      part2Score: 4.0,
      part3Score: 1.5,
      totalScore: 10.0,
      maxScore: 10.0,
      details: [],
    },
  },
  {
    id: 'sub-002',
    lookupCode: 'HD-2026-K45P9',
    examId: 'exam-gk1-hoa10-001',
    examCode: 'Nguon GK1 Hoa 10-001 - TRONDE - 3P - AI',
    examTitle: 'Đề Kiểm Tra Giữa Học Kỳ I - Hóa Học 10 (Mẫu Chuẩn 3 Phần)',
    examVersion: 'v11.2',
    studentName: 'Trần Thị Mai',
    studentClass: '10A1',
    submittedAt: '2026-11-01 08:42:05',
    timeSpentSeconds: 2310,
    answers: {
      part1: { q1: 'A', q2: 'C', q3: 'D', q4: 'B', q5: 'B', q6: 'C', q7: 'A', q8: 'C', q9: 'A', q10: 'D', q11: 'B', q12: 'B', q13: 'C', q14: 'B', q15: 'D', q16: 'C', q17: 'A', q18: 'D' },
      part2: {
        q19: { a: true, b: false, c: true, d: false },
        q20: { a: true, b: true, c: true, d: false },
      },
      part3: { q21: '13', q22: '73', q23: '6', q24: '23' },
    },
    grading: {
      part1Score: 4.25,
      part2Score: 3.5,
      part3Score: 1.125,
      totalScore: 8.875,
      maxScore: 10.0,
      details: [],
    },
  },
  {
    id: 'sub-003',
    lookupCode: 'HD-2026-T12W8',
    examId: 'exam-gk1-hoa10-001',
    examCode: 'Nguon GK1 Hoa 10-001 - TRONDE - 3P - AI',
    examTitle: 'Đề Kiểm Tra Giữa Học Kỳ I - Hóa Học 10 (Mẫu Chuẩn 3 Phần)',
    examVersion: 'v11.2',
    studentName: 'Lê Hoàng Long',
    studentClass: '10A2',
    submittedAt: '2026-11-01 08:44:20',
    timeSpentSeconds: 2450,
    answers: {
      part1: { q1: 'A', q2: 'B', q3: 'D', q4: 'B', q5: 'B', q6: 'C', q7: 'A', q8: 'A', q9: 'A', q10: 'D', q11: 'A', q12: 'B', q13: 'C', q14: 'B', q15: 'C', q16: 'C', q17: 'A', q18: 'D' },
      part2: {
        q19: { a: true, b: false, c: true, d: true },
        q20: { a: true, b: false, c: true, d: false },
      },
      part3: { q21: '13', q22: '75', q23: '5', q24: '23' },
    },
    grading: {
      part1Score: 3.75,
      part2Score: 3.0,
      part3Score: 1.125,
      totalScore: 7.875,
      maxScore: 10.0,
      details: [],
    },
  },
];

export const StorageService = {
  getExams(): Exam[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXAMS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading exams from storage', e);
    }
    // Default to sample exams
    this.saveExams(SAMPLE_EXAMS);
    return SAMPLE_EXAMS;
  },

  saveExams(exams: Exam[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
      window.dispatchEvent(new CustomEvent('thpt_exams_updated', { detail: exams }));
    } catch (e) {
      console.error('Error saving exams to storage', e);
    }
  },

  getExamById(id: string): Exam | undefined {
    return this.getExams().find((e) => e.id === id);
  },

  updateExam(updated: Exam): void {
    const list = this.getExams();
    const idx = list.findIndex((e) => e.id === updated.id);
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.push(updated);
    }
    this.saveExams(list);
  },

  deleteExam(examId: string): boolean {
    const list = this.getExams();
    const updated = list.filter((e) => e.id !== examId);
    if (updated.length !== list.length) {
      this.saveExams(updated);
      return true;
    }
    return false;
  },

  toggleAnswersVisibility(examId: string, visible: boolean): Exam | undefined {
    const list = this.getExams();
    const target = list.find((e) => e.id === examId);
    if (target) {
      target.answersVisible = visible;
      this.saveExams(list);
      return target;
    }
    return undefined;
  },

  getSubmissions(): ExamSubmission[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading submissions', e);
    }
    // Seed default submissions
    this.saveSubmissions(INITIAL_SUBMISSIONS);
    return INITIAL_SUBMISSIONS;
  },

  saveSubmissions(submissions: ExamSubmission[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
      window.dispatchEvent(new CustomEvent('thpt_submissions_updated', { detail: submissions }));
    } catch (e) {
      console.error('Error saving submissions', e);
    }
  },

  addSubmission(sub: ExamSubmission): void {
    const list = this.getSubmissions();
    list.unshift(sub);
    this.saveSubmissions(list);

    // Update stats
    this.incrementParticipation(sub.examId);
    this.incrementSubmission(sub.examId);
  },

  findSubmission(lookupCode: string, studentName: string, studentClass: string): ExamSubmission | undefined {
    const list = this.getSubmissions();
    const clean = (s: string) => s.trim().toLowerCase();
    return list.find(
      (s) =>
        s.lookupCode.trim().toUpperCase() === lookupCode.trim().toUpperCase() &&
        clean(s.studentName) === clean(studentName) &&
        clean(s.studentClass) === clean(studentClass)
    );
  },

  getSupabaseConfig(): SupabaseConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
      if (data) {
        const parsed = JSON.parse(data);
        // Auto-migrate if older demo url was stored or missing cloud URLs
        if (
          !parsed.projectUrl || 
          parsed.projectUrl.includes('wsx5dddkurgyedpkqghebw') || 
          !parsed.projectRef ||
          parsed.projectRef !== 'wzcosdniivggetnkdhmn'
        ) {
          parsed.projectUrl = 'https://wzcosdniivggetnkdhmn.supabase.co';
          parsed.projectRef = 'wzcosdniivggetnkdhmn';
          parsed.dashboardUrl = 'https://supabase.com/dashboard/project/wzcosdniivggetnkdhmn';
          parsed.githubUrl = 'https://github.com/lebanhan113-dotcom/247nhanlbonline';
          parsed.vercelUrl = 'https://vercel.com/le-nhan/247nhanlbonline';
          parsed.mode = 'cloud';
          parsed.isConnected = true;
          this.saveSupabaseConfig(parsed);
        }
        return parsed;
      }
    } catch (e) {}
    return {
      projectUrl: 'https://wzcosdniivggetnkdhmn.supabase.co',
      projectRef: 'wzcosdniivggetnkdhmn',
      dashboardUrl: 'https://supabase.com/dashboard/project/wzcosdniivggetnkdhmn',
      githubUrl: 'https://github.com/lebanhan113-dotcom/247nhanlbonline',
      vercelUrl: 'https://vercel.com/le-nhan/247nhanlbonline',
      publishableKey: 'sbp_pub_hon_dat_token_wzcosdniivggetnkdhmn',
      isConnected: true,
      lastTestedAt: new Date().toISOString(),
      mode: 'cloud',
    };
  },

  saveSupabaseConfig(cfg: SupabaseConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(cfg));
      window.dispatchEvent(new CustomEvent('thpt_supabase_updated', { detail: cfg }));
    } catch (e) {}
  },

  getChecklist(): ChecklistItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return INITIAL_CHECKLIST_ITEMS;
  },

  saveChecklist(items: ChecklistItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(items));
    } catch (e) {}
  },

  recordVisitor(): void {
    try {
      const stats = this.getStats();
      stats.visitors = (stats.visitors || 128) + 1;
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {}
  },

  incrementParticipation(examId?: string): void {
    try {
      const stats = this.getStats();
      stats.participations = (stats.participations || 42) + 1;
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {}
  },

  incrementSubmission(examId?: string): void {
    try {
      const stats = this.getStats();
      stats.submissions = (stats.submissions || 3) + 1;
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {}
  },

  getStats(): { visitors: number; participations: number; submissions: number } {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return { visitors: 145, participations: 56, submissions: 3 };
  },

  resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.EXAMS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    this.saveExams(SAMPLE_EXAMS);
    this.saveSubmissions(INITIAL_SUBMISSIONS);
  },
};

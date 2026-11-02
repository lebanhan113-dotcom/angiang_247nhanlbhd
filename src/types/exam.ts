export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export type ExamStatus = 'draft' | 'pending_review' | 'approved' | 'published' | 'closed';

export interface OptionItem {
  id: string; // 'A', 'B', 'C', 'D'
  content: string;
  isCorrect?: boolean;
  markedReason?: string; // e.g. "red_underline"
}

export interface StatementItem {
  id: string; // 'a', 'b', 'c', 'd'
  content: string;
  isCorrect?: boolean; // true = Đúng, false = Sai
  markedReason?: string; // e.g. "red_underline -> Đúng"
}

export interface Question {
  id: string;
  orderNumber: number;
  section: 1 | 2 | 3; // Phần I, II, III
  type: QuestionType;
  stem: string;
  options?: OptionItem[]; // For Part I
  statements?: StatementItem[]; // For Part II
  shortAnswer?: string; // For Part III
  acceptableAnswers?: string[]; // Alternative variations (e.g., "12", "12.0", "12,0")
  solution?: string;
  points: number;
  sourceAnswer?: string; // "red_underline", "key_line", "manual"
  sourceProof?: string; // Proof note
  reviewStatus: 'verified' | 'needs_review' | 'flagged';
  reviewNote?: string;
}

export interface ExamSectionConfig {
  section: 1 | 2 | 3;
  title: string;
  subtitle: string;
  totalPoints: number;
  pointsPerQuestion?: number;
  scoringRule?: 'standard' | 'moet_true_false' | 'equal_per_statement'; // For Part II
}

export interface Exam {
  id: string;
  code: string; // e.g. "GK1-HOA10-001"
  title: string;
  subject: string;
  grade: string;
  durationMinutes: number;
  version: string; // e.g. "v11.2"
  status: ExamStatus;
  answersVisible: boolean; // Server controlled toggle!
  publishedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  sections: ExamSectionConfig[];
  questions: Question[];
  totalScore: number;
  description?: string;
  semester?: string; // e.g. "Giữa Học Kỳ I"
  academicYear?: string; // e.g. "2026 - 2027"
  creator?: string; // Giáo viên ra đề
  instructions?: string; // Hướng dẫn thí sinh làm bài
  allowedAttempts?: number; // Số lượt làm bài cho phép
  shuffleOptions?: boolean; // Cho phép xáo trộn đáp án
  startTime?: string; // Thời gian bắt đầu mở phòng
  endTime?: string; // Thời gian đóng phòng
}

export interface StudentAnswers {
  part1: Record<string, string>; // questionId -> optionId ('A', 'B', 'C', 'D')
  part2: Record<string, Record<string, boolean | null>>; // questionId -> { a: true/false, b: ... }
  part3: Record<string, string>; // questionId -> text input
}

export interface SubmissionGrading {
  part1Score: number;
  part2Score: number;
  part3Score: number;
  totalScore: number;
  maxScore: number;
  details: {
    questionId: string;
    section: number;
    earnedPoints: number;
    maxPoints: number;
    isFullyCorrect: boolean;
    studentResponse: any;
    correctAnswer: any;
  }[];
}

export interface ExamSubmission {
  id: string;
  lookupCode: string; // Unique lookup code e.g. "HD-2026-X89K"
  examId: string;
  examCode: string;
  examTitle: string;
  examVersion: string;
  studentName: string;
  studentClass: string;
  studentId?: string;
  submittedAt: string;
  timeSpentSeconds: number;
  answers: StudentAnswers;
  grading?: SubmissionGrading; // Present if graded
}

export interface ExamStats {
  examId: string;
  visitorCount: number;
  participationCount: number;
  submissionCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}

export interface SupabaseConfig {
  projectUrl: string;
  publishableKey: string;
  isConnected: boolean;
  lastTestedAt?: string;
  mode: 'local' | 'cloud';
  projectRef?: string;
  dashboardUrl?: string;
  githubUrl?: string;
  vercelUrl?: string;
  lastSyncedAt?: string;
}

export interface ChecklistItem {
  id: number;
  title: string;
  description: string;
  category: 'content' | 'parsing' | 'exam_control' | 'student_flow' | 'security' | 'database';
  passed: boolean;
  systemVerified: boolean;
  verificationEvidence?: string;
}

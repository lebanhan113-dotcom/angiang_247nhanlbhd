import { Exam, StudentAnswers, SubmissionGrading } from '../types/exam';

export function calculateSubmissionScore(exam: Exam, answers: StudentAnswers): SubmissionGrading {
  let part1Score = 0;
  let part2Score = 0;
  let part3Score = 0;

  const details: SubmissionGrading['details'] = [];

  // Configuration
  const part1Config = exam.sections.find((s) => s.section === 1) || {
    totalPoints: 4.5,
    pointsPerQuestion: 0.25,
  };
  const part2Config = exam.sections.find((s) => s.section === 2) || {
    totalPoints: 4.0,
    scoringRule: 'moet_true_false',
  };
  const part3Config = exam.sections.find((s) => s.section === 3) || {
    totalPoints: 1.5,
    pointsPerQuestion: 0.375,
  };

  exam.questions.forEach((q) => {
    if (q.section === 1) {
      // PHẦN I: Nhiều lựa chọn
      const studentChoice = answers.part1[q.id];
      const correctOption = q.options?.find((o) => o.isCorrect)?.id;
      const pointsPerQ = q.points || part1Config.pointsPerQuestion || 0.25;

      const isCorrect = studentChoice && correctOption && studentChoice.toUpperCase() === correctOption.toUpperCase();
      const earned = isCorrect ? pointsPerQ : 0;
      part1Score += earned;

      details.push({
        questionId: q.id,
        section: 1,
        earnedPoints: Math.round(earned * 100) / 100,
        maxPoints: pointsPerQ,
        isFullyCorrect: !!isCorrect,
        studentResponse: studentChoice || null,
        correctAnswer: correctOption || null,
      });
    } else if (q.section === 2) {
      // PHẦN II: Đúng - Sai
      const studentStatements = answers.part2[q.id] || {};
      const statements = q.statements || [];
      let correctCount = 0;

      statements.forEach((st) => {
        const studentVal = studentStatements[st.id];
        if (studentVal !== null && studentVal !== undefined && studentVal === st.isCorrect) {
          correctCount++;
        }
      });

      let questionScore = 0;
      const maxQPoints = q.points || 2.0;

      if (part2Config.scoringRule === 'moet_true_false') {
        // Quy chuẩn Bộ GD&ĐT:
        // 1 ý đúng: 0.1 điểm
        // 2 ý đúng: 0.25 điểm
        // 3 ý đúng: 0.5 điểm
        // 4 ý đúng: 1.0 điểm
        // (Nếu câu thang 2.0 điểm thì nhân tỉ lệ 2x)
        const scale = maxQPoints / 1.0;
        if (correctCount === 1) questionScore = 0.1 * scale;
        else if (correctCount === 2) questionScore = 0.25 * scale;
        else if (correctCount === 3) questionScore = 0.5 * scale;
        else if (correctCount === 4) questionScore = 1.0 * scale;
      } else {
        // Chia đều mỗi ý:
        questionScore = (correctCount / 4) * maxQPoints;
      }

      part2Score += questionScore;

      details.push({
        questionId: q.id,
        section: 2,
        earnedPoints: Math.round(questionScore * 100) / 100,
        maxPoints: maxQPoints,
        isFullyCorrect: correctCount === statements.length,
        studentResponse: studentStatements,
        correctAnswer: statements.reduce(
          (acc, cur) => ({ ...acc, [cur.id]: cur.isCorrect }),
          {}
        ),
      });
    } else if (q.section === 3) {
      // PHẦN III: Trả lời ngắn
      const rawStudentText = (answers.part3[q.id] || '').trim();
      const pointsPerQ = q.points || part3Config.pointsPerQuestion || 0.375;

      const normalize = (str: string) =>
        str
          .toLowerCase()
          .replace(/\s+/g, '')
          .replace(/,/g, '.')
          .replace(/%/g, '');

      const normalizedStudent = normalize(rawStudentText);
      const acceptable = [
        q.shortAnswer || '',
        ...(q.acceptableAnswers || []),
      ].map(normalize);

      const isCorrect = rawStudentText !== '' && acceptable.includes(normalizedStudent);
      const earned = isCorrect ? pointsPerQ : 0;
      part3Score += earned;

      details.push({
        questionId: q.id,
        section: 3,
        earnedPoints: Math.round(earned * 100) / 100,
        maxPoints: pointsPerQ,
        isFullyCorrect: isCorrect,
        studentResponse: rawStudentText || null,
        correctAnswer: q.shortAnswer || null,
      });
    }
  });

  const totalScore = Math.min(
    exam.totalScore || 10,
    Math.round((part1Score + part2Score + part3Score) * 100) / 100
  );

  return {
    part1Score: Math.round(part1Score * 100) / 100,
    part2Score: Math.round(part2Score * 100) / 100,
    part3Score: Math.round(part3Score * 100) / 100,
    totalScore,
    maxScore: exam.totalScore || 10,
    details,
  };
}

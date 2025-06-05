// 과목 타입
export type Subject = 
  | '서비스경험디자인기획설계'
  | '사용자조사분석'
  | '사용자중심전략수립'
  | '서비스경험디자인개발및운영';

// 문제 타입
export interface Question {
  id: number;
  subject: Subject;
  question: string;
  options: string[];
  correctAnswer: number; // 정답 인덱스 (0부터 시작)
  explanation: string;
  imageUrl?: string; // 문제에 포함될 이미지 URL (선택사항)
  explanationImageUrl?: string; // 해설에 포함될 이미지 URL (선택사항)
}

// 문제 결과 타입
export interface QuestionResult {
  questionId: number;
  userAnswer: number;
  isCorrect: boolean;
  timeSpent: number; // 소요 시간 (초)
}

// 시험 세션 타입
export interface ExamSession {
  questions: Question[];
  currentQuestionIndex: number;
  results: QuestionResult[];
  startTime: Date;
  isCompleted: boolean;
} 
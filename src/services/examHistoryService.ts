import { ExamHistory } from '../types/Question';

const EXAM_HISTORY_KEY = 'serviceDesignTest_examHistory';
const EXAM_SESSION_KEY = 'serviceDesignTest_examSession';

// 시험 히스토리 저장
export const saveExamHistory = (examHistory: ExamHistory): void => {
  try {
    const existingHistory = getExamHistory();
    const updatedHistory = [...existingHistory, examHistory];
    localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('시험 히스토리 저장 실패:', error);
  }
};

// 시험 히스토리 조회
export const getExamHistory = (): ExamHistory[] => {
  try {
    const history = localStorage.getItem(EXAM_HISTORY_KEY);
    if (!history) return [];
    
    const parsedHistory = JSON.parse(history);
    // Date 객체 복원
    return parsedHistory.map((exam: any) => ({
      ...exam,
      examDate: new Date(exam.examDate)
    }));
  } catch (error) {
    console.error('시험 히스토리 조회 실패:', error);
    return [];
  }
};

// 특정 시험 결과 조회
export const getExamHistoryById = (id: string): ExamHistory | null => {
  try {
    const history = getExamHistory();
    return history.find(exam => exam.id === id) || null;
  } catch (error) {
    console.error('시험 결과 조회 실패:', error);
    return null;
  }
};

// 시험 히스토리 삭제
export const deleteExamHistory = (id: string): void => {
  try {
    const history = getExamHistory();
    const updatedHistory = history.filter(exam => exam.id !== id);
    localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('시험 히스토리 삭제 실패:', error);
  }
};

// 모든 시험 히스토리 삭제
export const clearExamHistory = (): void => {
  try {
    localStorage.removeItem(EXAM_HISTORY_KEY);
  } catch (error) {
    console.error('시험 히스토리 초기화 실패:', error);
  }
};

// 시험 세션 저장 (중간 저장)
export const saveExamSession = (session: any): void => {
  try {
    const sessionData = {
      ...session,
      startTime: session.startTime.toISOString()
    };
    localStorage.setItem(EXAM_SESSION_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('시험 세션 저장 실패:', error);
  }
};

// 시험 세션 조회
export const getExamSession = (): any | null => {
  try {
    const session = localStorage.getItem(EXAM_SESSION_KEY);
    if (!session) return null;
    
    const parsedSession = JSON.parse(session);
    // Date 객체 복원
    return {
      ...parsedSession,
      startTime: new Date(parsedSession.startTime)
    };
  } catch (error) {
    console.error('시험 세션 조회 실패:', error);
    return null;
  }
};

// 시험 세션 삭제
export const clearExamSession = (): void => {
  try {
    localStorage.removeItem(EXAM_SESSION_KEY);
  } catch (error) {
    console.error('시험 세션 삭제 실패:', error);
  }
};

// 유니크 ID 생성
export const generateExamId = (): string => {
  return `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}; 
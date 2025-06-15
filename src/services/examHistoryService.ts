import { ExamHistory } from '../types/Question';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc, deleteDoc, collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

const EXAM_HISTORY_KEY = 'serviceDesignTest_examHistory';
const EXAM_SESSION_KEY = 'serviceDesignTest_examSession';
const STUDY_SESSION_KEY = 'serviceDesignTest_studySession';

// Firebase 사용 가능 여부 확인
const isFirebaseAvailable = (): boolean => {
  return !!(auth && db);
};

// 현재 사용자 ID 가져오기
const getCurrentUserId = (): string => {
  if (isFirebaseAvailable() && auth && auth.currentUser) {
    return auth.currentUser.uid;
  }
  // Firebase 없거나 로그인 안된 경우 게스트용 ID 사용
  const guestId = localStorage.getItem('guestUserId');
  if (guestId) return guestId;
  
  const newGuestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('guestUserId', newGuestId);
  return newGuestId;
};

// 공부 세션 인터페이스 정의
interface StudySession {
  questions: any[]; // 섞인 문제 순서 보존
  currentQuestionIndex: number;
  answeredQuestions: number[]; // 답안을 확인한 문제들의 인덱스
  startTime: Date;
  lastActiveTime: Date;
}

// 시험 세션 인터페이스 정의
interface ExamSession {
  questions: any[];
  currentQuestionIndex: number;
  results: any[];
  startTime: Date;
  isCompleted: boolean;
  lastActiveTime: Date;
}

// 데이터 정리 함수 (undefined 값 제거)
const cleanDataForFirebase = (data: any): any => {
  if (data === null || data === undefined) {
    return null;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => cleanDataForFirebase(item));
  }
  
  if (typeof data === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = cleanDataForFirebase(value);
      }
    }
    return cleaned;
  }
  
  return data;
};

// 로컬 스토리지 용량 확인 및 정리
const cleanupLocalStorageIfNeeded = (): void => {
  try {
    // 스토리지 용량 테스트
    const testKey = 'test-storage-capacity';
    const testData = 'x'.repeat(1024 * 1024); // 1MB 테스트
    localStorage.setItem(testKey, testData);
    localStorage.removeItem(testKey);
  } catch (error) {
    console.warn('로컬 스토리지 용량 부족, 정리 중...');
    // 오래된 데이터 정리
    const keys = Object.keys(localStorage);
    const examKeys = keys.filter(key => key.includes('exam') || key.includes('study'));
    
    // 절반 정도 삭제
    const keysToDelete = examKeys.slice(0, Math.ceil(examKeys.length / 2));
    keysToDelete.forEach(key => {
      try {
        localStorage.removeItem(key);
        console.log('정리된 키:', key);
      } catch (e) {
        console.warn('키 삭제 실패:', key);
      }
    });
  }
};

// 시험 히스토리 저장
export const saveExamHistory = async (examHistory: ExamHistory): Promise<void> => {
  try {
    if (isFirebaseAvailable() && db) {
      const userId = getCurrentUserId();
      
      // Firebase용 데이터 정리 (undefined 값 제거)
      const cleanedHistory = cleanDataForFirebase({
        ...examHistory,
        examDate: examHistory.examDate.toISOString(),
        createdAt: new Date().toISOString(),
        // 이미지 데이터가 너무 클 경우 제거
        questions: examHistory.questions?.map(q => ({
          ...q,
          imageUrl: q.imageUrl && q.imageUrl.length > 50000 ? undefined : q.imageUrl,
          explanationImageUrl: q.explanationImageUrl && q.explanationImageUrl.length > 50000 ? undefined : q.explanationImageUrl,
          hintImageUrl: q.hintImageUrl && q.hintImageUrl.length > 50000 ? undefined : q.hintImageUrl
        })) || []
      });
      
      await addDoc(collection(db, 'users', userId, 'examHistory'), cleanedHistory);
      console.log('✅ 시험 히스토리 Firebase에 저장됨');
    } else {
      // Fallback to localStorage
      cleanupLocalStorageIfNeeded();
      
      const existingHistory = await getExamHistory();
      const updatedHistory = [...existingHistory, examHistory];
      
      try {
        localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(updatedHistory));
        console.log('✅ 시험 히스토리 로컬에 저장됨');
      } catch (storageError) {
        console.warn('로컬 스토리지 용량 초과, 압축 저장 시도');
        // 데이터 압축 (이미지 제거)
        const compressedHistory = updatedHistory.map(exam => ({
          ...exam,
          questions: exam.questions?.map(q => ({
            ...q,
            imageUrl: undefined,
            explanationImageUrl: undefined,
            hintImageUrl: undefined
          })) || []
        }));
        localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(compressedHistory));
        console.log('✅ 시험 히스토리 압축 저장됨 (이미지 제외)');
      }
    }
  } catch (error) {
    console.error('시험 히스토리 저장 실패:', error);
    // Firebase 실패 시 로컬 저장 시도
    try {
      cleanupLocalStorageIfNeeded();
      
      const existingHistory = await getExamHistory();
      const updatedHistory = [...existingHistory, examHistory];
      
      // 압축된 버전으로 저장
      const compressedHistory = updatedHistory.map(exam => ({
        ...exam,
        questions: exam.questions?.map(q => ({
          ...q,
          imageUrl: q.imageUrl && q.imageUrl.length < 10000 ? q.imageUrl : undefined,
          explanationImageUrl: q.explanationImageUrl && q.explanationImageUrl.length < 10000 ? q.explanationImageUrl : undefined,
          hintImageUrl: q.hintImageUrl && q.hintImageUrl.length < 10000 ? q.hintImageUrl : undefined
        })) || []
      }));
      
      localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(compressedHistory));
      console.log('✅ 시험 히스토리 로컬에 저장됨 (Firebase 실패 시)');
    } catch (localError) {
      console.error('로컬 저장도 실패:', localError);
      throw new Error('시험 결과 저장에 실패했습니다. 브라우저 저장 공간을 확인해주세요.');
    }
  }
};

// 시험 히스토리 조회
export const getExamHistory = async (): Promise<ExamHistory[]> => {
  try {
    if (isFirebaseAvailable() && db) {
      const userId = getCurrentUserId();
      const historyQuery = query(
        collection(db, 'users', userId, 'examHistory'),
        orderBy('examDate', 'desc')
      );
      const snapshot = await getDocs(historyQuery);
      const history: ExamHistory[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        history.push({
          ...data,
          examDate: new Date(data.examDate)
        } as ExamHistory);
      });
      
      console.log(`📖 Firebase에서 시험 히스토리 ${history.length}개 조회됨`);
      return history;
    } else {
      // Fallback to localStorage
      const history = localStorage.getItem(EXAM_HISTORY_KEY);
      if (!history) return [];
      
      const parsedHistory = JSON.parse(history);
      return parsedHistory.map((exam: any) => ({
        ...exam,
        examDate: new Date(exam.examDate)
      }));
    }
  } catch (error) {
    console.error('시험 히스토리 조회 실패:', error);
    // Firebase 실패 시 로컬에서 조회
    try {
      const history = localStorage.getItem(EXAM_HISTORY_KEY);
      if (!history) return [];
      
      const parsedHistory = JSON.parse(history);
      return parsedHistory.map((exam: any) => ({
        ...exam,
        examDate: new Date(exam.examDate)
      }));
    } catch (localError) {
      console.error('로컬 조회도 실패:', localError);
      return [];
    }
  }
};

// 특정 시험 결과 조회
export const getExamHistoryById = async (id: string): Promise<ExamHistory | null> => {
  try {
    const history = await getExamHistory();
    return history.find(exam => exam.id === id) || null;
  } catch (error) {
    console.error('시험 결과 조회 실패:', error);
    return null;
  }
};

// 시험 히스토리 삭제
export const deleteExamHistory = async (id: string): Promise<void> => {
  try {
    if (isFirebaseAvailable() && db) {
      const userId = getCurrentUserId();
      const historyQuery = query(
        collection(db, 'users', userId, 'examHistory'),
        where('id', '==', id)
      );
      const snapshot = await getDocs(historyQuery);
      
      snapshot.forEach(async (docSnapshot) => {
        await deleteDoc(docSnapshot.ref);
      });
      
      console.log('🗑️ Firebase에서 시험 히스토리 삭제됨');
    } else {
      // Fallback to localStorage
      const history = await getExamHistory();
      const updatedHistory = history.filter(exam => exam.id !== id);
      localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(updatedHistory));
      console.log('🗑️ 로컬에서 시험 히스토리 삭제됨');
    }
  } catch (error) {
    console.error('시험 히스토리 삭제 실패:', error);
  }
};

// 모든 시험 히스토리 삭제
export const clearExamHistory = async (): Promise<void> => {
  try {
    if (isFirebaseAvailable() && db) {
      const userId = getCurrentUserId();
      const historyQuery = query(collection(db, 'users', userId, 'examHistory'));
      const snapshot = await getDocs(historyQuery);
      
      snapshot.forEach(async (docSnapshot) => {
        await deleteDoc(docSnapshot.ref);
      });
      
      console.log('🗑️ Firebase에서 모든 시험 히스토리 삭제됨');
    } else {
      localStorage.removeItem(EXAM_HISTORY_KEY);
      console.log('🗑️ 로컬에서 모든 시험 히스토리 삭제됨');
    }
  } catch (error) {
    console.error('시험 히스토리 초기화 실패:', error);
  }
};

// 시험 세션 저장 (중간 저장)
export const saveExamSession = async (session: ExamSession): Promise<void> => {
  try {
    // undefined 값 제거 및 데이터 정리
    const cleanQuestions = session.questions.map(q => ({
      id: q.id || '',
      subject: q.subject || '',
      question: q.question || '',
      options: q.options || [],
      correctAnswer: q.correctAnswer ?? 0,
      explanation: q.explanation || '',
      // 이미지 URL은 저장하지 않아서 용량 절약
      imageUrl: q.imageUrl ? '존재함' : null,
      hintText: q.hintText || null,
      hintImageUrl: q.hintImageUrl ? '존재함' : null
    }));

    const cleanResults = session.results.map(r => ({
      questionId: r.questionId || '',
      userAnswer: r.userAnswer ?? -1,
      isCorrect: r.isCorrect || false,
      timeSpent: r.timeSpent || 0
    }));

    const sessionData = cleanDataForFirebase({
      questions: cleanQuestions,
      currentQuestionIndex: session.currentQuestionIndex || 0,
      results: cleanResults,
      startTime: session.startTime?.toISOString() || new Date().toISOString(),
      isCompleted: session.isCompleted || false,
      lastActiveTime: new Date().toISOString()
    });

    if (isFirebaseAvailable() && db) {
      const userId = getCurrentUserId();
      await setDoc(doc(db, 'users', userId, 'sessions', 'currentExam'), sessionData);
      console.log('💾 시험 세션 Firebase에 저장됨:', {
        currentQuestionIndex: sessionData.currentQuestionIndex,
        resultsCount: sessionData.results?.length || 0,
        totalQuestions: sessionData.questions?.length || 0
      });
    } else {
      // 로컬 스토리지 용량 체크 후 저장
      cleanupLocalStorageIfNeeded();
      
      const dataString = JSON.stringify(sessionData);
      const dataSize = dataString.length;
      const maxSize = 2 * 1024 * 1024; // 2MB 제한 (더 안전하게)
      
      if (dataSize > maxSize) {
        console.warn('⚠️ 시험 세션 데이터가 너무 큽니다. 간소화된 버전으로 저장합니다.');
        // 문제 데이터 간소화
        const simplifiedData = {
          currentQuestionIndex: sessionData.currentQuestionIndex,
          results: sessionData.results,
          startTime: sessionData.startTime,
          isCompleted: sessionData.isCompleted,
          lastActiveTime: sessionData.lastActiveTime,
          questions: sessionData.questions?.map((q: any) => ({
            id: q.id,
            subject: q.subject
          })) || []
        };
        localStorage.setItem(EXAM_SESSION_KEY, JSON.stringify(simplifiedData));
      } else {
        localStorage.setItem(EXAM_SESSION_KEY, dataString);
      }
      console.log('💾 시험 세션 로컬에 저장됨');
    }
  } catch (error) {
    console.error('시험 세션 저장 실패:', error);
    // Firebase 실패 시 로컬 저장 (간소화된 버전)
    try {
      cleanupLocalStorageIfNeeded();
      
      const simplifiedData = {
        currentQuestionIndex: session.currentQuestionIndex || 0,
        results: session.results?.map(r => ({
          questionId: r.questionId || '',
          userAnswer: r.userAnswer ?? -1,
          isCorrect: r.isCorrect || false,
          timeSpent: r.timeSpent || 0
        })) || [],
        startTime: session.startTime?.toISOString() || new Date().toISOString(),
        isCompleted: session.isCompleted || false,
        lastActiveTime: new Date().toISOString(),
        totalQuestions: session.questions?.length || 0
      };
      localStorage.setItem(EXAM_SESSION_KEY, JSON.stringify(simplifiedData));
      console.log('💾 시험 세션 간소화 버전으로 로컬에 저장됨');
    } catch (localError) {
      console.error('로컬 저장도 실패:', localError);
      // 로컬 스토리지 정리 후 재시도
      try {
        // 기존 세션 데이터 삭제
        localStorage.removeItem(EXAM_SESSION_KEY);
        localStorage.removeItem(STUDY_SESSION_KEY);
        
        // 최소 데이터만 저장
        const minimalData = {
          currentQuestionIndex: session.currentQuestionIndex || 0,
          startTime: session.startTime?.toISOString() || new Date().toISOString(),
          isCompleted: session.isCompleted || false,
          lastActiveTime: new Date().toISOString()
        };
        localStorage.setItem(EXAM_SESSION_KEY, JSON.stringify(minimalData));
        console.log('💾 최소 데이터로 저장 완료');
      } catch (finalError) {
        console.error('최종 저장 실패:', finalError);
        throw new Error('세션 저장에 실패했습니다. 브라우저 저장 공간을 확인해주세요.');
      }
    }
  }
};

// 시험 세션 조회
export const getExamSession = async (): Promise<ExamSession | null> => {
  try {
    let sessionData = null;

    if (isFirebaseAvailable() && db) {
      const userId = getCurrentUserId();
      const sessionDoc = await getDoc(doc(db, 'users', userId, 'sessions', 'currentExam'));
      
      if (sessionDoc.exists()) {
        sessionData = sessionDoc.data();
        console.log('📖 Firebase에서 시험 세션 조회됨');
      }
    }

    // Firebase에서 없으면 로컬에서 조회
    if (!sessionData) {
      const localSession = localStorage.getItem(EXAM_SESSION_KEY);
      if (localSession) {
        sessionData = JSON.parse(localSession);
        console.log('📖 로컬에서 시험 세션 조회됨');
      }
    }

    if (!sessionData) return null;

    // 세션이 24시간 이상 오래되었으면 무효화
    const lastActiveTime = new Date(sessionData.lastActiveTime);
    const now = new Date();
    const timeDiff = now.getTime() - lastActiveTime.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      console.log('⏰ 시험 세션이 만료되어 삭제됨 (24시간 초과)');
      await clearExamSession();
      return null;
    }

    // Date 객체 복원
    return {
      ...sessionData,
      startTime: new Date(sessionData.startTime),
      lastActiveTime: new Date(sessionData.lastActiveTime)
    };
  } catch (error) {
    console.error('시험 세션 조회 실패:', error);
    return null;
  }
};

// 시험 세션 삭제
export const clearExamSession = async (): Promise<void> => {
  try {
    if (isFirebaseAvailable() && db) {
      const userId = getCurrentUserId();
      await deleteDoc(doc(db, 'users', userId, 'sessions', 'currentExam'));
      console.log('🗑️ Firebase에서 시험 세션 삭제됨');
    }
    
    localStorage.removeItem(EXAM_SESSION_KEY);
    console.log('🗑️ 로컬에서 시험 세션 삭제됨');
  } catch (error) {
    console.error('시험 세션 삭제 실패:', error);
  }
};

// 공부 세션 저장
export const saveStudySession = async (session: StudySession): Promise<void> => {
  // undefined 값 제거 및 데이터 정리
  const cleanQuestions = session.questions.map(q => ({
    id: q.id || '',
    subject: q.subject || '',
    question: q.question || '',
    options: q.options || [],
    correctAnswer: q.correctAnswer ?? 0,
    explanation: q.explanation || '',
    // 이미지 URL은 저장하지 않아서 용량 절약
    imageUrl: q.imageUrl ? '존재함' : null,
    hintText: q.hintText || null,
    hintImageUrl: q.hintImageUrl ? '존재함' : null
  }));

  const sessionData = {
    questions: cleanQuestions,
    currentQuestionIndex: session.currentQuestionIndex || 0,
    answeredQuestions: session.answeredQuestions || [],
    startTime: session.startTime?.toISOString() || new Date().toISOString(),
    lastActiveTime: new Date().toISOString()
  };

  try {
    if (isFirebaseAvailable() && db) {
      const userId = getCurrentUserId();
      await setDoc(doc(db, 'users', userId, 'sessions', 'currentStudy'), sessionData);
      console.log('🔖 공부 세션 Firebase에 저장됨:', {
        currentQuestionIndex: sessionData.currentQuestionIndex,
        answeredCount: sessionData.answeredQuestions.length,
        totalQuestions: sessionData.questions.length
      });
    } else {
      // 로컬 스토리지 용량 체크 후 저장
      const dataSize = JSON.stringify(sessionData).length;
      const maxSize = 5 * 1024 * 1024; // 5MB 제한
      
      if (dataSize > maxSize) {
        console.warn('⚠️ 세션 데이터가 너무 큽니다. 간소화된 버전으로 저장합니다.');
        // 문제 데이터 간소화
        const simplifiedData = {
          ...sessionData,
          questions: sessionData.questions.map(q => ({
            id: q.id,
            subject: q.subject
          }))
        };
        localStorage.setItem(STUDY_SESSION_KEY, JSON.stringify(simplifiedData));
      } else {
        localStorage.setItem(STUDY_SESSION_KEY, JSON.stringify(sessionData));
      }
      console.log('🔖 공부 세션 로컬에 저장됨');
    }
  } catch (error) {
    console.error('공부 세션 저장 실패:', error);
    // Firebase 실패 시 로컬 저장 (간소화된 버전)
    try {
      const simplifiedData = {
        currentQuestionIndex: sessionData.currentQuestionIndex,
        answeredQuestions: sessionData.answeredQuestions,
        startTime: sessionData.startTime,
        lastActiveTime: sessionData.lastActiveTime,
        totalQuestions: sessionData.questions.length
      };
      localStorage.setItem(STUDY_SESSION_KEY, JSON.stringify(simplifiedData));
      console.log('🔖 공부 세션 간소화 버전으로 로컬에 저장됨');
    } catch (localError) {
      console.error('로컬 저장도 실패:', localError);
      // 로컬 스토리지 정리 후 재시도
      try {
        // 기존 세션 데이터 삭제
        localStorage.removeItem(STUDY_SESSION_KEY);
        localStorage.removeItem(EXAM_SESSION_KEY);
        // 최소 데이터만 저장
        const minimalData = {
          currentQuestionIndex: sessionData.currentQuestionIndex,
          startTime: sessionData.startTime,
          lastActiveTime: sessionData.lastActiveTime
        };
        localStorage.setItem(STUDY_SESSION_KEY, JSON.stringify(minimalData));
        console.log('🔖 최소 데이터로 저장 완료');
      } catch (finalError) {
        console.error('최종 저장 실패:', finalError);
      }
    }
  }
};

// 공부 세션 조회
export const getStudySession = async (): Promise<StudySession | null> => {
  try {
    let sessionData = null;

    if (isFirebaseAvailable() && db) {
      const userId = getCurrentUserId();
      const sessionDoc = await getDoc(doc(db, 'users', userId, 'sessions', 'currentStudy'));
      
      if (sessionDoc.exists()) {
        sessionData = sessionDoc.data();
        console.log('📖 Firebase에서 공부 세션 조회됨');
      }
    }

    // Firebase에서 없으면 로컬에서 조회
    if (!sessionData) {
      const localSession = localStorage.getItem(STUDY_SESSION_KEY);
      if (localSession) {
        sessionData = JSON.parse(localSession);
        console.log('📖 로컬에서 공부 세션 조회됨');
      }
    }

    if (!sessionData) return null;

    // 세션이 24시간 이상 오래되었으면 무효화
    const lastActiveTime = new Date(sessionData.lastActiveTime);
    const now = new Date();
    const timeDiff = now.getTime() - lastActiveTime.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      console.log('⏰ 공부 세션이 만료되어 삭제됨 (24시간 초과)');
      await clearStudySession();
      return null;
    }

    console.log('📖 공부 세션 복구됨:', {
      currentQuestionIndex: sessionData.currentQuestionIndex,
      answeredCount: sessionData.answeredQuestions.length,
      totalQuestions: sessionData.questions.length,
      lastActive: new Date(sessionData.lastActiveTime).toLocaleString()
    });

    return {
      ...sessionData,
      startTime: new Date(sessionData.startTime),
      lastActiveTime: new Date(sessionData.lastActiveTime)
    };
  } catch (error) {
    console.error('공부 세션 조회 실패:', error);
    return null;
  }
};

// 공부 세션 삭제
export const clearStudySession = async (): Promise<void> => {
  try {
    if (isFirebaseAvailable() && db) {
      const userId = getCurrentUserId();
      await deleteDoc(doc(db, 'users', userId, 'sessions', 'currentStudy'));
      console.log('🗑️ Firebase에서 공부 세션 삭제됨');
    }
    
    localStorage.removeItem(STUDY_SESSION_KEY);
    console.log('🗑️ 로컬에서 공부 세션 삭제됨');
  } catch (error) {
    console.error('공부 세션 삭제 실패:', error);
  }
};

// 공부 세션 활성 시간 업데이트
export const updateStudySessionActivity = async (): Promise<void> => {
  try {
    const session = await getStudySession();
    if (session) {
      await saveStudySession(session);
    }
  } catch (error) {
    console.error('공부 세션 활성 시간 업데이트 실패:', error);
  }
};

// 로컬 스토리지 정리 함수
export const cleanupLocalStorage = (): void => {
  try {
    // 오래된 데이터 삭제
    const keysToCheck = ['examHistory', 'studySession', 'examSession'];
    
    keysToCheck.forEach(key => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.lastActiveTime) {
            const lastActive = new Date(parsed.lastActiveTime);
            const now = new Date();
            const daysDiff = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
            
            // 7일 이상 오래된 데이터 삭제
            if (daysDiff > 7) {
              localStorage.removeItem(key);
              console.log(`🧹 오래된 데이터 삭제: ${key}`);
            }
          }
        }
      } catch (e) {
        console.warn(`데이터 정리 중 오류 (${key}):`, e);
      }
    });
    
    // 사용 가능한 스토리지 용량 확인
    const usedSpace = JSON.stringify(localStorage).length;
    const maxSpace = 10 * 1024 * 1024; // 10MB 추정
    
    if (usedSpace > maxSpace * 0.8) {
      console.warn('⚠️ 로컬 스토리지 용량이 80% 이상 사용됨. 정리가 필요합니다.');
      // 추가 정리 로직 실행
      ['examHistory', 'studySession', 'examSession'].forEach(key => {
        localStorage.removeItem(key);
      });
    }
    
    console.log(`📊 로컬 스토리지 사용 현황: ${(usedSpace / 1024).toFixed(2)}KB`);
  } catch (error) {
    console.error('로컬 스토리지 정리 실패:', error);
  }
};

// 유니크 ID 생성
export const generateExamId = (): string => {
  return `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}; 
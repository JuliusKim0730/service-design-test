import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc,
  onSnapshot,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Question, Subject } from '../types/Question';
import { sampleQuestions } from '../data/questions';

const QUESTIONS_COLLECTION = 'questions';
const LOCAL_STORAGE_KEY = 'service_design_questions';

// 이미지 URL 유효성 검사 및 복원 함수
const validateAndRestoreImageUrl = (url: string, questionId?: number, imageType?: 'imageUrl' | 'explanationImageUrl' | 'hintImageUrl'): string | undefined => {
  // 빈 문자열이거나 undefined인 경우
  if (!url || url.trim() === '') {
    return undefined;
  }
  
  // "존재함" 표시자인 경우 (세션 저장에서 복원)
  if (url === '존재함' || url === 'exists') {
    console.log(`⚠️ 문제 ${questionId}: 이미지가 세션에서 압축되어 저장되었습니다. 원본 데이터에서 복원을 시도합니다.`);
    
    // 원본 데이터에서 이미지 찾기
    if (questionId && imageType) {
      const originalQuestion = sampleQuestions.find(q => q.id === questionId);
      if (originalQuestion) {
        const originalImageUrl = originalQuestion[imageType];
        if (originalImageUrl && originalImageUrl !== '존재함' && originalImageUrl !== 'exists') {
          console.log(`✅ 문제 ${questionId}: ${imageType} 원본 데이터에서 복원됨`);
          return originalImageUrl;
        }
      }
    }
    
    console.log(`❌ 문제 ${questionId}: ${imageType} 원본 데이터에서 복원 실패`);
    return undefined;
  }
  
  // Base64 이미지인 경우 (가장 일반적)
  if (url.startsWith('data:image/')) {
    console.log(`✅ 문제 ${questionId}: Base64 이미지 확인됨`);
    return url;
  }
  
  // HTTP/HTTPS URL인 경우
  if (url.startsWith('http://') || url.startsWith('https://')) {
    console.log(`🌐 문제 ${questionId}: URL 이미지 확인됨`);
    return url;
  }
  
  // 상대 경로나 기타 경로
  if (url.includes('/') || url.includes('.')) {
    console.log(`📁 문제 ${questionId}: 파일 경로 이미지`);
    return url;
  }
  
  console.log(`❓ 문제 ${questionId}: 알 수 없는 이미지 형식:`, url.substring(0, 50) + '...');
  return url; // 일단 그대로 반환
};

// 이미지 URL 유효성 검사 함수 (기존 호환성 유지)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isValidImageUrl = (url: string): boolean => {
  return validateAndRestoreImageUrl(url) !== undefined;
};

// Firebase 연결 확인 함수
const isFirebaseAvailable = (): boolean => {
  return db !== null;
};

// 로컬 스토리지에 백업 저장
const saveToLocalStorage = (questions: Question[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(questions));
  } catch (error) {
    console.warn('로컬 스토리지 저장 실패:', error);
  }
};

// 로컬 스토리지에서 불러오기
const loadFromLocalStorage = (): Question[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn('로컬 스토리지 불러오기 실패:', error);
    return [];
  }
};

// 로컬 스토리지 강제 초기화 (개발용)
export const forceInitializeLocalStorage = (): void => {
  console.log('🔄 로컬 스토리지 강제 초기화');
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  // 힌트 필드를 포함한 샘플 데이터 처리
  const processedSampleQuestions = sampleQuestions.map(q => ({
    ...q,
    hintText: q.hintText || undefined,
    hintImageUrl: q.hintImageUrl || undefined
  }));
  saveToLocalStorage(processedSampleQuestions);
  console.log('✅ 새로운 샘플 데이터로 초기화 완료');
};

// 개발자 도구에서 사용할 수 있도록 전역 함수로 노출
if (process.env.NODE_ENV === 'development') {
  (window as any).initHintData = forceInitializeLocalStorage;
  console.log('🛠️ 개발 모드: window.initHintData() 함수를 사용해서 힌트 데이터를 초기화할 수 있습니다.');
}

// Firestore에 초기 데이터 설정
export const initializeFirestoreData = async (): Promise<void> => {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase를 사용할 수 없습니다. 로컬 스토리지만 사용됩니다.');
    // 로컬 스토리지에 초기 데이터가 없으면 추가 (개발 환경에서만)
    const localQuestions = loadFromLocalStorage();
    if (localQuestions.length === 0) {
      console.log('🛠️ Firebase 없이 로컬 스토리지에 샘플 데이터 추가');
      // 힌트 필드를 포함한 샘플 데이터 처리
      const processedSampleQuestions = sampleQuestions.map(q => ({
        ...q,
        hintText: q.hintText || undefined,
        hintImageUrl: q.hintImageUrl || undefined
      }));
      saveToLocalStorage(processedSampleQuestions);
    }
    return;
  }

  try {
    const questionsSnapshot = await getDocs(collection(db!, QUESTIONS_COLLECTION));
    
    // Firebase가 비어있어도 샘플 데이터를 자동으로 추가하지 않음
    if (questionsSnapshot.empty) {
      console.log('🔥 Firestore가 비어있습니다. 기출문제 관리에서 문제를 추가해주세요.');
      
      // 개발 환경에서만 샘플 데이터 추가
      if (process.env.NODE_ENV === 'development') {
        console.log('🛠️ 개발 환경: Firebase에 샘플 데이터 추가');
        // 힌트 필드를 포함한 샘플 데이터 처리
        const processedSampleQuestions = sampleQuestions.map(q => ({
          ...q,
          hintText: q.hintText || undefined,
          hintImageUrl: q.hintImageUrl || undefined
        }));
        for (const question of processedSampleQuestions) {
          await setDoc(doc(db!, QUESTIONS_COLLECTION, question.id.toString()), question);
        }
        console.log('초기 데이터 추가 완료');
        saveToLocalStorage(processedSampleQuestions);
      }
    } else {
      console.log('🔥 Firebase에서 기존 데이터 발견:', questionsSnapshot.size, '개 문제');
    }
  } catch (error) {
    console.error('Firestore 초기화 실패:', error);
    // 로컬 스토리지에 초기 데이터가 없으면 추가 (개발 환경에서만)
    const localQuestions = loadFromLocalStorage();
    if (localQuestions.length === 0) {
      console.log('🛠️ 오류 시 로컬 스토리지에 샘플 데이터 추가');
      // 힌트 필드를 포함한 샘플 데이터 처리
      const processedSampleQuestions = sampleQuestions.map(q => ({
        ...q,
        hintText: q.hintText || undefined,
        hintImageUrl: q.hintImageUrl || undefined
      }));
      saveToLocalStorage(processedSampleQuestions);
    }
  }
};

// 모든 문제 가져오기
export const getAllQuestions = async (): Promise<Question[]> => {
  if (!isFirebaseAvailable()) {
    console.log('Firebase를 사용할 수 없습니다. 로컬 스토리지에서 데이터를 불러옵니다...');
    const localQuestions = loadFromLocalStorage();
    const processedQuestions = localQuestions.map(q => ({
      ...q,
      imageUrl: validateAndRestoreImageUrl(q.imageUrl || '', q.id, 'imageUrl'),
      explanationImageUrl: validateAndRestoreImageUrl(q.explanationImageUrl || '', q.id, 'explanationImageUrl'),
      hintImageUrl: validateAndRestoreImageUrl(q.hintImageUrl || '', q.id, 'hintImageUrl')
    }));
    
    console.log(`💾 로컬에서 ${processedQuestions.length}개 문제 로드 (Firebase 없음)`);
    return processedQuestions;
  }

  try {
    const questionsSnapshot = await getDocs(
      query(collection(db!, QUESTIONS_COLLECTION), orderBy('id', 'asc'))
    );
    
    const questions: Question[] = [];
    questionsSnapshot.forEach((doc) => {
      const questionData = doc.data() as Question;
              // 이미지 URL 검증 및 복원 후 추가
        questions.push({
          ...questionData,
          imageUrl: validateAndRestoreImageUrl(questionData.imageUrl || '', questionData.id, 'imageUrl'),
          explanationImageUrl: validateAndRestoreImageUrl(questionData.explanationImageUrl || '', questionData.id, 'explanationImageUrl'),
          hintImageUrl: validateAndRestoreImageUrl(questionData.hintImageUrl || '', questionData.id, 'hintImageUrl')
        });
    });
    
    // 로컬 스토리지에도 백업
    saveToLocalStorage(questions);
    
    console.log(`📚 Firebase에서 ${questions.length}개 문제 로드 완료`);
    return questions;
  } catch (error) {
    console.error('Firestore에서 문제 가져오기 실패:', error);
    console.log('로컬 스토리지에서 데이터를 불러옵니다...');
    const localQuestions = loadFromLocalStorage();
    const processedQuestions = localQuestions.map(q => ({
      ...q,
      imageUrl: validateAndRestoreImageUrl(q.imageUrl || '', q.id, 'imageUrl'),
      explanationImageUrl: validateAndRestoreImageUrl(q.explanationImageUrl || '', q.id, 'explanationImageUrl'),
      hintImageUrl: validateAndRestoreImageUrl(q.hintImageUrl || '', q.id, 'hintImageUrl')
    }));
    
    console.log(`💾 로컬 스토리지에서 ${processedQuestions.length}개 문제 로드 완료`);
    return processedQuestions;
  }
};

// 실시간 문제 목록 구독
export const subscribeToQuestions = (callback: (questions: Question[]) => void) => {
  if (!isFirebaseAvailable()) {
    console.log('Firebase를 사용할 수 없습니다. 로컬 스토리지 데이터를 사용합니다...');
    const localQuestions = loadFromLocalStorage();
    // 이미지 및 힌트 필드 처리
    const processedLocalQuestions = localQuestions.map(q => ({
      ...q,
      imageUrl: validateAndRestoreImageUrl(q.imageUrl || '', q.id),
      explanationImageUrl: validateAndRestoreImageUrl(q.explanationImageUrl || '', q.id),
      hintImageUrl: validateAndRestoreImageUrl(q.hintImageUrl || '', q.id),
      hintText: q.hintText || undefined
    }));
    console.log('📁 로컬 스토리지에서 로드된 문제 수:', processedLocalQuestions.length);
    callback(processedLocalQuestions);
    return () => {}; // 빈 unsubscribe 함수 반환
  }

  try {
    const q = query(collection(db!, QUESTIONS_COLLECTION), orderBy('id', 'asc'));
    
    return onSnapshot(q, (snapshot) => {
      const questions: Question[] = [];
      snapshot.forEach((doc) => {
        const questionData = doc.data() as Question;
        // 이미지 및 힌트 필드 처리
        const processedQuestion: Question = {
          ...questionData,
          imageUrl: validateAndRestoreImageUrl(questionData.imageUrl || '', questionData.id, 'imageUrl'),
          explanationImageUrl: validateAndRestoreImageUrl(questionData.explanationImageUrl || '', questionData.id, 'explanationImageUrl'),
          hintImageUrl: validateAndRestoreImageUrl(questionData.hintImageUrl || '', questionData.id, 'hintImageUrl'),
          hintText: questionData.hintText || undefined
        };
        questions.push(processedQuestion);
      });
      
      console.log('🔥 Firebase에서 로드된 문제 수:', questions.length);
      
      // 이미지가 있는 문제 확인
      const questionsWithImages = questions.filter(q => q.imageUrl);
      console.log('📷 이미지가 있는 문제 수:', questionsWithImages.length);
      
      // 힌트가 있는 문제 확인
      const questionsWithHints = questions.filter(q => q.hintText || q.hintImageUrl);
      console.log('💡 힌트가 있는 문제 수:', questionsWithHints.length);
      
      // 로컬 스토리지에도 백업
      saveToLocalStorage(questions);
      callback(questions);
    }, (error) => {
      console.error('실시간 데이터 구독 실패:', error);
      // 오류 시 로컬 스토리지에서 불러오기
      const localQuestions = loadFromLocalStorage();
      const processedLocalQuestions = localQuestions.map(q => ({
        ...q,
        imageUrl: validateAndRestoreImageUrl(q.imageUrl || '', q.id),
        explanationImageUrl: validateAndRestoreImageUrl(q.explanationImageUrl || '', q.id),
        hintImageUrl: validateAndRestoreImageUrl(q.hintImageUrl || '', q.id),
        hintText: q.hintText || undefined
      }));
      console.log('📁 오류시 로컬 스토리지에서 로드된 문제 수:', processedLocalQuestions.length);
      callback(processedLocalQuestions);
    });
  } catch (error) {
    console.error('실시간 구독 설정 실패:', error);
    // 오류 시 로컬 스토리지에서 불러오기
    const localQuestions = loadFromLocalStorage();
    const processedLocalQuestions = localQuestions.map(q => ({
      ...q,
      imageUrl: validateAndRestoreImageUrl(q.imageUrl || '', q.id),
      explanationImageUrl: validateAndRestoreImageUrl(q.explanationImageUrl || '', q.id),
      hintImageUrl: validateAndRestoreImageUrl(q.hintImageUrl || '', q.id),
      hintText: q.hintText || undefined
    }));
    console.log('📁 오류시 로컬 스토리지에서 로드된 문제 수:', processedLocalQuestions.length);
    callback(processedLocalQuestions);
    return () => {}; // 빈 unsubscribe 함수 반환
  }
};

// 문제 추가
export const addQuestion = async (question: Omit<Question, 'id'>): Promise<Question> => {
  // 새 ID 생성 (기존 문제들의 최대 ID + 1)
  const allQuestions = await getAllQuestions();
  const newId = allQuestions.length > 0 ? Math.max(...allQuestions.map(q => q.id)) + 1 : 1;
  const newQuestion: Question = { ...question, id: newId };
  
  // 디버깅: 추가하려는 문제 데이터 확인
  console.log('➕ 새 문제 추가:', {
    id: newQuestion.id,
    subject: newQuestion.subject,
    hintText: newQuestion.hintText || '(없음)',
    hintImageUrl: newQuestion.hintImageUrl || '(없음)'
  });

  if (!isFirebaseAvailable()) {
    console.log('Firebase를 사용할 수 없습니다. 로컬 스토리지에만 저장합니다...');
    const localQuestions = loadFromLocalStorage();
    localQuestions.push(newQuestion);
    saveToLocalStorage(localQuestions);
    return newQuestion;
  }

  try {
    // undefined 값들을 빈 문자열로 변환하여 안전한 데이터 준비
    const safeQuestion = {
      ...newQuestion,
      imageUrl: newQuestion.imageUrl || '',
      explanationImageUrl: newQuestion.explanationImageUrl || '',
      hintText: newQuestion.hintText || '',
      hintImageUrl: newQuestion.hintImageUrl || ''
    };
    
    console.log('🔄 Firebase에 추가할 안전한 데이터:', {
      id: safeQuestion.id,
      subject: safeQuestion.subject,
      hintText: safeQuestion.hintText || '(빈값)',
      hintImageUrl: safeQuestion.hintImageUrl || '(빈값)'
    });
    
    await setDoc(doc(db!, QUESTIONS_COLLECTION, newId.toString()), safeQuestion);
    console.log('문제 추가 성공:', newQuestion.id);
    return newQuestion;
  } catch (error) {
    console.error('문제 추가 실패:', error);
    
    // Firestore 실패 시 로컬 스토리지에만 저장
    const localQuestions = loadFromLocalStorage();
    localQuestions.push(newQuestion);
    saveToLocalStorage(localQuestions);
    
    return newQuestion;
  }
};

// 문제 수정
export const updateQuestion = async (question: Question): Promise<void> => {
  // 디버깅: 수정하려는 문제 데이터 확인
  console.log('✏️ 문제 수정:', {
    id: question.id,
    subject: question.subject,
    hintText: question.hintText || '(없음)',
    hintImageUrl: question.hintImageUrl || '(없음)'
  });
  
  if (!isFirebaseAvailable()) {
    console.log('Firebase를 사용할 수 없습니다. 로컬 스토리지에서만 수정합니다...');
    const localQuestions = loadFromLocalStorage();
    const index = localQuestions.findIndex(q => q.id === question.id);
    if (index !== -1) {
      localQuestions[index] = question;
      saveToLocalStorage(localQuestions);
    }
    return;
  }

  try {
    // Firebase updateDoc에 전달할 데이터를 안전하게 준비 (undefined 값 제거)
    const updateData: any = {
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      subject: question.subject
    };
    
    // undefined가 아닌 값들만 포함
    if (question.imageUrl !== undefined) {
      updateData.imageUrl = question.imageUrl || '';
    }
    if (question.explanationImageUrl !== undefined) {
      updateData.explanationImageUrl = question.explanationImageUrl || '';
    }
    if (question.hintText !== undefined) {
      updateData.hintText = question.hintText || '';
    }
    if (question.hintImageUrl !== undefined) {
      updateData.hintImageUrl = question.hintImageUrl || '';
    }
    
    console.log('🔄 Firebase에 전달할 안전한 데이터:', updateData);
    
    await updateDoc(doc(db!, QUESTIONS_COLLECTION, question.id.toString()), updateData);
    console.log('문제 수정 성공:', question.id);
  } catch (error) {
    console.error('문제 수정 실패:', error);
    
    // Firestore 실패 시 로컬 스토리지에서 수정
    const localQuestions = loadFromLocalStorage();
    const index = localQuestions.findIndex(q => q.id === question.id);
    if (index !== -1) {
      localQuestions[index] = question;
      saveToLocalStorage(localQuestions);
    }
  }
};

// 문제 삭제
export const deleteQuestion = async (questionId: number): Promise<void> => {
  if (!isFirebaseAvailable()) {
    console.log('Firebase를 사용할 수 없습니다. 로컬 스토리지에서만 삭제합니다...');
    const localQuestions = loadFromLocalStorage();
    const filteredQuestions = localQuestions.filter(q => q.id !== questionId);
    saveToLocalStorage(filteredQuestions);
    return;
  }

  try {
    await deleteDoc(doc(db!, QUESTIONS_COLLECTION, questionId.toString()));
    console.log('문제 삭제 성공:', questionId);
  } catch (error) {
    console.error('문제 삭제 실패:', error);
    
    // Firestore 실패 시 로컬 스토리지에서 삭제
    const localQuestions = loadFromLocalStorage();
    const filteredQuestions = localQuestions.filter(q => q.id !== questionId);
    saveToLocalStorage(filteredQuestions);
  }
};

// 로컬 데이터를 Firestore에 동기화
export const syncLocalToFirestore = async (): Promise<void> => {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase를 사용할 수 없습니다. 동기화를 수행할 수 없습니다.');
    return;
  }

  try {
    const localQuestions = loadFromLocalStorage();
    
    if (localQuestions.length === 0) {
      return;
    }
    
    console.log('📤 로컬 데이터를 Firestore에 동기화 중...');
    
    for (const question of localQuestions) {
      await setDoc(doc(db!, QUESTIONS_COLLECTION, question.id.toString()), question);
    }
    
    console.log('✅ 로컬 → Firebase 동기화 완료');
  } catch (error) {
    console.error('동기화 실패:', error);
  }
};

// Firebase에서 로컬로 강제 동기화 (최신 데이터 가져오기)
export const syncFirestoreToLocal = async (): Promise<Question[]> => {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase를 사용할 수 없습니다.');
    return loadFromLocalStorage();
  }

  try {
    console.log('📥 Firebase에서 최신 데이터를 가져오는 중...');
    
    const questionsSnapshot = await getDocs(
      query(collection(db!, QUESTIONS_COLLECTION), orderBy('id', 'asc'))
    );
    
    const questions: Question[] = [];
    questionsSnapshot.forEach((doc) => {
      const questionData = doc.data() as Question;
      questions.push(questionData);
    });
    
    console.log('🔥 Firebase에서 가져온 최신 문제 수:', questions.length);
    
    // 로컬 스토리지 강제 업데이트
    saveToLocalStorage(questions);
    console.log('✅ Firebase → 로컬 동기화 완료');
    
    return questions;
  } catch (error) {
    console.error('Firebase에서 데이터 가져오기 실패:', error);
    return loadFromLocalStorage();
  }
};

// 양방향 완전 동기화
export const fullSync = async (): Promise<Question[]> => {
  console.log('🔄 양방향 완전 동기화 시작...');
  
  // 1단계: Firebase에서 최신 데이터 가져오기
  await syncFirestoreToLocal();
  
  // 2단계: 혹시 로컬에만 있는 데이터가 있다면 Firebase에 업로드
  await syncLocalToFirestore();
  
  // 3단계: 다시 최신 데이터 가져오기
  const finalQuestions = await syncFirestoreToLocal();
  
  console.log('✅ 양방향 완전 동기화 완료');
  return finalQuestions;
};

// 캐시 클리어 및 강제 새로고침
export const clearAllCaches = (): void => {
  console.log('🧹 모든 캐시 완전 클리어 중...');
  
  try {
    // 메인 스토리지 키 클리어
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    sessionStorage.removeItem(LOCAL_STORAGE_KEY);
    
    // 관련된 모든 키 찾아서 제거
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('question') || key.includes('service_design') || key.includes('exam') || key.includes('study'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // 세션 스토리지도 동일하게 처리
    const sessionKeysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes('question') || key.includes('service_design') || key.includes('exam') || key.includes('study'))) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
    
    console.log('✅ 로컬 스토리지 완전 클리어 완료');
    console.log('🗑️ 제거된 로컬 키:', keysToRemove.length);
    console.log('🗑️ 제거된 세션 키:', sessionKeysToRemove.length);
    
  } catch (error) {
    console.error('캐시 클리어 실패:', error);
  }
  
  // 브라우저 캐시 클리어 (새로고침)
  if (typeof window !== 'undefined') {
    console.log('🔄 페이지 강제 새로고침...');
    window.location.reload();
  }
};

// Firebase에서 강제로 최신 데이터 가져오기 (캐시 무시)
export const forceRefreshFromFirebase = async (): Promise<Question[]> => {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase를 사용할 수 없습니다.');
    return [];
  }

  try {
    console.log('🔥 Firebase에서 강제로 최신 데이터 가져오는 중... (모든 캐시 무시)');
    
    // 먼저 모든 로컬 캐시 클리어
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      sessionStorage.clear();
      console.log('🗑️ 로컬 캐시 완전 클리어');
    } catch (e) {
      console.warn('캐시 클리어 중 오류:', e);
    }
    
    // Firebase에서 서버 직접 가져오기 (브라우저 캐시도 무시)
    const questionsSnapshot = await getDocs(
      query(collection(db!, QUESTIONS_COLLECTION), orderBy('id', 'asc'))
    );
    
    const questions: Question[] = [];
    questionsSnapshot.forEach((doc) => {
      const questionData = doc.data() as Question;
      questions.push(questionData);
      console.log(`📝 문제 ${questionData.id}: ${questionData.question.substring(0, 50)}...`);
    });
    
    console.log('🔥 Firebase에서 가져온 REAL 최신 문제 수:', questions.length);
    
    // 각 과목별 문제 수 로그
    const subjects: Subject[] = ['서비스경험디자인기획설계', '사용자조사분석', '사용자중심전략수립', '서비스경험디자인개발및운영'];
    subjects.forEach(subject => {
      const count = questions.filter(q => q.subject === subject).length;
      console.log(`📚 ${subject}: ${count}개`);
    });
    
    // 이미지가 있는 문제 확인
    const questionsWithImages = questions.filter(q => q.imageUrl && q.imageUrl.trim() !== '');
    console.log('📷 이미지가 있는 문제 수:', questionsWithImages.length);
    
    // 최근 수정된 문제 확인 (ID가 큰 순으로)
    const recentQuestions = questions.slice(-5);
    console.log('🆕 최근 5개 문제 ID:', recentQuestions.map(q => q.id));
    
    // 로컬 스토리지에 강제 저장
    saveToLocalStorage(questions);
    console.log('✅ 로컬 스토리지에 진짜 최신 데이터 저장 완료');
    
    return questions;
  } catch (error) {
    console.error('Firebase에서 강제 새로고침 실패:', error);
    return [];
  }
};

// 데이터베이스 마이그레이션: 기존 문제들에 힌트 필드 추가
export const migrateQuestionsWithHints = async (): Promise<void> => {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase를 사용할 수 없습니다. 마이그레이션을 수행할 수 없습니다.');
    return;
  }

  try {
    console.log('🔄 데이터베이스 마이그레이션 시작: 힌트 필드 추가');
    
    // 모든 기존 문제 가져오기
    const questionsSnapshot = await getDocs(collection(db!, QUESTIONS_COLLECTION));
    let migratedCount = 0;
    
    for (const docSnapshot of questionsSnapshot.docs) {
      const questionData = docSnapshot.data() as Question;
      
      // 힌트 필드가 없는 문제만 업데이트
      if (!questionData.hasOwnProperty('hintText') || !questionData.hasOwnProperty('hintImageUrl')) {
        const updateData = {
          hintText: questionData.hintText || undefined,
          hintImageUrl: questionData.hintImageUrl || undefined
        };
        
        await updateDoc(doc(db!, QUESTIONS_COLLECTION, docSnapshot.id), updateData);
        migratedCount++;
        
        console.log(`✅ 문제 ${questionData.id} 마이그레이션 완료`);
      }
    }
    
    console.log(`🎉 마이그레이션 완료: ${migratedCount}개 문제 업데이트`);
    
    // 샘플 데이터의 힌트가 있는 문제들을 업데이트
    await updateSampleQuestionsWithHints();
    
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    throw error;
  }
};

// 샘플 데이터의 힌트를 Firebase에 적용
export const updateSampleQuestionsWithHints = async (): Promise<void> => {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase를 사용할 수 없습니다.');
    return;
  }

  try {
    console.log('📝 샘플 데이터의 힌트를 Firebase에 적용 중...');
    
    // 힌트가 있는 샘플 문제들
    const hintsToAdd = [
      {
        id: 1,
        hintText: '디자인의 핵심은 무엇일까요? 예술적 특성보다 더 중요한 것을 생각해보세요. 디자인은 문제를 해결하는 과정이라는 점을 고려해보세요.'
      },
      {
        id: 3,
        hintText: '디자인씽킹은 사용자 중심적 접근 방법입니다. 솔루션 중심이 아닌 무엇을 중심으로 하는지 생각해보세요.'
      },
      {
        id: 7,
        hintText: 'UCD의 "U"는 무엇을 의미할까요? 사용자(User)를 중심으로 한다는 것이 핵심입니다.',
        hintImageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGRUY3Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNGRjhGMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfkYUgVXNlcjwvdGV4dD4KPGNPCLE1cyBoZWlnaHQ9IjIwIiB3aWR0aD0iMjAiIGZpbGw9IiNGRkMxMDciIHJ4PSIxMCIvPgo8dGV4dCB4PSIxMDAiIHk9IjcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkY4RjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkNlbnRlcmVkIERlc2lnbjwvdGV4dD4KPC9zdmc+'
      }
    ];
    
    for (const hintData of hintsToAdd) {
      try {
        const docRef = doc(db!, QUESTIONS_COLLECTION, hintData.id.toString());
        await updateDoc(docRef, {
          hintText: hintData.hintText,
          hintImageUrl: hintData.hintImageUrl || undefined
        });
        console.log(`✅ 문제 ${hintData.id}에 힌트 추가 완료`);
      } catch (error) {
        console.error(`❌ 문제 ${hintData.id} 힌트 추가 실패:`, error);
      }
    }
    
    console.log('🎉 샘플 힌트 적용 완료');
    
  } catch (error) {
    console.error('❌ 샘플 힌트 적용 실패:', error);
  }
};

// 개발자 도구에서 사용할 수 있도록 전역 함수로 노출
if (process.env.NODE_ENV === 'development') {
  (window as any).migrateDB = migrateQuestionsWithHints;
  (window as any).addSampleHints = updateSampleQuestionsWithHints;
  console.log('🛠️ 개발 모드: 다음 함수들을 사용할 수 있습니다:');
  console.log('- window.migrateDB() : 데이터베이스 마이그레이션');
  console.log('- window.addSampleHints() : 샘플 힌트 추가');
} 
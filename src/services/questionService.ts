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
import { Question } from '../types/Question';
import { sampleQuestions } from '../data/questions';

const QUESTIONS_COLLECTION = 'questions';
const LOCAL_STORAGE_KEY = 'service_design_questions';

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

// Firestore에 초기 데이터 설정
export const initializeFirestoreData = async (): Promise<void> => {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase를 사용할 수 없습니다. 로컬 스토리지만 사용됩니다.');
    // 로컬 스토리지에 초기 데이터가 없으면 추가
    const localQuestions = loadFromLocalStorage();
    if (localQuestions.length === 0) {
      saveToLocalStorage(sampleQuestions);
    }
    return;
  }

  try {
    const questionsSnapshot = await getDocs(collection(db!, QUESTIONS_COLLECTION));
    
    if (questionsSnapshot.empty) {
      console.log('Firestore에 데이터가 없습니다. 초기 데이터를 추가합니다...');
      
      for (const question of sampleQuestions) {
        await setDoc(doc(db!, QUESTIONS_COLLECTION, question.id.toString()), question);
      }
      
      console.log('초기 데이터 추가 완료');
      saveToLocalStorage(sampleQuestions);
    }
  } catch (error) {
    console.error('Firestore 초기화 실패:', error);
    // 로컬 스토리지에 초기 데이터가 없으면 추가
    const localQuestions = loadFromLocalStorage();
    if (localQuestions.length === 0) {
      saveToLocalStorage(sampleQuestions);
    }
  }
};

// 모든 문제 가져오기
export const getAllQuestions = async (): Promise<Question[]> => {
  if (!isFirebaseAvailable()) {
    console.log('Firebase를 사용할 수 없습니다. 로컬 스토리지에서 데이터를 불러옵니다...');
    return loadFromLocalStorage();
  }

  try {
    const questionsSnapshot = await getDocs(
      query(collection(db!, QUESTIONS_COLLECTION), orderBy('id', 'asc'))
    );
    
    const questions: Question[] = [];
    questionsSnapshot.forEach((doc) => {
      questions.push(doc.data() as Question);
    });
    
    // 로컬 스토리지에도 백업
    saveToLocalStorage(questions);
    
    return questions;
  } catch (error) {
    console.error('Firestore에서 문제 가져오기 실패:', error);
    console.log('로컬 스토리지에서 데이터를 불러옵니다...');
    return loadFromLocalStorage();
  }
};

// 실시간 문제 목록 구독
export const subscribeToQuestions = (callback: (questions: Question[]) => void) => {
  if (!isFirebaseAvailable()) {
    console.log('Firebase를 사용할 수 없습니다. 로컬 스토리지 데이터를 사용합니다...');
    callback(loadFromLocalStorage());
    return () => {}; // 빈 unsubscribe 함수 반환
  }

  try {
    const q = query(collection(db!, QUESTIONS_COLLECTION), orderBy('id', 'asc'));
    
    return onSnapshot(q, (snapshot) => {
      const questions: Question[] = [];
      snapshot.forEach((doc) => {
        questions.push(doc.data() as Question);
      });
      
      // 로컬 스토리지에도 백업
      saveToLocalStorage(questions);
      callback(questions);
    }, (error) => {
      console.error('실시간 데이터 구독 실패:', error);
      // 오류 시 로컬 스토리지에서 불러오기
      callback(loadFromLocalStorage());
    });
  } catch (error) {
    console.error('실시간 구독 설정 실패:', error);
    // 오류 시 로컬 스토리지에서 불러오기
    callback(loadFromLocalStorage());
    return () => {}; // 빈 unsubscribe 함수 반환
  }
};

// 문제 추가
export const addQuestion = async (question: Omit<Question, 'id'>): Promise<Question> => {
  // 새 ID 생성 (기존 문제들의 최대 ID + 1)
  const allQuestions = await getAllQuestions();
  const newId = allQuestions.length > 0 ? Math.max(...allQuestions.map(q => q.id)) + 1 : 1;
  const newQuestion: Question = { ...question, id: newId };

  if (!isFirebaseAvailable()) {
    console.log('Firebase를 사용할 수 없습니다. 로컬 스토리지에만 저장합니다...');
    const localQuestions = loadFromLocalStorage();
    localQuestions.push(newQuestion);
    saveToLocalStorage(localQuestions);
    return newQuestion;
  }

  try {
    await setDoc(doc(db!, QUESTIONS_COLLECTION, newId.toString()), newQuestion);
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
    await updateDoc(doc(db!, QUESTIONS_COLLECTION, question.id.toString()), { ...question });
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
    
    console.log('로컬 데이터를 Firestore에 동기화 중...');
    
    for (const question of localQuestions) {
      await setDoc(doc(db!, QUESTIONS_COLLECTION, question.id.toString()), question);
    }
    
    console.log('동기화 완료');
  } catch (error) {
    console.error('동기화 실패:', error);
  }
}; 
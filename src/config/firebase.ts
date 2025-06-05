import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase 설정 체크
const hasFirebaseConfig = 
  process.env.REACT_APP_FIREBASE_API_KEY &&
  process.env.REACT_APP_FIREBASE_PROJECT_ID;

// Firebase 설정 - 실제 값으로 교체해야 합니다
const firebaseConfig = hasFirebaseConfig ? {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || ""
} : null;

// Firebase 초기화
const app = hasFirebaseConfig ? initializeApp(firebaseConfig!) : null;

// Auth 서비스 초기화
export const auth = app ? getAuth(app) : null;

// Google 로그인 프로바이더
export const googleProvider = app ? (() => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  return provider;
})() : null;

let db: Firestore | null = null;

if (app) {
  try {
    db = getFirestore(app);

    // 개발 환경에서 에뮬레이터 사용 (선택사항)
    if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATOR === 'true') {
      try {
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log('Firebase 에뮬레이터에 연결되었습니다.');
      } catch (error) {
        console.warn('Firebase 에뮬레이터 연결 실패:', error);
      }
    }

    console.log('Firebase가 성공적으로 초기화되었습니다.');
  } catch (error) {
    console.error('Firebase 초기화 실패:', error);
    console.warn('Firebase 연결에 실패했습니다. 로컬 스토리지만 사용됩니다.');
  }
} else {
  console.warn('Firebase 환경 변수가 설정되지 않았습니다. Firebase 기능이 비활성화됩니다.');
}

export { db };
export default app; 
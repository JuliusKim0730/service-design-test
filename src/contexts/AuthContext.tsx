import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { User, AuthState } from '../types/Auth';

interface AuthContextType {
  authState: AuthState;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    status: 'loading',
    user: null
  });

  // 관리자 이메일 목록
  const ADMIN_EMAILS = ['meangyun0729@gmail.com'];

  useEffect(() => {
    if (!auth) {
      // Firebase가 설정되지 않은 경우 게스트 모드로 시작
      setAuthState({
        status: 'guest',
        user: null
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '사용자',
          photoURL: firebaseUser.photoURL || undefined
        };
        setAuthState({
          status: 'authenticated',
          user
        });
      } else {
        // 게스트 상태인지 확인
        const guestStatus = localStorage.getItem('guestMode');
        if (guestStatus === 'true') {
          setAuthState({
            status: 'guest',
            user: null
          });
        } else {
          setAuthState({
            status: 'unauthenticated',
            user: null
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      throw new Error('Firebase가 설정되지 않았습니다. 관리자에게 문의하세요.');
    }
    try {
      localStorage.removeItem('guestMode');
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google 로그인 실패:', error);
      throw error;
    }
  };

  const signInAsGuest = () => {
    localStorage.setItem('guestMode', 'true');
    setAuthState({
      status: 'guest',
      user: null
    });
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('guestMode');
      if (auth) {
        await firebaseSignOut(auth);
      }
      setAuthState({
        status: 'unauthenticated',
        user: null
      });
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  };

  const isAdmin = (): boolean => {
    return (
      authState.status === 'authenticated' &&
      authState.user !== null &&
      authState.user.email !== null &&
      ADMIN_EMAILS.includes(authState.user.email)
    );
  };

  const value: AuthContextType = {
    authState,
    signInWithGoogle,
    signInAsGuest,
    signOut,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
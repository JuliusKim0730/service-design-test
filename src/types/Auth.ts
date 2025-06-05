export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'guest' | 'unauthenticated';

export interface AuthState {
  status: AuthStatus;
  user: User | null;
} 
import { createContext, useContext, useEffect } from 'react';
import { User } from '@/types';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import api from '@/services/api';
import { useAuthStore } from '@/stores/authStore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, setUser, setFirebaseUser, setLoading } = useAuthStore();

  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  useEffect(() => {
    // Safety timeout: if auth doesn't resolve in 5 seconds, stop loading
    const timer = setTimeout(() => {
      if (useAuthStore.getState().loading) {
        console.warn('Auth resolution timeout - forcing loading to false');
        setLoading(false);
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Use a shorter timeout for the initial sync to avoid hanging the UI
          const response = await api.get('/auth/me', { timeout: 5000 });
          setUser(response.data);
        } catch (error: any) {
          console.error('Auth sync error:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
      clearTimeout(timer);
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [setUser, setFirebaseUser, setLoading]);

  const getToken = async () => {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, getToken, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

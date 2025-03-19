
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, getCurrentCafe, logoutUser } from '@/api/authService';
import { User, Cafe } from '@/utils/authTypes';

interface AuthContextType {
  currentUser: User | null;
  currentCafe: Cafe | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  currentCafe: null,
  isAuthenticated: false,
  isLoading: true,
  refreshUser: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentCafe, setCurrentCafe] = useState<Cafe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      if (user) {
        const cafe = await getCurrentCafe();
        setCurrentCafe(cafe);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setCurrentCafe(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const value = {
    currentUser,
    currentCafe,
    isAuthenticated: !!currentUser,
    isLoading,
    refreshUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, getCurrentCafe } from '@/api/authService';
import { User, Cafe } from '@/utils/authTypes';

interface AuthContextType {
  currentUser: User | null;
  currentCafe: Cafe | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  currentCafe: null,
  isAuthenticated: false,
  isLoading: true,
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentCafe, setCurrentCafe] = useState<Cafe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    setIsLoading(true);
    const user = await getCurrentUser();
    setCurrentUser(user);
    
    if (user) {
      const cafe = await getCurrentCafe();
      setCurrentCafe(cafe);
    }
    
    setIsLoading(false);
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

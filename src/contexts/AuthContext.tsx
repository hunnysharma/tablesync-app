
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

// Create a default context with actual values
const defaultAuthContext: AuthContextType = {
  currentUser: null,
  currentCafe: null,
  isAuthenticated: false,
  isLoading: true,
  refreshUser: async () => {},
  logout: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Create a static instance of the context that can be imported directly
export let authContextValue = defaultAuthContext;

export const useAuth = () => {
  const context = useContext(AuthContext);
  // If we're outside of the provider, return the static instance
  return context || authContextValue;
};

// Update the static instance whenever the context value changes
export const updateAuthContextValue = (value: AuthContextType) => {
  authContextValue = value;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentCafe, setCurrentCafe] = useState<Cafe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user on initial mount
    refreshUser();
  }, []);

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

  const value = {
    currentUser,
    currentCafe,
    isAuthenticated: !!currentUser,
    isLoading,
    refreshUser,
    logout,
  };
  
  // Update the static instance whenever the context value changes
  updateAuthContextValue(value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

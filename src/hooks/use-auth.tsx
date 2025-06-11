
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (redirectTo?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedAuthState = localStorage.getItem('isAuthenticatedReportViewer');
      if (storedAuthState === 'true') {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
      // Handle environments where localStorage is not available or restricted
    }
    setLoading(false);
  }, []);

  const login = (redirectTo?: string) => {
    try {
      localStorage.setItem('isAuthenticatedReportViewer', 'true');
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
    setIsAuthenticated(true);
    router.push(redirectTo || '/reports/call-detail');
  };

  const logout = () => {
    try {
      localStorage.removeItem('isAuthenticatedReportViewer');
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
    setIsAuthenticated(false);
    router.push('/auth/sign-in');
  };
  
  useEffect(() => {
    if (!loading && !isAuthenticated && !pathname.startsWith('/auth')) {
      router.push('/auth/sign-in');
    }
  }, [isAuthenticated, loading, router, pathname]);


  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
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

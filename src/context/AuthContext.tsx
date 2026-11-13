'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount } from '@/lib/db';
import { isFirebaseConfigured } from '@/lib/firebase';
import {
  firebaseSignInUser,
  firebaseSignUpUser,
  firebaseUpdateProfile
} from '@/lib/firebaseService';

interface AuthContextType {
  user: UserAccount | null;
  token: string | null;
  isLoading: boolean;
  isFirebaseActive: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    email: string;
    password: string;
    businessName: string;
    pan?: string;
    phone?: string;
    address?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (updates: Partial<UserAccount>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        localStorage.removeItem('quickbill_token');
        setToken(null);
        setUser(null);
      }
    } catch (e) {
      console.warn('Failed to fetch user', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('quickbill_token');
    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // 1. Try Firebase if configured and email is provided
    if (isFirebaseConfigured && email.includes('@')) {
      try {
        const fbRes = await firebaseSignInUser(email, password);
        if (fbRes.success && fbRes.user && fbRes.token) {
          localStorage.setItem('quickbill_token', fbRes.token);
          setToken(fbRes.token);
          setUser(fbRes.user);
          return { success: true };
        } else if (!fbRes.success && fbRes.error !== 'Firebase is not configured.') {
          return { success: false, error: fbRes.error };
        }
      } catch (err) {
        console.warn('Firebase login attempt failed, falling back to local server:', err);
      }
    }

    // 2. Fallback to built-in Cloud API
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      localStorage.setItem('quickbill_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const signup = async (formData: {
    email: string;
    password: string;
    businessName: string;
    pan?: string;
    phone?: string;
    address?: string;
  }) => {
    // 1. Try Firebase if configured
    if (isFirebaseConfigured) {
      try {
        const fbRes = await firebaseSignUpUser(formData);
        if (fbRes.success && fbRes.user && fbRes.token) {
          localStorage.setItem('quickbill_token', fbRes.token);
          setToken(fbRes.token);
          setUser(fbRes.user);
          return { success: true };
        } else if (!fbRes.success && fbRes.error !== 'Firebase is not yet configured with valid API keys.') {
          return { success: false, error: fbRes.error };
        }
      } catch (err) {
        console.warn('Firebase signup attempt failed, falling back to local server:', err);
      }
    }

    // 2. Fallback to built-in Cloud API
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Signup failed' };
      }
      localStorage.setItem('quickbill_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    if (token) {
      fetch('/api/auth/me', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem('quickbill_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (token) {
      await fetchCurrentUser(token);
    }
  };

  const updateProfile = async (updates: Partial<UserAccount>): Promise<boolean> => {
    if (!token) return false;

    // Sync to Firestore if user ID exists
    if (isFirebaseConfigured && user?.id) {
      firebaseUpdateProfile(user.id, updates).catch(() => {});
    }

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isFirebaseActive: isFirebaseConfigured,
        login,
        signup,
        logout,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

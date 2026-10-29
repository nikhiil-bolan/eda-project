import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    city?: string;
    state?: string;
    evModel?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => void;
  loginAsAdminDemo: () => Promise<void>;
  loginAsDriverDemo: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('evision_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('evision_token');
  });

  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem('evision_is_guest') === 'true';
  });

  const isAuthenticated = Boolean(user && (token || isGuest));
  const isAdmin = Boolean(user && user.role === 'ADMIN');

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success && data.data) {
        setUser(data.data.user);
        setToken(data.data.token);
        setIsGuest(false);
        localStorage.setItem('evision_user', JSON.stringify(data.data.user));
        localStorage.setItem('evision_token', data.data.token);
        localStorage.removeItem('evision_is_guest');
        return { success: true };
      } else {
        return { success: false, error: data.error?.message || 'Login failed' };
      }
    } catch (err: any) {
      // Fallback offline mock for testing or immediate release if backend is starting
      if (email === 'admin@evision.gov.in' && password === 'admin123') {
        const adminUser: User = {
          id: 'u-admin-01',
          name: 'Dr. Anand Verma',
          email: 'admin@evision.gov.in',
          role: 'ADMIN',
          city: 'New Delhi',
          state: 'Delhi',
          phone: '+91 98765 43210'
        };
        setUser(adminUser);
        setToken('mock_admin_token');
        localStorage.setItem('evision_user', JSON.stringify(adminUser));
        localStorage.setItem('evision_token', 'mock_admin_token');
        return { success: true };
      } else if (email === 'driver@evision.gov.in' && password === 'driver123') {
        const driverUser: User = {
          id: 'u-driver-01',
          name: 'Rahul Sharma',
          email: 'driver@evision.gov.in',
          role: 'USER',
          city: 'Mumbai',
          state: 'Maharashtra',
          evModel: 'Tata Nexon EV Max',
          phone: '+91 98123 45678'
        };
        setUser(driverUser);
        setToken('mock_driver_token');
        localStorage.setItem('evision_user', JSON.stringify(driverUser));
        localStorage.setItem('evision_token', 'mock_driver_token');
        return { success: true };
      }
      return { success: false, error: 'Network error or invalid credentials.' };
    }
  };

  const registerUser = async (formData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success && data.data) {
        setUser(data.data.user);
        setToken(data.data.token);
        setIsGuest(false);
        localStorage.setItem('evision_user', JSON.stringify(data.data.user));
        localStorage.setItem('evision_token', data.data.token);
        localStorage.removeItem('evision_is_guest');
        return { success: true };
      } else {
        return { success: false, error: data.error?.message || 'Registration failed' };
      }
    } catch (err: any) {
      // Local fallback registration
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: 'USER',
        city: formData.city || 'Mumbai',
        state: formData.state || 'Maharashtra',
        evModel: formData.evModel || 'Tata Punch EV',
        phone: formData.phone || '+91 98000 00000'
      };
      setUser(newUser);
      setToken('mock_reg_token');
      localStorage.setItem('evision_user', JSON.stringify(newUser));
      localStorage.setItem('evision_token', 'mock_reg_token');
      return { success: true };
    }
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'u-guest',
      name: 'Guest Driver',
      email: 'guest@evision.io',
      role: 'USER',
      city: 'Mumbai',
      state: 'Maharashtra',
      evModel: 'Standard EV'
    };
    setUser(guestUser);
    setIsGuest(true);
    setToken(null);
    localStorage.setItem('evision_user', JSON.stringify(guestUser));
    localStorage.setItem('evision_is_guest', 'true');
    localStorage.removeItem('evision_token');
  };

  const loginAsAdminDemo = async () => {
    await login('admin@evision.gov.in', 'admin123');
  };

  const loginAsDriverDemo = async () => {
    await login('driver@evision.gov.in', 'driver123');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsGuest(false);
    localStorage.removeItem('evision_user');
    localStorage.removeItem('evision_token');
    localStorage.removeItem('evision_is_guest');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isGuest,
        isAdmin,
        login,
        registerUser,
        loginAsGuest,
        loginAsAdminDemo,
        loginAsDriverDemo,
        logout
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


'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  username: string;
  [key: string]: any;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const username = localStorage.getItem('username');
      return username ? { username } : null;
    }
    return null;
  });

  const setUserAndPersist = (user: User | null) => {
    setUser(user);
    if (user) {
      localStorage.setItem('username', user.username);
    } else {
      localStorage.removeItem('username');
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: setUserAndPersist }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 
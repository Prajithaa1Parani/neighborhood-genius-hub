import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { currentUser, secondUser, DEMO_CREDENTIALS, DEMO_CREDENTIALS_2, type User } from "./mock-data";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "exchange_auth_uid";

function userById(id: string): User | null {
  if (id === currentUser.id) return currentUser;
  if (id === secondUser.id) return secondUser;
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const u = userById(stored);
        if (u) setUser(u);
      }
      setHydrated(true);
    }
  }, []);

  const persist = (u: User) => {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, u.id);
  };

  const login = useCallback((email: string, password: string) => {
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      setUser(currentUser); persist(currentUser);
      return { success: true };
    }
    if (email === DEMO_CREDENTIALS_2.email && password === DEMO_CREDENTIALS_2.password) {
      setUser(secondUser); persist(secondUser);
      return { success: true };
    }
    return { success: false, error: "Invalid email or password" };
  }, []);

  const signup = useCallback((name: string, email: string, password: string) => {
    if (!name || !email || password.length < 6) {
      return { success: false, error: "Please provide a valid name, email and password (min 6 chars)" };
    }
    const u = { ...currentUser, name: name || currentUser.name };
    setUser(u); persist(u);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

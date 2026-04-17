import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { currentUser, DEMO_CREDENTIALS, type User } from "./mock-data";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("exchange_auth");
      if (stored) setUser(currentUser);
      setHydrated(true);
    }
  }, []);

  const login = useCallback((email: string, password: string) => {
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      setUser(currentUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("exchange_auth", "true");
      }
      return { success: true };
    }
    return { success: false, error: "Invalid email or password" };
  }, []);

  const signup = useCallback((name: string, email: string, password: string) => {
    if (!name || !email || password.length < 6) {
      return { success: false, error: "Please provide a valid name, email and password (min 6 chars)" };
    }
    setUser({ ...currentUser, name: name || currentUser.name });
    if (typeof window !== "undefined") {
      localStorage.setItem("exchange_auth", "true");
    }
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("exchange_auth");
    }
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

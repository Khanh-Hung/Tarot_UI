"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { AuthResponse, LoginCommand, RegisterCommand, UserProfile } from "../types/auth.types";
import { authService } from "../services/authService";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (command: LoginCommand) => Promise<AuthResponse>;
  register: (command: RegisterCommand) => Promise<AuthResponse>;
  logout: () => void;
  updateUserZodiac: (zodiacSign: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("tarot_jwt_token");
      const savedUser = localStorage.getItem("tarot_user");
      if (savedToken && savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.id && !parsed.userId) {
          parsed.userId = parsed.id;
        }

        // Kiểm tra tính hợp lệ của UUID v7 / UUID string
        const isValidUUID =
          typeof parsed.userId === "string" &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(parsed.userId);

        if (!isValidUUID) {
          // Xóa session cũ từ thời chưa dùng UUID v7
          localStorage.removeItem("tarot_jwt_token");
          localStorage.removeItem("tarot_user");
          setToken(null);
          setUser(null);
        } else {
          setToken(savedToken);
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to restore auth session:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSession = (authData: AuthResponse) => {
    const userProfile: UserProfile = {
      userId: authData.userId,
      email: authData.email,
      username: authData.username,
      zodiacSign: authData.zodiacSign,
      role: authData.role,
    };
    setToken(authData.token);
    setUser(userProfile);
    localStorage.setItem("tarot_jwt_token", authData.token);
    localStorage.setItem("tarot_user", JSON.stringify(userProfile));
  };

  const login = async (command: LoginCommand) => {
    const authData = await authService.login(command);
    saveSession(authData);
    return authData;
  };

  const register = async (command: RegisterCommand) => {
    const authData = await authService.register(command);
    saveSession(authData);
    return authData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("tarot_jwt_token");
    localStorage.removeItem("tarot_user");
  };

  const updateUserZodiac = (zodiacSign: string) => {
    if (user) {
      const updated = { ...user, zodiacSign };
      setUser(updated);
      localStorage.setItem("tarot_user", JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        updateUserZodiac,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  fotoPerfil: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CACHE_KEY = "lux_viajes_user";

function getCachedUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    const now = Date.now();
    if (parsed.expiresAt && now > parsed.expiresAt) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed.user ?? null;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function setCachedUser(user: User): void {
  if (typeof window === "undefined") return;
  const cache = {
    user,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 días
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

function clearCachedUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CACHE_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    const cached = getCachedUser();
    if (cached) {
      setState((prev) => ({
        ...prev,
        user: cached,
        isAuthenticated: true,
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      const user: User = {
        id: data.user.id,
        nombre: data.user.nombre,
        email: data.user.email,
        rol: data.user.rol,
        fotoPerfil: data.user.fotoPerfil ?? null,
      };

      setCachedUser(user);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error de conexión";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      throw error;
    }
  }, []);

  const register = useCallback(
    async (
      email: string,
      username: string,
      password: string,
      confirmPassword: string
    ) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: username,
            email,
            password,
            confirmPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Error al registrar usuario");
        }

        const user: User = {
          id: data.user.id,
          nombre: data.user.nombre,
          email: data.user.email,
          rol: data.user.rol,
          fotoPerfil: data.user.fotoPerfil ?? null,
        };

        setCachedUser(user);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error de conexión";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        throw error;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Continuar con el logout local incluso si el endpoint falla
    }

    clearCachedUser();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setCachedUser(updatedUser);
    setState((prev) => ({
      ...prev,
      user: updatedUser,
    }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}

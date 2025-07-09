import { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    currentUser: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState((prev) => ({
        ...prev,
        currentUser: user,
        loading: false,
      }));
    });
    return unsubscribe;
  }, []);

  const clearError = () => setState((prev) => ({ ...prev, error: null }));

  const value = {
    ...state,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Must be used within AuthProvider");
  return context;
};
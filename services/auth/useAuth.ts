import { useAuthContext } from "./AuthContext";
import { authActions } from "./authActions";
import { useState } from "react";

export const useAuth = () => {
  const { currentUser, loading, error, clearError } = useAuthContext();
  const [actionLoading, setActionLoading] = useState(false);

  const executeWithLoading = async <T,>(action: () => Promise<T>) => {
    try {
      setActionLoading(true);
      clearError();
      return await action();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Action failed";
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    currentUser,
    loading: loading || actionLoading,
    error,
    clearError,
    signUp: (email: string, password: string, displayName: string) =>
      executeWithLoading(() =>
        authActions.signUp(email, password, displayName)
      ),
    signIn: (email: string, password: string) =>
      executeWithLoading(() => authActions.signIn(email, password)),
    googleSignIn: () => executeWithLoading(authActions.googleSignIn),
    logOut: () => executeWithLoading(authActions.logOut),
  };
};
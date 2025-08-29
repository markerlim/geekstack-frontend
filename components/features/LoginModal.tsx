import { useState } from "react";
import styles from "../../styles/LoginModal.module.css";
import { useAuth } from "../../services/auth";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal = ({ onClose }: LoginModalProps) => {
  const { googleSignIn, signIn, loading, error, logOut} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      logOut();
      await googleSignIn();
      onClose();
    } catch (err: any) {
      setLoginError(err.message);
      console.error("Google login failed:", err);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      logOut();
      await signIn(email, password);
      onClose();
    } catch (err:any) {
      setLoginError(err.message);
      console.error("Email login failed:", err);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Login to Your Account</h2>

        <form onSubmit={handleEmailLogin} className={styles.loginForm}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className={styles.googleButton}
          disabled={loading}
        >
          <img
            src="/icons/google-icon.png"
            alt="Google logo"
            className={styles.googleIcon}
          />
          Sign in with Google
        </button>

        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
    </div>
  );
};

export default LoginModal;

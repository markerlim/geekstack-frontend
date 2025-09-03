import { useRouter } from "next/router";
import { useEffect } from "react";
import LoginModal from "../../components/features/LoginModal";
import styles from "../../styles/LoginPage.module.css";
import { useAuth } from "../../services/auth";
import CardLoader from "../../components/genericComponent/CardLoader";

const LoginPage = () => {
  const router = useRouter();
  const { currentUser, loading } = useAuth();
  
  const redirectPath = router.query.redirect || "/";
  
  const handleLoginSuccess = () => {
    router.push(redirectPath as string);
  };
  
  useEffect(() => {
    if (currentUser && !loading) {
      router.push(redirectPath as string);
    }
  }, [currentUser, loading, router, redirectPath]);
  
  if (loading) {
    return (
      <div className={styles.loginContainer}>
        <CardLoader/>
      </div>
    );
  }
  
  return (
    <div className={styles.loginContainer}>
      <LoginModal onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;
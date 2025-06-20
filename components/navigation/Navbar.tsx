import { useState } from "react";
import Image from "next/image";
import styles from "../../styles/Navbar.module.css";
import LoginModal from "../functional/LoginModal";
import { User } from "@firebase/auth";
import { useAuth } from "../../services/auth/authService";
import { Bell, CircleUser, LogOut } from "lucide-react";

const Navbar = () => {
  const {currentUser} = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { logOut } = useAuth();
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const navigateTo = (path: string) => {
    console.log(`Navigate to ${path}`);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Image
          src="/icons/geekstackicon.svg"
          alt="Logo"
          width={45}
          height={49.5}
        />
        <div className={styles["geekstack-title"]}>
          <strong>GEEKSTACK</strong>
          <span>Everything Cards</span>
        </div>
      </div>

      <div className={styles.login}>
        {currentUser ? (
          <>
            <div
              className={styles["avatar-container"]}
              tabIndex={0}
              onClick={toggleMenu}
            >
              <img
                src={currentUser.photoURL || "/images/default-avatar.png"}
                alt="User Photo"
                className={styles["user-photo"]}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/default-avatar.png";
                }}
              />
              <span className={styles.username}>
                {currentUser.displayName || "Guest"}
              </span>
            </div>
            {menuOpen && (
              <div className={styles.menu}>
                <button className={styles.menuItem} onClick={() => navigateTo("account")}><CircleUser /> Account</button>
                <button className={styles.menuItem} onClick={() => navigateTo("notifications")}>
                 <Bell/> Notifications
                </button>
                <button className={styles.menuItem} onClick={handleLogout}><LogOut/> Sign Out</button>
              </div>
            )}
          </>
        ) : (
          <button className={styles.loginBtn} onClick={() => setLoginOpen(true)}>LOGIN</button>
        )}
        {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      </div>
    </nav>
  );
};

export default Navbar;

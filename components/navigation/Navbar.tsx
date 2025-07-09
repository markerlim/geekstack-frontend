import { useState } from "react";
import Image from "next/image";
import styles from "../../styles/Navbar.module.css";
import LoginModal from "../features/LoginModal";
import { User } from "@firebase/auth";
import { Bell, CircleUser, LogOut } from "lucide-react";
import { useAuth } from "../../services/auth";
import { useUserStore } from "../../services/store/user.store";
import { useDevice } from "../../contexts/DeviceContext";

const Navbar = () => {
  const { logOut } = useAuth();
  const { sqlUser, signOut } = useUserStore();
  const device = useDevice();
  const isDesktop = device === "desktop";
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const navigateTo = (path: string) => {
    console.log(`Navigate to ${path}`);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      await signOut();
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
        {sqlUser ? (
          <>
            <div
              className={styles["avatar-container"]}
              tabIndex={0}
              onClick={toggleMenu}
            >
              <img
                src={sqlUser.displaypic || "/images/default-avatar.png"}
                alt="User Photo"
                className={styles["user-photo"]}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/default-avatar.png";
                }}
              />
              {isDesktop && (
                <span className={styles.username}>
                  {sqlUser.name || "Guest"}
                </span>
              )}
            </div>
            {menuOpen && (
              <div className={styles.menu}>
                <button
                  className={styles.menuItem}
                  onClick={() => navigateTo("account")}
                >
                  <CircleUser /> Account
                </button>
                <button
                  className={styles.menuItem}
                  onClick={() => navigateTo("notifications")}
                >
                  <Bell /> Notifications
                </button>
                <button className={styles.menuItem} onClick={handleLogout}>
                  <LogOut /> Sign Out
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <button
              className={styles.loginBtn}
              onClick={() => setLoginOpen(true)}
            >
              LOGIN
            </button>
          </>
        )}
        {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      </div>
    </nav>
  );
};

export default Navbar;

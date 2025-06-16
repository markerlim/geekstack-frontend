import { useState } from "react";
import Image from "next/image";
import styles from "../../styles/Navbar.module.css";

interface User {
  displaypic: string;
  name?: string;
}

interface NavbarProps {
  user?: User | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const navigateTo = (path: string) => {
    console.log(`Navigate to ${path}`);
    setMenuOpen(false);
  };
  const handleLogout = () => {
    console.log("Logout");
    setMenuOpen(false);
  };
  const openLoginModal = () => {
    console.log("Open login modal");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Image src="/icons/geekstackicon.svg" alt="Logo" width={45} height={49.5} />
        <div className={styles['geekstack-title']}>
          <strong>GEEKSTACK</strong>
          <span>Everything Cards</span>
        </div>
      </div>

      <div className={styles.login}>
        {user ? (
          <>
            <div
              className={styles["avatar-container"]}
              tabIndex={0}
              onClick={toggleMenu}
            >
              <img src={user.displaypic} alt="User Photo" className={styles["user-photo"]} />
              <span className={styles.username}>{user.name || "Guest"}</span>
            </div>
            {menuOpen && (
              <div className={styles.menu}>
                <button onClick={() => navigateTo("account")}>Account</button>
                <button onClick={() => navigateTo("notifications")}>Notifications</button>
                <button onClick={handleLogout}>Sign Out</button>
              </div>
            )}
          </>
        ) : (
          <button onClick={openLoginModal}>LOGIN</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

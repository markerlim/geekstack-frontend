import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../../styles/Navbar.module.css";
import LoginModal from "../features/LoginModal";
import { Bell, CircleUser, LogOut } from "lucide-react";
import { useAuth } from "../../services/auth";
import { useUserStore } from "../../services/store/user.store";
import { useDevice } from "../../contexts/DeviceContext";
import SearchBar from "../SearchBar";
import { tcgList } from "../../data/tcgList";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const { sqlUser, signOut } = useUserStore();
  const device = useDevice();
  const isDesktop = device === "desktop";
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [initialGame, setInitialGame] = useState(tcgList[0]); // State for dynamic game
  const [authChecked, setAuthChecked] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const navigateTo = (path: string) => {
    console.log(`Navigate to ${path}`);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const routeSegments = router.asPath.split("/"); // Split the path into segments
    const matchedGame = tcgList.find(
      (game) => routeSegments.some((segment) => segment === game.tcg) // Check if any segment matches game.tcg
    );
    setInitialGame(matchedGame || tcgList[0]);
    console.log("Matched Game: ", matchedGame);
  }, [router.asPath]);

  useEffect(() => {
    // When sqlUser is loaded (either user object or null), mark auth as checked
    setAuthChecked(true);
  }, [sqlUser]);

  return (
    <nav className={styles.navbar}>
      {isDesktop && (
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
      )}
      <div className={styles['navbar-middle']}>
        {!isDesktop && (
            <SearchBar
              games={tcgList}
              initialGame={initialGame}
              key={initialGame.tcg}
            />
        )}
      </div>
      <div className={styles.login}>
        {!authChecked ? (
          <div className={styles.loading}>Loading...</div>
        ) : sqlUser ? (
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
          <button
            className={styles.loginBtn}
            onClick={() => setLoginOpen(true)}
          >
            LOGIN
          </button>
        )}
        {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      </div>
    </nav>
  );
};

export default Navbar;

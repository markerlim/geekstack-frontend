import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "../../styles/Navbar.module.css";
import LoginModal from "../features/LoginModal";
import { Bell, CircleUser, LogOut, Search } from "lucide-react";
import { useUserStore } from "../../services/store/user.store";
import { useDevice } from "../../contexts/DeviceContext";
import { useRouter } from "next/router";
import ListOfNotifications from "../features/notifications/ListOfNotifications";
import { useSearchState } from "../features/search/useSearchState";
import CardLoader from "../loader/CardLoader";
import CardSpinner from "../loader/CardSpinner";

const Navbar = () => {
  const router = useRouter();
  const { sqlUser, signOut, loading } = useUserStore();
  const { openSearch } = useSearchState();
  const device = useDevice();
  const isDesktop = device === "desktop";
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [loaderTimer, setLoaderTimer] = useState<NodeJS.Timeout | null>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const toggleNotifications = () => {
    setNotificationsOpen((prev) => !prev);
    setMenuOpen(false);
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setMenuOpen(false);
    setNotificationsOpen(false);
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };

    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationsOpen]);

  useEffect(() => {
    if (loading) {
      setShowLoader(true);
      
      if (loaderTimer) {
        clearTimeout(loaderTimer);
        setLoaderTimer(null);
      }
    } else {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 1000);
      
      setLoaderTimer(timer);
    }
    
    return () => {
      if (loaderTimer) {
        clearTimeout(loaderTimer);
      }
    };
  }, [loading]);

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
      <div className={styles["navbar-middle"]}>
        {!isDesktop && (
          <div onClick={openSearch} className={styles.searchContainer}>
            <div className={styles.searchInputContainer}>
              <span>Search Geekstack...</span>
              <Search className={styles.searchIcon} />
            </div>
          </div>
        )}
      </div>
      <div className={styles.login}>
        {showLoader ? ( // Use showLoader instead of loading directly
          <div className={styles.loading}><CardSpinner/></div>
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
                  onClick={() => navigateTo("/account")}
                >
                  <CircleUser /> Account
                </button>
                <button
                  className={styles.menuItem}
                  onClick={toggleNotifications}
                >
                  <Bell /> Notifications
                </button>
                <button className={styles.menuItem} onClick={handleLogout}>
                  <LogOut /> Sign Out
                </button>
              </div>
            )}
            {notificationsOpen && (
              <div
                className={styles.notificationsDropdown}
                ref={notificationsRef}
              >
                <ListOfNotifications isComponent={true} />
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
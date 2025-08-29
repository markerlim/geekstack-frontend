import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Layout.module.css";
import Navbar from "./navigation/Navbar";
import Sidenav from "./navigation/Sidenav";
import Bottomnav from "./navigation/Bottomnav";
import { motion, AnimatePresence } from "framer-motion";
import { useDevice } from "../contexts/DeviceContext";
import SearchComponent from "./features/search/SearchComponent";
import { tcgList } from "../data/tcgList";
import { useSearchState } from "./features/search/useSearchState";

type Props = {
  scrollable?: boolean;
  children?: ReactNode;
  title?: string;
};

const Layout = ({
  scrollable = true,
  children,
  title = "GeekStack",
}: Props) => {
  const deviceType = useDevice();
  const router = useRouter();
  const hideNavbarPaths = [
    "/deckbuilder",
    "/stacks",
    "/stack",
    "/decklib",
    "/notifications",
    "/account"
  ];


  const { isOpen, closeSearch } = useSearchState();
  const [initialGame, setInitialGame] = useState(tcgList[0]); // State for dynamic game
  const shouldHideNavbar =
    deviceType !== "desktop" &&
    hideNavbarPaths.some((path) => router.pathname.includes(path));

  const hideValue = deviceType !== "desktop" && shouldHideNavbar;

  useEffect(() => {
    const routeSegments = router.asPath.split("/"); // Split the path into segments
    const matchedGame = tcgList.find(
      (game) => routeSegments.some((segment) => segment === game.tcg) // Check if any segment matches game.tcg
    );
    setInitialGame(matchedGame || tcgList[0]);
  }, [router.asPath]);

  return (
    <div>
      {/* Show Navbar unless: on mobile AND in deckbuilder route */}
      {!hideValue && <Navbar />}
      <div
        className={`${styles.pageBody} ${
          deviceType === "desktop"
            ? styles.pageBodyDesktop
            : !hideValue
            ? styles.pageBodyMobileWithTopNav
            : styles.pageBodyMobileNoTop
        }`}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={styles.searchOverlay}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              onClick={closeSearch}
            >
              <motion.div
                className={styles.searchComponentHolder}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{
                  type: "tween",
                  duration: 0.3
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <SearchComponent
                  tcgList={tcgList}
                  initialGame={initialGame}
                  onClose={closeSearch}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Always show Sidenav/Bottomnav based on device */}
        {deviceType === "desktop" ? <Sidenav /> : <Bottomnav />}
        <main
          className={`${styles.mainContent} ${
            scrollable ? styles.scrollable : styles.notScrollable
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Bottomnav.module.css";
import Image from "next/image";
import { tcgList } from "../../data/tcgList";

const bottoms = [
  { src: "/icons/bottomnav/HomeSelected.svg", alt: "Home", path: "/" },
  {
    src: "/icons/bottomnav/DecklibrarySelected.svg",
    alt: "Deck Library",
    path: "/decklib",
  },
  {
    src: "/icons/bottomnav/DeckcreateSelected.svg",
    alt: "Deckbuilder",
    path: "/deckbuilder",
  },
  { src: "/icons/bottomnav/NewsSelected.svg", alt: "Stacks", path: "/stack" },
  {
    src: "/icons/bottomnav/BellSelected.svg",
    alt: "Notifications",
    path: "/notifications",
  },
];

const Bottomnav = () => {
  const router = useRouter();
  const [showDeckBuilderOptions, setShowDeckBuilderOptions] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const isActive = (path: string) => {
    // Get all valid paths except home
    const validPaths = bottoms.filter((b) => b.path !== "/").map((b) => b.path);

    if (path === "/") {
      // Check if current path doesn't start with any valid path
      const isInvalidPath = !validPaths.some((p) =>
        router.pathname.startsWith(p)
      );
      return isInvalidPath && router.pathname === "/";
    }
    return router.pathname.startsWith(path);
  };

  const onBottomNavClick = (tab: any) => {
    if (tab.path === "/deckbuilder") {
      setShowDeckBuilderOptions(true);
      setIsClosing(false);
    } else {
      router.push(tab.path);
    }
  };

  const selectCardGame = (value: string) => {
    setIsClosing(true);
    setTimeout(() => {
      router.push(`/deckbuilder/${value}`);
      setShowDeckBuilderOptions(false);
      setIsClosing(false);
    }, 300); // Match this with your animation duration
  };

  const closeOptions = () => {
    if (!isClosing) {
      setIsClosing(true);
      setTimeout(() => {
        setShowDeckBuilderOptions(false);
        setIsClosing(false);
      }, 300);
    }
  };

  return (
    <>
      <div className={styles.bottomNav}>
        {bottoms.map((bottom) => (
          <div
            key={bottom.path}
            className={`${styles.bottomNavIcon} ${
              isActive(bottom.path) ? styles.active : ""
            }`}
            onClick={() => onBottomNavClick(bottom)}
          >
            <Image
              src={bottom.src}
              alt={bottom.alt}
              width={30}
              height={30}
              className={!isActive(bottom.path) ? styles.greyScale : ""}
            />
          </div>
        ))}
      </div>

      {showDeckBuilderOptions && (
        <>
          <div
            className={styles.overlay}
            onClick={closeOptions}
            style={{ pointerEvents: isClosing ? "none" : "auto" }}
          />
          <div
            className={`${styles.cardGameOption} ${
              isClosing ? styles.slideOut : styles.slideIn
            }`}
          >
            {tcgList.map((item, index) => (
              <div
                key={index}
                onClick={() => selectCardGame(item.tcg)}
                style={{ pointerEvents: isClosing ? "none" : "auto" }}
                className={styles.gameSelect}
              >
                <img src={item.icon} alt={item.tcg} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Bottomnav;

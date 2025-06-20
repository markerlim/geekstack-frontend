import { useState } from "react";
import { useRouter } from "next/router";  
import styles from "../../styles/Bottomnav.module.css";
import Image from "next/image";

const bottoms = [
  { src: "/icons/bottomnav/HomeSelected.svg", alt: "Home", path: "/" },
  { src: "/icons/bottomnav/DecklibrarySelected.svg", alt: "DeckCreation", path: "/postdeck" },
  { src: "/icons/bottomnav/DeckcreateSelected.svg", alt: "Deckbuilder", path: "/deckbuilder" },
  { src: "/icons/bottomnav/NewsSelected.svg", alt: "Stacks", path: "/stacks" },
  { src: "/icons/bottomnav/BellSelected.svg", alt: "Notifications", path: "/notifications" },
];

const games = [
  { icon: "/icons/unionarenaicon.ico", value: "unionarena" },
  { icon: "/icons/onepieceicon.png", value: "onepiece" },
  { icon: "/icons/cookierun.png", value: "cookierunbraverse" },
  { icon: "/icons/duelmastericon.ico", value: "duelmasters" },
  { icon: "/icons/hololiveicon.png", value: "hololive" },
  { icon: "/icons/dragonballz.ico", value: "dragonballzfw" },
];

const Bottomnav = () => {
  const router = useRouter();
  const [showDeckBuilderOptions, setShowDeckBuilderOptions] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const isActive = (path: string) => router.pathname.startsWith(path);

  const onBottomNavClick = (tab: any) => {
    if (tab.path === "/deckbuilder") {
      setShowDeckBuilderOptions(true);
    } else {
      router.push(tab.path);
    }
  };

  const selectCardGame = (value: string) => {
    router.push(`/deckbuilder/${value}`);
    setShowDeckBuilderOptions(false);
  };

  const closeOptions = () => {
    setIsAnimatingOut(true);
  };

  const onAnimationEnd = () => {
    setIsAnimatingOut(false);
    setShowDeckBuilderOptions(false);
  };

  return (
    <>
      <div className={styles.bottomNav}>
        {bottoms.map((bottom) => (
          <div
            key={bottom.path}
            className={`${styles.bottomNavIcon} ${isActive(bottom.path) ? styles.active : ""}`}
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
          <div className={styles.overlay} onClick={closeOptions} />
          <div
            className={`${styles.cardGameOption} ${isAnimatingOut ? styles.slideOut : styles.slideIn}`}
            onAnimationEnd={onAnimationEnd}
          >
            {games.map((item, index) => (
              <div key={index} onClick={() => selectCardGame(item.value)}>
                <img src={item.icon} alt={item.value} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Bottomnav;

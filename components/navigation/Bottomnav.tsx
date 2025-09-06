import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Bottomnav.module.css";
import Image from "next/image";
import { tcgList } from "../../data/tcgList";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, SquarePlus } from "lucide-react";
import PostingStack from "../features/stacks/PostingStack";

const bottoms = [
  { src: "/icons/bottomnav/HomeSelected.svg", alt: "Home", path: "/" },
  {
    src: "/icons/bottomnav/DecklibrarySelected.svg",
    alt: "Deck Library",
    path: "/decklib",
  },
  {
    src: "/icons/bottomnav/Create.svg",
    alt: "Deckbuilder",
    path: "/deckbuilder",
  },
  { src: "/icons/bottomnav/Stacks.svg", alt: "Stacks", path: "/stack" },
  {
    src: "/icons/bottomnav/BellSelected.svg",
    alt: "Notifications",
    path: "/notifications",
  },
];

const Bottomnav = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isTCGListVisible, setIsTCGListVisible] = useState(false);
  const [isPostingOpen, setIsPostingOpen] = useState(false);

  const isActive = (path: string) => {
    const validPaths = bottoms.filter((b) => b.path !== "/").map((b) => b.path);

    if (path === "/") {
      const isInvalidPath = !validPaths.some((p) =>
        router.pathname.startsWith(p)
      );
      return isInvalidPath && router.pathname === "/";
    }
    return router.pathname.startsWith(path);
  };

  const onBottomNavClick = (tab: any) => {
    if (tab.path === "/deckbuilder") {
      setIsOpen(true); // open panel
    } else {
      router.push(tab.path);
    }
  };

  const selectCardGame = (value: string) => {
    setIsOpen(false); // close first
    setIsTCGListVisible(false);
    setTimeout(() => {
      router.push(`/deckbuilder/${value}`);
    }, 300); // match animation
  };

  const closeOptions = () => {
    setIsOpen(false);
    setIsTCGListVisible(false);
  };

  const closeTCGList = (e: any) => {
    e.stopPropagation();
    setIsTCGListVisible(false);
  };

  const openTCGList = () => {
    setIsTCGListVisible(true);
  };

  const closePostingStack = () => {
    setIsPostingOpen(false);
  };

  const openPostingStack = () => {
    setIsPostingOpen(true);
    setIsOpen(false);
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            className={styles.overlay}
            onClick={closeOptions}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ pointerEvents: "auto" }}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <motion.div
        className={styles.cardGameOptionWrapper}
        initial={{ y: "100%" }}
        animate={{ y: isOpen ? "-20px" : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          className={styles.cardGameOption}
          initial={{ scale: 0.8 }}
          animate={{ scale: isOpen ? 1 : 0.8 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onClick={openPostingStack}
        >
          <div className={styles.secondButton}>
            <div>
              <img
                  src="/icons/bottomnav/StacksCreate.svg"
                  alt="Create post"
                />
              <span>Post Content</span>
            </div>
            <ChevronRight size={14} />
          </div>
        </motion.div>
        <motion.div
          className={styles.cardGameOption}
          initial={{ scale: 0.8, width: 160 }} // small initial height
          animate={{
            scale: isOpen ? 1 : 0.8,
            width: isTCGListVisible ? 250 : 160,
          }}
          transition={{
            scale: { duration: 0.3, delay: 0.3 }, // scale transition
            width: { duration: 0.5, ease: "easeInOut" }, // slower width expansion
          }}
          onClick={openTCGList}
        >
          <motion.div
            className={styles.firstButtonContainer}
            initial={{ x: "100%" }}
            animate={{
              x: !isTCGListVisible ? 0 : "100%",
              width: !isTCGListVisible ? "100%" : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className={styles.firstButton}>
              <div>
                <img
                  src="/icons/bottomnav/DeckcreateSelected.svg"
                  alt="deckbuilder"
                />
                <span>Deckbuilder</span>
              </div>
              <ChevronRight size={14} />
            </div>
          </motion.div>
          <motion.div
            className={styles.horizontalScrollContainer}
            initial={{ x: "calc(100%)", width: 0 }}
            animate={{
              x: isTCGListVisible ? 0 : "calc(100%)",
              width: isTCGListVisible ? "calc(100%)" : 0,
              padding: 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div onClick={(e) => closeTCGList(e)}>
              <ChevronLeft size={30} />
            </div>
            {tcgList.map((item, index) => (
              <div
                key={index}
                onClick={() => selectCardGame(item.tcg)}
                className={styles.gameSelect}
              >
                <img src={item.icon} alt={item.tcg} />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {isPostingOpen && (
          <>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className={styles.postingStackWrapper}
            >
              <PostingStack onClose={closePostingStack} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Bottomnav;

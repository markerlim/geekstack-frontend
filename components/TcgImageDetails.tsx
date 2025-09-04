import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { X } from "lucide-react";
import styles from "../styles/TcgImage.module.css";
import { TCGTYPE } from "../utils/constants";
import TB_UnionArena from "./tcgeffects/TB_unionarena";
import RTB_UnionArena from "./tcgeffects/RTB_unionarena";
import RTB_Onepiece from "./tcgeffects/RTB_onepiece";
import TB_Onepiece from "./tcgeffects/TB_onepiece";
import RTB_Gundam from "./tcgeffects/RTB_gundam";
import TB_Gundam from "./tcgeffects/TB_gundam";
import { useSwipeable } from "react-swipeable";
import TB_Duelmasters from "./tcgeffects/TB_duelmasters";
import RTB_Duelmasters from "./tcgeffects/RTB_duelmasters";
import GenericGoogleAd from "./AdSense";
import { useCallback } from "react";

interface CardModalProps {
  card: any;
  tcgtype: string;
  imgProps: React.ImgHTMLAttributes<HTMLImageElement>;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  isCookieRun?: boolean; // Now optional since we'll determine it internally
}

const TcgImageDetails = ({
  card,
  tcgtype,
  imgProps,
  onClose,
  onNext,
  onPrev,
  isCookieRun: initialIsCookieRun,
}: CardModalProps) => {
  const RTBComponentsMap: Record<
    string,
    React.FC<{
      card: any;
      onNext?: () => void;
      onPrev?: () => void;
    }>
  > = {
    [TCGTYPE.UNIONARENA]: RTB_UnionArena,
    [TCGTYPE.ONEPIECE]: RTB_Onepiece,
    [TCGTYPE.GUNDAM]: RTB_Gundam,
    [TCGTYPE.DUELMASTERS]: RTB_Duelmasters,
  };

  const TBComponentsMap: Record<string, React.FC<{ card: any }>> = {
    [TCGTYPE.UNIONARENA]: TB_UnionArena,
    [TCGTYPE.ONEPIECE]: TB_Onepiece,
    [TCGTYPE.GUNDAM]: TB_Gundam,
    [TCGTYPE.DUELMASTERS]: TB_Duelmasters,
  };

  const panelY = useMotionValue(0);
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (onNext) onNext();
    },
    onSwipedRight: () => {
      if (onPrev) onPrev();
    },
    delta: 30,
    trackTouch: true,
    trackMouse: false,
  });
  const threshold = 100;
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const startY = e.clientY;

      const moveHandler = (moveEvent: PointerEvent) => {
        const delta = moveEvent.clientY - startY;
        if (delta > 0) panelY.set(delta);
      };

      const upHandler = (upEvent: PointerEvent) => {
        const totalDelta = upEvent.clientY - startY;
        if (totalDelta > threshold) onClose();
        else panelY.set(0);

        window.removeEventListener("pointermove", moveHandler);
        window.removeEventListener("pointerup", upHandler);
      };

      window.addEventListener("pointermove", moveHandler);
      window.addEventListener("pointerup", upHandler);
    },
    [panelY, onClose, threshold]
  );

  const RTBComponent = RTBComponentsMap[tcgtype] || null;
  const TBComponent = TBComponentsMap[tcgtype] || null;
  const allowedTypes = [TCGTYPE.COOKIERUN, TCGTYPE.DRAGONBALLZFW];

  const showImageOnly =
    initialIsCookieRun ?? allowedTypes.includes(tcgtype as TCGTYPE);

  return (
    <AnimatePresence>
      <>
        {card && (
          <>
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={onClose}
            />
          </>
        )}
        {showImageOnly ? (
          <div className={styles.cookieRunModalContainer}>
            <motion.div
              className={styles.cookieRunModal}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={imgProps.src}
                alt={imgProps.alt}
                className={styles.cookieRunImage}
                onClick={onClose}
              />
            </motion.div>
          </div>
        ) : (
          <motion.div
            className={styles.fullscreenPanel}
            style={{ y: panelY }}
            initial={{ y: "100%" }}
            animate={{ y: card ? 0 : "100%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}
            dragListener={false}
            {...swipeHandlers}
          >
            <div className={styles.puller} onPointerDown={onPointerDown} />
            {card && (
              <div className={styles.detailsContent}>
                <div className={styles["upper-eff-table"]}>
                  <img src={imgProps.src} alt={imgProps.alt} />
                  {RTBComponent && (
                    <RTBComponent card={card} onNext={onNext} onPrev={onPrev} />
                  )}
                </div>
                {TBComponent && <TBComponent card={card} />}
                <div
                  style={{
                    width: "100%",
                    maxWidth: "728px",
                    overflow: "hidden",
                  }}
                >
                  <GenericGoogleAd />
                </div>
                <button
                  title="close button"
                  className={styles.closeBtn}
                  onClick={onClose}
                >
                  <X size={24} color="#000" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </>
    </AnimatePresence>
  );
};

export default TcgImageDetails;

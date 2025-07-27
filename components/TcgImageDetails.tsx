// components/CardModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import styles from "../styles/TcgImage.module.css";
import { TCGTYPE } from "../utils/constants";
import TB_UnionArena from "./tcgeffects/TB_unionarena";
import RTB_UnionArena from "./tcgeffects/RTB_unionarena";
import RTB_Onepiece from "./tcgeffects/RTB_onepiece";
import TB_Onepiece from "./tcgeffects/TB_onepiece";
import RTB_Gundam from "./tcgeffects/RTB_gundam";
import TB_Gundam from "./tcgeffects/TB_gundam";

interface CardModalProps {
  card: any;
  tcgtype: string;
  imgProps: React.ImgHTMLAttributes<HTMLImageElement>;
  onClose: () => void;
  onNext?: (e: React.MouseEvent) => void;
  onPrev?: (e: React.MouseEvent) => void;
  isCookieRun?: boolean; // Now optional since we'll determine it internally
}

export const TcgImageDetails = ({
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
      onNext?: (e: React.MouseEvent) => void;
      onPrev?: (e: React.MouseEvent) => void;
    }>
  > = {
    [TCGTYPE.UNIONARENA]: RTB_UnionArena,
    [TCGTYPE.ONEPIECE]: RTB_Onepiece,
    [TCGTYPE.GUNDAM]: RTB_Gundam,
  };

  const TBComponentsMap: Record<string, React.FC<{ card: any }>> = {
    [TCGTYPE.UNIONARENA]: TB_UnionArena,
    [TCGTYPE.ONEPIECE]: TB_Onepiece,
    [TCGTYPE.GUNDAM]: TB_Gundam,
  };

  const RTBComponent = RTBComponentsMap[tcgtype] || null;
  const TBComponent = TBComponentsMap[tcgtype] || null;
  const isCookieRun = initialIsCookieRun ?? tcgtype === TCGTYPE.COOKIERUN;

  return (
    <AnimatePresence>
      <>
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        />

        {isCookieRun ? (
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
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 100 }}
            dragElastic={0}
            dragMomentum={false}
            onDragEnd={(e, info) => {
              if (info.offset.y > 80) onClose();
            }}
          >
            <div className={styles.detailsContent}>
              <div className={styles.puller} />
              <div className={styles["upper-eff-table"]}>
                <img src={imgProps.src} alt={imgProps.alt} />
                {RTBComponent && (
                  <RTBComponent card={card} onNext={onNext} onPrev={onPrev} />
                )}
              </div>
              {TBComponent && <TBComponent card={card} />}
              <button title="close button" className={styles.closeBtn} onClick={onClose}>
                <X size={24} color="#000"/>
              </button>
            </div>
          </motion.div>
        )}
      </>
    </AnimatePresence>
  );
};

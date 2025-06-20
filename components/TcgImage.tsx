import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/TcgImage.module.css";
import TB_UnionArena from "./tcgeffects/TB_unionarena";
import RTB_UnionArena from "./tcgeffects/RTB_unionarena";
import RTB_onepiece from "./tcgeffects/RTB_onepiece";
import TB_Onepiece from "./tcgeffects/TB_onepiece";
import { useDevice } from "../contexts/DeviceContext";

interface TcgImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  card: any;
  tcgtype: string;
}
const TcgImage = ({ card, tcgtype, ...imgProps }: TcgImageProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const deviceType = useDevice();

  const imageClass =
    deviceType === "mobile"
      ? styles.cardImageMobile
      : deviceType === "tablet"
      ? styles.cardImageTablet
      : styles.cardImageDesktop;

  const RTBComponentsMap: Record<string, React.FC<{ card: any }>> = {
    unionarena: RTB_UnionArena,
    onepiece: RTB_onepiece,
  };

  const TBComponentsMap: Record<string, React.FC<{ card: any }>> = {
    unionarena: TB_UnionArena,
    onepiece: TB_Onepiece,
  };

  const RTBComponent = RTBComponentsMap[tcgtype] || null;
  const TBComponent = TBComponentsMap[tcgtype] || null;

  return (
    <>
      <img
        {...imgProps}
        className={`${styles.cardImage} ${imageClass}`}
        onClick={() => setShowDetails(true)}
      />
      <AnimatePresence>
        {showDetails && (
          <>
            {/* BACKDROP */}
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowDetails(false)}
            />

            {/* SLIDING PANEL */}
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
                if (info.offset.y > 80) setShowDetails(false);
              }}
            >
              <div className={styles.detailsContent}>
                <div className={styles.puller} />
                <div className={styles["upper-eff-table"]}>
                  <img src={imgProps.src} alt={imgProps.alt}  />
                  <RTBComponent card={card} />
                </div>
                <TBComponent card={card} />
                <button
                  className={styles.closeBtn}
                  onClick={() => setShowDetails(false)}
                >
                  X
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default TcgImage;

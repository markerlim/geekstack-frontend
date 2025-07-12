import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/TcgImage.module.css";
import TB_UnionArena from "./tcgeffects/TB_unionarena";
import RTB_UnionArena from "./tcgeffects/RTB_unionarena";
import RTB_Onepiece from "./tcgeffects/RTB_onepiece";
import TB_Onepiece from "./tcgeffects/TB_onepiece";
import RTB_Gundam from "./tcgeffects/RTB_gundam";
import TB_Gundam from "./tcgeffects/TB_gundam";
import { TCGTYPE } from "../utils/constants";
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

  const isCookieRun = tcgtype === TCGTYPE.COOKIERUN;

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
            {/* BACKDROP - Shared for all card types */}
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowDetails(false)}
            />

            {isCookieRun ? (
              /* SIMPLE MODAL FOR COOKIERUN */
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetails(false);
                    }}
                  />
                </motion.div>
              </div>
            ) : (
              /* SLIDING PANEL FOR OTHER TCGS */
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
                    <img src={imgProps.src} alt={imgProps.alt} />
                    {RTBComponent && <RTBComponent card={card} />}
                  </div>
                  {TBComponent && <TBComponent card={card} />}
                  <button
                    className={styles.closeBtn}
                    onClick={() => setShowDetails(false)}
                  >
                    X
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default TcgImage;
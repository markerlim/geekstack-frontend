import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/TcgImage.module.css";
import TB_UnionArena from "./tcgeffects/TB_unionarena";
import RTB_UnionArena from "./tcgeffects/RTB_unionarena";

interface TcgImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  card: any;
}
const TcgImage = ({ card, ...imgProps }: TcgImageProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <img
        {...imgProps}
        className={styles.cardImage}
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
                  <img src={imgProps.src} alt={imgProps.alt} />
                  <RTB_UnionArena card={card} />
                </div>
                <TB_UnionArena card={card} />
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

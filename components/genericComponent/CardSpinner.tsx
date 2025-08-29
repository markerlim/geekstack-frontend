import React from "react";
import styles from "../../styles/CardLoader.module.css";

const CardSpinner: React.FC = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.cardSpinner}>
        <div className={styles.cardSpin}>
          <div className={`${styles.cardFace} ${styles.cardBack}`}></div>
        </div>
      </div>
    </div>
  );
};

export default CardSpinner;

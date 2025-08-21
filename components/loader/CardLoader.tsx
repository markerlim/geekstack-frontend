import React from 'react';
import styles from '../../styles/CardLoader.module.css';

const CardLoader: React.FC = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <div className={`${styles.cardFace} ${styles.cardBack}`}></div>
          <div className={`${styles.cardFace} ${styles.cardFront}`}>
            M
          </div>
        </div>
        <div className={styles.card}>
          <div className={`${styles.cardFace} ${styles.cardBack}`}></div>
          <div className={`${styles.cardFace} ${styles.cardFront}`}>
            K
          </div>
        </div>
        <div className={styles.card}>
          <div className={`${styles.cardFace} ${styles.cardBack}`}></div>
          <div className={`${styles.cardFace} ${styles.cardFront}`}>
            Q
          </div>
        </div>
      </div>
      
      <div className={styles.loadingText}>
        Shuffling cards<span className={styles.dots}></span>
      </div>
    </div>
  );
};

export default CardLoader;
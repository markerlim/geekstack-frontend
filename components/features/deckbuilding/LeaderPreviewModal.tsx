import { X } from "lucide-react";
import styles from "../../../styles/LeaderPreviewModal.module.css";

const LeaderPreviewModal = ({ card, onClose }) => {
  return (
    <div className={styles.previewOverlay} onClick={onClose}>
      <div
        className={styles.previewContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.cardDetails}>
          <h3>{card.cardName}</h3>
          <p>{card.effects}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X/>
        </button>
      </div>
    </div>
  );
};

export default LeaderPreviewModal;

import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../../styles/EffectTable.module.css";
import { CardOnePiece } from "../../model/card.model";

interface RTBProps {
  card: CardOnePiece;
  onNext?: (e: React.MouseEvent) => void;
  onPrev?: (e: React.MouseEvent) => void;
}

const RTB_Onepiece = ({ card, onNext, onPrev }: RTBProps) => {
  return (
    <div className={styles["rtb"]}>
      <div className={styles["rtb-main"]}>
        <div className={styles["rtb-section"]}>
          <div className={styles["rtb-header"]}>Card Id</div>
          <div className={styles["rtb-info"]}>{card?.cardId}</div>
        </div>
        <div className={styles["rtb-section"]}>
          <div className={styles["rtb-header"]}>Type</div>
          <div className={styles["rtb-info"]}>{card?.typing}</div>
        </div>
      </div>
      <div className={styles["rtb-nav"]}>
          {onPrev && (
            <button title="Prev" onClick={onPrev}>
              <ChevronLeft />
            </button>
          )}
          {onNext && (
            <button title="Next" onClick={onNext}>
              <ChevronRight />
            </button>
          )}
      </div>
      <div>Report error</div>
    </div>
  );
};

export default RTB_Onepiece;

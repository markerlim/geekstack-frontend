import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../../styles/EffectTable.module.css";
import { DuelmastersCard } from "../../model/card.model";

interface RTBProps {
  card: DuelmastersCard;
  onNext?: () => void;
  onPrev?: () => void;
}

const RTB_Duelmaster= ({ card, onNext, onPrev }: RTBProps) => {
  return (
    <div className={styles["rtb"]}>
      <div className={styles["rtb-main"]}>
        <div className={styles["rtb-section"]}>
          <div className={styles["rtb-header"]}>Card Id</div>
          <div className={styles["rtb-info"]}>{card?.cardUid}</div>
        </div>
        <div className={styles["rtb-section"]}>
          <div className={styles["rtb-header"]}>Race</div>
          <div className={styles["rtb-info"]}>{card?.race}</div>
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

export default RTB_Duelmaster;

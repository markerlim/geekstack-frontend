import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../../styles/EffectTable.module.css";
import { CardOnePiece } from "../../model/card.model";
import ErrorReportBtn from "./ErrorReportBtn";

interface RTBProps {
  card: CardOnePiece;
  onNext?: () => void;
  onPrev?: () => void;
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
            <div className={styles["rtb-func"]}>
        <ErrorReportBtn id={card._id}/>
      </div>
    </div>
  );
};

export default RTB_Onepiece;

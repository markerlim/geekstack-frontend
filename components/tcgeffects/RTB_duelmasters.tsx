import { ArrowLeftRight, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../../styles/EffectTable.module.css";
import { DuelmastersCard } from "../../model/card.model";
import { useDualCardSide } from "./useDualToggle";
import { useState } from "react";
import ErrorReportBtn from "./ErrorReportBtn";

interface RTBProps {
  card: DuelmastersCard;
  onNext?: () => void;
  onPrev?: () => void;
}

const RTB_Duelmasters = ({ card, onNext, onPrev }: RTBProps) => {
  const { showSecondSide, toggleSide } = useDualCardSide();
  const [effectShow, setEffectShow] = useState(false);

  const handleEffectToggle = () => {
    setEffectShow(!effectShow);
    toggleSide();
  };
  const dualCard = card.cardName2 != null && card.cardName2 !== "";
  console.log("RTB_Duelmasters card:", card);

  const displayedCardUid = card.cardUid;
  const displayedRace =
    (showSecondSide && card.race2 ? card.race2 : card.race) ?? [];
  const displayedType =
    (showSecondSide && card.type2 ? card.type2 : card.type) ?? [];

  return (
    <div className={styles["rtb"]}>
      <div className={styles["rtb-main"]}>
        <div className={styles["rtb-section"]}>
          <div className={styles["rtb-header"]}>Card Id</div>
          <div className={styles["rtb-info"]}>{displayedCardUid}</div>
        </div>
        <div className={styles["rtb-section"]}>
          <div className={styles["rtb-header"]}>Race</div>
          <div className={styles["rtb-info"]}>
            {displayedRace.length > 0 ? displayedRace.join(" / ") : "-"}
          </div>
        </div>
                <div className={styles["rtb-section"]}>
          <div className={styles["rtb-header"]}>Type</div>
          <div className={styles["rtb-info"]}>
            {displayedType.length > 0 ? displayedType : "-"}
          </div>
        </div>
      </div>
      <div className={styles["rtb-nav"]}>
        {onPrev && (
          <button title="Prev" onClick={onPrev}>
            <ChevronLeft/>
          </button>
        )}
        {onNext && (
          <button title="Next" onClick={onNext}>
            <ChevronRight/>
          </button>
        )}
      </div>
      {dualCard && (
        <div
          className={styles["rtb-duelmasters"]}
          onClick={handleEffectToggle}
        >
          <ArrowLeftRight size={18}/>
        </div>
      )}
      <div className={styles["rtb-func"]}>
        <ErrorReportBtn id={card._id} />
      </div>
    </div>
  );
};

export default RTB_Duelmasters;

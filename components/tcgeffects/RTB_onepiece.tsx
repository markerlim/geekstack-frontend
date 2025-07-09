import { CardOnePiece, CardUnionArena } from "../../model/card.model";
import styles from "../../styles/EffectTable.module.css";

interface TBOnePieceProps {
  card: CardOnePiece;
}

const RTB_onepiece = ({ card }: TBOnePieceProps) => {
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
    <div>
        Report error
    </div>
    </div>
  );
};

export default RTB_onepiece;

import styles from "../../styles/EffectTable.module.css";
import { TBUnionArenaProps } from "./TB_unionarena";

const RTB_UnionArena = ({ card }: TBUnionArenaProps) => {
  return (
    <div className={styles["rtb"]}>
    <div className={styles["rtb-main"]}>
      <div className={styles["rtb-section"]}>
        <div className={styles["rtb-header"]}>Card Id</div>
        <div className={styles["rtb-info"]}>{card?.cardId}</div>
      </div>
      <div className={styles["rtb-section"]}>
        <div className={styles["rtb-header"]}>Traits</div>
        <div className={styles["rtb-info"]}>{card?.traits}</div>
      </div>
    </div>
    <div>
        Report error
    </div>
    </div>
  );
};

export default RTB_UnionArena;

import styles from "../../styles/EffectTable.module.css";
import { TBGundamProps } from "./TB_gundam";


const RTB_Gundam = ({ card }: TBGundamProps) => {
  return (
    <div className={styles["rtb"]}>
    <div className={styles["rtb-main"]}>
      <div className={styles["rtb-section"]}>
        <div className={styles["rtb-header"]}>Card Id</div>
        <div className={styles["rtb-info"]}>{card?.cardId}</div>
      </div>
      <div className={styles["rtb-section"]}>
        <div className={styles["rtb-header"]}>Traits</div>
        <div className={styles["rtb-info"]}>{card?.trait}</div>
      </div>
    </div>
    <div>
        Report error
    </div>
    </div>
  );
};

export default RTB_Gundam;

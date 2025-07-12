import { GundamCard } from "../../model/card.model";
import EffectWithIcons from "../../services/effectUnionArenaTag";
import styles from "../../styles/EffectTable.module.css";

export interface TBGundamProps {
  card: GundamCard;
}

const TB_Gundam = ({ card }: TBGundamProps) => {
  const normalizedEffect = card.effect.replace(/\\n/g, "\n");
  const effectLines = normalizedEffect.split(/\r?\n|;/).filter(Boolean);
  return (
    <div className={styles['lower-table']}>
      <h3 className={styles["card-name"]}>{card.cardName}</h3>
      <table className={styles["tb-main"]}>
        <tbody>
          <tr>
            <th className={styles["tb-header"]}>Effects</th>
          </tr>
          <tr>
            <td className={styles["tb-info"]}>
              {effectLines.map((line, index) => (
                <p key={index}>
                  <EffectWithIcons text={line.trim()} />
                </p>
              ))}
            </td>
          </tr>
          <div className={styles.spacer}></div>
        </tbody>
      </table>
    </div>
  );
};

export default TB_Gundam;

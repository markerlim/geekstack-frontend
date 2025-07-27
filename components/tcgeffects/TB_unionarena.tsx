import { CardUnionArena } from "../../model/card.model";
import EffectWithIcons from "../../services/effectUnionArenaTag";
import styles from "../../styles/EffectTable.module.css";

export interface TBUnionArenaProps {
  card: CardUnionArena;
}

const TB_UnionArena = ({ card }: TBUnionArenaProps) => {
  const normalizedEffect = card.effect.replace(/\\n/g, "\n");
  const effectLines = normalizedEffect.split(/\r?\n|;/).filter(Boolean);
  return (
    <div className={styles['lower-table']}>
      <div className={styles["card-name"]}>{card.cardName}</div>
      <table className={styles["tb-main"]}>
        <tbody>
          <tr>
            <th className={styles["tb-header"]} >Effects</th>
          </tr>
          <tr>
            <td className={`${styles["tb-info"]} ${styles['roboto-font']}`}>
              {effectLines.map((line, index) => (
                <p key={index}>
                  <EffectWithIcons text={line.trim()} />
                </p>
              ))}
            </td>
          </tr>
          <tr className={styles.spacer}></tr>
          <tr>
            <th className={styles["tb-header"]}>Trigger</th>
          </tr>
          <tr>
            <td className={styles["tb-info"]}>
                <p>
                  {card.trigger}
                </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TB_UnionArena;

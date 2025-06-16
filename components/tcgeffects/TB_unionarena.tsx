import { CardUnionArena } from "../../interfaces/card.model";
import EffectWithIcons from "../../services/effectUnionArenaTag";
import styles from "../../styles/EffectTable.module.css";

interface TBUnionArenaProps {
  card: CardUnionArena;
}

const TB_UnionArena = ({ card }: TBUnionArenaProps) => {
  const normalizedEffect = card.effect.replace(/\\n/g, "\n");
  const effectLines = normalizedEffect.split(/\r?\n|;/).filter(Boolean);
  return (
    <div>
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

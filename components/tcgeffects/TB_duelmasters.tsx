import { useState } from "react";
import { DuelmastersCard } from "../../model/card.model";
import EffectWithIcons from "../../services/effectUnionArenaTag";
import styles from "../../styles/EffectTable.module.css";
import { useDualCardSide } from "./useDualToggle";

export interface TBDuelmasterProps {
  card: DuelmastersCard;
}

const TB_Duelmasters = ({ card }: TBDuelmasterProps) => {
  const { showSecondSide } = useDualCardSide();

  // Decide which side's name and effects to display
  const displayedName =  showSecondSide ? card.cardName2 : card.cardName;
  const displayedEffects =
    showSecondSide && card.effects2
      ? card.effects2
      : card.effects;

  // Normalize and split effects into lines
  const normalizedEffect = displayedEffects.replace(/\\n/g, "\n");
  const effectLines = normalizedEffect.split(/\r?\n|;/).filter(Boolean);

  return (
    <div className={styles["lower-table"]}>
      <div className={styles["card-name"]}>{displayedName}</div>
      <table className={styles["tb-main"]}>
        <tbody>
          <tr>
            <th className={styles["tb-header"]}>Effects</th>
          </tr>
          <tr>
            <td className={`${styles["tb-info"]} ${styles["roboto-font"]}`}>
              {effectLines.map((line, index) => (
                <p key={index}>
                  <EffectWithIcons text={line.trim()} />
                </p>
              ))}
            </td>
          </tr>
          <tr className={styles.spacer}></tr>
        </tbody>
      </table>
    </div>
  );
};

export default TB_Duelmasters;

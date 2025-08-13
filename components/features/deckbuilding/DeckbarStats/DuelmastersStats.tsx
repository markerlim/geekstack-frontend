import { DuelmastersCard } from "../../../../model/card.model";
import styles from "../../../../styles/Stats.module.css";
import { GameCardStatsProps } from "../DeckbuilderStats";

const DuelmastersStats = ({ cardlist }: GameCardStatsProps) => {
  const maxTotal = 40;

  type EnergyKey = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8+";

  const energyCounts: Record<EnergyKey, number> = {
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
    "7": 0,
    "8+": 0,
  };

  const statsCounts = {
    total: 0,
  };

  cardlist.forEach((card) => {
    const { count, cost } = card as DuelmastersCard;

    statsCounts.total += count;

    if (parseInt(cost) >= 0 && parseInt(cost) <= 7) {
      energyCounts[cost as EnergyKey] += card.count;
    } else if (parseInt(cost) >= 8) {
      energyCounts["8+"] += card.count;
    }
  });

  return (
    <div className={styles["cost-grid"]}>
      {Object.entries(energyCounts).map(([cost, count]) => (
        <div key={cost} className={styles["cost-item"]}>
          <div className={styles["cost-count"]}>{count}</div>
          <div className={styles["cost-bar-container"]}>
            <div
              className={styles["cost-bar"]}
              style={{ height: `${(count / 15) * 100}%` }}
            ></div>
          </div>
          <div className={styles["cost-value"]}>{cost}</div>
        </div>
      ))}
      <div className={styles["extra-stats"]}>
        <div>
          <img src="/icons/TTOTAL.png" alt="total" />
          <span
            className={`${
              maxTotal < statsCounts["total"] && styles["exceeded"]
            }`}
          >
            {statsCounts["total"]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DuelmastersStats;

import { GundamCard } from "../../../../model/card.model";
import styles from "../../../../styles/Stats.module.css";
import { GameCardStatsProps } from "../DeckbuilderStats";

const GundamStats = ({ cardlist }: GameCardStatsProps) => {
  const maxTotal = 50;

  type EnergyKey = "0" | "1" | "2" | "3" | "4" | "5+";
  const energyCounts: Record<EnergyKey, number> = {
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5+": 0,
  };

  type LevelKey = "0" | "1" | "2" | "3" | "4" | "5+";
  const levelCounts: Record<LevelKey, number> = {
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5+": 0,
  };
  const statsCounts = {
    pilot: 0,
    command: 0,
    unit: 0,
    base: 0,
    total: 0,
  };

  // Count cards for each energy cost
  cardlist.forEach((card) => {
    const { count, cardType, cost, level } = card as GundamCard;
    const normalizedType = cardType?.toLowerCase() || "";

    statsCounts["total"] += card.count;
    const parsedCost = parseInt(cost);
    const parsedLevel = parseInt(level);

    if (parsedCost >= 0 && parsedCost <= 5) {
      energyCounts[cost as EnergyKey] += card.count;
    } else if (parsedCost >= 6) {
      energyCounts["5+"] += card.count;
    }

    if (parsedLevel >= 1 && parsedLevel <= 4) {
      levelCounts[level as LevelKey] += card.count;
    } else if (parsedLevel >= 5) {
      levelCounts["5+"] += card.count;
    }

    switch (normalizedType) {
      case "pilot":
      case "command":
      case "unit":
      case "base":
        statsCounts[normalizedType] += count;
        break;
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
        {Object.entries(levelCounts).map(([cost, count]) => (
          <div>
            <span>LV.{cost}</span>
            <span>{count}</span>
          </div>
        ))}
      </div>
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
        <div>
          <span>pilot</span>
          <span>{statsCounts["pilot"]}</span>
        </div>
        <div>
          <span>command</span>
          <span>{statsCounts["command"]}</span>
        </div>
        <div>
          <span>unit</span>
          <span>{statsCounts["unit"]}</span>
        </div>
        <div>
          <span>base</span>
          <span>{statsCounts["base"]}</span>
        </div>
      </div>
    </div>
  );
};

export default GundamStats;

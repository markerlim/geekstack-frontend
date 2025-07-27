import styles from "../../../../styles/Stats.module.css";

const GundamStats = ({ cardlist }) => {
  const maxTotal = 50;

  const energyCounts = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    "5+": 0,
  };

  const levelCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
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
    statsCounts["total"] += card.count;
    const cost = card.cost;
    const level = card.level;

    if (cost >= 0 && cost <= 5) {
      energyCounts[cost] += card.count;
    } else if (cost >= 6) {
      energyCounts["5+"] += card.count;
    }

    if (level >= 1 && level <= 4) {
      levelCounts[level] += card.count;
    } else if (level >= 5) {
      levelCounts["5+"] += card.count;
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

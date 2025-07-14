import styles from "../../../../styles/Stats.module.css";

const DuelmastersStats = ({ cardlist }) => {
  const maxTotal = 40;

  const energyCounts = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    "8+": 0,
  };

  const statsCounts = {
    total: 0,
  };

  // Count cards for each energy cost
  cardlist.forEach((card) => {
        const { count, cost } = card;

    statsCounts.total += count;

    if (cost >= 0 && cost <= 7) {
      energyCounts[cost] += card.count;
    } else if (cost >= 8) {
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
          <span className={`${maxTotal < statsCounts["total"] && styles['exceeded']}`}>{statsCounts["total"]}</span>
        </div>
      </div>
    </div>
  );
};

export default DuelmastersStats;

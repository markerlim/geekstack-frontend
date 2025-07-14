import styles from "../../../../styles/Stats.module.css";

const UnionArenaStats = ({ cardlist }) => {
  const maxTotal = 50;
  const maxCopy = 4;
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
    color: 0,
    final: 0,
    special: 0,
    total: 0,
  };

  cardlist.forEach((card) => {
    const { count, triggerState, energycost } = card;
    const normalizedType = triggerState?.toLowerCase() || "";

    statsCounts.total += count;

    if (energycost >= 0 && energycost <= 7) {
      energyCounts[energycost] += card.count;
    } else if (energycost >= 8) {
      energyCounts["8+"] += card.count;
    }

    switch (normalizedType) {
      case "color":
      case "special":
      case "final":
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
          <img src="/icons/TCOLOR.png" alt="color" />
          <span
            className={`${
              maxCopy < statsCounts["color"] && styles["exceeded"]
            }`}
          >
            {statsCounts["color"]}
          </span>
        </div>
        <div>
          <img src="/icons/TSPECIAL.png" alt="special" />
          <span
            className={`${
              maxCopy < statsCounts["special"] && styles["exceeded"]
            }`}
          >
            {statsCounts["special"]}
          </span>
        </div>
        <div>
          <img src="/icons/TFINAL.png" alt="final" />
          <span
            className={`${
              maxCopy < statsCounts["final"] && styles["exceeded"]
            }`}
          >
            {statsCounts["final"]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UnionArenaStats;

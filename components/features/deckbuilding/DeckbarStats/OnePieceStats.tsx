import styles from "../../../../styles/Stats.module.css";

const OnePieceStats = ({ cardlist }) => {
  const maxTotal = 50;

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
    character: 0,
    event: 0,
    stage: 0,
    total: 0,
  };

  cardlist.forEach((card) => {
    const { count, category, lifecost } = card;
    const normalizedType = category?.toLowerCase() || "";

    statsCounts.total += count;
    if (lifecost >= 0 && lifecost <= 7) {
      energyCounts[lifecost] += card.count;
    } else if (lifecost >= 8) {
      energyCounts["8+"] += card.count;
    }

    switch (normalizedType) {
      case "character":
      case "event":
      case "stage":
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
          <span>character</span>
          <span>{statsCounts["character"]}</span>
        </div>
        <div>
          <span>event</span>
          <span>{statsCounts["event"]}</span>
        </div>
        <div>
          <span>stage</span>
          <span>{statsCounts["stage"]}</span>
        </div>
      </div>
    </div>
  );
};

export default OnePieceStats;

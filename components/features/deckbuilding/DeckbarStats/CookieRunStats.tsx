import styles from "../../../../styles/Stats.module.css";

const CookieRunStats = ({ cardlist }) => {
  const maxTotal = 50;
  const energyCounts = {
    1: 0,
    2: 0,
    3: 0,
  };

  const statsCounts = {
    cookie: 0,
    item: 0,
    trap: 0,
    stage: 0,
    total: 0,
  };

  cardlist.forEach((card) => {
    const { count, cardType, cardLevelTitle } = card;
    const normalizedType = cardType?.toLowerCase() || "";

    statsCounts.total += count;

    if (cardLevelTitle != null) {
      energyCounts[cardLevelTitle] =
        (energyCounts[cardLevelTitle] || 0) + count;
    }

    switch (normalizedType) {
      case "cookie":
      case "trap":
      case "item":
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
          <span>cookie</span>
          <span>{statsCounts["cookie"]}</span>
        </div>
        <div>
          <span>item</span>
          <span>{statsCounts["item"]}</span>
        </div>
        <div>
          <span>trap</span>
          <span>{statsCounts["trap"]}</span>
        </div>
        <div>
          <span>stage</span>
          <span>{statsCounts["stage"]}</span>
        </div>
      </div>
    </div>
  );
};

export default CookieRunStats;

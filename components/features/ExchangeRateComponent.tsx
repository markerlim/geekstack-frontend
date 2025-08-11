import styles from "../../styles/IndexPage.module.css";
import { useAppStore } from "../../services/store/store";

const ExchangeRate = () => {
  const exchangeRate = useAppStore((state) => state.exchangeRate);

  return (
    <div className={styles["additional-content"]}>
      <div className={styles["additional-header"]}>Today's Exchange Rate</div>
      <div className={styles["exchange-rate-container"]}>
        <span className={styles.currency}>1 SGD</span>
        <span className={styles.equals}>=</span>
        <span className={styles.value}>{exchangeRate?.toFixed(2)}</span>
        <span className={styles.currency}>JPY</span>
      </div>
      <div className={styles["additional-sub-header"]}>
        Exchange rate refreshes daily at around 00:00 UTC
      </div>
    </div>
  );
};

export default ExchangeRate;

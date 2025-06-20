import { CircleMinus, CirclePlus } from "lucide-react";
import { useDevice } from "../../contexts/DeviceContext";
import styles from "../../styles/DeckbuilderCounter.module.css";
import { useDeck } from "../../contexts/DeckContext";

const DeckbuilderCounter = ({card}) => {
  const device = useDevice();
  const { addCard, removeCard, getCardCount} = useDeck();

  const sizeClass =
    device === "desktop"
      ? styles.counterButtonDesktop
      : styles.counterButtonMobile;

  const contSizeClass =
    device === "desktop"
      ? styles.counterContainerDesktop
      : styles.counterContainerMobile;

  return (
    <div className={`${styles.counterContainer} ${contSizeClass}`}>
      <div className={`${styles.counterButton} ${sizeClass}`} onClick={() => addCard(card)}>
        <CirclePlus
          color="var(--gs-color-primary)"
        />
      </div>
      <div className={styles.counterValue}>{getCardCount(card._id)}</div>
      <div className={`${styles.counterButton} ${sizeClass}`} onClick={() => removeCard(card._id)}>
        <CircleMinus color="var(--gs-color-primary)" />
      </div>
    </div>
  );
};

export default DeckbuilderCounter;

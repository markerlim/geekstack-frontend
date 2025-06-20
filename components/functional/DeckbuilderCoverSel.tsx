import { useDeck } from "../../contexts/DeckContext";
import styles from "../../styles/DeckbuilderCover.module.css";

const DeckbuilderCover = ({ onCoverSelect, onClose }) => {
  const { deckCards } = useDeck();

  const handleClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    onCoverSelect(url);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.coverGrid}>
        {deckCards.map((deckcard) => (
          <div
            key={deckcard.card._id}
            onClick={(e) => handleClick(e, deckcard.card.urlimage)}
          >
            <img src={deckcard.card.urlimage} alt={deckcard.card._id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeckbuilderCover;

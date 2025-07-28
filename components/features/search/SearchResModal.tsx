import { X } from "lucide-react";
import styles from "../../../styles/IndexPage.module.css";
import { useSearchCards } from "../../../contexts/SearchContext";
import TcgImage from "../../TcgImage";
import TcgImageDetails from "../../TcgImageDetails";
import { GameCard } from "../../../model/card.model";
import { useState } from "react";
import cardNavEvent from "../../../services/eventBus/cardNavEvent";

const SearchResModal = ({onClose}) => {
  const { searchResults, searchTerm } = useSearchCards();
  const [currentCard, setCurrentCard] = useState<GameCard | null>(null);

  const handleCardClick = (card: GameCard) => {
    setCurrentCard(card);
    cardNavEvent.emit("card:open", card._id);
  };

  const handleCloseModal = () => {
    setCurrentCard(null);
    cardNavEvent.emit("card:close");
  };
  
  return (
    <div className={styles.resultsModal}>
      <div className={styles.modalHeader}>
        <h3>Search Results for "{searchTerm}"</h3>
        <button
          title="Expand results"
          onClick={onClose}
          className={styles.closeButton}
        >
          <X size={24} />
        </button>
      </div>
      <div className={styles.modalResults}>
        {searchResults?.map((card) => (
          <div key={card._id}>
            <TcgImage
              card={card}
              tcgtype={card.tcg}
              src={card.urlimage}
              alt={card.cardName}
              onClick={() => handleCardClick(card)}
            />
          </div>
        ))}
      </div>
      <TcgImageDetails
        card={currentCard}
        tcgtype={currentCard?.tcg || ""}
        imgProps={{
          src: currentCard?.urlimage,
          alt: currentCard?.cardName,
        }}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default SearchResModal;

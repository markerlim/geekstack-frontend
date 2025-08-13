import { useState } from "react";
import { useSearchCards } from "../../../contexts/SearchContext";
import { GameCard } from "../../../model/card.model";
import cardNavEvent from "../../../services/eventBus/cardNavEvent";
import styles from "../../../styles/IndexPage.module.css";
import TcgImage from "../../TcgImage";
import TcgImageDetails from "../../TcgImageDetails";
import { TCGTYPE } from "../../../utils/constants";

interface SearchContainerProps {
  onOpen: () => void;
} 

const SearchContainer = ({ onOpen }:SearchContainerProps) => {
  const { searchResults, isLoading } = useSearchCards();
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
    <div className={styles.searchResultsContainer}>
      <div className={styles.inlineResults}>
        {isLoading ? (
          <div className={styles.loading}>Searching cards...</div>
        ) : searchResults && searchResults.length > 0 ? (
          <>
            {searchResults.slice(0, 5).map((card) => (
              <TcgImage
                card={card}
                key={card._id}
                tcgtype={card.tcg as TCGTYPE}
                src={card.urlimage}
                alt={card.cardName}
                onClick={() => handleCardClick(card)}
              />
            ))}
          </>
        ) : (
          <p className={styles.noResults}>No cards found</p>
        )}
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
      {searchResults && searchResults.length > 5 && (
        <button
          title="show more"
          className={styles.showMoreButton}
          onClick={onOpen}
        >
          Show All Results ({searchResults.length})
        </button>
      )}
    </div>
  );
};

export default SearchContainer;

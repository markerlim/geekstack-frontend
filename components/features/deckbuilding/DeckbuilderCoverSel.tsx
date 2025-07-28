import { useEffect, useState } from "react";
import { useDeck } from "../../../contexts/DeckContext";
import styles from "../../../styles/DeckbuilderCover.module.css";
import { fetchOnePieceLeaders } from "../../../services/functions/gsBoosterService";
import { TCGTYPE } from "../../../utils/constants";
import LeaderPreviewModal from "./LeaderPreviewModal";

const DeckbuilderCover = ({ onCoverSelect, onClose, tcg }) => {
  const { deckCards } = useDeck();
  const [listofcards, setListofcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [previewCard, setPreviewCard] = useState(null); // Track card to preview

  const handleSearch = () => {
    setTriggerSearch(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const isLeaderBased =
    tcg === TCGTYPE.ONEPIECE || tcg === TCGTYPE.DRAGONBALLZFW;

  useEffect(() => {
    const loadCards = async () => {
      setIsLoading(true);
      try {
        if (isLeaderBased) {
          if (tcg === TCGTYPE.ONEPIECE) {
            const leaders = await fetchOnePieceLeaders(0, 50, searchTerm);
            setListofcards(leaders);
          }
        } else {
          setListofcards(deckCards.map((dc) => dc.card));
        }
      } catch (error) {
        console.error("Error loading cards:", error);
      } finally {
        setIsLoading(false);
        setTriggerSearch(false);
      }
    };

    loadCards();
  }, [tcg, deckCards, isLeaderBased, triggerSearch]); // Removed searchTerm from dependencies

  const handleSingleClick = (card: any) => {
    onCoverSelect(card.urlimage);
  };

  const handleContextClick = (e, card: any) => {
    e.preventDefault();
    setPreviewCard(card);
  };

  const closePreview = () => {
    setPreviewCard(null);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.coverGrid}>
          {isLoading ? (
            <div className={styles.loading}>Loading...</div>
          ) : listofcards.length > 0 ? (
            listofcards.map((card) => (
              <div
                key={card._id}
                onClick={() => handleSingleClick(card)}
                onContextMenu={(e) => handleContextClick(e, card)}
                className={styles["deckcover"]}
              >
                <img src={card.urlimage} alt={card._id} />
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              {isLeaderBased && searchTerm
                ? "No matching cards found"
                : "No cards available"}
            </div>
          )}
        </div>
        {isLeaderBased && (
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search leader cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSearch();
              }}
              disabled={isLoading}
            >
              Search
            </button>
          </div>
        )}
      </div>
      {previewCard && (
        <LeaderPreviewModal card={previewCard} onClose={closePreview} />
      )}
    </div>
  );
};

export default DeckbuilderCover;

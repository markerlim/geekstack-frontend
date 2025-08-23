import { useEffect, useState } from "react";
import { useDeck } from "../../../contexts/DeckContext";
import styles from "../../../styles/DeckbuilderCover.module.css";
import { fetchOnePieceLeaders } from "../../../services/functions/gsBoosterService";
import { TCGTYPE } from "../../../utils/constants";
import LeaderPreviewModal from "./LeaderPreviewModal";
import { CardOnePiece, GameCard } from "../../../model/card.model";

interface DeckbuilderCoverProps {
  onCoverSelect: (coverUrl: string) => void;
  onClose: () => void;
  tcg: string;
}

const DeckbuilderCover = ({
  onCoverSelect,
  onClose,
  tcg,
}: DeckbuilderCoverProps) => {
  const { deckCards, setPreFilterList, setIsPreFilterRequired } = useDeck();
  const [listofcards, setListofcards] = useState<GameCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
            setIsPreFilterRequired(true);
          }
        } else {
          setListofcards(deckCards.map((dc) => dc.card));
          setIsPreFilterRequired(false);
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
    console.log(card);
    onCoverSelect(card.urlimage);
    if (isLeaderBased) {
      const colors = String(card.color)
        .split("/")
        .map((c) => c.trim().toLowerCase());

      setPreFilterList({
        color: colors,
        category: ["leader"],
      });
      setSearchTerm("");
      setTriggerSearch(false);
    }
  };

  const handleContextClick = (e: any, card: any) => {
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

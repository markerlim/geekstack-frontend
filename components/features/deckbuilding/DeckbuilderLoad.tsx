import { motion, AnimatePresence } from "framer-motion";
import styles from "../../../styles/DeckbuilderLoad.module.css";
import { useDeck } from "../../../contexts/DeckContext";
import { Share, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Deck, DeckRecord, LightDeck } from "../../../model/deck.model";
import {
  deleteDeck,
  loadOneDeck,
} from "../../../services/functions/gsDeckbuildingFunctions";
import { useUserStore } from "../../../services/store/user.store";
import { TCGTYPE } from "../../../utils/constants";

interface DeckbuilderLoadProps {
  tcg: string;
  decks: DeckRecord[];
  onClose: () => void;
  onSelectedDeck: (deck: Deck) => void;
  isOpen: boolean;
}

const DeckbuilderLoad = ({
  tcg,
  decks,
  onClose,
  onSelectedDeck,
  isOpen,
}: DeckbuilderLoadProps) => {
  const { setCardlist } = useDeck();
  const { removeDeckFromCategory } = useUserStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDecks = useMemo(() => {
    return decks.filter((deck) => {
      const search = searchTerm.toLowerCase();

      const matchesDeckName = deck.deckname?.toLowerCase().includes(search);

      const matchesCardName = deck.listofcards?.some((card: any) =>
        card.cardName?.toLowerCase().includes(search)
      );

      return matchesDeckName || matchesCardName;
    });
  }, [decks, searchTerm]);

  const handleDeckSelect = async (deck: DeckRecord) => {
    const res = await loadOneDeck(tcg, deck.deckuid);
    onSelectedDeck(res);
    setCardlist(res.listofcards);
    onClose();
  };

  const handleDeleteDeck = async (e: React.MouseEvent, deckuid: string) => {
    e.stopPropagation();
    try {
      const response = await deleteDeck(tcg, deckuid);
      removeDeckFromCategory(tcg as TCGTYPE, deckuid);
      console.log("Deletion successful:", response);
      onClose();
    } catch (error) {
      console.error("Failed to delete deck:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.sliderWrapper}>
          {/* Overlay that only appears during animation */}
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Slider Panel */}
          <motion.div
            className={styles.sliderPanel}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              ease: [0.22, 1, 0.36, 1],
              duration: 0.3,
            }}
          >
            {/* Search Bar */}
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search decks or cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.deckContainer}>
              {filteredDecks.length > 0 ? (
                filteredDecks.map((deck) => (
                  <motion.div
                    key={deck.deckuid}
                    className={styles.deckItem}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleDeckSelect(deck)}
                  >
                    <img
                      src={deck.deckcover}
                      alt={deck.deckname}
                      onError={(e) => {
                        e.currentTarget.src = "/gsdeckimage.jpg";
                      }}
                    />
                    <div className={styles.deckInfo}>
                      <h3>{deck.deckname}</h3>
                      <div className={styles.deckInfoFunc}>
                        <Share />
                        <Trash2
                          className={styles.delete}
                          onClick={(e) => handleDeleteDeck(e, deck.deckuid)}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className={styles.noResults}>
                  No decks found matching "{searchTerm}"
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeckbuilderLoad;

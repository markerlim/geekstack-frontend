import { motion, AnimatePresence } from "framer-motion";
import styles from "../../styles/DeckbuilderLoad.module.css";
import { Deck } from "../../services/gsDeckbuildingFunctions";
import { useDeck } from "../../contexts/DeckContext";

interface DeckbuilderLoadProps {
  decks: Deck[];
  onClose: () => void;
  onSelectedDeck:(deck:Deck) => void;
  isOpen: boolean;
}

const DeckbuilderLoad = ({ decks, onClose,onSelectedDeck, isOpen }: DeckbuilderLoadProps) => {
  const { setCardlist } = useDeck();
  const handleDeckSelect = (deck) => {
    onSelectedDeck(deck);
    setCardlist(deck.listofcards);
    onClose;
  }

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
            <div className={styles.deckContainer}>
              {decks.map((deck) => (
                <motion.div
                  key={deck.deckuid}
                  className={styles.deckItem}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleDeckSelect(deck)}
                >
                  <img src={deck.deckcover} alt={deck.deckname} />
                  <div className={styles.deckInfo}>
                    <h3>{deck.deckname}</h3>
                    <p>{deck.listofcards?.length || 0} cards</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeckbuilderLoad;

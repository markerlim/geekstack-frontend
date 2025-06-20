import { useState } from "react";
import styles from "../../styles/DeckbuilderBar.module.css";
import { ChevronDown, ChevronUp, Menu } from "lucide-react";
import DeckbuilderMenu from "./DeckbuilderMenu";
import DeckbuilderCover from "./DeckbuilderCoverSel";
import { Deck, loadDeck } from "../../services/gsDeckbuildingFunctions";
import DeckbuilderLoad from "./DeckbuilderLoad";

interface DeckbuilderBarProps {
  tcg: string;
  userId: string;
}

const DeckbuilderBar = ({ tcg, userId }: DeckbuilderBarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCoverSelOpen, setCoverSelOpen] = useState(false);
  const [isDeckcoverLoad, setDeckcoverLoad] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedCover, setSelectedCover] = useState("/gsdeckimage.jpg");
  const [selectedDeck,setSelectedDeck] = useState<Deck>();
  const [listofdecks, setListofdecks] = useState<Deck[]>([]);

  const handleCoverSelect = (coverUrl: string) => {
    setSelectedCover(coverUrl);
    setCoverSelOpen(false);
  };

  const handleLoad = async () => {
    try {
      setDeckcoverLoad(true);
      setLoader(true);
      const decks = await loadDeck(userId, tcg);
      setListofdecks(decks);
      setLoader(false);
    } catch (error) {
      console.error("Failed to load decks:", error);
    }
  };

  const handleSelectedDeck = (deck: Deck) => {
    setSelectedCover(deck.deckcover)
    setSelectedDeck(deck)
  }
  return (
    <div
      className={`${styles["db-main"]} ${isCollapsed ? styles.collapsed : ""}`}
    >
      <div className={styles.content}>
        <div className={styles.deckInfo}>
          <img
            onClick={() => setCoverSelOpen(true)}
            className={`${styles.deckcover} ${
              isCollapsed ? styles["item-collapsed"] : ""
            }`}
            src={selectedCover}
            alt="default deckcover"
          />
          <img
            onClick={() => setCoverSelOpen(true)}
            className={`${styles.geekstacklogo} ${
              isCollapsed ? "" : styles["item-collapsed"]
            }`}
            src="/icons/geekstackicon.svg"
            alt="default deckcover"
          />{" "}
          <div className={styles.decknameinput}>
            <input
              title="input deckname"
              type="text"
              placeholder="DeckName"
              value={selectedDeck?.deckname || "DeckName"}
              className={styles.codeStyle}
            />
          </div>
        </div>
        <div>
          <Menu onClick={() => setIsMenuOpen(true)} />
        </div>
        {isMenuOpen && (
          <DeckbuilderMenu
            tcg={tcg}
            onClose={() => setIsMenuOpen(false)}
            onLoad={handleLoad}
          />
        )}
      </div>
      <button
        className={styles.toggleButton}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Expand" : "Collapse"}
      >
        {isCollapsed ? <ChevronDown /> : <ChevronUp />}
      </button>
      {isCoverSelOpen && (
        <DeckbuilderCover
          onCoverSelect={handleCoverSelect}
          onClose={() => setCoverSelOpen(false)}
        />
      )}
      <DeckbuilderLoad
        decks={listofdecks}
        isOpen={isDeckcoverLoad}
        onSelectedDeck = {handleSelectedDeck}
        onClose={() => setDeckcoverLoad(false)}
      />
    </div>
  );
};

export default DeckbuilderBar;

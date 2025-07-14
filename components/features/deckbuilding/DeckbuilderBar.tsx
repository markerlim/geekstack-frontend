import { useState } from "react";
import styles from "../../../styles/DeckbuilderBar.module.css";
import { BrushCleaning, ChevronDown, ChevronUp, Menu } from "lucide-react";
import DeckbuilderMenu from "./DeckbuilderMenu";
import DeckbuilderCover from "./DeckbuilderCoverSel";
import { loadDeck } from "../../../services/functions/gsDeckbuildingFunctions";
import DeckbuilderLoad from "./DeckbuilderLoad";
import { useDeck } from "../../../contexts/DeckContext";
import { Deck } from "../../../model/deck.model";
import { useDevice } from "../../../contexts/DeviceContext";
import DeckbuilderStats from "./DeckbuilderStats";

interface DeckbuilderBarProps {
  tcg: string;
  userId: string;
  onCollapseChange?: (isCollapsed: boolean) => void; // Add this prop
}

const DeckbuilderBar = ({
  tcg,
  userId,
  onCollapseChange,
}: DeckbuilderBarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCoverSelOpen, setIsCoverSelOpen] = useState(false);
  const [isDeckcoverLoad, setIsDeckcoverLoad] = useState(false);
  const device = useDevice();
  const isDesktop = device === "desktop";
  const [loader, setLoader] = useState(false);

  const [listofdecks, setListofdecks] = useState<Deck[]>([]);
  const { clearList, selectedDeck, setSelectedDeck, updateDeckName } =
    useDeck();

  const handleCoverSelect = (coverUrl: string) => {
    selectedDeck.deckcover = coverUrl;
    setIsCoverSelOpen(false);
  };

  const handleDeckLoaderClose = () => {
    setIsDeckcoverLoad(false);
  };

  const handleLoad = async () => {
    try {
      setIsDeckcoverLoad(true);
      setLoader(true);
      const decks = await loadDeck(tcg);
      setListofdecks(decks);
      setLoader(false);
    } catch (error) {
      console.error("Failed to load decks:", error);
    }
  };

  const handleDeckNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    updateDeckName(e.target.value);
  };

  const handleSelectedDeck = (deck: Deck) => {
    setSelectedDeck(deck);
  };

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapseChange?.(newState); // Call the callback if provided
  };
  return (
    <div
      className={`${styles["db-main"]} ${isCollapsed ? styles.collapsed : ""}`}
    >
      <div className={styles.content}>
        <div className={styles.holderTop}>
          <div className={styles.deckInfo}>
            <img
              onClick={() => setIsCoverSelOpen(true)}
              className={`${styles.deckcover} ${
                isCollapsed ? styles["item-collapsed"] : ""
              }`}
              src={selectedDeck.deckcover || "/gsdeckimage.jpg"}
              alt="default deckcover"
            />
            <img
              onClick={() => setIsCoverSelOpen(true)}
              className={`${styles.geekstacklogo} ${
                isCollapsed ? "" : styles["item-collapsed"]
              }`}
              src="/icons/geekstackicon.svg"
              alt="default deckcover"
            />{" "}
            <div
              className={`${styles.decknameinput} ${
                isDesktop
                  ? styles["decknameinput-desktop"]
                  : styles["decknameinput-mobile"]
              }`}
            >
              <input
                title="input deckname"
                type="text"
                placeholder="DeckName"
                value={selectedDeck?.deckname}
                onChange={handleDeckNameChange}
                className={styles.codeStyle}
              />
            </div>
          </div>
          <div className={styles.barUtils}>
            <BrushCleaning onClick={clearList} />
            <Menu onClick={() => setIsMenuOpen(true)} />
          </div>
          {isMenuOpen && (
            <DeckbuilderMenu
              tcg={tcg}
              userId={userId}
              selectedDeck={selectedDeck}
              onClose={() => setIsMenuOpen(false)}
              onLoad={handleLoad}
            />
          )}
        </div>
        <div
          className={`${styles["stats"]} ${
            isCollapsed ? styles.hidestats : styles.showstats
          }`}
        >
          <DeckbuilderStats tcg={tcg} />
        </div>
      </div>
      <button
        className={styles.toggleButton}
        onClick={toggleCollapse}
        aria-label={isCollapsed ? "Expand" : "Collapse"}
      >
        {isCollapsed ? (
          <ChevronDown width={30} height={30} />
        ) : (
          <ChevronUp width={30} height={30} />
        )}
      </button>
      {isCoverSelOpen && (
        <DeckbuilderCover
          onCoverSelect={handleCoverSelect}
          onClose={() => setIsCoverSelOpen(false)}
          tcg={tcg}
        />
      )}
      <DeckbuilderLoad
        tcg={tcg}
        decks={listofdecks}
        isOpen={isDeckcoverLoad}
        onSelectedDeck={handleSelectedDeck}
        onClose={handleDeckLoaderClose}
      />
      <code className={styles.test}>[{tcg}]</code>
    </div>
  );
};

export default DeckbuilderBar;

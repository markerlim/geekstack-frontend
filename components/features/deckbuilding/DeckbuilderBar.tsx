import { useEffect, useState } from "react";
import styles from "../../../styles/DeckbuilderBar.module.css";
import { BrushCleaning, ChevronDown, ChevronUp, Menu } from "lucide-react";
import DeckbuilderMenu from "./DeckbuilderMenu";
import DeckbuilderCover from "./DeckbuilderCoverSel";
import DeckbuilderLoad from "./DeckbuilderLoad";
import { useDeck } from "../../../contexts/DeckContext";
import { Deck, LightDeck } from "../../../model/deck.model";
import { useDevice } from "../../../contexts/DeviceContext";
import DeckbuilderStats from "./DeckbuilderStats";
import { DEFAULT_DECKCOVER } from "../../../utils/constants";
import { loadDeck } from "../../../services/functions/gsDeckbuildingFunctions";
import { useUserStore } from "../../../services/store/user.store";

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
  const [listofdecks, setListofdecks] = useState<LightDeck[]>([]);
  const device = useDevice();
  const isDesktop = device === "desktop";
  const { clearList, selectedDeck, setSelectedDeck, updateDeckName } =
    useDeck();
  const {getDecksByCategory} = useUserStore()

  const loadDecks = async () => {
    try {
      //const decks: LightDeck[] = await loadDeck(tcg);
      const decks = getDecksByCategory(tcg);
      setListofdecks(decks);
      console.log(decks);
    } catch (error) {
      console.error("Failed to load decks:", error);
      setListofdecks([]); // Set empty array on error
    }
  };

  const handleCoverSelect = (coverUrl: string) => {
    selectedDeck.deckcover = coverUrl;
    setIsCoverSelOpen(false);
  };

  useEffect(() => {
    handleCoverSelect(DEFAULT_DECKCOVER);
  }, [tcg]);

  const handleDeckLoaderClose = () => {
    setIsDeckcoverLoad(false);
  };

  const handleLoad = () => {
    setIsDeckcoverLoad(true);
    loadDecks();
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
  
  useEffect(() => {
    console.log("Selected deck updated:", selectedDeck);
  }, [selectedDeck]);

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
              src={selectedDeck.deckcover || DEFAULT_DECKCOVER}
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
    </div>
  );
};

export default DeckbuilderBar;

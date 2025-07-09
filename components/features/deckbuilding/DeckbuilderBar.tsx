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
  const [isCoverSelOpen, setCoverSelOpen] = useState(false);
  const [isDeckcoverLoad, setDeckcoverLoad] = useState(false);
  const device = useDevice();
  const isDesktop = device === "desktop";
  const [loader, setLoader] = useState(false);
  const [selectedCover, setSelectedCover] = useState("/gsdeckimage.jpg");
  const [selectedDeck, setSelectedDeck] = useState<Deck>({
    deckuid: "",
    deckname: "DeckName",
    deckcover: "/gsdeckimage.jpg",
    listofcards: [],
  });
  const [listofdecks, setListofdecks] = useState<Deck[]>([]);
  const { clearList } = useDeck();

  const handleCoverSelect = (coverUrl: string) => {
    setSelectedCover(coverUrl);
    selectedDeck.deckcover = coverUrl;
    setCoverSelOpen(false);
  };

  const handleLoad = async () => {
    try {
      setDeckcoverLoad(true);
      setLoader(true);
      const decks = await loadDeck(tcg);
      setListofdecks(decks);
      setLoader(false);
    } catch (error) {
      console.error("Failed to load decks:", error);
    }
  };

  const handleDeckNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDeck((prev) => ({
      ...prev,
      deckname: e.target.value,
    }));
  };

  const handleSelectedDeck = (deck: Deck) => {
    setSelectedCover(deck.deckcover);
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
          onClose={() => setCoverSelOpen(false)}
          tcg={tcg}
        />
      )}
      <DeckbuilderLoad
        decks={listofdecks}
        isOpen={isDeckcoverLoad}
        onSelectedDeck={handleSelectedDeck}
        onClose={() => setDeckcoverLoad(false)}
      />
      <code className={styles.test}>[{tcg}]</code>
    </div>
  );
};

export default DeckbuilderBar;

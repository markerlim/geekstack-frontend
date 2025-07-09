import { useEffect, useRef } from "react";
import styles from "../../../styles/DeckbuilderMenu.module.css";
import {
  exportDeck,
  saveDeck,
} from "../../../services/functions/gsDeckbuildingFunctions";
import { ArrowRightFromLine, PackageOpen, Save } from "lucide-react";
import { useDeck } from "../../../contexts/DeckContext";
import { Deck } from "../../../model/deck.model";

interface DeckbuilderMenuProps {
  tcg: string;
  userId: string;
  selectedDeck: Deck;
  onClose: () => void;
  onLoad: () => void;
}

const DeckbuilderMenu = ({
  tcg,
  userId,
  selectedDeck,
  onClose,
  onLoad,
}: DeckbuilderMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { cardlist } = useDeck();

  const onSave = () => {
    // Calculate the total count of cards
    const totalCount = cardlist.reduce(
      (sum, card) => sum + (card.count || 0),
      0
    );

    if (totalCount !== 50) {
      // If count is not 50, show confirmation dialog
      const shouldSave = window.confirm(
        `Your deck has ${totalCount} cards (recommended is 50). Do you want to save anyway?`
      );

      if (!shouldSave) {
        return; // Don't proceed with saving if user cancels
      }
    }
    selectedDeck.listofcards = cardlist
    // Proceed with saving
    saveDeck(selectedDeck, tcg);
    onClose();
  };

  const handleLoad = () => {
    onLoad();
    onClose();
  };
  const onExport = () => {
    exportDeck();
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={menuRef} className={styles.menu}>
      <button className={styles.menuItem} onClick={onSave}>
        <Save /> Save
      </button>
      <button className={styles.menuItem} onClick={() => handleLoad()}>
        <PackageOpen /> Load
      </button>
      <button className={styles.menuItem} onClick={onExport}>
        <ArrowRightFromLine /> Export
      </button>
    </div>
  );
};

export default DeckbuilderMenu;

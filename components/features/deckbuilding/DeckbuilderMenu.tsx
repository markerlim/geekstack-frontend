import { useEffect, useRef } from "react";
import styles from "../../../styles/DeckbuilderMenu.module.css";
import {
  exportDeck,
  saveDeck,
} from "../../../services/functions/gsDeckbuildingFunctions";
import { ArrowRightFromLine, PackageOpen, Save } from "lucide-react";
import { useDeck } from "../../../contexts/DeckContext";
import { Deck } from "../../../model/deck.model";
import { useToast } from "../../../contexts/ToastManager";
import { useUserStore } from "../../../services/store/user.store";
import { TCGTYPE } from "../../../utils/constants";

interface DeckbuilderMenuProps {
  tcg: string;
  selectedDeck: Deck;
  onClose: () => void;
  onLoad: () => void;
}

const DeckbuilderMenu = ({
  tcg,
  selectedDeck,
  onClose,
  onLoad,
}: DeckbuilderMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { cardlist, clearListBypass } = useDeck();
  const {addDeckToCategory} = useUserStore();
  const { showToast } = useToast();

  const onSave = () => {
    const totalCount = cardlist.reduce(
      (sum, card) => sum + (card.count || 0),
      0
    );

    if (totalCount !== 50) {
      const shouldSave = window.confirm(
        `Your deck has ${totalCount} cards (recommended is 50). Do you want to save anyway?`
      );

      if (!shouldSave) {
        return;
      }
    }
    selectedDeck.listofcards = cardlist;
    saveDeck(selectedDeck, tcg)
      .then((res) => {
        if (res?.status) {
          showToast("✅ Deck saved successfully!", "success");
          console.log()
          if(!selectedDeck.deckuid){
            selectedDeck.deckuid = res.data.deckuid;
            addDeckToCategory(tcg as TCGTYPE,selectedDeck)
          }
          clearListBypass()
          onClose();
        } else {
          showToast("⚠️ Failed to save deck. Please try again.", "error");
        }
      })
      .catch(() => {
        showToast(
          "❌ An error occurred while saving. Please try again.",
          "error"
        );
      });
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

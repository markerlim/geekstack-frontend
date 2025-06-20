import { useEffect, useRef } from "react";
import styles from "../../styles/DeckbuilderMenu.module.css";
import {
  exportDeck,
  loadDeck,
  saveDeck,
} from "../../services/gsDeckbuildingFunctions";
import { ArrowRightFromLine, PackageOpen, Save } from "lucide-react";
import { useDeck } from "../../contexts/DeckContext";

interface DeckbuilderMenuProps {
  tcg: string;
  onClose: () => void;
  onLoad: () => void;
}

const DeckbuilderMenu = ({ tcg,onClose, onLoad}: DeckbuilderMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const {deckCards} = useDeck();

  const onSave = () => {
    //saveDeck(deckCards, "{userId}", tcg);
    onClose()
  };

  const handleLoad = () => {
    onLoad()
    onClose()
  };
  const onExport = () => {
    exportDeck();
    onClose()
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
        <Save/> Save
      </button>
      <button className={styles.menuItem} onClick={()=>handleLoad()}>
        <PackageOpen /> Load
      </button>
      <button className={styles.menuItem} onClick={onExport}>
        <ArrowRightFromLine /> Export
      </button>
    </div>
  );
};

export default DeckbuilderMenu;

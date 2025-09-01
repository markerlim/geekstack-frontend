import { Bold, Italic, Plus, Underline } from "lucide-react";
import styles from "../../../styles/PostingStackFunctions.module.css";
import { DeckRecord } from "../../../model/deck.model";

interface PostingStackFunctionProps {
  toggleDeckSelector: () => void;
  selectedDeck: DeckRecord | null;
  handleFormat: (input: string) => void;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
}

const PostingStackFunction = ({
  toggleDeckSelector,
  selectedDeck,
  handleFormat,
  isBold,
  isItalic,
  isUnderline,
}: PostingStackFunctionProps) => {
  return (
    <div className={styles["function-bar"]}>
      <button
        className={styles["attach-deck-btn"]}
        onClick={toggleDeckSelector}
        title="Attach a deck"
      >
        <Plus size={20} />
        <span>{selectedDeck ? "Change Deck" : "Attach Deck"}</span>
      </button>
      <div className={styles["formatting-toolbar"]}>
        <button
          type="button"
          title="Bold"
          className={`${styles["format-btn"]} ${
            isBold ? styles["active"] : ""
          }`}
          onClick={() => handleFormat("bold")}
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          title="Italic"
          className={`${styles["format-btn"]} ${
            isItalic ? styles["active"] : ""
          }`}
          onClick={() => handleFormat("italic")}
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          title="Underline"
          className={`${styles["format-btn"]} ${
            isUnderline ? styles["active"] : ""
          }`}
          onClick={() => handleFormat("underline")}
        >
          <Underline size={16} />
        </button>
      </div>
    </div>
  );
};

export default PostingStackFunction;

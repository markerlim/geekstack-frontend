import { Bold, Italic, Plus, Underline, ImageIcon } from "lucide-react";
import styles from "../../../styles/PostingStackFunctions.module.css";
import { DeckRecord } from "../../../model/deck.model";
import { useRef } from "react";

interface PostingStackFunctionProps {
  toggleDeckSelector: () => void;
  selectedDeck: DeckRecord | null;
  handleFormat: (input: string) => void;
  handleImageUpload: (file: File) => void; // Add this prop
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
}

const PostingStackFunction = ({
  toggleDeckSelector,
  selectedDeck,
  handleFormat,
  handleImageUpload, // Receive the handler
  isBold,
  isItalic,
  isUnderline,
}: PostingStackFunctionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
      // Reset the input to allow selecting the same file again
      event.target.value = '';
    }
  };

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
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      {/* Image upload button */}
      <button
        className={styles["attach-deck-btn"]}
        onClick={handleImageClick}
        title="Upload image"
        type="button"
      >
        <ImageIcon size={20} /> {/* Better icon for image upload */}
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
import {
  Bold,
  Italic,
  Plus,
  Underline,
  ImageIcon,
  Link2,
  Quote,
  List,
  ListOrdered,
} from "lucide-react";
import styles from "../../../styles/PostingStackFunctions.module.css";
import { DeckRecord } from "../../../model/deck.model";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface PostingStackFunctionProps {
  toggleDeckSelector: () => void;
  selectedDeck: DeckRecord | null;
  handleFormat: (input: string) => void;
  handleEditorImageUpload: () => void;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
}

const PostingStackFunction = ({
  toggleDeckSelector,
  selectedDeck,
  handleFormat,
  handleEditorImageUpload,
  isBold,
  isItalic,
  isUnderline,
}: PostingStackFunctionProps) => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  const toggleSlider = () => {
    setIsSliderOpen(!isSliderOpen);
  };
  return (
    <>
      <div className={styles["function-bar"]}>
        <button
          className={styles["attach-deck-btn"]}
          onClick={toggleDeckSelector}
          title="Attach a deck"
        >
          <Plus size={20} />
          <span>{selectedDeck ? "Change Deck" : "Attach Deck"}</span>
        </button>
        <button
          className={styles["attach-deck-btn"]}
          title="Open edit function"
          onClick={toggleSlider}
          type="button"
        >
          <Plus size={20} />
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
      <AnimatePresence>
        {isSliderOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "#000",
                zIndex: 1002,
              }}
              onClick={toggleSlider}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "tween",
                duration: 0.3,
              }}
              className={styles["functions-menu"]}
            >
              <div className={styles["function-menu-header"]}>Insert</div>
              <button
                className={styles["function-btn"]}
                onClick={handleEditorImageUpload}
                title="Upload image"
                type="button"
              >
                <ImageIcon size={24} /> Add an image
              </button>
              <button
                className={styles["function-btn"]}
                title="Upload image"
                type="button"
              >
                <Link2 size={24} /> Add a link
              </button>
              <button
                className={styles["function-btn"]}
                title="Upload image"
                type="button"
              >
                <Quote size={24} /> Quotation
              </button>
              <button
                className={styles["function-btn"]}
                title="Upload image"
                type="button"
              >
                <List size={24} /> Bullet List
              </button>
              <button
                className={styles["function-btn"]}
                title="Upload image"
                type="button"
              >
                <ListOrdered size={24} /> Ordered List
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PostingStackFunction;

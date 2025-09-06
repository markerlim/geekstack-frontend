import styles from "../../../styles/PostingStack.module.css";
import { ChevronLeft, ChevronRight, ImagePlus, X } from "lucide-react";
import { useUserStore } from "../../../services/store/user.store";
import { useState, useRef, useEffect } from "react";
import { TCGTYPE } from "../../../utils/constants";
import { DeckRecord } from "../../../model/deck.model";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  updateImage,
  userMakePost,
} from "../../../services/functions/gsUserPostService";
import { DeckPost, MongoDBDeckPost } from "../../../model/deckpost.model";
import { detailStackEvent } from "../../../services/eventBus/detailStackEvent";
import { formatFirstLetterCap } from "../../../utils/FormatText";
import { motion, AnimatePresence } from "framer-motion";
import PostingStackFunction from "./PostingStackFunctions";

interface PostingStackProps {
  onClose: () => void;
}

const PostingStack = ({ onClose }: PostingStackProps) => {
  const [deckType, setDeckType] = useState(TCGTYPE.UNIONARENA);
  const [selectedDeck, setSelectedDeck] = useState<DeckRecord | null>(null);
  const [selectedPostCover, setSelectedPostCover] = useState<string>("");
  const [showDeckSelector, setShowDeckSelector] = useState(false);
  const { sqlUser, getDecksByCategory } = useUserStore();
  const listofdecks = getDecksByCategory(deckType);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<any>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [formData, setFormData] = useState({
    headline: "",
    content: "",
  });
  const [errors, setErrors] = useState({
    headline: "",
    content: "",
  });

  // Validating of form
  const validateField = (name: string, value: string) => {
    if (name === "headline") {
      if (value.length > 50) return "Maximum 50 characters";
      if (value.length < 5) return "Minimum 5 characters";
    }
    if (name === "content") {
      const textContent = value.replace(/<[^>]*>/g, "");
      if (textContent.length < 20) return "Minimum 20 characters";
    }
    return "";
  };

  //Adjusting headline size
  const handleHeadlineChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;

    el.style.height = "auto"; // reset to measure scrollHeight
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    const maxHeight = lineHeight * 6; // max 6 lines

    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";

    const { name, value } = e.target;
    const error = validateField(name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  //Image click for Post Cover
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  //Handle the image after file is selected, no way to change after selecting
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
      event.target.value = "";
    }
  };

  // Handle click on editor image button
  const handleEditorImageClick = () => {
    editorImageInputRef.current?.click();
  };

  // Handle file selection for editor images
  const handleEditorFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        // Upload the image
        const result = await updateImage("editor-image", files[0]);

        // Insert the image into the editor at cursor position
        insertImageIntoEditor(result.fileUrl);

        console.log("Editor image uploaded successfully:", result);
      } catch (error) {
        console.error("Editor image upload failed:", error);
      } finally {
        // Reset the file input
        event.target.value = "";
      }
    }
  };

  // Function to insert image at cursor position
  const insertImageIntoEditor = (imageUrl: string) => {
    if (!editorRef.current) return;

    // Focus the editor first
    editorRef.current.focus();

    // Create image element
    const img = document.createElement("img");
    img.src = imageUrl;
    img.style.maxWidth = "100%";
    img.style.height = "auto";

    // Insert at current cursor position
    document.execCommand("insertHTML", false, img.outerHTML);

    // Update the editor content
    handleEditorChange();
  };

  // Handle formatting commands
  const handleFormat = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    // Update button states
    if (command === "bold") setIsBold(document.queryCommandState("bold"));
    if (command === "italic") setIsItalic(document.queryCommandState("italic"));
    if (command === "underline")
      setIsUnderline(document.queryCommandState("underline"));

    // Focus back on the editor
    editorRef.current?.focus();
    handleEditorChange();
  };

  // Handle content change
  const handleEditorChange = () => {
    if (editorRef.current) {
      let content = editorRef.current.innerHTML;

      content = content.replace(/<div>/g, "<p>").replace(/<\/div>/g, "</p>");

      setEditorContent(content);
      setFormData((prev) => ({ ...prev, content }));

      const textContent = editorRef.current.textContent || "";
      const error = validateField("content", textContent);
      setErrors((prev) => ({ ...prev, content: error }));
    }
  };

  // Auto-resize the editor
  const autoResizeEditor = () => {
    const editor = editorRef.current;
    if (editor) {
      editor.style.height = "auto";
      editor.style.height = `${editor.scrollHeight}px`;
    }
  };

  // Handle paste event to clean up formatting if needed
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const handlePosting = (deck: DeckRecord | null) => {
    // Allow posting without a deck if user chooses to
    if (!deck) {
      const postObject: DeckPost = {
        postType: "GENERAL",
        userId: sqlUser?.userId || "",
        deckName: "",
        isTournamentDeck: false,
        selectedCover: selectedPostCover || "",
        listofcards: [],
        name: sqlUser?.name || "Anonymous",
        displaypic: sqlUser?.displaypic || "/images/default-avatar.png",
      };

      // Optional fields if needed
      if (formData.headline) postObject.headline = formData.headline;
      if (formData.content) postObject.content = formData.content;

      userMakePost(postObject)
        .then(() => {
          console.log("Post created successfully without deck:", postObject);
          detailStackEvent.emit("post:created");
          setTimeout(() => onClose(), 2000);
        })
        .catch((error) => {
          console.error("Error posting:", error);
        });
      return;
    }

    const postObject: MongoDBDeckPost = {
      postType: deckType,
      userId: sqlUser?.userId || "",
      deckName: deck.deckname || "Untitled Deck",
      isTournamentDeck: false,
      selectedCover: selectedPostCover,
      listofcards: deck.listofcards.map((card) => ({
        _id: card._id,
        imageSrc: card.imageSrc,
        cardName: card.cardName,
        count: card.count,
      })),
      name: sqlUser?.name || "Anonymous",
      displaypic: sqlUser?.displaypic || "/images/default-avatar.png",
    };

    // Optional fields if needed
    if (formData.headline) postObject.headline = formData.headline;
    if (formData.content) postObject.content = formData.content;

    userMakePost(postObject)
      .then(() => {
        console.log("Deck posted successfully:", postObject);
        onClose();
      })
      .catch((error) => {
        console.error("Error posting deck:", error);
      });
  };

  const handlePostCover = (coverurl: string) => {
    setSelectedPostCover(coverurl);
  };

  const toggleDeckSelector = () => {
    setShowDeckSelector(!showDeckSelector);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const result = await updateImage("test", file);
      setSelectedPostCover(result.fileUrl);
      console.log("Image uploaded successfully:", result);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const removeDeck = (e: any) => {
    e.stopPropagation();
    if (window.confirm("Do you want to remove the cover?")) {
      setSelectedDeck(null);
      setSelectedPostCover("");
    }
  };

  const handleDeckSelect = (deck: DeckRecord) => {
    setSelectedDeck(deck);
  };

  const canPost =
    !errors.headline &&
    !errors.content &&
    formData.headline.trim().length > 0 &&
    editorContent.replace(/<[^>]*>/g, "").trim().length > 0;

  const updateFormattingState = () => {
    setIsBold(document.queryCommandState("bold"));
    setIsItalic(document.queryCommandState("italic"));
    setIsUnderline(document.queryCommandState("underline"));
  };

  useEffect(() => {
    if (
      swiperRef.current &&
      prevRef.current &&
      nextRef.current &&
      typeof swiperRef.current.params.navigation !== "boolean"
    ) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.destroy();
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, [listofdecks]);

  return (
    <div className={styles["posting-main"]}>
      <button
        title="close-tb"
        onClick={onClose}
        className={styles["close-btn"]}
      >
        <X size={24} />
      </button>
      <button
        title="posting"
        onClick={() => handlePosting(selectedDeck)}
        className={styles["post-btn"]}
        disabled={!canPost}
      >
        <code>Post</code>
      </button>
      <div className={styles["posting-header"]}></div>
      <div
        className={styles["posting-space"]}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (!target.closest("#headline") && !target.closest("#prevent")) {
            editorRef.current?.focus();
          }
        }}
      >
        <AnimatePresence>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: !selectedPostCover ? "50px" : 0 }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5 }}
          >
            {!selectedPostCover && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <div className={styles["image-btn"]} onClick={handleImageClick}>
                  <ImagePlus />
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          <motion.div
            id="prevent"
            initial={{ height: 0 }}
            animate={{ height: selectedPostCover ? "260px" : 0 }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5 }}
            onClick={toggleDeckSelector}
          >
            {selectedPostCover && (
              <div className={styles["selected-deck-header"]}>
                <div className={styles["deck-cover-preview"]}>
                  <img
                    src={selectedPostCover}
                    alt="Deck cover preview"
                    className={styles["deck-cover-image"]}
                    onError={(e) => {
                      e.currentTarget.src = "/gsdeckimage.jpg";
                    }}
                  />

                  <div className={styles["deck-cover-func"]}>
                    {selectedDeck && (
                      <span className={styles["deck-cover-deckname"]}>
                        {selectedDeck.deckname}
                      </span>
                    )}
                    <button
                      onClick={(e) => removeDeck(e)}
                      className={styles["remove-deck-btn"]}
                      title="Remove deck"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <input
          type="file"
          ref={editorImageInputRef}
          onChange={handleEditorFileChange}
          accept="image/*"
          style={{ display: "none" }}
        />
        <form className={styles["post-form"]}>
          <div className={styles["form-group"]} id="prevent">
            <textarea
              id="headline"
              name="headline"
              className={styles["form-textarea"]}
              placeholder="Article Title"
              rows={1}
              ref={headlineRef}
              onChange={handleHeadlineChange}
            />
          </div>

          <div className={styles["form-group"]}>
            <div
              ref={editorRef}
              className={`${styles["rich-text-editor"]} ${
                !editorContent && !isEditorFocused
                  ? styles["placeholderVisible"]
                  : ""
              }`}
              contentEditable="true"
              data-placeholder="What have you been cooking?"
              onInput={handleEditorChange}
              onPaste={handlePaste}
              onFocus={() => setIsEditorFocused(true)}
              onBlur={() => {
                setIsEditorFocused(false);
                if (
                  editorRef.current &&
                  (editorRef.current.innerHTML.trim() === "<br>" ||
                    editorRef.current.innerHTML.trim() === "<p><br></p>" ||
                    editorRef.current.innerHTML.trim() === "")
                ) {
                  editorRef.current.innerHTML = "";
                  setEditorContent("");
                }
              }}
              onKeyUp={() => {
                handleEditorChange();
                autoResizeEditor();
                updateFormattingState();
              }}
            />
          </div>
        </form>
      </div>
      <PostingStackFunction
        toggleDeckSelector={toggleDeckSelector}
        selectedDeck={selectedDeck}
        handleFormat={handleFormat}
        handleEditorImageUpload={handleEditorImageClick}
        isBold={isBold}
        isItalic={isItalic}
        isUnderline={isUnderline}
      />
      <AnimatePresence>
        {showDeckSelector && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={styles.overlay}
              onClick={() => {
                setShowDeckSelector(false);
              }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 40,
              }}
            />{" "}
            <motion.div
              initial={{ opacity: 1, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 1, y: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
                duration: 0.5,
              }}
              className={styles["deck-selector-container"]}
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 50,
              }}
            >
              <div className={styles["deck-type-selector"]}>
                {Object.values(TCGTYPE).map((type) => (
                  <button
                    key={type}
                    title="setting deck type"
                    className={`${styles["type-btn"]} ${
                      deckType === type ? styles["active"] : ""
                    }`}
                    onClick={() => setDeckType(type)}
                  >
                    {formatFirstLetterCap(type)}
                  </button>
                ))}
              </div>
              <div className={styles["swiper-wrapper"]}>
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={15}
                  slidesPerView={"auto"}
                  onSwiper={(swiper: any) => (swiperRef.current = swiper)}
                  className={styles["swiper-container"]}
                  slidesOffsetBefore={30}
                  slidesOffsetAfter={30}
                >
                  {listofdecks.map((deck) => (
                    <SwiperSlide key={deck.deckuid} style={{ width: "120px" }}>
                      <div
                        key={deck.deckuid}
                        className={`${styles["deck-card"]} ${
                          selectedDeck?.deckuid === deck.deckuid
                            ? styles["selected"]
                            : ""
                        }`}
                        onClick={() => handleDeckSelect(deck)}
                      >
                        <img
                          src={deck.deckcover}
                          alt={deck.deckname}
                          className={styles["deck-image"]}
                          onError={(e) => {
                            e.currentTarget.src = "/gsdeckimage.jpg";
                          }}
                        />
                        <div className={styles["deck-name"]}>
                          <code>{deck.deckname}</code>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <button
                  ref={prevRef}
                  type="button"
                  title="prev"
                  className={styles["custom-prev"]}
                  aria-label="Previous slide"
                >
                  <ChevronLeft width={"30px"} height={"30px"} />
                </button>
                <button
                  ref={nextRef}
                  type="button"
                  title="next"
                  className={styles["custom-next"]}
                  aria-label="Next slide"
                >
                  <ChevronRight width={"30px"} height={"30px"} />
                </button>
              </div>
              {selectedDeck && (
                <>
                  <div className={styles["cover-headline"]}>
                    Select a cover for your post!
                  </div>
                  <div className={styles["image-select-cont"]}>
                    {selectedDeck.listofcards.map((card) => (
                      <img
                        key={card._id}
                        className={
                          styles["image-selection"] +
                          (selectedPostCover === card.imageSrc
                            ? " " + styles["selected"]
                            : "")
                        }
                        src={card.imageSrc}
                        alt={card.cardName}
                        onClick={() => handlePostCover(card.imageSrc)}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostingStack;

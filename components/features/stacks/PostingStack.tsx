import styles from "../../../styles/PostingStack.module.css";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useUserStore } from "../../../services/store/user.store";
import { useState, useRef, useEffect } from "react";
import { TCGTYPE } from "../../../utils/constants";
import { Deck } from "../../../model/deck.model";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { userMakePost } from "../../../services/functions/gsUserPostService";
import { DeckPost } from "../../../model/deckpost.model";

interface PostingStackProps {
  onClose: () => void;
}

const deckFieldMap: Record<string, string> = {
  [TCGTYPE.UNIONARENA]: "uadecks",
  [TCGTYPE.ONEPIECE]: "opdecks",
  [TCGTYPE.COOKIERUN]: "crbdecks",
  [TCGTYPE.DUELMASTERS]: "dmdecks",
  [TCGTYPE.DRAGONBALLZFW]: "dbzfwdecks",
  [TCGTYPE.GUNDAM]: "gcgdecks",
  [TCGTYPE.RIFTBOUND]: "riftdecks",
  [TCGTYPE.PKMNPOCKET]: "pkdecks",
  [TCGTYPE.HOLOLIVE]: "holodecks",
};

const PostingStack = ({ onClose }: PostingStackProps) => {
  const [deckType, setDeckType] = useState(TCGTYPE.UNIONARENA);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [selectedPostCover, setSelectedPostCover] = useState<string | null>(
    null
  );
  const { mongoUser, sqlUser } = useUserStore();
  const listofdecks: Deck[] = mongoUser?.[deckFieldMap[deckType]] || [];

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<any>(null);

  const [formData, setFormData] = useState({
    headline: "",
    content: "",
  });
  const [errors, setErrors] = useState({
    headline: "",
    content: "",
  });

  const validateField = (name: string, value: string) => {
    if (name === "headline") {
      if (value.length > 50) return "Maximum 50 characters";
      if (value.length < 5) return "Minimum 5 characters";
    }
    if (name === "content") {
      if (value.length > 500) return "Maximum 500 characters";
      if (value.length < 20) return "Minimum 20 characters";
    }
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    console.log(name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handlePosting = (deck: Deck) => {
    const postObject: DeckPost = {
      postType: deckType,
      userId: mongoUser?.userId || "", // Assuming uid is available
      deckName: deck.deckname || "Untitled Deck",
      isTournamentDeck: false, // Set this based on your logic
      selectedCards: [{ imageSrc: selectedPostCover }],
      listofcards: deck.listofcards.map((card) => ({
        _id: card._id,
        imageSrc: card.urlimage,
        cardName: card.cardName,
        count: card.count,
      })),
      listoflikes: [],
      listofcomments: [],
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

  const handlePostCover = (coverurl) => {
    setSelectedPostCover(coverurl);
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
      <div className={styles["posting-header"]}></div>
      <div className={styles["deck-type-selector"]}>
        {Object.values(TCGTYPE).map((type) => (
          <button
            title="setting deck type"
            className={`${styles["type-btn"]} ${
              deckType === type ? styles["active"] : ""
            }`}
            onClick={() => setDeckType(type)}
          >
            <code>{type}</code>
          </button>
        ))}
      </div>
      <div className={styles["swiper-wrapper"]}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={15}
          slidesPerView={"auto"}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className={styles["swiper-container"]}
          slidesOffsetBefore={30}
          slidesOffsetAfter={30}
        >
          {listofdecks.map((deck) => (
            <SwiperSlide key={deck.deckuid} style={{ width: "120px" }}>
              <div
                className={`${styles["deck-card"]} ${
                  selectedDeck?.deckuid === deck.deckuid
                    ? styles["selected"]
                    : ""
                }`}
                onClick={() => setSelectedDeck(deck)}
              >
                <img
                  src={deck.deckcover}
                  alt={deck.deckname}
                  className={styles["deck-image"]}
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
          <code className={styles["code-font"]}>
            Select a cover for your post!
          </code>

          <div className={styles["image-select-cont"]}>
            {selectedDeck.listofcards.map((card) => (
              <img
                key={card._id}
                className={
                  styles["image-selection"] +
                  (selectedPostCover === card.urlimage
                    ? " " + styles["selected"]
                    : "")
                }
                src={card.urlimage}
                alt={card.cardName}
                onClick={() => handlePostCover(card.urlimage)}
              />
            ))}
          </div>
        </>
      )}
      <form className={styles["post-form"]}>
        <div className={styles["form-group"]}>
          <label htmlFor="headline" className={styles["form-label"]}>
            Headline
          </label>
          <input
            id="headline"
            name="headline"
            type="text"
            className={styles["form-input"]}
            placeholder="Enter a catchy headline"
            onChange={handleChange}
          />
          {errors.headline && (
            <div className={styles["error-message"]}>{errors.headline}</div>
          )}
        </div>

        <div className={styles["form-group"]}>
          <textarea
            id="content"
            name="content"
            className={styles["form-textarea"]}
            placeholder="Write your post content here..."
            onChange={handleChange}
            rows={5}
          />
          {errors.content && (
            <div className={styles["error-message"]}>{errors.content}</div>
          )}
        </div>
      </form>
      <div className={styles["posting-footer"]}>
        <button
          title="posting"
          onClick={() => handlePosting(selectedDeck)}
          className={styles["post-btn"]}
          disabled={!selectedDeck}
        >
          <code>Post</code>
        </button>
      </div>
    </div>
  );
};

export default PostingStack;

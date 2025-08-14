import { useEffect, useState } from "react";
import { useUserStore } from "../../../services/store/user.store";
import { TCGTYPE } from "../../../utils/constants";
import styles from "../../../styles/AllDecks.module.css";
import { useRouter } from "next/router";

const AllDecks = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TCGTYPE | "ALL">(
    "ALL"
  );
  const deckCategories = Object.values(TCGTYPE);
  const { getDecksByCategory } = useUserStore();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading decks...</div>;
  }
  // Get filtered decks for display
  const getDisplayDecks = () => {
    const decks =
      selectedCategory === "ALL"
        ? deckCategories.flatMap((category) => getDecksByCategory(category))
        : getDecksByCategory(selectedCategory);

    return decks
      .filter((deck) => deck && deck.deckname)
      .filter((deck) => deck.deckname.toLowerCase().includes(searchTerm));
  };

  const handleDeckSelect = (tcg: string, deckuid: string) => {
    router.push(`/deckbuilder/${tcg}?deckuid=${deckuid}`);
  };

  const displayDecks = getDisplayDecks();
  console.log("AllDecks displayDecks:", displayDecks);

  return (
    <div className={styles.deckLibrary}>
      <div className={styles.deckCategoryContainer}>
        {selectedCategory === "ALL" ? (
          deckCategories.map((category) => {
            const decks = getDecksByCategory(category)
              .filter((deck) => deck && deck.deckname)
              .filter((deck) =>
                deck.deckname.toLowerCase().includes(searchTerm)
              );

            if (decks.length === 0) return null;

            return (
              <div key={category}>
                <div className={styles.deckCategory}>
                  {category.toUpperCase()}
                </div>
                <div className={styles.deckItem}>
                  {decks.map((deck) => (
                    <img
                      onClick={() =>
                        handleDeckSelect(category, deck.deckuid)
                      }
                      key={deck.deckuid}
                      src={deck.deckcover}
                      alt={deck.deckname}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.deckItem}>
            {displayDecks.length > 0 ? (
              displayDecks.map((deck) => (
                <img
                  onClick={() =>
                    handleDeckSelect(selectedCategory, deck.deckuid)
                  }
                  key={deck.deckuid}
                  src={deck.deckcover}
                  alt={deck.deckname}
                />
              ))
            ) : (
              <p className={styles.noDecks}>
                {searchTerm
                  ? `No matching decks found in ${selectedCategory}`
                  : `No decks found for ${selectedCategory}`}
              </p>
            )}
          </div>
        )}
      </div>
      {selectedCategory === "ALL" &&
        deckCategories.every(
          (category) =>
            getDecksByCategory(category).filter(
              (deck) =>
                deck &&
                deck.deckname &&
                deck.deckname.toLowerCase().includes(searchTerm)
            ).length === 0 && (
              <p className={styles.noDecks}>
                {searchTerm
                  ? "No matching decks found in any category"
                  : "No decks found in any category"}
              </p>
            )
        )}
      <div className={styles.deckCategory}>
        <select
          title="Select Deck Category"
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value as TCGTYPE | "ALL")
          }
          className={styles.categorySelect}
        >
          <option value="ALL">All Categories</option>
          {deckCategories.map((category) => (
            <option key={category} value={category}>
              {category.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.deckCategory}>
        <input
          type="text"
          placeholder="Search decks by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          className={styles.searchInput}
        />
      </div>
    </div>
  );
};

export default AllDecks;

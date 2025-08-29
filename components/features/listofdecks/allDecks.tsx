import { useEffect, useState, useMemo } from "react";
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

  // Memoize filtered decks to prevent unnecessary recalculations
  const displayDecks = useMemo(() => {
    const decks =
      selectedCategory === "ALL"
        ? deckCategories.flatMap((category) => getDecksByCategory(category))
        : getDecksByCategory(selectedCategory);

    const search = searchTerm.toLowerCase();

    return decks
      .filter((deck) => deck && deck.deckname)
      .filter((deck) => {
        const matchesDeckName = deck.deckname.toLowerCase().includes(search);
        const matchesCardName = deck.listofcards?.some((card: any) =>
          card.cardName?.toLowerCase().includes(search)
        );

        return matchesDeckName || matchesCardName;
      });
  }, [selectedCategory, searchTerm, getDecksByCategory, deckCategories]);

  const handleDeckSelect = (tcg: string, deckuid: string) => {
    router.push(`/deckbuilder/${tcg}?deckuid=${deckuid}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as TCGTYPE | "ALL");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading decks...</div>;
  }

  // Check if all categories are empty when "ALL" is selected
  const allCategoriesEmpty =
    selectedCategory === "ALL" &&
    deckCategories.every(
      (category) =>
        getDecksByCategory(category).filter(
          (deck) =>
            deck &&
            deck.deckname &&
            deck.deckname.toLowerCase().includes(searchTerm)
        ).length === 0
    );

  return (
    <div className={styles.deckLibrary}>
      <div className={styles.deckCategoryContainer}>
        {selectedCategory === "ALL" ? (
          deckCategories.map((category) => {
            const decks = getDecksByCategory(category)
              .filter((deck) => deck && deck.deckname)
              .filter((deck) =>
                deck.deckname.toLowerCase().includes(searchTerm.toLowerCase())
              );

            if (decks.length === 0) return null;

            return (
              <div key={category}>
                <div className={styles.deckCategory}>
                  {category.toUpperCase()}
                </div>
                <div className={styles.deckItemContainer}>
                  {decks.map((deck) => (
                    <div key={deck.deckuid} className={styles.deckItem}>
                      <img
                        onClick={() => handleDeckSelect(category, deck.deckuid)}
                        src={deck.deckcover}
                        alt={deck.deckname}
                        onError={(e) => {
                          e.currentTarget.src = "/gsdeckimage.jpg";
                        }}
                      />
                      <div className={styles.deckItemName}>{deck.deckname}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.deckItemScrollContainer}>
            {displayDecks.length > 0 ? (
              displayDecks.map((deck) => (
                <div key={deck.deckuid} className={styles.deckItem}>
                  <img
                    onClick={() =>
                      handleDeckSelect(selectedCategory, deck.deckuid)
                    }
                    src={deck.deckcover}
                    alt={deck.deckname}
                    onError={(e) => {
                      e.currentTarget.src = "/gsdeckimage.jpg";
                    }}
                  />
                  <div className={styles.deckItemName}>{deck.deckname}</div>
                </div>
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
        {allCategoriesEmpty && (
          <p className={styles.noDecks}>
            {searchTerm
              ? "No matching decks found"
              : "No decks"}
          </p>
        )}
      </div>

      <div className={styles.deckCategory}>
        <select
          title="Select Deck Category"
          value={selectedCategory}
          onChange={handleCategoryChange}
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
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>
    </div>
  );
};

export default AllDecks;

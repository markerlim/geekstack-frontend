import { useSearchCards } from "../../../contexts/SearchContext";
import styles from "../../../styles/IndexPage.module.css";
import TcgImage from "../../TcgImage";

const SearchContainer = ({onOpen}) => {
    const {searchResults, isLoading} = useSearchCards();
  return (
    <div className={styles.searchResultsContainer}>
      <div className={styles.inlineResults}>
        {isLoading ? (
          <div className={styles.loading}>Searching cards...</div>
        ) : searchResults.length > 0 ? (
          <>
            {searchResults.slice(0, 5).map((card) => (
              <TcgImage
                card={card}
                key={card._id}
                tcgtype={card.tcg}
                src={card.urlimage}
                alt={card.cardName}
              />
            ))}
          </>
        ) : (
          <p className={styles.noResults}>No cards found</p>
        )}
      </div>

      {searchResults.length > 5 && (
        <button
          title="show more"
          className={styles.showMoreButton}
          onClick={onOpen}
        >
          Show All Results ({searchResults.length})
        </button>
      )}
    </div>
  );
};

export default SearchContainer;
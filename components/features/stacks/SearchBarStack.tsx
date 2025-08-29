import { useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import styles from "../../../styles/SearchBarStack.module.css";
import searchPostEvent from "../../../services/eventBus/searchPostEvent";

const SearchBarStack = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  let placeholder = "Search posts...";
  let className = "";

  const handleSearch = () => {
    searchPostEvent.emit("search:query", query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Clear search
  const handleClear = () => {
    setQuery("");
    searchPostEvent.emit("search:query", ""); // reset search
  };

  // Handle focus
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`${styles.searchContainer} ${className}`}>
      <div
        className={`${styles.searchWrapper} ${isFocused ? styles.focused : ""}`}
      >
        <Search
          className={styles.searchIcon}
          size={20}
          onClick={handleSearch} // search when clicking icon
          style={{ cursor: "pointer" }}
        />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={styles.searchInput}
          aria-label="Search posts"
        />

        {query && (
          <button
            onClick={handleClear}
            className={styles.clearButton}
            aria-label="Clear search"
            type="button"
          >
            <X size={16} />
          </button>
        )}
        <button
          onClick={handleSearch}
          className={styles.searchButton}
          aria-label="Clear search"
          type="button"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default SearchBarStack;

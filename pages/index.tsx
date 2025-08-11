import { useState } from "react";
import SearchResModal from "../components/features/search/SearchResModal";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import styles from "../styles/IndexPage.module.css";
import "swiper/css";
import "swiper/css/navigation";
import { tcgList } from "../data/tcgList";
import { useDevice } from "../contexts/DeviceContext";
import { useSearchCards } from "../contexts/SearchContext";
import SearchContainer from "../components/features/search/SearchContainer";
import HomeContent from "../components/HomeContent";

const IndexPage = () => {
  const { searchResults } = useSearchCards();
  const [expandedResults, setExpandedResults] = useState(false);
  const device = useDevice();
  const isDesktop = device === "desktop";

  const handleSearchResultsClosed = () => {
    setExpandedResults(false);
  };

  const handleSearchCardOpen = () =>{
    setExpandedResults(true);
  }

  return (
    <Layout title="Home | GeekStack">
      <div
        className={`${styles.homepage} ${
          !isDesktop && styles["mobile-homepage"]
        }`}
      >
        {isDesktop && (
          <div className={styles.searchBar}>
            <SearchBar games={tcgList} initialGame={tcgList[0]} />
          </div>
        )}
        {/* Search Results Section */}
        {searchResults ? (
          <SearchContainer onOpen={handleSearchCardOpen}/>
        ) : (
          /* Default Homepage Content */
          <HomeContent/>
        )}

        {/* Results Modal */}
        {expandedResults && (
          <SearchResModal
            onClose={handleSearchResultsClosed}
          />
        )}
      </div>
    </Layout>
  );
};

export default IndexPage;

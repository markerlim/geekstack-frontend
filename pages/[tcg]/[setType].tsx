import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import CardList from "../../components/features/CardList";
import { useSearchCards } from "../../contexts/SearchContext";
import SearchContainer from "../../components/features/search/SearchContainer";
import { useState } from "react";
import SearchResModal from "../../components/features/search/SearchResModal";

const BoosterCardsPage = () => {
  const { setType } = useRouter().query;
  const { searchResults } = useSearchCards();
  const [expandedResults, setExpandedResults] = useState(false);

  const handleSearchResultsClosed = () => {
    setExpandedResults(false);
  };

  const handleSearchCardOpen = () => {
    setExpandedResults(true);
  };

  return (
    <Layout title={`${setType?.toString().toUpperCase()} Cards`} scrollable={false}>
      {searchResults ? (
        <SearchContainer onOpen={handleSearchCardOpen} />
      ) : (
        <CardList />
      )}
      {expandedResults && (
          <SearchResModal
            onClose={handleSearchResultsClosed}
          />
        )}
    </Layout>
  );
};

export default BoosterCardsPage;

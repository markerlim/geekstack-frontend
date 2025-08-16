import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import CardList from "../../components/features/CardList";
import { useSearchCards } from "../../contexts/SearchContext";
import SearchContainer from "../../components/features/search/SearchContainer";
import { useState } from "react";
import SearchResModal from "../../components/features/search/SearchResModal";

const BoosterCardsPage = () => {
  const { setType } = useRouter().query;


  return (
    <Layout title={`${setType?.toString().toUpperCase()} Cards`} scrollable={false}>
        <CardList />
    </Layout>
  );
};

export default BoosterCardsPage;

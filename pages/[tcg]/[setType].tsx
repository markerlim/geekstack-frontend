import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import CardList from "../../components/functional/CardList";

const BoosterCardsPage = () => {
  const { setType } = useRouter().query;

  return (
    <Layout title={`${setType?.toString().toUpperCase()} Cards`}>
      <CardList/>
    </Layout>
  );
};

export default BoosterCardsPage;
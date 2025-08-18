import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import CardList from "../../components/features/CardList";

const BoosterCardsPage = () => {
  const { setType } = useRouter().query;


  return (
    <Layout title={`${setType?.toString().toUpperCase()} Cards`} scrollable={false}>
        <CardList />
    </Layout>
  );
};

export default BoosterCardsPage;

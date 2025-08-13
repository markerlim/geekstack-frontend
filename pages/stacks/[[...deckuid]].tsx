import Layout from "../../components/Layout";
import StacksList from "../../components/features/stacks/StacksList";

const StacksPage = () => {
  
  return (
    <Layout title={`Stacks`} scrollable={false}>
      <StacksList />
    </Layout>
  );
};

export default StacksPage;

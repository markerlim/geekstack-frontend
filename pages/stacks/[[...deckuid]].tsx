import Layout from "../../components/Layout";
import StacksList from "../../components/features/stacks/StacksList";

export const runtime = 'experimental-edge';

const StacksPage = () => {
  
  return (
    <Layout title={`Stacks`} scrollable={false}>
      <StacksList />
    </Layout>
  );
};

export default StacksPage;

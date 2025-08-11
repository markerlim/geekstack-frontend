import { useRouter } from "next/router";
import { useDevice } from "../../contexts/DeviceContext";
import { useState } from "react";
import Layout from "../../components/Layout";
import StacksList from "../../components/features/stacks/StacksList";

const StacksPage = () => {
  const router = useRouter();
  const { deckuid } = router.query;
  const [deckUid, setDeckUid] = useState("");

  const handleSetTypeChange = (newDeckUid: string) => {
    setDeckUid(newDeckUid);
    if (!newDeckUid) {
      router.push(`/stacks`, undefined, { shallow: true });
    }
  };
  return (
    <Layout title={`Stacks`} scrollable={false}>
      <StacksList />
    </Layout>
  );
};

export default StacksPage;

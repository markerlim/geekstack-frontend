import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Image from "next/image";
import styles from "../../styles/CardList.module.css"
import { GameCard } from "../../interfaces/card.model";
import { useEffect, useState } from "react";
import { fetchCardsByTcg } from "../../services/gsBoosterService";
import TcgImage from "../../components/TcgImage";

const BoosterCardsPage = () => {
  const { tcg, setType } = useRouter().query;
  const [cardList, setCardList] = useState<GameCard[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof tcg === "string" && typeof setType === "string") {
      fetchCardsByTcg(tcg, setType)
        .then((data) => {
          console.log("Cards fetched:", data);
          setCardList(data);
        })
        .catch(() => setError("Failed to load boosters"));
    }
  }, [tcg]);

  return (
    <Layout title={`${setType?.toString().toUpperCase()} Cards`}>
      <div className={styles['card-list']}>
        {cardList.map((card) => (
          <div key={card._id} className={styles['card-item']}>
            <TcgImage
              src={card.urlimage}
              alt={card.cardName}
              card={card}
            />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default BoosterCardsPage;

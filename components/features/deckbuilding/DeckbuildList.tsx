import { useRouter } from "next/router";
import { useDeck } from "../../../contexts/DeckContext";
import styles from "../../../styles/DeckbuildList.module.css";
import TcgImage from "../../TcgImage";
import DeckbuilderCounter from "./DeckbuilderCounter";
import DeckbuilderBar from "./DeckbuilderBar";
import Image from "next/image";
import { useUserStore } from "../../../services/store/user.store";
import { useState } from "react";
import { useDevice } from "../../../contexts/DeviceContext";

const DeckbuildList = () => {
  const { tcg } = useRouter().query;
  const { sqlUser } = useUserStore();
  const { cardlist } = useDeck();
  const [isBarCollapsed, setIsBarCollapsed] = useState(false);
  const deviceType = useDevice();
  const isDesktop = deviceType === "desktop";
  const userId = sqlUser?.userId;

  const tcgType = Array.isArray(tcg) ? tcg[0] : tcg || "default";

  return (
    <>
      <div className={styles["db-bar"]}>
        <DeckbuilderBar
          tcg={tcgType}
          userId={userId}
          onCollapseChange={(collapsed) => {
            setIsBarCollapsed(collapsed);
          }}
        />
      </div>
      <div
        className={`${styles["card-list"]} ${
          isBarCollapsed
            ? isDesktop
              ? styles["c-height-desktop"]
              : styles["c-height-mobile"]
            : isDesktop
            ? styles["uc-height-desktop"]
            : styles["uc-height-mobile"]
        }`}
      >
        <div className={styles.iconbg}>
          <Image
            src="/icons/gsdb-backdrop.png"
            alt="logo"
            width={150}
            height={150}
            priority
          />
        </div>
        <div className={styles.cardlistscroll}>
          {Array.isArray(cardlist) && cardlist.length > 0 ? (
            cardlist.map((card) => {
              if (!card?._id || !card?.urlimage ) {
                console.warn("Invalid card data:", card);
                return null;
              }

              return (
                <div key={card._id} className={styles["card-item"]}>
                  <TcgImage
                    src={card.urlimage}
                    alt={card.cardName || `Card ${card._id}`}
                    tcgtype={tcgType}
                    card={card}
                  />
                  <DeckbuilderCounter card={card} />
                </div>
              );
            })
          ) : (
            <div className={styles.empty}>
              <p>Believe in the heart of the cards.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DeckbuildList;

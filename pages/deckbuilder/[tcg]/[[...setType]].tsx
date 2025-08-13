import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "../../../styles/DeckbuilderPage.module.css";
import Layout from "../../../components/Layout";
import CardList from "../../../components/features/CardList";
import { useDevice } from "../../../contexts/DeviceContext";
import DeckbuildList from "../../../components/features/deckbuilding/DeckbuildList";
import BoosterList from "../../../components/features/BoosterList";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { useDeck } from "../../../contexts/DeckContext";

export const runtime = 'experimental-edge';

const DeckbuilderBoosterPage = () => {
  const router = useRouter();
  const { tcg, setType } = router.query;
  const device = useDevice();
  const isDesktop = device === "desktop";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentSetType, setCurrentSetType] = useState<string | null>(null);
  const [contentVisible, setContentVisible] = useState(false);
  const { clearList, cardlist } = useDeck();
  const [confirmedTcg, setConfirmedTcg] = useState(tcg);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initialize setType
  useEffect(() => {
    const normalized = Array.isArray(setType) ? setType[0] : setType;
    setCurrentSetType(normalized || null);
  }, [setType]);

  // Intercept route changes
  useEffect(() => {
    const handleRouteChange = async (url: string) => {
      const newTcg = url.split("/")[2];
      if (newTcg === confirmedTcg) return;

      if (cardlist.length > 0) {
        setIsTransitioning(true);
        try {
          await new Promise((resolve) => {
            clearList();
            setTimeout(resolve, 0);
          });
          setConfirmedTcg(newTcg);
        } finally {
          setIsTransitioning(false);
        }
      } else {
        setConfirmedTcg(newTcg);
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [confirmedTcg, cardlist.length, clearList]);

  const handleSlider = () => {
    setContentVisible((prev) => !prev);
  };

  return (
    <Layout title={`${tcg?.toString().toUpperCase()} Cards`} scrollable={false}>
      <div className={styles.pageWrapper}>
        {/* Mobile view */}
        {!isDesktop && (
          <>
            {/* Always visible DeckbuildList */}
            <div className={styles.deckbuildListMobile}>
              <DeckbuildList />
              <button
                title="Show decklist"
                className={styles.openingSlider}
                onClick={() => handleSlider()}
              >
                <ChevronUp width={30} height={30} />
              </button>
            </div>


            {/* Sliding content area */}
            <div
              className={`${styles.mobileContentContainer} ${
                contentVisible ? styles.visible : styles.notVisible
              }`}
            >
              <button
                title="Close decklist"
                className={styles.closingSlider}
                onClick={() => handleSlider()}
              >
                <ChevronDown width={30} height={30} />
              </button>
              <div className={styles.mainMobileContent}>
                {currentSetType ? (
                  <>
                    <CardList />
                  </>
                ) : (
                  <BoosterList />
                )}
              </div>
            </div>
            {contentVisible && (
              <div
                className={styles.overlayBackdrop}
                onClick={() => handleSlider()}
              />
            )}
          </>
        )}
        {isDesktop && (
          <>
            <div className={styles.mainContent}>
              <DeckbuildList />
            </div>
            <div
              className={`${styles.sidebar} ${
                isCollapsed ? styles.sidebarCollapsed : ""
              }`}
            >
              <button
                className={styles.toggleBtn}
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label="Toggle sidebar"
              >
                {isCollapsed ? <ChevronLeft /> : <ChevronRight />}
              </button>
              {!isCollapsed && (
                <div className={styles.listofbc}>
                  {currentSetType ? (
                    <>
                      <CardList />
                    </>
                  ) : (
                    <BoosterList />
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DeckbuilderBoosterPage;

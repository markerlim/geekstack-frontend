import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

const DeckbuilderBoosterPage = () => {
  const router = useRouter();
  const { tcg, setType } = router.query;
  const device = useDevice();
  const isDesktop = device === "desktop";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentSetType, setCurrentSetType] = useState<string | null>(null);
  const [contentVisible, setContentVisible] = useState(false);

  // Initialize setType
  useEffect(() => {
    const normalized = Array.isArray(setType) ? setType[0] : setType;
    setCurrentSetType(normalized || null);
  }, [setType]);

  const handleSlider = () => {
    setContentVisible((prev) => !prev);
  };

  const handleSetTypeChange = (newSetType: string | null) => {
    setCurrentSetType(newSetType);
    if (!newSetType) {
      router.push(`/deckbuilder/${tcg}`, undefined, { shallow: true });
    }
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

            {/* Overlay backdrop - only visible when content is visible */}
            {contentVisible && (
              <div
                className={styles.overlayBackdrop}
                onClick={() => handleSlider()}
              />
            )}
            
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
                    <button
                      onClick={() => handleSetTypeChange(null)}
                      className={styles.closeButton}
                    >
                      Close
                    </button>
                    <CardList />
                  </>
                ) : (
                  <BoosterList />
                )}
              </div>
            </div>
          </>
        )}

        {/* Desktop view (unchanged) */}
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
                      <button onClick={() => handleSetTypeChange(null)}>
                        Clear
                      </button>
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

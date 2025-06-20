// components/layout/DeckbuilderLayout.tsx
import { useState } from "react";
import { useDevice } from "../../contexts/DeviceContext";
import styles from "../../styles/DeckbuilderPage.module.css";
import DeckbuildList from "../functional/DeckbuildList";

export default function DeckbuilderLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const device = useDevice();
  const isDesktop = device === "desktop";
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={styles.pageWrapper}>
      {!isDesktop && (
        <div>
          <DeckbuildList />
        </div>
      )}
      {isDesktop && (
        <div className={styles.mainContent}>
          {children} {/* Main content injected here */}
        </div>
      )}
      {isDesktop && (
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
            {isCollapsed ? "<" : ">"}
          </button>
          {!isCollapsed && <DeckbuildList />}
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import styles from "../../styles/Sidenav.module.css";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { tcgList } from "../../data/tcgList";

const Sidenav = () => {
  const [collapsed, setCollapsed] = useState(false);
  const tabs = [
    {
      icon: "/icons/bottomnav/HomeSelected.svg",
      alt: "home",
      label: "Home",
      path: "/",
    },
    {
      icon: "/icons/bottomnav/NewsSelected.svg",
      alt: "Stack",
      label: "Stack",
      path: "/stack",
    },
  ];

  return (
    <aside className={`${styles.sidenav} ${collapsed ? styles.collapsed : ""}`}>
      <nav className={styles.nav}>
        {tabs.map((tab) => {
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`${collapsed ? styles["sidenav-collapsed"] : ""}`}
            >
              <Image src={tab.icon} alt={tab.alt} width={30} height={30} />
              <span className={`${collapsed ? styles["label-collapsed"] : ""}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
        {tcgList.map((tab) => {
          return (
            <Link
              key={tab.path}
              href={`/deckbuilder${tab.path}`}
              className={`${collapsed ? styles["sidenav-collapsed"] : ""}`}
            >
              <Image src={tab.icon} alt={tab.alt} width={30} height={30} />
              <span className={`${collapsed ? styles["label-collapsed"] : ""}`}>
                deckbuilder
              </span>
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={styles.toggleBtn}
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>
    </aside>
  );
};

export default Sidenav;

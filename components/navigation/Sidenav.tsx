import { useState } from "react";
import styles from "../../styles/Sidenav.module.css";
import Link from "next/link";

const Sidenav = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${styles.sidenav} ${collapsed ? styles.collapsed : ""}`}>
      <button onClick={() => setCollapsed(!collapsed)} className={styles.toggleBtn}>
        {collapsed ? "→" : "←"}
      </button>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/cards">Cards</Link>
        <Link href="/about">About</Link>
      </nav>
    </aside>
  );
};

export default Sidenav;

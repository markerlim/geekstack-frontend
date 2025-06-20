import { useState } from "react";
import styles from "../../styles/Sidenav.module.css";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Sidenav = () => {
  const [collapsed, setCollapsed] = useState(false);
  const tabs = [
    { icon: '/icons/bottomnav/HomeSelected.svg', alt: 'home', label: 'Home', path: '/' },
    { icon: '/icons/unionarenaicon.ico', alt: 'Decks', label: 'Deckbuilder', path: '/deckbuilder/unionarena' },
    { icon: '/icons/onepieceicon.png', alt: 'Decks', label: 'Deckbuilder', path: '/deckbuilder/onepiece' },
    { icon: '/icons/cookierun.png', alt: 'Decks', label: 'Deckbuilder', path: '/deckbuilder/cookierunbraverse' },
    { icon: '/icons/duelmastericon.ico', alt: 'Decks', label: 'Deckbuilder', path: '/deckbuilder/duelmasters' },
    { icon: '/icons/hololiveicon.png', alt: 'Decks', label: 'Deckbuilder', path: '/deckbuilder/hololive' },
    { icon: '/icons/dragonballz.ico', alt: 'Decks', label: 'Deckbuilder', path: '/deckbuilder/dragonballzfw' },
    { icon: '/icons/bottomnav/NewsSelected.svg', alt: 'Stacks', label: 'Stacks', path: '/stacks' },
  ];

  return (
    <aside className={`${styles.sidenav} ${collapsed ? styles.collapsed : ""}`}>
      <nav className={styles.nav}>
        {tabs.map((tab)=>{
          return(<Link  key={tab.path}  href={tab.path} className={`${collapsed ? styles['sidenav-collapsed'] : ""}`}>
            <Image src={tab.icon} alt={tab.alt} width={30} height={30}/>
            <span className={`${collapsed ? styles['label-collapsed'] : ""}`}>{tab.label}</span>
          </Link>
          )
        })}
      </nav>
      <button onClick={() => setCollapsed(!collapsed)} className={styles.toggleBtn}>
        {collapsed ? <ChevronRight/> : <ChevronLeft/>}
      </button>
    </aside>
  );
};

export default Sidenav;

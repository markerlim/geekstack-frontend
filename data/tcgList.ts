import { TCGTYPE } from "../utils/constants";

export interface TCGListItem {
  img: string;
  alt: string;
  path: string;
  icon: string;
  tcg: TCGTYPE;
}

export const tcgList: TCGListItem[] = [
  {
    img: "/images/homeUAbtn.jpg",
    alt: "Union Arena",
    path: `/${TCGTYPE.UNIONARENA}`,
    icon: "/icons/unionarenaicon.ico",
    tcg: TCGTYPE.UNIONARENA,
  },
  {
    img: "/images/homeOPbtn.jpg",
    alt: "One Piece",
    path: `/${TCGTYPE.ONEPIECE}`,
    icon: "/icons/onepieceicon.png",
    tcg: TCGTYPE.ONEPIECE,
  },
  {
    img: "/images/homeGCGbtn.webp",
    alt: "Gundam Card Game",
    path: `/${TCGTYPE.GUNDAM}`,
    icon: "/icons/gundamicon.png",
    tcg: TCGTYPE.GUNDAM,
  },
  {
    img: "/images/homeCRBbtn.jpg",
    alt: "Cookie Run Braverse",
    path: `/${TCGTYPE.COOKIERUN}`,
    icon: "/icons/cookierun.png",
    tcg: TCGTYPE.COOKIERUN,
  },
  {
    img: "/images/homeDMbtn.jpg",
    alt: "Duelmasters",
    path: `/${TCGTYPE.DUELMASTERS}`,
    icon: "/icons/duelmastericon.ico",
    tcg: TCGTYPE.DUELMASTERS,
  },
  {
    img: "/images/homeHOCGbtn.webp",
    alt: "Hololive Official Card Game",
    path: `/${TCGTYPE.HOLOLIVE}`,
    icon: "/icons/hololiveicon.png",
    tcg: TCGTYPE.HOLOLIVE,
  },
  {
    img: "/images/homeDBZbtn.jpg",
    alt: "Dragonballz Fusion World",
    path: `/${TCGTYPE.DRAGONBALLZFW}`,
    icon: "/icons/dragonballz.ico",

    tcg: TCGTYPE.DRAGONBALLZFW,
  },
];

export const fullTcgList: TCGListItem[] = [
  {
    img: "/images/homeUAbtn.jpg",
    alt: "Union Arena",
    path: `/${TCGTYPE.UNIONARENA}`,
    icon: "/icons/unionarenaicon.ico",
    tcg: TCGTYPE.UNIONARENA,
  },
  {
    img: "/images/homeOPbtn.jpg",
    alt: "One Piece",
    path: `/${TCGTYPE.ONEPIECE}`,
    icon: "/icons/onepieceicon.png",
    tcg: TCGTYPE.ONEPIECE,
  },
  {
    img: "/images/homeCRBbtn.jpg",
    alt: "Cookie Run Braverse",
    path: `/${TCGTYPE.COOKIERUN}`,
    icon: "/icons/cookierun.png",
    tcg: TCGTYPE.COOKIERUN,
  },
  {
    img: "/images/homeRBbtn.webp",
    alt: "Riftbound League Of Legends",
    path: `/${TCGTYPE.RIFTBOUND}`,
    icon: "/images/homeRBbtn.webp",
    tcg: TCGTYPE.RIFTBOUND,
  },
  {
    img: "/images/homeGCGbtn.webp",
    alt: "Gundam Card Game",
    path: `/${TCGTYPE.GUNDAM}`,
    icon: "/icons/gundamicon.png",
    tcg: TCGTYPE.GUNDAM,
  },
  {
    img: "/images/homeDMbtn.jpg",
    alt: "Duelmasters",
    path: `/${TCGTYPE.DUELMASTERS}`,
    icon: "/icons/duelmastericon.ico",
    tcg: TCGTYPE.DUELMASTERS,
  },
  {
    img: "/images/homeHOCGbtn.webp",
    alt: "Hololive Official Card Game",
    path: `/${TCGTYPE.HOLOLIVE}`,
    icon: "/icons/hololiveicon.png",
    tcg: TCGTYPE.HOLOLIVE,
  },
  {
    img: "/images/homeDBZbtn.jpg",
    alt: "Dragonballz Fusion World",
    path: `/${TCGTYPE.DRAGONBALLZFW}`,
    icon: "/icons/dragonballz.ico",

    tcg: TCGTYPE.DRAGONBALLZFW,
  },
  {
    img: "/images/homePTCGPbtn.jpg",
    alt: "Pokemon",
    path: `/${TCGTYPE.PKMNPOCKET}`,
    icon: "/images/homePTCGPbtn.jpg",
    tcg: TCGTYPE.PKMNPOCKET,
  },
];

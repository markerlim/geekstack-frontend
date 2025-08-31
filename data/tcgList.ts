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
    path: `/`,
    icon: "/images/homeRBbtn.webp",
    tcg: "ritfboundlol" as TCGTYPE, // Placeholder for Riftbound
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
    path: `/`,
    icon: "/images/homePTCGPbtn.jpg",
    tcg: "ptcgpocket" as TCGTYPE, // Placeholder for Pokemon Pocket TCG
  },
];

export const TCGSETList = {
  [`${TCGTYPE.UNIONARENA}List`]: {
    "Code Geass": "CGH",
    "Jujutsu No Kaisen": "JJK", 
    "Hunter X Hunter": "HTR",
    "Idolmaster Shiny Colors": "IMS",
    "Demon Slayer": "KMY",
    "Tales of Arise": "TOA",
    "That Time I Got Reincarnated as a Slime": "TSK",
    "Bleach: Thousand-Year Blood War": "BLC",
    "Me & Roboco": "BTR",
    "My Hero Academia": "MHA",
    "Gintama": "GNT",
    "Bluelock": "BLK",
    "Tekken 7": "TKN",
    "Dr. Stone": "DST",
    "Sword Art Online": "SAO",
    "Synduality Noir": "SYN",
    "Toriko": "TRK",
    "Goddess of Victory : Nikke": "NIK",
    "Haikyu!!": "HIQ",
    "Black Clover": "BCV",
    "YuYu Hakusho": "YYH",
    "GAMERA -Rebirth-": "GMR",
    "Attack On Titan": "AOT",
    "SHY": "SHY",
    "Undead Unluck": "AND",
    "The 100 Girlfriends Who Really, Really, Really, Really, Really Love You": "RLY",
    "Gakuen Idolmaster": "GIM",
    "Kaiju No. 8": "KJ8",
    "Kamen Rider": "KMR",
    "Arknights": "ARK",
    "Puella Magi Madoka Magica": "MMM",
    "Shangri-La Frontier": "SNF",
    "2.5 Dimensional Seduction": "NGR",
    "Code Geass: Rozé of the Recapture": "CGD",
    "One Punch Man": "OPM",
    "Blue Archive": "BAC",
    "Macross Series": "MCR",
    "Fullmetal Alchemist": "FMA",
    "Windbreaker": "WBK",
    "Kinnikuman": "KIN",
    "Re:ZERO -Starting Life in Another World-": "REZ",
    "Rurouni Kenshin": "RNK",
    "Monogatari": "MGS",
    "SAKAMOTO DAYS": "SMD"
  }
} as const;

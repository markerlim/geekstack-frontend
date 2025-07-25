export interface Booster {
  _id: { $oid: string };
  pathname: string;
  alt?: string;
  imageSrc: string;
  tcg?: string;
  order?: number;
  imgWidth?: string; // optional because sometimes it might not be set
  category: string;
}

export interface DuelmasterBooster extends Booster {
  japtext: string;
  timestamp: Date;
  detailLink: string;
}

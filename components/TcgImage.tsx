// components/TcgImage.tsx
import { useDevice } from "../contexts/DeviceContext";
import styles from "../styles/TcgImage.module.css";

interface TcgImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  card: any;
  tcgtype: string;
}

export const TcgImage = ({ card, tcgtype, ...imgProps }: TcgImageProps) => {
  const deviceType = useDevice();

  const imageClass =
    deviceType === "mobile"
      ? styles.cardImageMobile
      : deviceType === "tablet"
      ? styles.cardImageTablet
      : styles.cardImageDesktop;

  return (
    <img
      {...imgProps}
      className={`${styles.cardImage} ${imageClass}`}
    />
  );
};
import { useDevice } from "../contexts/DeviceContext";
import styles from "../styles/TcgImage.module.css";
import { TCGTYPE } from "../utils/constants";

interface TcgImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  card: any;
  tcgtype: TCGTYPE;
}

const TcgImage = ({ card, tcgtype, ...imgProps }: TcgImageProps) => {
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

export default TcgImage;
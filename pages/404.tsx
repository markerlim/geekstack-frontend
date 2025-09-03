import Link from "next/link";
import styles from "../styles/Custom404.module.css"; // optional CSS
import CardLoader from "../components/genericComponent/CardLoader";

const Custom404 = () => {
  return (
    <div className={styles.container}>
      <CardLoader />
      <h1>404</h1>
      <h2>Oops! This page is deprecated or does not exist.</h2>
      <a href="/">Back to Homepage</a>
    </div>
  );
};

export default Custom404;

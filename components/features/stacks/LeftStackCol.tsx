import StacksComponent from "./StackComponent";
import styles from "../../../styles/StacksPage.module.css";
import { DeckPost } from "../../../model/deckpost.model";

interface LeftStackColProps {
  items: DeckPost[];
}

const LeftStackCol = ({ items }: LeftStackColProps) => {
  return (
    <div className={`${styles["stack-col"]} ${styles["left-col"]}`}>
      {items.map((item) => (
        <StacksComponent key={item.postId} post={item} />
      ))}
    </div>
  );
};

export default LeftStackCol;

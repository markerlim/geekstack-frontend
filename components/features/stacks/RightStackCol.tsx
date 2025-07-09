import StacksComponent from "./StackComponent";
import styles from "../../../styles/StacksPage.module.css";
import { DeckPost } from "../../../model/deckpost.model";

interface RightStackColProps {
  items: DeckPost[];
}
const RightStackCol =  ({ items }: RightStackColProps)  => {
  return (
    <div className={`${styles["stack-col"]} ${styles["right-col"]}`}>
      {items.map((item) => (
        <StacksComponent key={item.postId} post={item} />
      ))}
    </div>
  );
};

export default RightStackCol;

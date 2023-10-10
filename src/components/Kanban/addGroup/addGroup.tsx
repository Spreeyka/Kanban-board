import { Plus } from "../../../assets/icons/Plus";
import { AddListButton } from "../../KanbanBoard/components/AddListButton";
import styles from "./styles.module.scss";

const AddGroup = () => {
  return (
    <>
      <div className={`${styles.gridItem} ${styles.placeholder}`}>
        <AddListButton>
          <Plus fill="#88819F" /> Add another list
        </AddListButton>
      </div>
    </>
  );
};
export { AddGroup };

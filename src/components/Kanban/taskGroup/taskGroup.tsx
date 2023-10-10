import { Plus } from "../../../assets/icons/Plus";
import { AddListButton } from "../../KanbanBoard/components/AddListButton";
import styles from "./styles.module.scss";
import { Task } from "./task/task";

const TaskGroup = () => {
  return (
    <>
      <div className={styles.gridItem} tabIndex={0}>
        <div>Working on</div>
        <ul>
          <Task />
        </ul>
        <AddListButton>
          <Plus fill="#88819F" /> Add a card
        </AddListButton>
      </div>
    </>
  );
};
export { TaskGroup };

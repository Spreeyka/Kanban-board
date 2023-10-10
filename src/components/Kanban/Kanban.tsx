import { AddGroup } from "./addGroup/addGroup";
import styles from "./styles.module.scss";

import { TaskGroup } from "./taskGroup/taskGroup";

const Kanban = () => {
  return (
    <div className={styles.grid}>
      <TaskGroup />
      <AddGroup />
    </div>
  );
};
export { Kanban };

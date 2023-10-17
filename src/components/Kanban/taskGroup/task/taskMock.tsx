import { useSelector } from "react-redux";

import { selectTaskState } from "../../../../store/slices";
import { CustomToggleButton } from "../components/toggleButton";
import styles from "./styles.module.scss";
import { Task as TaskType } from "../../../../store/slices/types";

const TaskMock = ({ task, workspaceId, taskGroupId }: { task: TaskType; workspaceId: string; taskGroupId: string }) => {
  const taskId = task.id;

  const isTaskDone = useSelector(selectTaskState(workspaceId, taskGroupId, taskId));

  return (
    <li className={styles.flexSpaced} style={{ opacity: 0.8 }}>
      <div className={styles.gridItemHeader}>
        <p className={styles.namePlaceholder}>{task.name}</p>
        <CustomToggleButton style={{ marginLeft: -6 }} selected={isTaskDone} />
      </div>
    </li>
  );
};
export { TaskMock };

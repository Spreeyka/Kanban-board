import { IconButton } from "@mui/material";
import { DeleteIcon } from "../../../assets/icons/Delete";
import { EditIcon } from "../../../assets/icons/Edit";
import { Plus } from "../../../assets/icons/Plus";
import { TaskGroup as TaskGroupType, Task as taskType } from "../../../store/slices/types";
import { AddListButton } from "../../KanbanBoard/components/AddListButton";
import styles from "./styles.module.scss";

import { TaskMock } from "./task/taskMock";

interface TaskGroupProps {
  activeWorkspace: string;
  taskGroup: TaskGroupType;
  taskList: taskType[];
}

const TaskGroupMock: React.FC<TaskGroupProps> = ({ taskGroup, taskList, activeWorkspace }) => {
  return (
    // trick to make container actually smaller. It works better with closestCorners strategy
    <div style={{ width: "100px", height: "50px" }}>
      <div className={styles.taskGroupWrapper} style={{ opacity: 0.8 }}>
        <div className={styles.flexColumn}>
          <div className={styles.flexSpaced}>
            <p className={styles.taskGroupName}>{taskGroup.name}</p>

            <div className={styles.buttonGroup}>
              <IconButton aria-label="edit" sx={{ border: 0, padding: "6px", borderRadius: 0 }}>
                <EditIcon />
              </IconButton>
              <IconButton aria-label="delete" sx={{ border: 0, padding: "6px", borderRadius: 0 }}>
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
          <p className={styles.taskDoneDescription}>X tasks done</p>
        </div>

        <ul className={styles.taskList}>
          {taskList.map((task) => (
            <TaskMock key={task.id} task={task} workspaceId={activeWorkspace} taskGroupId={taskGroup.id} />
          ))}
        </ul>

        <div className={styles.addListButtonWrapper}>
          <AddListButton>
            <Plus fill="#88819F" /> Add a card
          </AddListButton>
        </div>
      </div>
    </div>
  );
};
export { TaskGroupMock };

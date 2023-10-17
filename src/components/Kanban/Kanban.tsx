import { useSelector } from "react-redux";
import { AddGroup } from "./addGroup/addGroup";
import styles from "./styles.module.scss";

import { selectTaskGroupsList } from "../../store/slices";
import { TaskGroup } from "./taskGroup/taskGroup";

import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";

const Kanban = ({ activeWorkspace }: { activeWorkspace: string }) => {
  const taskGroups = useSelector(selectTaskGroupsList(activeWorkspace));

  const [isTaskDragging, setIsTaskDragging] = useState(false);

  return (
    <>
      <div className={styles.grid}>
        <SortableContext items={taskGroups} strategy={horizontalListSortingStrategy}>
          {taskGroups.map((taskGroup) => (
            <TaskGroup
              key={taskGroup.id}
              workspaceId={activeWorkspace}
              taskGroupId={taskGroup.id}
              taskGroup={taskGroup}
              isTaskDragging={isTaskDragging}
              setIsTaskDragging={setIsTaskDragging}
            />
          ))}
        </SortableContext>

        <AddGroup activeWorkspace={activeWorkspace} />
      </div>
    </>
  );
};
export { Kanban };

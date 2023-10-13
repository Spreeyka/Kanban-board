import { useSelector } from "react-redux";
import { AddGroup } from "./addGroup/addGroup";
import styles from "./styles.module.scss";

import { TaskGroup } from "./taskGroup/taskGroup";
import { selectWorkspaces } from "../../store/slices";

const Kanban = ({ activeWorkspace }: { activeWorkspace: string }) => {
  const workspaces = useSelector(selectWorkspaces);

  return (
    <div className={styles.grid}>
      {Object.values(workspaces[activeWorkspace].taskGroups).map((taskGroup) => (
        <TaskGroup key={taskGroup.id} workspaceId={activeWorkspace} taskGroupId={taskGroup.id} taskGroup={taskGroup} />
      ))}

      <AddGroup activeWorkspace={activeWorkspace} />
    </div>
  );
};
export { Kanban };

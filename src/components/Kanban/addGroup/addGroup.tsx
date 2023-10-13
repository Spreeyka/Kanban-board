import { useDispatch } from "react-redux";
import { Plus } from "../../../assets/icons/Plus";
import { AddListButton } from "../../KanbanBoard/components/AddListButton";
import styles from "./styles.module.scss";
import { addTaskGroup } from "../../../store/slices";

const AddGroup = ({ activeWorkspace }: { activeWorkspace: string }) => {
  const dispatch = useDispatch();

  const handleAddTaskGroup = () => {
    const newGroupName = "New group";
    dispatch(addTaskGroup({ workspaceId: activeWorkspace, taskGroupName: newGroupName }));
  };

  return (
    <>
      <div className={`${styles.gridItem} ${styles.placeholder}`}>
        <AddListButton onClick={handleAddTaskGroup}>
          <Plus fill="#88819F" /> Add another list
        </AddListButton>
      </div>
    </>
  );
};
export { AddGroup };

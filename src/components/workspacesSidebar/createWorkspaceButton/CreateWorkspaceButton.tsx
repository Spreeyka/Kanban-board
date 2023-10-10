import { Plus } from "../../../assets/icons/Plus";
import styles from "./styles.module.scss";

const CreateWorkspaceButton = ({ onClickHandler }: { onClickHandler: () => void }) => {
  return (
    <>
      <button className={styles.button} onClick={onClickHandler}>
        <Plus />
        Create workspace
      </button>
    </>
  );
};
export { CreateWorkspaceButton };

import { TickIcon } from "../../../assets/icons/Tick";
import styles from "./styles.module.scss";

const SaveWorkspaceButton = ({ onClickHandler }: { onClickHandler: () => void }) => {
  return (
    <>
      <button className={styles.button} onClick={onClickHandler}>
        <TickIcon />
        Save workspace
      </button>
    </>
  );
};
export { SaveWorkspaceButton };

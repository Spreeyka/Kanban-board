import { DeleteIcon } from "../../../../assets/icons/Delete";
import { EditIcon } from "../../../../assets/icons/Edit";
import styles from "./styles.module.scss";
import IconButton from "@mui/material/IconButton";

const Task = () => {
  return (
    <li tabIndex={0}>
      <div className={styles.gridItemHeader}>
        <p>Create a video for Acme</p>
        <IconButton aria-label="edit" sx={{ padding: 0 }}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" sx={{ padding: 0 }}>
          <DeleteIcon />
        </IconButton>
      </div>
    </li>
  );
};
export { Task };

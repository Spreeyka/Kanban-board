import { IconButton } from "@mui/material";
import { Dispatch, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { DeleteIcon } from "../../../assets/icons/Delete";
import { EditIcon } from "../../../assets/icons/Edit";
import { TickIcon } from "../../../assets/icons/Tick";
import { WorkspaceIcon } from "../../../assets/icons/Workspace";
import useHover from "../../../hooks/useHovered";
import { deleteWorkspace, editWorkspace } from "../../../store/slices";
import styles from "./styles.module.scss";

interface WorkspaceButtonProps {
  workspaceName: string;
  index: string;
  setWorkspacePlaceholder: Dispatch<React.SetStateAction<boolean>>;
}

const WorkspaceButton: React.FC<WorkspaceButtonProps> = ({ workspaceName, index, setWorkspacePlaceholder }) => {
  const { hovered, handleMouseIn, handleMouseOut } = useHover();
  const [text, setText] = useState(workspaceName);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();

  const handleEditClick = () => {
    setIsEditing(true);

    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 0);
  };

  const handleSaveClick = () => {
    dispatch(editWorkspace({ workspaceIndex: index, newName: text }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    setIsEditing(false);
    setWorkspacePlaceholder(false);
    dispatch(deleteWorkspace(index));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setText(event.target.value);
  };

  // TODO:
  // naprawić działanie dodawania workspace
  // Usuwanie workspace

  return (
    <>
      <button className={styles.button} onMouseOver={handleMouseIn} onMouseOut={handleMouseOut}>
        <div style={{ display: "flex" }}>
          <WorkspaceIcon />
        </div>

        {isEditing ? (
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              value={text}
              onChange={handleChange}
              onBlur={handleSaveClick}
              className={styles.customInput}
              maxLength={20}
              spellCheck="false"
              ref={inputRef}
            />
            <IconButton
              aria-label="finish editing"
              onClick={handleSaveClick}
              size="large"
              component="div"
              sx={{
                padding: 0,
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <TickIcon fill="green" />
            </IconButton>
          </div>
        ) : (
          <div style={{ display: "flex", padding: "4px", flex: 1 }}>{workspaceName}</div>
        )}

        <div
          className={styles.buttonGroup}
          style={{ display: hovered && !isEditing ? "flex" : "none" }}
          // onFocus={() => setIsFocused(true)} // Handle focus event
          // onBlur={() => setIsFocused(false)}
        >
          <IconButton aria-label="edit" sx={{ padding: 0 }} component="div" onClick={handleEditClick}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" sx={{ padding: 0 }} component="div" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </div>
      </button>
    </>
  );
};
export { WorkspaceButton };

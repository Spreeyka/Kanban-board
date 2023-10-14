import { IconButton } from "@mui/material";
import { Dispatch, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteIcon } from "../../../assets/icons/Delete";
import { EditIcon } from "../../../assets/icons/Edit";

import { WorkspaceIcon } from "../../../assets/icons/Workspace";
import { deleteWorkspace, editWorkspace, selectWorkspaces } from "../../../store/slices";
import styles from "./styles.module.scss";
import { EditConfirmButton } from "../../Kanban/taskGroup/components/editConfirmButton";

interface WorkspaceButtonProps {
  workspaceName: string;
  workspaceId: string;
  setWorkspacePlaceholder: Dispatch<React.SetStateAction<boolean>>;
  setActiveWorkspace: Dispatch<React.SetStateAction<string>>;
  activeWorkspace: string;
}

const WorkspaceButton: React.FC<WorkspaceButtonProps> = ({
  workspaceName,
  workspaceId,
  setWorkspacePlaceholder,
  setActiveWorkspace,
  activeWorkspace,
}) => {
  const [text, setText] = useState(workspaceName);
  const [isEditing, setIsEditing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useDispatch();
  const workspaces = useSelector(selectWorkspaces);

  const handleEditClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsEditing(true);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 0);
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>) => {
    e.stopPropagation();
    dispatch(editWorkspace({ workspaceId: workspaceId, newName: text }));
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const firstWorkspace = Object.keys(workspaces).find((workspace) => workspaceId != workspace);
    if (!firstWorkspace) return;
    setIsEditing(false);
    setWorkspacePlaceholder(false);
    dispatch(deleteWorkspace(workspaceId));
    setActiveWorkspace(firstWorkspace);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.stopPropagation();
    setText(e.target.value);
  };

  return (
    <>
      <button
        className={styles.button}
        style={{ backgroundColor: activeWorkspace === workspaceId ? "#f4f7fe" : "transparent" }}
        onClick={() => setActiveWorkspace(workspaceId)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
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

            <EditConfirmButton onClick={handleSaveClick} />
          </div>
        ) : (
          <div style={{ display: "flex", padding: "4px", flex: 1 }}>{workspaceName}</div>
        )}

        <div className={styles.buttonGroup} style={{ opacity: (isFocused || isHovered) && !isEditing ? "1" : "0" }}>
          <IconButton
            aria-label="edit"
            sx={{ border: 0, padding: "6px", borderRadius: 0 }}
            component="div"
            role="button"
            onClick={handleEditClick}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            role="button"
            sx={{ border: 0, padding: "6px", borderRadius: 0 }}
            component="div"
            onClick={handleDelete}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </button>
    </>
  );
};
export { WorkspaceButton };

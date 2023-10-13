import { useRef, useState } from "react";

import IconButton from "@mui/material/IconButton";
import { DeleteIcon } from "../../../../assets/icons/Delete";
import { EditIcon } from "../../../../assets/icons/Edit";
import { TickIcon } from "../../../../assets/icons/Tick";
import { deleteSubtask, editSubtaskName, selectSubtaskState, toggleSubtaskState } from "../../../../store/slices";
import { Subtask as SubtaskType } from "../../../../store/slices/types";
import styles from "./styles.module.scss";

import { useDispatch, useSelector } from "react-redux";
import { CustomToggleButton } from "../components/toggleButton";

const Subtask = ({
  subtask,
  workspaceId,
  taskGroupId,
  taskId,
}: {
  subtask: SubtaskType;
  workspaceId: string;
  taskGroupId: string;
  taskId: string;
}) => {
  const dispatch = useDispatch();
  const subtaskId = subtask.id;
  const [text, setText] = useState(subtask.name);
  const [isEditing, setIsEditing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isSubtaskDone = useSelector(selectSubtaskState(workspaceId, taskGroupId, taskId, subtaskId));

  const handleRemoveTask = () => {
    dispatch(deleteSubtask({ workspaceId, taskGroupId, taskId, subtaskId }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.stopPropagation();
    setText(e.target.value);
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>) => {
    e.stopPropagation();
    dispatch(
      editSubtaskName({
        workspaceId,
        taskGroupId,
        taskId,
        subtaskId,
        newName: text,
      })
    );
    setIsEditing(false);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsEditing(true);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 0);
  };

  return (
    <li
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.gridItemHeader}>
        {isEditing ? (
          <div style={{ display: "flex", gap: "6px", flex: 1 }}>
            <input
              value={text}
              style={{ width: `${text.length}ch` }}
              onChange={handleChange}
              onBlur={handleSaveClick}
              className={styles.customInput}
              maxLength={22}
              spellCheck="false"
              ref={inputRef}
            />
          </div>
        ) : (
          <>
            <p className={styles.namePlaceholder}>{subtask.name}</p>
          </>
        )}

        {isEditing ? (
          <IconButton
            aria-label="finish editing"
            onClick={handleSaveClick}
            size="large"
            component="div"
            sx={{
              marginLeft: "4px",
              padding: "6px",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <TickIcon fill="green" />
          </IconButton>
        ) : (
          <div
            className={styles.buttonGroup}
            style={{
              opacity: (isFocused || isHovered) && !isEditing ? 1 : 0,
            }}
          >
            <IconButton aria-label="edit" sx={{ border: 0, padding: "6px", borderRadius: 0 }} onClick={handleEditClick}>
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              sx={{ border: 0, padding: "6px", borderRadius: 0 }}
              onClick={handleRemoveTask}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        )}
        {!isEditing && (
          <CustomToggleButton
            selected={isSubtaskDone}
            onChange={() => {
              dispatch(
                toggleSubtaskState({
                  workspaceId,
                  taskGroupId,
                  taskId,
                  subtaskId,
                })
              );
            }}
          />
        )}
      </div>
    </li>
  );
};
export { Subtask };

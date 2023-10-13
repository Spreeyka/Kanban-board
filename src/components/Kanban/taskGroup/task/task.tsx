import { useRef, useState } from "react";
import { DeleteIcon } from "../../../../assets/icons/Delete";
import { EditIcon } from "../../../../assets/icons/Edit";
import {
  editTaskName,
  deleteTask,
  selectSubtasksForTask,
  toggleTaskState,
  selectTaskState,
} from "../../../../store/slices";
import { Task as TaskType } from "../../../../store/slices/types";
import styles from "./styles.module.scss";
import IconButton from "@mui/material/IconButton";

import { useDispatch, useSelector } from "react-redux";
import { TickIcon } from "../../../../assets/icons/Tick";
import { Subtask } from "../subtask/subtask";
import { CustomToggleButton } from "../components/toggleButton";

const Task = ({ task, workspaceId, taskGroupId }: { task: TaskType; workspaceId: string; taskGroupId: string }) => {
  const dispatch = useDispatch();
  const taskId = task.id;
  const [text, setText] = useState(task.name);
  const [isEditing, setIsEditing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isTaskDone = useSelector(selectTaskState(workspaceId, taskGroupId, taskId));

  const handleRemoveTask = () => {
    dispatch(deleteTask({ workspaceId, taskGroupId, taskId }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.stopPropagation();
    setText(e.target.value);
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>) => {
    e.stopPropagation();
    console.log("text", text);
    dispatch(editTaskName({ workspaceId, taskGroupId, taskId, newTaskName: text }));
    setIsEditing(false);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsEditing(true);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 0);
  };

  const subtasks = useSelector(selectSubtasksForTask(workspaceId, taskGroupId, taskId));

  return (
    <li style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div
        className={styles.gridItemHeader}
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isEditing ? (
          <div style={{ display: "flex", gap: "6px", flex: "1" }}>
            <input
              value={text}
              //trick to make input grow
              style={{ width: `${text.length}ch` }}
              onChange={handleChange}
              onBlur={handleSaveClick}
              className={styles.customInput}
              maxLength={38}
              spellCheck="false"
              ref={inputRef}
            />
          </div>
        ) : (
          <>
            <p className={styles.namePlaceholder}>{task.name}</p>
          </>
        )}

        {isEditing ? (
          <IconButton
            aria-label="finish editing"
            onClick={handleSaveClick}
            size="large"
            component="div"
            sx={{
              border: 0,
              padding: "6px",
              borderRadius: 0,
              "&:hover": {
                backgroundColor: "lightgreen",
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
            style={{ marginLeft: -6 }}
            selected={isTaskDone}
            onChange={() => {
              dispatch(
                toggleTaskState({
                  workspaceId,
                  taskGroupId,
                  taskId,
                })
              );
            }}
          />
        )}
      </div>
      {Object.values(subtasks).length > 0 && (
        <ul className={styles.subtaskList}>
          {Object.values(subtasks).map((subtask) => (
            <Subtask
              key={subtask.id}
              subtask={subtask}
              workspaceId={workspaceId}
              taskGroupId={taskGroupId}
              taskId={task.id}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
export { Task };

import { useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { DeleteIcon } from "../../../../assets/icons/Delete";
import { EditIcon } from "../../../../assets/icons/Edit";
import { editTaskName, deleteTask, toggleTaskState, selectTaskState } from "../../../../store/slices";
import { CustomToggleButton } from "../components/toggleButton";
import { EditConfirmButton } from "../components/editConfirmButton";
import { Task as TaskType } from "../../../../store/slices/types";
import styles from "./styles.module.scss";

interface TaskProps {
  task: TaskType;
  workspaceId: string;
  taskGroupId: string;
  setIsTaskDragging: (isDragging: boolean) => void;
}

const Task: React.FC<TaskProps> = ({ task, workspaceId, taskGroupId, setIsTaskDragging }) => {
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " ") {
      e.stopPropagation();
    }
    if (e.key === "Enter") {
      e.stopPropagation();
      inputRef.current?.blur();
    }
  };

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: taskId });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : undefined,
    paddingLeft: task.depth > 0 ? "20px" : 0,
  };

  useEffect(() => {
    setIsTaskDragging(isDragging);
  }, [isDragging, setIsTaskDragging]);

  return (
    <li className={styles.flexSpaced} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        className={styles.gridItemHeader}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isEditing ? (
          <input
            value={text}
            //trick to make input grow
            className={styles.customInput}
            style={{ width: `${text.length}ch` }}
            onFocus={(e) => e.target.select()}
            onChange={handleChange}
            onBlur={handleSaveClick}
            maxLength={38}
            spellCheck="false"
            ref={inputRef}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <>
            <p className={styles.namePlaceholder}>{task.name}</p>
          </>
        )}

        {isEditing ? (
          <EditConfirmButton onClick={handleSaveClick} />
        ) : (
          <div
            className={styles.buttonGroup}
            style={{
              opacity: (isFocused || isHovered) && !isEditing ? 1 : 0,
            }}
          >
            <IconButton
              aria-label="edit"
              sx={{ border: 0, padding: "6px", borderRadius: 0 }}
              onClick={handleEditClick}
              onKeyDown={handleKeyDown}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              sx={{ border: 0, padding: "6px", borderRadius: 0 }}
              onClick={handleRemoveTask}
              onKeyDown={handleKeyDown}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        )}
        {!isEditing && (
          <CustomToggleButton
            style={{ marginLeft: -6 }}
            selected={isTaskDone}
            onKeyDown={handleKeyDown}
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
    </li>
  );
};
export { Task };

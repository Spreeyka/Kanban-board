import { useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
import { Subtask } from "../subtask/subtask";
import { CustomToggleButton } from "../components/toggleButton";
import { EditConfirmButton } from "../components/editConfirmButton";
import styles from "./styles.module.scss";

const Task = ({ task, workspaceId, taskGroupId }: { task: any; workspaceId: string; taskGroupId: string }) => {
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

  const subtasks = useSelector(selectSubtasksForTask(workspaceId, taskGroupId, taskId));

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: taskId });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : undefined,
    paddingLeft: task.depth > 0 ? "20px" : 0,
  };

  return (
    <li className={styles.flexSpaced} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        className={styles.gridItemHeader}
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isEditing ? (
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
      {/* {Object.values(subtasks).length > 0 && (
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
      )} */}
    </li>
  );
};
export { Task };

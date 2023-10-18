import { IconButton } from "@mui/material";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteIcon } from "../../../assets/icons/Delete";
import { EditIcon } from "../../../assets/icons/Edit";
import { Plus } from "../../../assets/icons/Plus";
import {
  addTask,
  countDoneTasksAndSubtasks,
  deleteTaskGroup,
  editTaskGroupName,
  selectTasksList,
} from "../../../store/slices";
import { TaskGroup as TaskGroupType } from "../../../store/slices/types";
import { AddListButton } from "./components/AddListButton";
import { EditConfirmButton } from "./components/editConfirmButton";
import styles from "./styles.module.scss";
import { Task } from "./task/task";

import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskGroupProps {
  workspaceId: string;
  taskGroupId: string;
  taskGroup: TaskGroupType;
  isTaskDragging: boolean;
  setIsTaskDragging: (isDragging: boolean) => void;
}

const TaskGroup: React.FC<TaskGroupProps> = ({
  workspaceId,
  taskGroupId,
  taskGroup,
  isTaskDragging,
  setIsTaskDragging,
}) => {
  const dispatch = useDispatch();
  const doneTasks = useSelector(countDoneTasksAndSubtasks(workspaceId, taskGroupId));
  const taskList = useSelector(selectTasksList(workspaceId, taskGroupId));

  const [text, setText] = useState(taskGroup.name);
  const [isEditing, setIsEditing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addTaskToGroup = () => {
    const taskName = "New Task";
    dispatch(addTask({ workspaceId, taskGroupId, taskName }));
  };

  const handleRemoveTask = () => {
    dispatch(deleteTaskGroup({ workspaceId, taskGroupId }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.stopPropagation();
    setText(e.target.value);
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>) => {
    e.stopPropagation();
    dispatch(editTaskGroupName({ workspaceId, taskGroupId, newTaskGroupName: text }));
    setIsEditing(false);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsEditing(true);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 0);
  };

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: taskGroupId });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : undefined,
    backgroundColor: isTaskDragging && isHovered ? "rgba(144, 238, 144, 0.7)" : "unset",
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

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={styles.taskGroupWrapper}
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.flexColumn}>
          <div className={styles.flexSpaced}>
            {isEditing ? (
              <input
                value={text}
                //trick to make input grow
                style={{ width: `${text.length}ch` }}
                onFocus={(e) => e.target.select()}
                onChange={handleChange}
                onBlur={handleSaveClick}
                className={styles.customInput}
                maxLength={38}
                spellCheck="false"
                ref={inputRef}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <p className={styles.taskGroupName}>{taskGroup.name}</p>
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
          </div>
          <p className={styles.taskDoneDescription}>{doneTasks} tasks done</p>
        </div>
        <SortableContext items={taskList} strategy={verticalListSortingStrategy}>
          <ul className={styles.taskList}>
            {taskList.map((task) => (
              <Task
                key={task.id}
                task={task}
                workspaceId={workspaceId}
                taskGroupId={taskGroupId}
                setIsTaskDragging={setIsTaskDragging}
              />
            ))}
          </ul>
        </SortableContext>

        <div className={styles.addListButtonWrapper}>
          <AddListButton onClick={addTaskToGroup} handleKeyDown={handleKeyDown}>
            <Plus fill="#88819F" /> Add a card
          </AddListButton>
        </div>
      </div>
    </>
  );
};
export { TaskGroup };

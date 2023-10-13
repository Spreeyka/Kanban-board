import { useDispatch, useSelector } from "react-redux";
import { Plus } from "../../../assets/icons/Plus";
import {
  addTask,
  countDoneTasksAndSubtasks,
  deleteTaskGroup,
  editTaskGroupName,
  selectTasksForTaskGroup,
} from "../../../store/slices";
import { AddListButton } from "../../KanbanBoard/components/AddListButton";
import styles from "./styles.module.scss";
import { Task } from "./task/task";
import { TaskGroup as TaskGroupType } from "../../../store/slices/types";
import { useRef, useState } from "react";
import { IconButton } from "@mui/material";
import { TickIcon } from "../../../assets/icons/Tick";
import { EditIcon } from "../../../assets/icons/Edit";
import { DeleteIcon } from "../../../assets/icons/Delete";

const TaskGroup = ({
  workspaceId,
  taskGroupId,
  taskGroup,
}: {
  workspaceId: string;
  taskGroupId: string;
  taskGroup: TaskGroupType;
}) => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasksForTaskGroup(workspaceId, taskGroupId));
  const [text, setText] = useState(taskGroup.name);
  const [isEditing, setIsEditing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addTaskToGroup = () => {
    const taskName = "New Task";
    dispatch(addTask({ workspaceId, taskGroupId, taskName }));
  };

  const { doneTasks, doneSubtasks } = useSelector(countDoneTasksAndSubtasks(workspaceId, taskGroupId));

  const handleRemoveTask = () => {
    dispatch(deleteTaskGroup({ workspaceId, taskGroupId }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.stopPropagation();
    setText(e.target.value);
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>) => {
    e.stopPropagation();
    console.log("text", text);
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

  // style schować do klas, te które są inline
  // ujednolicić outline wszędzie
  // ujednolicić hovery radius do ikonek
  // powiększyć button do dodawania kolejnej listy
  // naprawić bug, że nie targetuje taska (ale subtaska już targetuje)
  // powiększyć paddingi buttonów z workspace button

  // instalacja React D&D kit
  // Dodanie kontekstów
  // Dodanie przeciągania dla grup
  // Dodanie przeciągania dla tasków
  // Dodanie przeciągania dla subtasków
  // Dodanie ładnego indykatora, że można przeciągnie do taska lub subtaska

  // Dodanie przeciągania do innego workspace
  // Zapisywanie stanu w local storage

  return (
    <>
      <div
        className={styles.taskGroupWrapper}
        style={{ display: "flex" }}
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
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
              <p className={styles.taskGroupName}>{taskGroup.name}</p>
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
                <IconButton
                  aria-label="edit"
                  sx={{ border: 0, padding: "6px", borderRadius: 0 }}
                  onClick={handleEditClick}
                >
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
          </div>
          <p className={styles.taskDoneDescription}>{doneTasks + doneSubtasks} tasks done</p>
        </div>

        <ul className={styles.taskList}>
          {Object.values(tasks).map((task) => (
            <Task key={task.id} task={task} workspaceId={workspaceId} taskGroupId={taskGroupId} />
          ))}
        </ul>
        <div className={styles.addListButtonWrapper}>
          <AddListButton onClick={addTaskToGroup}>
            <Plus fill="#88819F" /> Add a card
          </AddListButton>
        </div>
      </div>
    </>
  );
};
export { TaskGroup };

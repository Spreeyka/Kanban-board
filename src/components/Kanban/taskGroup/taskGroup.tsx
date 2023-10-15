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
  getAllTasksInWorkspace,
  reorderTasks,
  selectTasksList,
} from "../../../store/slices";
import { TaskGroup as TaskGroupType } from "../../../store/slices/types";
import { AddListButton } from "../../KanbanBoard/components/AddListButton";
import { EditConfirmButton } from "./components/editConfirmButton";
import styles from "./styles.module.scss";
import { Task } from "./task/task";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";
import { RootState } from "../../../store/store";

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
  const doneTasks = useSelector(countDoneTasksAndSubtasks(workspaceId, taskGroupId));

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
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const taskList = useSelector(selectTasksList(workspaceId, taskGroupId));

  console.log("taskList", taskList);

  // Można pomniejszyć task, jeśli będzie w odpowiednich koordynatach
  // Dzięki temu będzie widoczne, gdzie wyląduje

  function handleDragEnd(event: DragEndEvent) {
    console.log("event", event);
    const { active, over } = event;

    if (active.id === over?.id) return;

    // tutaj nie znajdzie takiego taska, bo on jest w innym kontenerze !

    // const sourceTask = allTasks.find((task) => task.id === active.id);
    // const targetTask = allTasks.find((task) => task.id === over.id);

    const oldIndex = taskList.findIndex((task) => task.id === active.id);
    const newIndex = taskList.findIndex((task) => task.id === over?.id);

    dispatch(
      reorderTasks({
        workspaceId,
        taskGroupId,
        oldIndex,
        newIndex,
      })
    );
  }

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
                onChange={handleChange}
                onBlur={handleSaveClick}
                className={styles.customInput}
                maxLength={38}
                spellCheck="false"
                ref={inputRef}
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
          <p className={styles.taskDoneDescription}>{doneTasks} tasks done</p>
        </div>

        {/* <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}> */}
        <SortableContext items={taskList} strategy={verticalListSortingStrategy}>
          <ul className={styles.taskList}>
            {taskList.map((task) => (
              <Task key={task.id} task={task} workspaceId={workspaceId} taskGroupId={taskGroupId} />
            ))}
          </ul>
        </SortableContext>
        {createPortal(
          <DragOverlay>
            <div>123</div>
          </DragOverlay>,
          document.body
        )}
        {/* </DndContext> */}

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

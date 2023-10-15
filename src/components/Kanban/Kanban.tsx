import { useDispatch, useSelector } from "react-redux";
import { AddGroup } from "./addGroup/addGroup";
import styles from "./styles.module.scss";

import {
  getAllTasksInWorkspace,
  reorderTaskGroups,
  reorderTasks,
  selectTaskGroupsList,
  transformDataSelector,
} from "../../store/slices";
import { TaskGroup } from "./taskGroup/taskGroup";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { RootState } from "../../store/store";
import { useState } from "react";

import { UseCustomDetection } from "../../hooks/useCustomDetection";
import { createPortal } from "react-dom";

const Kanban = ({ activeWorkspace }: { activeWorkspace: string }) => {
  const taskGroups = useSelector(selectTaskGroupsList(activeWorkspace));
  const dispatch = useDispatch();

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

  const allTasks = useSelector((state: RootState) => getAllTasksInWorkspace(state, activeWorkspace));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    const itemNotMoved = active.id === over?.id;
    if (itemNotMoved) return;

    const sourceTaskIndex = allTasks.findIndex((task) => task.id === active.id);
    const targetTaskIndex = allTasks.findIndex((task) => task.id === over?.id);
    const sourceGroupIndex = taskGroups.findIndex((taskGroup) => taskGroup.id === active.id);
    const targetGroupIndex = taskGroups.findIndex((taskGroup) => taskGroup.id === over?.id);

    const groupsMoving = sourceGroupIndex !== -1 && targetGroupIndex !== -1;
    const tasksMoving = sourceTaskIndex !== -1 && targetTaskIndex !== -1;

    console.log("sourceTaskIndex", sourceTaskIndex);
    console.log("targetTaskIndex", targetTaskIndex);

    console.log("allTasks", allTasks);

    const sourceTask = allTasks.find((task) => task.id === active.id);
    const targetTask = allTasks.find((task) => task.id === over.id);

    const moveInSingleGroup = sourceTask?.taskGroupId === targetTask?.taskGroupId;
    console.log("moveInSingleGroup", moveInSingleGroup);
    // Dodać warunek, że taski poruszane w obrębie tego samego kontenera
    // Dodać warunek, że taski poruszane w różnych kontenerach

    if (tasksMoving) {
      if (moveInSingleGroup) {
        console.log("taski poruszane");
        const groupIdOfGivenTask = allTasks.find((task) => task.id === over?.id)?.taskGroupId;
        const tasksForGivenGroup = allTasks.filter((task) => task.taskGroupId === groupIdOfGivenTask);

        const sourceTaskIndex = tasksForGivenGroup.findIndex((task) => task.id === active.id);
        const targetTaskIndex = tasksForGivenGroup.findIndex((task) => task.id === over?.id);

        dispatch(
          reorderTasks({
            workspaceId: activeWorkspace,
            taskGroupId: groupIdOfGivenTask,
            oldIndex: sourceTaskIndex,
            newIndex: targetTaskIndex,
          })
        );
      } else {
        // TODO:
        // reducer, który przenosi taska z jednej grupy do drugiej
        // overlay będzie konieczny z komponentem prezentacyjnym
      }
    }

    if (groupsMoving) {
      console.log("grupy poruszane");
      const targetGroupIndex = taskGroups.findIndex((taskGroup) => taskGroup.id === over?.id);

      dispatch(
        reorderTaskGroups({
          workspaceId: activeWorkspace,
          oldIndex: sourceGroupIndex,
          newIndex: targetGroupIndex,
        })
      );
    }

    setActiveId(null);
  }

  // Dodanie przeciągania do innego workspace
  // Zapisywanie stanu w local storage
  // Deploy na vercel

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const organizedTasks = useSelector(transformDataSelector);
  const collisionDetectionStrategy = UseCustomDetection(organizedTasks, activeId);

  return (
    <>
      <div className={styles.grid}>
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetectionStrategy}
          onDragEnd={handleDragEnd}
          onDragStart={({ active }) => {
            setActiveId(active.id);
          }}
        >
          <SortableContext items={taskGroups} strategy={horizontalListSortingStrategy}>
            {taskGroups.map((taskGroup) => (
              <TaskGroup
                key={taskGroup.id}
                workspaceId={activeWorkspace}
                taskGroupId={taskGroup.id}
                taskGroup={taskGroup}
                activeId={activeId}
              />
            ))}
          </SortableContext>
          {createPortal(<DragOverlay>{activeId ? <div>123</div> : null}</DragOverlay>, document.body)}
        </DndContext>
        <AddGroup activeWorkspace={activeWorkspace} />
      </div>
    </>
  );
};
export { Kanban };

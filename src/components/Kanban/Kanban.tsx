import { useDispatch, useSelector } from "react-redux";
import { AddGroup } from "./addGroup/addGroup";
import styles from "./styles.module.scss";

import {
  getAllTasksInWorkspace,
  moveTask,
  reorderTaskGroups,
  reorderTasks,
  selectTaskGroupsList,
  transformDataSelector,
} from "../../store/slices";
import { TaskGroup } from "./taskGroup/taskGroup";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DropAnimation,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import { RootState } from "../../store/store";

import { createPortal } from "react-dom";
import { UseCustomDetection } from "../../hooks/useCustomDetection";

import { TaskMock } from "./taskGroup/task/taskOverlay";
import { coordinateGetter } from "./utils/coordinateGetter";

const Kanban = ({ activeWorkspace }: { activeWorkspace: string }) => {
  const dispatch = useDispatch();
  const taskGroups = useSelector(selectTaskGroupsList(activeWorkspace));
  const allTasks = useSelector((state: RootState) => getAllTasksInWorkspace(state, activeWorkspace));

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    const itemNotMoved = active.id === over?.id;
    if (itemNotMoved) return;

    const sourceTaskIndex = allTasks.findIndex((task) => task.id === active.id);

    const sourceGroupIndex = taskGroups.findIndex((taskGroup) => taskGroup.id === active.id);
    const targetGroupIndex = taskGroups.findIndex((taskGroup) => taskGroup.id === over?.id);

    const groupsMoving = sourceGroupIndex !== -1 && targetGroupIndex !== -1;
    const tasksMoving = sourceTaskIndex !== -1;

    const sourceTask = allTasks.find((task) => task.id === active.id);
    const targetTask = allTasks.find((task) => task.id === over?.id);

    const moveInSingleGroup = sourceTask?.taskGroupId === targetTask?.taskGroupId;

    console.log("over", over.id);
    console.log("active", active.id);

    if (tasksMoving) {
      // Reorder tasks
      if (moveInSingleGroup) {
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
      }
      // Move task from one group to another one
      else if (sourceTask && targetTask) {
        dispatch(
          moveTask({
            workspaceId: activeWorkspace,
            sourceGroupId: sourceTask.taskGroupId,
            destinationGroupId: targetTask.taskGroupId,
            taskId: sourceTask.id,
          })
        );
      }
      // Move task from one group to another group, which is empty
      else if (sourceTask && over) {
        dispatch(
          moveTask({
            workspaceId: activeWorkspace,
            sourceGroupId: sourceTask.taskGroupId,
            destinationGroupId: over.id,
            taskId: sourceTask.id,
          })
        );
      }
    }

    // Move groups
    if (groupsMoving) {
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
  // Naprawić to, że jak klikamy w input, żeby zaznaczyć, to przeciąga
  // Deploy na vercel

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const organizedTasks = useSelector(transformDataSelector);
  const collisionDetectionStrategy = UseCustomDetection(organizedTasks, activeId);

  const taskMoving = allTasks.find((task) => task.id === activeId);

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  const [isTaskDragging, setIsTaskDragging] = useState(false);

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
                isTaskDragging={isTaskDragging}
                setIsTaskDragging={setIsTaskDragging}
              />
            ))}
          </SortableContext>
          {createPortal(
            <DragOverlay dropAnimation={dropAnimation} style={{ pointerEvents: "none" }}>
              {taskMoving ? (
                <TaskMock task={taskMoving} workspaceId={activeWorkspace} taskGroupId={taskMoving.taskGroupId} />
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
        <AddGroup activeWorkspace={activeWorkspace} />
      </div>
    </>
  );
};
export { Kanban };

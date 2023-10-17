import { DndContext } from "@dnd-kit/core";
import { useState } from "react";
import { useSelector } from "react-redux";
import "./App.scss";
import { Kanban } from "./components/Kanban/Kanban";
import { WorkspacesSidebar } from "./components/workspacesSidebar";
import {
  moveTaskGroupToNewWorkspace,
  moveTaskToNewWorkspace,
  selectTaskGroupsList,
  selectTasksList,
  selectWorkspaces,
} from "./store/slices";

import { useDispatch } from "react-redux";

import {
  getAllTasksInWorkspace,
  moveTask,
  reorderTaskGroups,
  reorderTasks,
  transformDataSelector,
} from "./store/slices";

import {
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
import { RootState } from "./store/store";

import { createPortal } from "react-dom";
import { TaskMock } from "./components/Kanban/taskGroup/task/taskMock";
import { UseCustomDetection } from "./hooks/useCustomDetection";

import { TaskGroupMock } from "./components/Kanban/taskGroup/taskGroupMock";
import { coordinateGetter } from "./components/Kanban/utils/coordinateGetter";

export const App = () => {
  const workspaces = useSelector(selectWorkspaces);
  const dispatch = useDispatch();
  const [activeWorkspace, setActiveWorkspace] = useState(Object.keys(workspaces)[0]);
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

    const groupsMoving = sourceGroupIndex !== -1;
    const tasksMoving = sourceTaskIndex !== -1;

    const sourceTask = allTasks.find((task) => task.id === active.id);
    const targetTask = allTasks.find((task) => task.id === over?.id);
    const targetWorkspaceId = Object.keys(workspaces).find((workspace) => workspace === over?.id);

    const moveInSingleGroup = sourceTask?.taskGroupId === targetTask?.taskGroupId;

    if (tasksMoving) {
      if (targetWorkspaceId) {
        dispatch(
          moveTaskToNewWorkspace({
            task: sourceTask,
            sourceWorkspaceId: activeWorkspace,
            targetWorkspaceId: targetWorkspaceId,
          })
        );
      } else if (moveInSingleGroup) {
        // Reorder tasks
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
      //move group to new workspace
      if (targetWorkspaceId) {
        console.log("Przenosimy grupę do nowego workspace");
        const sourceGroup = taskGroups.find((taskGroup) => taskGroup.id === active.id);

        dispatch(
          moveTaskGroupToNewWorkspace({
            sourceWorkspaceId: activeWorkspace,
            targetWorkspaceId: targetWorkspaceId,
            taskGroupId: sourceGroup?.id,
          })
        );
      }
      // reorder groups in same workspace
      else {
        const targetGroupIndex = taskGroups.findIndex((taskGroup) => taskGroup.id === over?.id);

        dispatch(
          reorderTaskGroups({
            workspaceId: activeWorkspace,
            oldIndex: sourceGroupIndex,
            newIndex: targetGroupIndex,
          })
        );
      }
    }

    setActiveId(null);
  }

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const organizedTasks = useSelector(transformDataSelector);
  const collisionDetectionStrategy = UseCustomDetection(organizedTasks, activeId);

  const taskMoving = allTasks.find((task) => task.id === activeId);
  const groupMoving = taskGroups.find((group) => group.id === activeId);
  const taskList = useSelector(selectTasksList(activeWorkspace || "", groupMoving?.id || ""));

  const renderProperOverlay = () => {
    if (taskMoving)
      return <TaskMock task={taskMoving} workspaceId={activeWorkspace} taskGroupId={taskMoving.taskGroupId} />;
    if (groupMoving)
      return <TaskGroupMock taskGroup={groupMoving} taskList={taskList} activeWorkspace={activeWorkspace} />;
  };

  return (
    <div className="container">
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
        onDragEnd={handleDragEnd}
        onDragStart={({ active }) => {
          setActiveId(active.id);
        }}
      >
        <WorkspacesSidebar setActiveWorkspace={setActiveWorkspace} activeWorkspace={activeWorkspace} />
        <Kanban activeWorkspace={activeWorkspace}></Kanban>
        {createPortal(
          <DragOverlay dropAnimation={dropAnimation} style={{ pointerEvents: "none" }}>
            {renderProperOverlay()}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

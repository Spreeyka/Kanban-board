import { useDispatch, useSelector } from "react-redux";
import { AddGroup } from "./addGroup/addGroup";
import styles from "./styles.module.scss";

import { reorderTaskGroups, selectTaskGroupsList } from "../../store/slices";
import { TaskGroup } from "./taskGroup/taskGroup";

import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

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

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = taskGroups.findIndex((taskGroup) => taskGroup.id === active.id);
      const newIndex = taskGroups.findIndex((taskGroup) => taskGroup.id === over?.id);

      dispatch(
        reorderTaskGroups({
          workspaceId: activeWorkspace,
          oldIndex: oldIndex,
          newIndex: newIndex,
        })
      );
    }
  }

  // pobranie kod z przykładem z indykatorem i zagnieżdżaniem

  // Dodanie przeciągania dla subtasków
  // Dodanie ładnego indykatora, że można przeciągnie do taska lub subtaska

  // Dodanie przeciągania do innego workspace
  // Zapisywanie stanu w local storage
  // Naprawa overflow tekstu, jak się doda kilka grup

  return (
    <>
      <div className={styles.grid}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={taskGroups} strategy={horizontalListSortingStrategy}>
            {taskGroups.map((taskGroup) => (
              <TaskGroup
                key={taskGroup.id}
                workspaceId={activeWorkspace}
                taskGroupId={taskGroup.id}
                taskGroup={taskGroup}
              />
            ))}
          </SortableContext>
        </DndContext>
        <AddGroup activeWorkspace={activeWorkspace} />
      </div>
    </>
  );
};
export { Kanban };

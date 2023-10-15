import { useDispatch, useSelector } from "react-redux";
import { AddGroup } from "./addGroup/addGroup";
import styles from "./styles.module.scss";

import { getAllTasksInWorkspace, reorderTaskGroups, selectTaskGroupsList } from "../../store/slices";
import { TaskGroup } from "./taskGroup/taskGroup";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { RootState } from "../../store/store";

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

    if (active.id !== over?.id) {
      const oldIndex = taskGroups.findIndex((taskGroup) => taskGroup.id === active.id);
      const newIndex = taskGroups.findIndex((taskGroup) => taskGroup.id === over?.id);

      const sourceTask = allTasks.find((task) => task.id === active.id);
      const targetTask = allTasks.find((task) => task.id === over.id);

      console.log("sourceTask", sourceTask);
      console.log("targetTask", targetTask);

      const itemOver = taskGroups.find((taskGroup) => taskGroup.id === over?.id);
      console.log("itemOver", itemOver);

      // trzeba sprawdzić, czy zgadza się grupa i zrobić ifa:
      //    - jeśli się zgadza, to robimy reorder
      //    - jeśli się nie zgadza, to usuwamy z bieżącego i dodajemy do innego

      dispatch(
        reorderTaskGroups({
          workspaceId: activeWorkspace,
          oldIndex: oldIndex,
          newIndex: newIndex,
        })
      );
    }
  }

  // Dodanie możliwości przeciągania tasków do innych grup

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

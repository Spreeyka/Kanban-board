import "./App.scss";
import { TrashableItems } from "./components/KanbanBoard/TrashableItems";
import { Kanban, KanbanCustom } from "./components/Kanban/Kanban";
import { WorkspacesSidebar } from "./components/workspacesSidebar";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectWorkspaces } from "./store/slices";
import { DndContext } from "@dnd-kit/core";

export const App = () => {
  const workspaces = useSelector(selectWorkspaces);
  const [activeWorkspace, setActiveWorkspace] = useState(Object.keys(workspaces)[0]);

  function handleDragEnd(event) {
    const { over } = event;

    console.log("przeciągamy");
  }

  return (
    <div className="container">
      <DndContext onDragEnd={handleDragEnd}>
        <WorkspacesSidebar setActiveWorkspace={setActiveWorkspace} activeWorkspace={activeWorkspace} />
        <Kanban activeWorkspace={activeWorkspace}></Kanban>
      </DndContext>
      {/* <TrashableItems confirmDrop={false} /> */}
    </div>
  );
};

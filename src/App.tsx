import "./App.scss";
import { TrashableItems } from "./components/KanbanBoard/TrashableItems";
import { Kanban, KanbanCustom } from "./components/Kanban/Kanban";
import { WorkspacesSidebar } from "./components/workspacesSidebar";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectWorkspaces } from "./store/slices";

export const App = () => {
  const workspaces = useSelector(selectWorkspaces);
  const [activeWorkspace, setActiveWorkspace] = useState(Object.keys(workspaces)[0]);

  return (
    <div className="container">
      <WorkspacesSidebar setActiveWorkspace={setActiveWorkspace} activeWorkspace={activeWorkspace} />
      <Kanban activeWorkspace={activeWorkspace}></Kanban>
      {/* <TrashableItems confirmDrop={false} /> */}
    </div>
  );
};

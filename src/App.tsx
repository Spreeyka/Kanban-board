import "./App.scss";
import { TrashableItems } from "./components/KanbanBoard/TrashableItems";
import { Kanban, KanbanCustom } from "./components/Kanban/Kanban";
import { WorkspacesSidebar } from "./components/workspacesSidebar";

export const App = () => {
  return (
    <div className="container">
      <WorkspacesSidebar />
      <Kanban></Kanban>
      {/* <TrashableItems confirmDrop={false} /> */}
    </div>
  );
};

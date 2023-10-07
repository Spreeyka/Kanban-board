import "./App.scss";
import { TrashableItems } from "./components/KanbanBoard/TrashableItems";
import { WorkspacesSidebar } from "./components/workspacesSidebar";

// dodanie d&d kit

export const App = () => {
  return (
    <div className="container">
      <WorkspacesSidebar />
      <TrashableItems confirmDrop={false} />
    </div>
  );
};

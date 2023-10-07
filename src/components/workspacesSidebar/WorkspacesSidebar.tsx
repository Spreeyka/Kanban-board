import "./WorkspacesSidebar.scss";

import { Plus } from "../../assets/icons/Plus";
import { WorkspaceIcon } from "../../assets/icons/Workspace";
import { CreateWorkspaceButton } from "./createWorkspaceButton/CreateWorkspaceButton";
import { Divider } from "./divider/Divider";
import { SidebarList } from "./sidebarList/SidebarList";
import { UserProfile } from "./userProfile";
import { WorkspaceButton } from "./workspaceButton";
import { WorkspaceSettings } from "./workspaceSettings";

export const WorkspacesSidebar = () => {
  return (
    <div className="workspaces">
      <div className="workspaces-header">
        <WorkspaceButton>
          <WorkspaceIcon />
          Acme Corp workspace
        </WorkspaceButton>
        <CreateWorkspaceButton>
          <Plus />
          Create workspace
        </CreateWorkspaceButton>
      </div>
      <Divider />
      <div className="workspaces-main">
        <SidebarList />
      </div>
      <div className="workspaces-footer">
        <UserProfile />
        <WorkspaceSettings />
      </div>
    </div>
  );
};

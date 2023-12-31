import styles from "./styles.module.scss";

import React, { Dispatch, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWorkspace, selectWorkspaces } from "../../store/slices";
import { Workspace } from "../../store/slices/types";
import { CreateWorkspaceButton } from "./createWorkspaceButton/CreateWorkspaceButton";
import { Divider } from "./divider/Divider";
import { SaveWorkspaceButton } from "./saveWorkspaceButton";
import { SidebarList } from "./sidebarList/SidebarList";
import { UserProfile } from "./userProfile";
import { WorkspaceButton } from "./workspaceButton";
import { WorkspaceSettings } from "./workspaceSettings";

export const WorkspacesSidebar = ({
  setActiveWorkspace,
  activeWorkspace,
}: {
  setActiveWorkspace: Dispatch<React.SetStateAction<string>>;
  activeWorkspace: string;
}) => {
  const [workspacePlaceholder, setWorkspacePlaceholder] = useState(false);

  const dispatch = useDispatch();

  const showPlaceholder = () => {
    setWorkspacePlaceholder((prev) => !prev);
    dispatch(addWorkspace("New Workspace Name"));
  };

  const hidePlaceholder = () => {
    setWorkspacePlaceholder((prev) => !prev);
  };

  const workspaces = useSelector(selectWorkspaces);

  return (
    <div className={styles.workspaces}>
      <div className={styles.workspacesHeader}>
        {Object.values(workspaces).map((workspace: Workspace) => (
          <WorkspaceButton
            key={workspace.id}
            workspaceName={workspace.name}
            workspaceId={workspace.id}
            setWorkspacePlaceholder={setWorkspacePlaceholder}
            activeWorkspace={activeWorkspace}
            setActiveWorkspace={setActiveWorkspace}
          ></WorkspaceButton>
        ))}
        {workspacePlaceholder ? (
          <SaveWorkspaceButton onClickHandler={hidePlaceholder} />
        ) : (
          <CreateWorkspaceButton onClickHandler={showPlaceholder} />
        )}
      </div>
      <Divider />
      <div className={styles.workspacesMain}>
        <SidebarList />
      </div>
      <div className={styles.workspacesFooter}>
        <UserProfile />
        <WorkspaceSettings />
      </div>
    </div>
  );
};

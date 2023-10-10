import styles from "./styles.module.scss";

import React, { useState } from "react";
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

export const WorkspacesSidebar = () => {
  const [workspacePlaceholder, setWorkspacePlaceholder] = useState(false);

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  console.log(state);

  const showPlaceholder = () => {
    setWorkspacePlaceholder((prev) => !prev);
    dispatch(addWorkspace("New Workspace Name"));
  };

  const hidePlaceholder = () => {
    setWorkspacePlaceholder((prev) => !prev);
  };

  const workspaces = useSelector(selectWorkspaces);

  // Usuwanie workspace
  // Nie tylko hover powinien pokazywać buttony, ale też focus

  return (
    <div className={styles.workspaces}>
      <div className={styles.workspacesHeader}>
        {workspaces.map((workspace: Workspace, index: string) => (
          <React.Fragment key={workspace.name}>
            <WorkspaceButton
              workspaceName={workspace.name}
              index={index}
              setWorkspacePlaceholder={setWorkspacePlaceholder}
            ></WorkspaceButton>
          </React.Fragment>
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

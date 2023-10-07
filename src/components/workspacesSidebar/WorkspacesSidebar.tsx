import './WorkspacesSidebar.scss';
import { UserProfile } from '../userProfile';
import { WorkspaceSettings } from '../workspaceSettings';

export const WorkspacesSidebar = () => {
  return (
    <div className='workspaces'>
      <div className="workspaces-header"></div>
      <div className="workspaces-main"></div>
      <div className="workspaces-footer">
        <UserProfile />
        <WorkspaceSettings/>
      </div>
    </div>
  )
}

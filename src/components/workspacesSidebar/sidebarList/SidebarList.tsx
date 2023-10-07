import { BoardsIcon } from "../../../assets/icons/Boards";
import { DashboardIcon } from "../../../assets/icons/Dashboard";
import { ProfileIcon } from "../../../assets/icons/Profile";
import { SearchIcon } from "../../../assets/icons/Search";
import styles from "./styles.module.scss";

const sidebarItems = [
  { icon: <DashboardIcon />, text: "Dashboard" },
  { icon: <BoardsIcon />, text: "Boards" },
  { icon: <ProfileIcon />, text: "Profile" },
  { icon: <SearchIcon />, text: "Search" },
];

const SidebarList = () => {
  return (
    <>
      <ul className={styles.sidebarList}>
        {sidebarItems.map((item) => (
          <li key={item.text}>
            <button>
              {item.icon}
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};
export { SidebarList };

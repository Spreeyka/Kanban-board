import { ReactNode } from "react";
import styles from "./styles.module.scss";

const CreateWorkspaceButton = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <button className={styles.button}>{children}</button>
    </>
  );
};
export { CreateWorkspaceButton };

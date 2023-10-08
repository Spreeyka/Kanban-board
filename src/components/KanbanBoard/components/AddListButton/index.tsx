import { ReactNode } from "react";
import { Plus } from "../../../../assets/icons/Plus";
import styles from "./styles.module.scss";

const AddListButton = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <button className={styles.button}>{children}</button>
    </>
  );
};
export { AddListButton };

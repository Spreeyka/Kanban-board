import { MouseEvent, ReactNode } from "react";
import styles from "./styles.module.scss";

const AddListButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <>
      <button className={styles.button} onClick={onClick}>
        {children}
      </button>
    </>
  );
};
export { AddListButton };

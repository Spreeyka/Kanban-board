import { MouseEvent, ReactNode } from "react";
import styles from "./styles.module.scss";

const AddListButton = ({
  children,
  onClick,
  handleKeyDown,
}: {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  handleKeyDown?: (e: React.KeyboardEvent) => void;
}) => {
  return (
    <>
      <button className={styles.button} onClick={onClick} onKeyDown={handleKeyDown}>
        {children}
      </button>
    </>
  );
};
export { AddListButton };

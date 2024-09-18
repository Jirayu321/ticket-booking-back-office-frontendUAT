import { FC, ReactNode } from "react";
// import Sidebar from "../../Sidebar/Sidebar";
import styles from "./container.module.css";
import Sidebars from "../../Sidebar/Sidebars";

type ContainerProp = {
  children: ReactNode;
};

const Container: FC<ContainerProp> = ({ children }) => {
  return (
    <div className={styles.container}>
      {/* <Sidebar /> */}
      <Sidebars />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Container;

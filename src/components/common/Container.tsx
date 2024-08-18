import { FC, ReactNode } from "react";
import Sidebar from "../Sidebar/Sidebar";

type ContainerProp = {
  children: ReactNode;
};

const Container: FC<ContainerProp> = ({ children }) => {
  return (
    <div className="flex h-[100vh] overflow-y-scroll">
      <Sidebar />
      <div className="content">{children}</div>
    </div>
  );
};

export default Container;

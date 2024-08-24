import { FC } from "react";
import styles from "./plan.module.css";

type HeaderProps = {
  onExpand: any;
  Plan_Id: number;
  Plan_Name: string;
  Plan_Desc: string;
};

const Header: FC<HeaderProps> = ({
  onExpand,
  Plan_Id,
  Plan_Name,
  Plan_Desc,
}) => {
  return (
    <header
      onClick={() => onExpand(Plan_Id, Plan_Name)}
      className={styles.header}
    >
      <h4>
        {Plan_Id}. {Plan_Name}
      </h4>
      <h4>{Plan_Desc}</h4>
    </header>
  );
};

export default Header;

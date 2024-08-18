import { FC } from "react";
import { useNavigate } from "react-router-dom";
import BackIcon from "/back.svg";

type BackButtonProp = {
  link: string;
};

const BackButton: FC<BackButtonProp> = ({ link }) => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(link);
  };
  return (
    <button className="back-button">
      <img src={BackIcon} alt="Back Icon" onClick={handleBackClick} />
    </button>
  );
};

export default BackButton;

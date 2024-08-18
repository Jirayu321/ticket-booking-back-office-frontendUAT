import './header.css';
import CarbonEvent from '/carbon-event.svg';

const Header = ({ title }) => {
  return (
    <div className="header">
      <img src={CarbonEvent} alt="Carbon Event" className="header-image" />
      <h1>{title}</h1>
    </div>
  );
};

export default Header;

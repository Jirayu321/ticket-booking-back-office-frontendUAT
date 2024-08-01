import Sidebar from '../../components/Sidebar/Sidebar'; // Adjust the path if necessary
import CreateEventForm from './create-event-form';
import './create-event.css';

const CreateNewEvent = () => {
  return (
    <div className="main-container">
      <Sidebar />
      <div className="content">
        <CreateEventForm />
      </div>
    </div>
  );
};

export default CreateNewEvent;

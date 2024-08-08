import React, { useEffect, useState } from 'react';

const EventsComponent: React.FC = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/events')
            .then((response) => response.json())
            .then((data) => setEvents(data))
            .catch((error) => console.error('Error fetching events:', error));
    }, []);

    return (
        <div>
            {events.map((event) => (
                <div key={event.Event_Id}>{event.Event_Name}</div>
            ))}
        </div>
    );
};

export default EventsComponent;

import React, { useEffect, useState } from 'react';

const EventsComponent: React.FC = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('/api/events')
            .then((response) => response.json())
            .then((data) => setEvents(data))
            .catch((error) => console.error('Error fetching events:', error));
    }, []);

    return (
        <div>
            {events.map((event) => (
                <div key={event.Event_Name}>{event.Event_Id}</div>
            ))}
        </div>
    );
};

export default EventsComponent;

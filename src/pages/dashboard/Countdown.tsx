import React, { useEffect, useState } from "react";
import "./countdown.css";

interface CountdownProps {
  initialTime: string;
  id: string;
  details: any;
}

const Countdown: React.FC<CountdownProps> = ({ initialTime, id, details }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!initialTime) return;

    const countdown = () => {
      const eventDate = new Date(initialTime).getTime();
      if (isNaN(eventDate)) {
        console.error("Invalid initialTime:", initialTime);
        return;
      }
      const now = Date.now();
      const distance = eventDate - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    countdown();
    const interval = setInterval(countdown, 1000);
    return () => clearInterval(interval);
  }, [initialTime]);

  return (
    <div className="countdown-wrapper">
      <div
        className="countdown-container"
        style={{
          backgroundImage: `url(${details?.img})`,
        }}
      >
        <div className="countdown-overlay">
          <div className="event-info">
            <h1 className="event-name">{details?.Name}</h1>
            <p className="event-location">{details?.At}</p>
          </div>

          <div className="timer-box">
            <div className="time-block">
              <p className="time-value">{timeLeft.days}</p>
              <p className="time-label">Days</p>
            </div>
            <div className="time-separator">:</div>
            <div className="time-block">
              <p className="time-value">{timeLeft.hours}</p>
              <p className="time-label">Hours</p>
            </div>
            <div className="time-separator">:</div>
            <div className="time-block">
              <p className="time-value">{timeLeft.minutes}</p>
              <p className="time-label">Minutes</p>
            </div>
            <div className="time-separator">:</div>
            <div className="time-block">
              <p className="time-value">{timeLeft.seconds}</p>
              <p className="time-label">Seconds</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Countdown;

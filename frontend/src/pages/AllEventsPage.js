import React, { useEffect, useState } from 'react';
import { getEvents } from '../api/event';
import '../pages/styles/allevents.css';

const AllEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getEvents()
      .then(setEvents)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="allevents-root">
      <h1>Все спортивные мероприятия</h1>
      {loading ? <div>Загрузка...</div> : error ? <div>Ошибка: {error}</div> : (
        <ul className="allevents-list">
          {events.map(event => (
            <li key={event.id} className="allevents-item">
              <b>{event.name}</b> — {event.location}<br/>
              {event.description && <span>{event.description}<br/></span>}
              {event.start_date && <span>Начало: {new Date(event.start_date).toLocaleString()}<br/></span>}
              {event.end_date && <span>Окончание: {new Date(event.end_date).toLocaleString()}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllEventsPage;

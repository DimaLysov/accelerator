import React, { useEffect, useState } from 'react';
import { getEventsByDate } from '../api/event';
import '../pages/styles/calendarpage.css';

function formatDate(date) {
  // Возвращает дату в формате 08-10-2025
  return date.toLocaleDateString('ru-RU').split('.').reverse().join('-').split('-').reverse().join('-');
}

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const formatted = formatDate(selectedDate);
        const events = await getEventsByDate(formatted);
        setEvents(events);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [selectedDate]);

  // Генерация дней месяца для простого календаря
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const handleDayClick = (day) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));
  };

  return (
    <div className="calendarpage-root">
      <div className="calendarpage-calendar">
        <div className="calendarpage-header">
          <b>Сентябрь 2025</b>
        </div>
        <div className="calendarpage-weekdays">
          {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="calendarpage-days">
          {Array((firstDay + 6) % 7).fill(null).map((_, i) => <div key={'empty'+i}></div>)}
          {days.map(day => (
            <div
              key={day}
              className={day === selectedDate.getDate() ? 'calendarpage-day calendarpage-day-selected' : 'calendarpage-day'}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
      <div className="calendarpage-events">
        <div className="calendarpage-events-header">
          <span>События за {formatDate(selectedDate)}</span>
        </div>
        {loading ? <div>Загрузка...</div> : error ? <div>Ошибка: {error}</div> : (
          <ul className="calendarpage-events-list">
            {events.length === 0 && <li>Нет событий</li>}
            {events.map(event => (
              <li key={event.id} className="calendarpage-event-item">
                <b>{new Date(event.start_date).toLocaleDateString()} — {new Date(event.end_date).toLocaleDateString()}</b><br/>
                <span>{event.name}</span><br/>
                {event.location && <span>📍 {event.location}<br/></span>}
                {event.description && <span>{event.description}<br/></span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;

import React, { useEffect, useState } from 'react';
import { getEventsByDate } from '../api/event';
// import { Link } from 'react-router-dom';
import '../pages/styles/mainpage.css';
import '../pages/styles/mainpage-calendar.css';
// import Header from '../components/Header';
import Hero from '../components/Hero';


function formatDate(date) {
  // Возвращает дату в формате 08-10-2025
  const d = date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

const MainPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Календарь: переключение месяца
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    getEventsByDate(formatDate(selectedDate))
      .then(setEvents)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  // Генерация дней месяца для календаря
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const handleDayClick = (day) => {
    setSelectedDate(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day));
  };
  const handlePrevMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Если выбранная дата не в текущем месяце — сбрасываем на 1 число месяца
  useEffect(() => {
    setSelectedDate(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1));
  }, [calendarMonth]);

  return (
    <div>
      <Hero subtitle="Это универсальная цифровая платформа для всех, кто интересуется спортом в нашем городе. Мы объединяем на интерактивной карте все спортивные объекты, собираем и календарим все предстоящие мероприятия и помогаем найти команду, тренировки или площадку." />
      <div className="mainpage-page">
        <div className="mainpage-container">
          <div className="mainpage-card">
            <div className="mainpage-card-inner">
              <div className="mainpage-calendar">
            <div className="mainpage-calendar-header">
              <button className="mainpage-calendar-arrow" onClick={handlePrevMonth}>&lt;</button>
              <span>{calendarMonth.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}</span>
              <button className="mainpage-calendar-arrow" onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className="mainpage-weekdays">
              {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="mainpage-days">
              {Array((firstDay + 6) % 7).fill(null).map((_, i) => <div key={'empty'+i}></div>)}
              {days.map(day => {
                const isSelected = day === selectedDate.getDate() && calendarMonth.getMonth() === selectedDate.getMonth() && calendarMonth.getFullYear() === selectedDate.getFullYear();
                const cls = `day-tile ${isSelected ? 'active' : 'inactive'}`;
                return (
                  <div key={day} className={cls} onClick={() => handleDayClick(day)}>{day}</div>
                );
              })}
            </div>
          </div>
        <div className="mainpage-events">
            <div className="mainpage-events-header">
              События за {formatDate(selectedDate)}
            </div>
            {loading ? <div>Загрузка...</div> : error ? <div>Ошибка: {error}</div> : (
              <ul className="mainpage-events-list">
                {events.length === 0 && <li>Нет событий</li>}
                {events.map(event => (
                  <li key={event.id} className="mainpage-event-item">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

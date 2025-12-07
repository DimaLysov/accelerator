import React, { useEffect, useState, useRef } from 'react';
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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [dragStartDateTemp, setDragStartDateTemp] = useState(null);
  const [dragHoverDate, setDragHoverDate] = useState(null);
  const rangeJustSetRef = useRef(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const TYPE_MAP = {
    'professional events': 'профессиональные события',
    'custom event': 'Пользовательское событие'
  };

  // Календарь: переключение месяца
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (!startDate) {
      setEvents([]);
      setLoading(false);
      return;
    }
    const start = formatDate(startDate);
    const end = formatDate(endDate || startDate);
    getEventsByDate(start, end)
      .then(setEvents)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

  // Генерация дней месяца для календаря
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const handleDayClick = (day) => {
    // Ignore click immediately after a drag selection finalized by mouseup
    if (rangeJustSetRef.current && (Date.now() - rangeJustSetRef.current) < 400) {
      rangeJustSetRef.current = 0;
      return;
    }
    const clicked = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    // Desired behavior:
    // 1) First click -> set startDate
    // 2) Second click -> set endDate so range = [min(start, clicked), max(start, clicked)]
    // 3) Third click (when range already set) -> start new selection with clicked as start
    // Also allow selecting earlier date second (e.g. click 16 then 03 -> range 03..16)

    // If there is an existing range (startDate && endDate), start a new selection
    if (startDate && endDate) {
      setStartDate(new Date(clicked.getFullYear(), clicked.getMonth(), clicked.getDate()));
      setEndDate(null);
      return;
    }

    // If no startDate -> set it
    if (!startDate) {
      setStartDate(new Date(clicked.getFullYear(), clicked.getMonth(), clicked.getDate()));
      setEndDate(null);
      return;
    }

    // Here: startDate exists and endDate is null -> this is the second click
    const s = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const c = new Date(clicked.getFullYear(), clicked.getMonth(), clicked.getDate());
    if (c.getTime() === s.getTime()) {
      // clicking same date -> keep it as single-day selection (no change)
      return;
    }
    if (c < s) {
      setStartDate(new Date(c.getFullYear(), c.getMonth(), c.getDate()));
      setEndDate(new Date(s.getFullYear(), s.getMonth(), s.getDate()));
    } else {
      setStartDate(s);
      setEndDate(new Date(c.getFullYear(), c.getMonth(), c.getDate()));
    }
  };
  const handlePrevMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Если выбранная дата не в текущем месяце — сбрасываем на 1 число месяца
  useEffect(() => {
    // when switching month, reset selection to the first day of that month
    const firstOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    setStartDate(firstOfMonth);
    setEndDate(null);
  }, [calendarMonth]);

  // Mouse drag handlers
  const handleTileMouseDown = (day, e) => {
    e.preventDefault();
    const clicked = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    setDragActive(true);
    setDragStartDateTemp(clicked);
    setDragHoverDate(clicked);
  };
  const handleTileMouseEnter = (day) => {
    if (!dragActive) return;
    const hovered = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    setDragHoverDate(hovered);
  };
  const handleMouseUpAnywhere = () => {
    if (!dragActive) return;
    if (dragStartDateTemp && dragHoverDate) {
      const s = dragStartDateTemp < dragHoverDate ? dragStartDateTemp : dragHoverDate;
      const e = dragStartDateTemp < dragHoverDate ? dragHoverDate : dragStartDateTemp;
      setStartDate(new Date(s.getFullYear(), s.getMonth(), s.getDate()));
      setEndDate(new Date(e.getFullYear(), e.getMonth(), e.getDate()));
      rangeJustSetRef.current = Date.now();
    }
    setDragActive(false);
    setDragStartDateTemp(null);
    setDragHoverDate(null);
  };

  // attach mouseup listener on mount to catch release outside tiles
  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUpAnywhere);
    return () => window.removeEventListener('mouseup', handleMouseUpAnywhere);
  }, []);

  const formatRangeLabel = () => {
    if (!startDate) return '';
    const startLabel = startDate.toLocaleDateString('ru-RU');
    if (!endDate) return startLabel;
    return `${startLabel} — ${endDate.toLocaleDateString('ru-RU')}`;
  }

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
                const tileDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
                let inRange = false;
                // during drag, highlight between dragStartDateTemp and dragHoverDate
                if (dragActive && dragStartDateTemp && dragHoverDate) {
                  const s = dragStartDateTemp < dragHoverDate ? dragStartDateTemp : dragHoverDate;
                  const e = dragStartDateTemp < dragHoverDate ? dragHoverDate : dragStartDateTemp;
                  inRange = tileDate >= s && tileDate <= e;
                } else if (startDate && endDate) {
                  inRange = tileDate >= startDate && tileDate <= endDate;
                } else if (startDate) {
                  inRange = tileDate.getTime() === new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
                }
                const cls = `day-tile ${inRange ? 'active' : 'inactive'}`;
                return (
                  <div key={day}
                    className={cls}
                    onMouseDown={(e) => handleTileMouseDown(day, e)}
                    onMouseEnter={() => handleTileMouseEnter(day)}
                    onClick={() => handleDayClick(day)}
                  >{day}</div>
                );
              })}
            </div>
          </div>
        <div className="mainpage-events">
            <div className="mainpage-events-header">
              События за {formatRangeLabel()}
            </div>
            {loading ? <div>Загрузка...</div> : error ? <div>Ошибка: {error}</div> : (
              <ul className="mainpage-events-list">
                {events.length === 0 && <li>Нет событий</li>}
                {events.map(event => (
                  <li key={event.id} className="mainpage-event-item">
                    <b>{new Date(event.start_date).toLocaleString()} — {new Date(event.end_date).toLocaleString()}</b><br/>
                    <span style={{fontWeight:700}}>{event.name}</span><br/>
                    <span style={{fontStyle:'italic', color:'#9aa'}}>Тип: {TYPE_MAP[event.type_event] || event.type_event}</span><br/>
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

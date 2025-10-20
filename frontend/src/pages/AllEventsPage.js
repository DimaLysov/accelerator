import React, { useEffect, useMemo, useState } from 'react';
import { getEvents } from '../api/event';
import { getSports } from '../api/sport';
import '../pages/styles/allevents.css';

const eventsOverlap = (evStartIso, evEndIso, from, to) => {
  if (!from && !to) return true;
  const evStart = evStartIso ? new Date(evStartIso) : null;
  const evEnd = evEndIso ? new Date(evEndIso) : evStart;
  if (from && to) return evStart <= to && evEnd >= from;
  if (from) return evEnd >= from;
  if (to) return evStart <= to;
  return true;
}

const AllEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSportId, setSelectedSportId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([getEvents(), getSports()])
      .then(([evs, sps]) => {
        setEvents(evs || []);
        setSports(sps || []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const filterFrom = dateFrom ? new Date(dateFrom) : null;
    const filterTo = dateTo ? new Date(dateTo) : null;

    return events.filter(ev => {
      if (selectedSportId) {
        if (!Array.isArray(ev.sport) || !ev.sport.some(s => String(s.id) === String(selectedSportId))) return false;
      }
      if (!eventsOverlap(ev.start_date, ev.end_date, filterFrom, filterTo)) return false;
      return true;
    });
  }, [events, selectedSportId, dateFrom, dateTo]);

  return (
    <div className="allevents-root dark-theme">
      <div className="container allevents-inner">
        <h1 className="allevents-title">Единый календарный план спортивных мероприятий города Иваново</h1>

        <div className="allevents-controls">
          <div className="control">
            <label>Вид спорта</label>
            <select className="select" value={selectedSportId} onChange={e => setSelectedSportId(e.target.value)}>
              <option value="">Все виды</option>
              {sports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="control">
            <label>Дата от</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div className="control">
            <label>Дата по</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
        </div>

        <div className="month-nav">&lt; Сентябрь 2025 &gt;</div>

        <div className="results-count">Найдено: {loading ? '...' : filtered.length} мероприятий</div>

        {loading ? (
          <div className="loader">Загрузка...</div>
        ) : error ? (
          <div className="error">Ошибка: {error}</div>
        ) : (
          <div className="events-list">
            {filtered.map(ev => (
              <article key={ev.id} className="event-card">
                <div className="card-top">
                  <div className="card-title">{ev.name}</div>
                  <div className="card-star">☆</div>
                </div>
                <div className="card-content">
                  <div>Вид спорта: {Array.isArray(ev.sport) ? ev.sport.map(s => s.name).join(', ') : '—'}</div>
                  {ev.age_group && <div>Возрастная группа: {ev.age_group}</div>}
                  {ev.start_date && <div>Начало: {new Date(ev.start_date).toLocaleString()}</div>}
                  {ev.end_date && <div>Окончание: {new Date(ev.end_date).toLocaleString()}</div>}
                  {ev.location && <div>Место проведения: {ev.location}</div>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEventsPage;

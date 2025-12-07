import React, { useEffect, useMemo, useState } from 'react';
import * as eventApi from '../api/event';
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

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString('ru-RU', { dateStyle: 'medium', timeStyle: 'short' });
  } catch (e) {
    return iso;
  }
}

const getRangeForView = (refDate, view) => {
  const from = new Date(refDate);
  from.setHours(0,0,0,0);
  let to = new Date(from);
  if (view === 'day') {
    to.setHours(23,59,59,999);
  } else if (view === 'week') {
    // week starts Monday
    const diff = (from.getDay() + 6) % 7;
    from.setDate(from.getDate() - diff);
    from.setHours(0,0,0,0);
    to = new Date(from);
    to.setDate(to.getDate() + 6);
    to.setHours(23,59,59,999);
  } else if (view === 'month') {
    from.setDate(1);
    from.setHours(0,0,0,0);
    to = new Date(from.getFullYear(), from.getMonth() + 1, 0);
    to.setHours(23,59,59,999);
  }
  return { from, to };
}

const addToDate = (date, view, delta) => {
  const d = new Date(date);
  if (view === 'day') d.setDate(d.getDate() + delta);
  else if (view === 'week') d.setDate(d.getDate() + delta * 7);
  else if (view === 'month') d.setMonth(d.getMonth() + delta);
  return d;
}

const ProfessionalEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSportId, setSelectedSportId] = useState('');
  const [view, setView] = useState('day');
  const [refDate, setRefDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0,10);
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([eventApi.getProfessionalEvents(), getSports()])
      .then(([evs, sps]) => {
        setEvents(evs || []);
        setSports(sps || []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (view === 'all') {
      return events.filter(ev => {
        if (selectedSportId) {
          if (!Array.isArray(ev.sport) || !ev.sport.some(s => String(s.id) === String(selectedSportId))) return false;
        }
        return true;
      });
    }
    const ref = refDate ? new Date(refDate) : new Date();
    const { from, to } = getRangeForView(ref, view);
    return events.filter(ev => {
      if (selectedSportId) {
        if (!Array.isArray(ev.sport) || !ev.sport.some(s => String(s.id) === String(selectedSportId))) return false;
      }
      if (!eventsOverlap(ev.start_date, ev.end_date, from, to)) return false;
      return true;
    });
  }, [events, selectedSportId, view, refDate]);

  const handlePrev = () => setRefDate(addToDate(new Date(refDate), view, -1).toISOString().slice(0,10));
  const handleNext = () => setRefDate(addToDate(new Date(refDate), view, 1).toISOString().slice(0,10));

  const displayRangeLabel = () => {
    const ref = refDate ? new Date(refDate) : new Date();
    const { from, to } = getRangeForView(ref, view);
    if (view === 'day') return from.toLocaleDateString();
    if (view === 'week') return `${from.toLocaleDateString()} — ${to.toLocaleDateString()}`;
    if (view === 'month') return `${from.toLocaleString('default', { month: 'long', year: 'numeric' })}`;
    return '';
  }

  return (
    <div className="allevents-root dark-theme">
      <div className="container allevents-inner">
        <h1 className="allevents-title">Профессиональные события</h1>

        <div className="allevents-controls">
          <div className="control">
            <label>Вид спорта</label>
            <select className="select" value={selectedSportId} onChange={e => setSelectedSportId(e.target.value)}>
              <option value="">Все виды</option>
              {sports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="control">
            <label>Вид отображения</label>
            <select className="view-select" value={view} onChange={e => setView(e.target.value)}>
              <option value="all">Все</option>
              <option value="day">День</option>
              <option value="week">Неделя</option>
              <option value="month">Месяц</option>
            </select>
          </div>
          <div className="control">
            <label>Дата</label>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <button onClick={handlePrev}>&lt;</button>
              <input type="date" value={refDate} onChange={e => setRefDate(e.target.value)} />
              <button onClick={handleNext}>&gt;</button>
            </div>
          </div>
        </div>

        <div className="month-nav">{displayRangeLabel()}</div>

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
                  {ev.description && <div className="event-desc">{ev.description}</div>}
                  <div className="card-row"><span className="card-label">Вид спорта:</span> {Array.isArray(ev.sport) ? ev.sport.map(s => s.name).join(', ') : '—'}</div>
                  {ev.age_group && <div className="card-row"><span className="card-label">Возрастная группа:</span> {ev.age_group}</div>}
                  {ev.start_date && <div className="card-row"><span className="card-label">Начало:</span> {formatDate(ev.start_date)}</div>}
                  {ev.end_date && <div className="card-row"><span className="card-label">Окончание:</span> {formatDate(ev.end_date)}</div>}
                  {ev.location && <div className="card-row"><span className="card-label">Место проведения:</span> {ev.location}</div>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalEventsPage;

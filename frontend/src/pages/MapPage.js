import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { customMarkerIcon } from '../components/customMarkerIcon';
import '../pages/styles/map.css';

const DEFAULT_CENTER = [56.999, 40.973]; // Иваново, пример
const DEFAULT_ZOOM = 12;

const MapPage = ({ cityObjects = [], sports = [], objectTypes = [] }) => {
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [selectedSportId, setSelectedSportId] = useState('');
  const [searchText, setSearchText] = useState('');

  const filteredObjects = useMemo(() => {
    return cityObjects
      .filter(obj => obj.lat && obj.lng)
      .filter(obj => {
        if (selectedTypeId === '') return true;
        return obj.object_type && String(obj.object_type.id) === String(selectedTypeId);
      })
      .filter(obj => {
        if (selectedSportId === '') return true;
        return Array.isArray(obj.sport) && obj.sport.some(s => String(s.id) === String(selectedSportId));
      })
      .filter(obj => {
        if (!searchText) return true;
        return obj.name && obj.name.toLowerCase().includes(searchText.toLowerCase());
      });
  }, [cityObjects, selectedTypeId, selectedSportId, searchText]);

  return (
    <div className="map-page">
      <div className="map-container-wrap">
        <h2 style={{ textAlign:'center', color:'var(--color-on-dark)', marginBottom: 16 }}>Карта спортивных объектов города Иваново</h2>
        <div className="map-filters">
          <select className="select" value={selectedTypeId} onChange={e => setSelectedTypeId(e.target.value)}>
            <option value="">Тип объекта</option>
            {objectTypes.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <select className="select" value={selectedSportId} onChange={e => setSelectedSportId(e.target.value)}>
            <option value="">Вид спорта</option>
            {sports.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <input className="select" placeholder="Поиск по названию" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </div>
        <div className="map-box">
          <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} attributionControl={false} style={{ height: '520px', width: '100%', borderRadius: 12 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredObjects.map(obj => (
              <Marker key={obj.id} position={[obj.lat, obj.lng]} icon={customMarkerIcon}>
                <Popup className="map-popup">
                  <h3>{obj.name}</h3>
                  <div>Адрес: {obj.location}</div>
                  <div style={{ marginTop:8 }}>Описание: {obj.description}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapPage;

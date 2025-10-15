import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { customMarkerIcon } from '../components/customMarkerIcon';

const DEFAULT_CENTER = [56.999, 40.973]; // Иваново, пример
const DEFAULT_ZOOM = 12;

const MapPage = ({ cityObjects }) => {
  return (
    <div style={{ height: '70vh', width: '100%', marginBottom: 32 }}>
      <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {cityObjects.filter(obj => obj.lat && obj.lng).map(obj => (
          <Marker key={obj.id} position={[obj.lat, obj.lng]} icon={customMarkerIcon}>
            <Popup>
              <b>{obj.name}</b><br />
              {obj.location}<br />
              {obj.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;

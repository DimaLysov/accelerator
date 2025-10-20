import React from 'react';
import MapPage from './MapPage';
import { getCityObjects } from '../api/city_object';
import { getSports } from '../api/sport';
import { getObjectTypes } from '../api/object_type';

const MapPageWrapper = () => {
  const [cityObjects, setCityObjects] = React.useState(null);
  const [sports, setSports] = React.useState([]);
  const [objectTypes, setObjectTypes] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setError(null);
    Promise.all([getCityObjects(), getSports(), getObjectTypes()])
      .then(([objects, sportsList, types]) => {
        setCityObjects(objects);
        setSports(sportsList);
        setObjectTypes(types);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Ошибка загрузки данных');
        setCityObjects([]);
        setSports([]);
        setObjectTypes([]);
      });
  }, []);

  if (cityObjects === null) return <div style={{ padding:24 }}>Загрузка...</div>;
  if (error) return <div style={{ padding:24 }}>Ошибка: {error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <MapPage cityObjects={cityObjects} sports={sports} objectTypes={objectTypes} />
    </div>
  );
};

export default MapPageWrapper;

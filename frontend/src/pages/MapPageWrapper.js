import React from 'react';
import MapPage from './MapPage';
import { getCityObjects } from '../api/city_object';

const MapPageWrapper = () => {
  const [cityObjects, setCityObjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    getCityObjects()
      .then(setCityObjects)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return <MapPage cityObjects={cityObjects} />;
};

export default MapPageWrapper;

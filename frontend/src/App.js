
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import MainPage from './pages/MainPage';
import MapPageWrapper from './pages/MapPageWrapper';
import ProfessionalEventsPage from './pages/ProfessionalEventsPage';
import CustomEventsPage from './pages/CustomEventsPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="map" element={<MapPageWrapper />} />
          <Route path="events/professional" element={<ProfessionalEventsPage />} />
          <Route path="events/custom" element={<CustomEventsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import MainPage from './pages/MainPage';
import MapPageWrapper from './pages/MapPageWrapper';
import AllEventsPage from './pages/AllEventsPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="map" element={<MapPageWrapper />} />
          <Route path="events" element={<AllEventsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

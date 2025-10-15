import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'linear-gradient(90deg, #4f6ef7 0%, #6a8cff 100%)', color: '#fff', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700, fontSize: 24 }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Стартуй</Link>
        </div>
        <nav>
          <Link to="/map" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontSize: 18, padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', marginLeft: 16 }}>Карта объектов</Link>
          <Link to="/events" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontSize: 18, padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', marginLeft: 16 }}>Все события</Link>
        </nav>
      </header>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer style={{ background: '#f5f5f5', color: '#888', textAlign: 'center', padding: 16 }}>
        &copy; {new Date().getFullYear()} Стартуй — Все права защищены
      </footer>
    </div>
  );
};

export default Layout;

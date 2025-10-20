import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer style={{ background: '#071218', color: '#9aa29f', textAlign: 'center', padding: 24 }}>
        &copy; {new Date().getFullYear()} Стартуй — Все права защищены
      </footer>
    </div>
  );
};

export default Layout;

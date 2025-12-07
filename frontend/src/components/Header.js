import React from 'react';
import { ReactComponent as StartLogo } from '../assets/images/логостартуй.svg';
import { Link } from 'react-router-dom';
import '../components/styles/header.css';

const Header = () => {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="logo">
          <Link to="/" className="logo-link" aria-label="Главная">
            <StartLogo className="logo-svg" />
          </Link>
        </div>
        <nav className="header-nav">
          <Link to="/map">Карта объектов</Link>
          <Link to="/events/professional">Профессиональные события</Link>
          <Link to="/events/custom">Пользовательские события</Link>
          {/* <span className="nav-disabled">Поиск игр</span>
          <span className="nav-disabled">Контакты</span> */}
        </nav>
        <div className="header-actions">
          <button className="btn-ghost">Войти</button>
        </div>
      </div>
    </header>
  );
};

export default Header;

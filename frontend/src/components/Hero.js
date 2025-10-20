import React from 'react';
import '../components/styles/hero.css';

const Hero = ({ title = 'СТАРТУЙ!', subtitle }) => {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-overlay" />
      <div className="container hero-content">
        <h1 className="hero-title">{title}</h1>
        {subtitle && <p className="hero-sub">{subtitle}</p>}
      </div>
    </section>
  );
};

export default Hero;

import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaLock, FaBolt, FaBox, FaChartBar } from 'react-icons/fa';
import './Home.css';

export const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Bienvenue sur E-Commerce Pro</h1>
          <p>Découvrez notre sélection de produits de qualité supérieure</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">
              Découvrir les Produits
            </Link>
            <Link to="/orders" className="btn btn-secondary">
              Mes Commandes
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Pourquoi Nous Choisir?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaRocket className="feature-icon" />
            <h3>Architecture Microservices</h3>
            <p>Services distribués pour une performance optimale et une scalabilité garantie</p>
          </div>
          
          <div className="feature-card">
            <FaLock className="feature-icon" />
            <h3>Sécurité Avancée</h3>
            <p>Authentification centralisée avec Keycloak et chiffrement de bout en bout</p>
          </div>
          
          <div className="feature-card">
            <FaBolt className="feature-icon" />
            <h3>Performance</h3>
            <p>API Gateway optimisée pour des réponses ultrarapides</p>
          </div>
          
          <div className="feature-card">
            <FaBox className="feature-icon" />
            <h3>Gestion Distribuée</h3>
            <p>Gestion de stock et commandes distribuées sur PostgreSQL</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>API Moderne</h3>
            <p>REST APIs avec documentation Swagger automatique</p>
          </div>
          
          <div className="feature-card">
            <FaChartBar className="feature-icon" />
            <h3>Analytics</h3>
            <p>Tableau de bord pour suivi des commandes et statistiques</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Prêt à Commencer?</h2>
        <p>Explorez nos produits et effectuez votre première commande dès maintenant</p>
        <Link to="/products" className="btn btn-large">
          Commencer les Achats
        </Link>
      </section>

      {/* Technology Stack Section */}
      <section className="tech-stack-section">
        <h2>Stack Technologique</h2>
        <div className="tech-grid">
          <div className="tech-item">
            <h4>Frontend</h4>
            <ul>
              <li>React 19.2.3</li>
              <li>React Router DOM</li>
              <li>Axios</li>
              <li>Keycloak JS</li>
            </ul>
          </div>
          
          <div className="tech-item">
            <h4>Backend</h4>
            <ul>
              <li>Spring Boot 3.x</li>
              <li>Spring Cloud</li>
              <li>Eureka Discovery</li>
              <li>API Gateway</li>
            </ul>
          </div>
          
          <div className="tech-item">
            <h4>Sécurité</h4>
            <ul>
              <li>Keycloak OAuth2</li>
              <li>JWT Tokens</li>
              <li>Role-Based Access</li>
              <li>SSL/TLS</li>
            </ul>
          </div>
          
          <div className="tech-item">
            <h4>Infrastructure</h4>
            <ul>
              <li>Docker</li>
              <li>PostgreSQL</li>
              <li>Spring Config Server</li>
              <li>Kubernetes Ready</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

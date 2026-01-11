import React from 'react';
import { FaLock, FaRocket, FaBox } from 'react-icons/fa';
import './Navbar.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>À Propos</h4>
          <p>Plateforme e-commerce professionnelle avec gestion distribuée des services.</p>
        </div>
        
        <div className="footer-section">
          <h4>Liens Rapides</h4>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="/products">Produits</a></li>
            <li><a href="/orders">Commandes</a></li>
            <li><a href="/cart">Panier</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: info@ecommerce-pro.com</p>
          <p>Tél: +212 6XX XX XX XX</p>
        </div>
        
        <div className="footer-section">
          <h4>Services</h4>
          <ul>
            <li><FaLock /> Sécurisé par Keycloak</li>
            <li><FaRocket /> Architecture Microservices</li>
            <li><FaBox /> Gestion Distribuée</li>
            <li>🌍 API Gateway</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 E-Commerce Pro. Tous les droits réservés.</p>
      </div>
    </footer>
  );
};

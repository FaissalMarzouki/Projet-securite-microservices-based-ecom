import React, { useState } from 'react';
import { useAuth } from '../hooks/useContextHooks';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import './Navbar.css';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="/">E-Commerce Pro</a>
        </div>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <a href="/" className="nav-link">Accueil</a>
          </li>
          <li className="nav-item">
            <a href="/products" className="nav-link">Produits</a>
          </li>
          <li className="nav-item">
            <a href="/orders" className="nav-link">Mes Commandes</a>
          </li>
          <li className="nav-item">
            <a href="/cart" className="nav-link"><FaShoppingCart /> Panier</a>
          </li>
        </ul>

        <div className="nav-auth">
          {isAuthenticated ? (
            <div className="auth-menu">
              <span className="user-name"><FaUser /> {user?.name || user?.email}</span>
              {user?.roles?.includes('ADMIN') && (
                <a href="/admin" className="admin-link">⚙️ Admin</a>
              )}
              <button onClick={logout} className="logout-btn">Déconnexion</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="login-btn">Connexion</button>
              <button className="signup-btn">Inscription</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

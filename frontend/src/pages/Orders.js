import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { LoadingSpinner, ErrorAlert } from '../components/Alerts';
import { useAuth } from '../hooks/useContextHooks';
import './Orders.css';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let data;
      
      if (isAuthenticated && user?.id) {
        // Si authentifié, récupérer les commandes du client
        data = await orderService.getOrdersByClientId(user.id);
      } else {
        // Sinon, récupérer avec un ID par défaut
        data = await orderService.getOrdersByClientId('C001');
      }
      
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des commandes: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'PENDING': { class: 'badge-pending', label: 'En Attente' },
      'CONFIRMED': { class: 'badge-confirmed', label: 'Confirmée' },
      'SHIPPED': { class: 'badge-shipped', label: 'Expédiée' },
      'DELIVERED': { class: 'badge-delivered', label: 'Livrée' },
      'CANCELLED': { class: 'badge-cancelled', label: 'Annulée' }
    };
    const badge = badges[status] || { class: 'badge-unknown', label: status };
    return <span className={`status-badge ${badge.class}`}>{badge.label}</span>;
  };

  if (loading) {
    return <LoadingSpinner message="Chargement de vos commandes..." />;
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>📋 Mes Commandes</h1>
        {isAuthenticated && <p>Bienvenue, {user?.name || user?.email}</p>}
      </div>

      {error && <ErrorAlert message={error} />}

      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="empty-icon">📭</div>
          <h2>Aucune Commande</h2>
          <p>Vous n'avez pas encore effectué de commande</p>
          <a href="/products" className="shop-btn">
            🛍️ Commencer à Faire des Achats
          </a>
        </div>
      ) : (
        <div className="orders-container">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <h3>Commande #{order.id}</h3>
                  <span className="order-date">
                    {new Date(order.createdAt || Date.now()).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="order-status">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              <div className="order-content">
                <div className="order-items">
                  <h4>Articles</h4>
                  {order.orderItems && order.orderItems.length > 0 ? (
                    <ul className="items-list">
                      {order.orderItems.map((item, idx) => (
                        <li key={idx} className="item">
                          <span className="item-name">Produit {item.productId}</span>
                          <span className="item-qty">Qty: {item.quantity}</span>
                          <span className="item-price">{item.unitPrice?.toFixed(2) || 'N/A'} DH</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-items">Aucun article dans cette commande</p>
                  )}
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Total:</span>
                    <span className="total-amount">
                      {order.totalAmount?.toFixed(2) || 'N/A'} DH
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Client:</span>
                    <span>{order.clientId}</span>
                  </div>
                </div>
              </div>

              <div className="order-footer">
                <button className="view-details-btn">
                  👁️ Voir Détails
                </button>
                {order.status === 'PENDING' && (
                  <button className="cancel-btn">
                    ✕ Annuler la Commande
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

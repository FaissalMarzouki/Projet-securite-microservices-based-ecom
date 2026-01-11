import React, { useState, useEffect } from 'react';
import { useCart } from '../hooks/useContextHooks';
import { orderService } from '../services/orderService';
import { ErrorAlert, SuccessAlert, LoadingSpinner } from '../components/Alerts';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import './Cart.css';

export const CartPage = () => {
  const { items, getTotalPrice, removeFromCart, updateQuantity, clearCart, clientId } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError('Votre panier est vide');
      return;
    }

    try {
      setIsCheckingOut(true);
      setError(null);

      // Créer une commande
      const order = {
        clientId: clientId,
        totalAmount: getTotalPrice(),
        status: 'PENDING'
      };

      const createdOrder = await orderService.createOrder(order);

      // Ajouter les articles à la commande
      for (const item of items) {
        await orderService.addItemToOrder(createdOrder.id, {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        });
      }

      setSuccessMessage(`Commande #${createdOrder.id} créée avec succès!`);
      clearCart();
      
      // Redirection après 2 secondes
      setTimeout(() => {
        window.location.href = '/orders';
      }, 2000);
    } catch (err) {
      setError('Erreur lors de la création de la commande: ' + err.message);
      console.error(err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isCheckingOut) {
    return <LoadingSpinner message="Traitement de votre commande..." />;
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1><FaShoppingCart /> Panier</h1>
      </div>

      {successMessage && (
        <SuccessAlert 
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {error && (
        <ErrorAlert 
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {items.length === 0 ? (
        <div className="empty-cart">
          <FaShoppingCart className="empty-icon" />
          <h2>Votre panier est vide</h2>
          <p>Explorez nos produits et ajoutez-les à votre panier</p>
          <a href="/products" className="continue-shopping-btn">
            Continuer les Achats
          </a>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Prix Unitaire</th>
                  <th>Quantité</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.productId} className="cart-item-row">
                    <td className="product-name">{item.product?.name}</td>
                    <td className="unit-price">{item.unitPrice.toFixed(2)} DH</td>
                    <td className="quantity-control">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="qty-btn"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                        className="qty-input"
                      />
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </td>
                    <td className="item-total">
                      {(item.quantity * item.unitPrice).toFixed(2)} DH
                    </td>
                    <td className="action">
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="remove-btn"
                      >
                        <FaTrash /> Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-summary">
            <h2>Résumé de la Commande</h2>
            <div className="summary-row">
              <span>Sous-total:</span>
              <span>{getTotalPrice().toFixed(2)} DH</span>
            </div>
            <div className="summary-row">
              <span>Frais de Port:</span>
              <span>Gratuit</span>
            </div>
            <div className="summary-row tax">
              <span>Taxe (14%):</span>
              <span>{(getTotalPrice() * 0.14).toFixed(2)} DH</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>{(getTotalPrice() * 1.14).toFixed(2)} DH</span>
            </div>

            <div className="cart-actions">
              <button 
                onClick={handleCheckout}
                className="checkout-btn"
              >
                ✓ Procéder au Paiement
              </button>
              <a href="/products" className="continue-btn">
                ← Continuer les Achats
              </a>
            </div>

            <button
              onClick={clearCart}
              className="clear-cart-btn"
            >
              Vider le Panier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

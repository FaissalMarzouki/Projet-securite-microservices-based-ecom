import React from 'react';
import { FaShoppingCart, FaExclamationTriangle } from 'react-icons/fa';
import './ProductCard.css';

export const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={`https://via.placeholder.com/250x250?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
        />
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <p className="product-description">
          {product.description?.substring(0, 100)}...
        </p>
        
        <div className="product-meta">
          <span className="product-id">ID: {product.id}</span>
          <span className={`product-quantity ${product.quantity <= 5 ? 'low-stock' : ''}`}>
            Stock: {product.quantity}
          </span>
        </div>
        
        <div className="product-footer">
          <span className="product-price">{product.price.toFixed(2)} DH</span>
          <button 
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product)}
            disabled={product.quantity <= 0}
          >
            {product.quantity > 0 ? <><FaShoppingCart /> Ajouter</> : <><FaExclamationTriangle /> Rupture</>}
          </button>
        </div>
      </div>
    </div>
  );
};

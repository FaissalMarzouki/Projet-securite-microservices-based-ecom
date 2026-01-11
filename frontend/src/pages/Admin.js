import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { LoadingSpinner, ErrorAlert, SuccessAlert } from '../components/Alerts';
import { useAuth } from '../hooks/useContextHooks';
import { FaEdit, FaTrash, FaBox, FaMoneyBillWave } from 'react-icons/fa';
import './Admin.css';

export const AdminPage = () => {
  const { isAdmin, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Erreur lors du chargement des produits: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const newProduct = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };

      if (editingId) {
        await productService.updateProduct(editingId, newProduct);
        setSuccess('Produit mis à jour avec succès!');
      } else {
        await productService.createProduct(newProduct);
        setSuccess('Produit créé avec succès!');
      }

      setFormData({ name: '', description: '', price: '', quantity: '' });
      setShowForm(false);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError('Erreur lors de la création/mise à jour: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      return;
    }

    try {
      await productService.deleteProduct(id);
      setSuccess('Produit supprimé avec succès!');
      fetchProducts();
    } catch (err) {
      setError('Erreur lors de la suppression: ' + err.message);
    }
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  if (!isAdmin) {
    return (
      <div className="admin-denied">
        <h1>⛔ Accès Refusé</h1>
        <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <p>Seuls les administrateurs peuvent gérer les produits.</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Chargement du tableau de bord..." />;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>⚙️ Tableau de Bord Administrateur</h1>
        <p>Bienvenue {user?.name || 'Admin'}</p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <SuccessAlert message={success} onClose={() => setSuccess(null)} />}

      <div className="admin-content">
        <div className="admin-section">
          <div className="section-header">
            <h2>Gestion des Produits</h2>
            <button 
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setFormData({ name: '', description: '', price: '', quantity: '' });
              }}
              className="add-product-btn"
            >
              {showForm ? '✕ Annuler' : '+ Ajouter un Produit'}
            </button>
          </div>

          {showForm && (
            <div className="product-form">
              <form onSubmit={handleAddProduct}>
                <div className="form-group">
                  <label htmlFor="name">Nom du Produit</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Laptop Pro"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Description du produit..."
                    rows="4"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Prix (DH)</label>
                    <input
                      type="number"
                      id="price"
                      required
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="quantity">Quantité</label>
                    <input
                      type="number"
                      id="quantity"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>

                <button type="submit" className="submit-btn">
                  {editingId ? '💾 Mettre à Jour' : '➕ Créer le Produit'}
                </button>
              </form>
            </div>
          )}

          <div className="products-table-container">
            {products.length === 0 ? (
              <p className="no-products-msg">Aucun produit trouvé</p>
            ) : (
              <table className="products-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prix (DH)</th>
                    <th>Quantité</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td className="bold">{product.name}</td>
                      <td>{product.price.toFixed(2)}</td>
                      <td>
                        <span className={product.quantity <= 10 ? 'low-stock' : ''}>
                          {product.quantity}
                        </span>
                      </td>
                      <td className="description">
                        {product.description?.substring(0, 50)}...
                      </td>
                      <td className="actions">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="edit-btn"
                        >
                          <FaEdit /> Éditer
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="delete-btn"
                        >
                          <FaTrash /> Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <FaBox className="stat-icon" />
            <div className="stat-content">
              <h3>Produits Totaux</h3>
              <p className="stat-value">{products.length}</p>
            </div>
          </div>

          <div className="stat-card">
            <FaMoneyBillWave className="stat-icon" />
            <div className="stat-content">
              <h3>Stock Faible</h3>
              <p className="stat-value">{products.filter(p => p.quantity <= 10).length}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Valeur Stock</h3>
              <p className="stat-value">
                {products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(0)} DH
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

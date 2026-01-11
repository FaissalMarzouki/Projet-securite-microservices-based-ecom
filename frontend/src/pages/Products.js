import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner, ErrorAlert } from '../components/Alerts';
import { useCart } from '../hooks/useContextHooks';
import { FaSearch } from 'react-icons/fa';
import './Products.css';

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPrice, setFilterPrice] = useState(100000);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des produits: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // Vous pouvez ajouter un toast de succès ici
    console.log(`${product.name} ajouté au panier`);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price <= filterPrice;
    return matchesSearch && matchesPrice;
  });

  if (loading) {
    return <LoadingSpinner message="Chargement des produits..." />;
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Nos Produits</h1>
        <p>Découvrez notre large gamme de produits de qualité</p>
      </div>

      {error && <ErrorAlert message={error} />}

      <div className="products-filter-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-box">
          <label>Prix Maximum: {filterPrice.toFixed(0)} DH</label>
          <input
            type="range"
            min="0"
            max="100000"
            value={filterPrice}
            onChange={(e) => setFilterPrice(parseInt(e.target.value))}
            className="price-slider"
          />
        </div>

        <div className="filter-info">
          <p>{filteredProducts.length} produit(s) trouvé(s)</p>
          <button onClick={fetchProducts} className="refresh-btn">
            🔄 Actualiser
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>Aucun produit ne correspond à votre recherche</p>
          <button onClick={() => {
            setSearchTerm('');
            setFilterPrice(100000);
          }} className="reset-btn">
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

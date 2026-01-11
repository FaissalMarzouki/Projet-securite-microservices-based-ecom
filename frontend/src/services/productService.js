import apiClient from './apiClient';

const PRODUCTS_BASE_URL = '/product-service/api/products';

export const productService = {
  // Récupérer tous les produits
  getAllProducts: async () => {
    try {
      const response = await apiClient.get(PRODUCTS_BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  },

  // Récupérer un produit par ID
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`${PRODUCTS_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du produit ${id}:`, error);
      throw error;
    }
  },

  // Créer un nouveau produit (ADMIN)
  createProduct: async (product) => {
    try {
      const response = await apiClient.post(PRODUCTS_BASE_URL, product);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      throw error;
    }
  },

  // Mettre à jour un produit (ADMIN)
  updateProduct: async (id, product) => {
    try {
      const response = await apiClient.put(`${PRODUCTS_BASE_URL}/${id}`, product);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du produit ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un produit (ADMIN)
  deleteProduct: async (id) => {
    try {
      await apiClient.delete(`${PRODUCTS_BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du produit ${id}:`, error);
      throw error;
    }
  },
};

import apiClient from './apiClient';

const ORDERS_BASE_URL = '/order-service/api/orders';

export const orderService = {
  // Récupérer toutes les commandes (ADMIN)
  getAllOrders: async () => {
    try {
      const response = await apiClient.get(ORDERS_BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      throw error;
    }
  },

  // Récupérer une commande par ID
  getOrderById: async (id) => {
    try {
      const response = await apiClient.get(`${ORDERS_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la commande ${id}:`, error);
      throw error;
    }
  },

  // Récupérer les commandes d'un client
  getOrdersByClientId: async (clientId) => {
    try {
      const response = await apiClient.get(`${ORDERS_BASE_URL}/client/${clientId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des commandes du client ${clientId}:`, error);
      throw error;
    }
  },

  // Créer une nouvelle commande
  createOrder: async (order) => {
    try {
      const response = await apiClient.post(ORDERS_BASE_URL, order);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      throw error;
    }
  },

  // Ajouter un article à une commande
  addItemToOrder: async (orderId, item) => {
    try {
      const response = await apiClient.post(`${ORDERS_BASE_URL}/${orderId}/items`, item);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'ajout d'un article à la commande ${orderId}:`, error);
      throw error;
    }
  },

  // Mettre à jour une commande (ADMIN)
  updateOrder: async (id, order) => {
    try {
      const response = await apiClient.put(`${ORDERS_BASE_URL}/${id}`, order);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la commande ${id}:`, error);
      throw error;
    }
  },

  // Mettre à jour le statut d'une commande
  updateOrderStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`${ORDERS_BASE_URL}/${id}/status`, null, {
        params: { status },
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut de la commande ${id}:`, error);
      throw error;
    }
  },

  // Supprimer une commande (ADMIN)
  deleteOrder: async (id) => {
    try {
      await apiClient.delete(`${ORDERS_BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la commande ${id}:`, error);
      throw error;
    }
  },
};

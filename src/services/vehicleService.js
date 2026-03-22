const BASE_URL = 'http://localhost:8080/api';

export const vehicleService = {
  getCategories: async () => {
    const response = await fetch(`${BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  getVehicles: async () => {
    const response = await fetch(`${BASE_URL}/vehicles`);
    if (!response.ok) throw new Error('Failed to fetch vehicles');
    return response.json();
  },

  getVehicleById: async (id) => {
    const response = await fetch(`${BASE_URL}/vehicles/${id}`);
    if (!response.ok) throw new Error('Failed to fetch vehicle details');
    return response.json();
  },

  getVehiclesByCategory: async (categoryId) => {
    const response = await fetch(`${BASE_URL}/vehicles/category/${categoryId}`);
    if (!response.ok) throw new Error('Failed to fetch vehicles by category');
    return response.json();
  }
};

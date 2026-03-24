const BASE_URL = 'http://127.0.0.1:8080/api';

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

  getFeaturedVehicles: async () => {
    const response = await fetch(`${BASE_URL}/vehicles/featured`);
    if (!response.ok) throw new Error('Failed to fetch featured vehicles');
    return response.json();
  },

  getVehicleById: async (id) => {
    const response = await fetch(`${BASE_URL}/vehicles/${id}`);
    if (!response.ok) throw new Error('Failed to fetch vehicle details');
    return response.json();
  },

  getVehicleAvailabilityByMonth: async (id, month) => {
    const response = await fetch(`${BASE_URL}/vehicles/${id}/availability?month=${month}`);
    if (!response.ok) throw new Error('Failed to fetch availability');
    return response.json();
  },

  getVehiclesByCategory: async (categoryId) => {
    const response = await fetch(`${BASE_URL}/vehicles/category/${categoryId}`);
    if (!response.ok) throw new Error('Failed to fetch vehicles by category');
    return response.json();
  },

  // GET /api/vehicles/search?keyword=...&categoryId=...&brand=...&minPrice=...&maxPrice=...&rentalDate=yyyy-MM-dd&sort=...
  searchVehicles: async ({
    keyword,
    categoryId,
    brand,
    minPrice,
    maxPrice,
    rentalDate,
    sort
  } = {}) => {
    const params = new URLSearchParams();

    if (keyword && keyword.trim()) params.append('keyword', keyword.trim());
    if (categoryId) params.append('categoryId', categoryId);
    if (brand) params.append('brand', brand);
    if (minPrice !== undefined && minPrice !== null) params.append('minPrice', minPrice);
    if (maxPrice !== undefined && maxPrice !== null) params.append('maxPrice', maxPrice);
    if (rentalDate) params.append('rentalDate', rentalDate);
    if (sort) params.append('sort', sort);

    const queryString = params.toString();
    const response = await fetch(
      `${BASE_URL}/vehicles/search${queryString ? `?${queryString}` : ''}`
    );
    if (!response.ok) throw new Error('Failed to search vehicles');
    return response.json();
  }
};

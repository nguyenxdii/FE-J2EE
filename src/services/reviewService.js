const BASE_URL = 'http://127.0.0.1:8080/api/reviews';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const reviewService = {
  getByVehicle: async (vehicleId, page = 0, size = 10) => {
    const response = await fetch(`${BASE_URL}/vehicle/${vehicleId}?page=${page}&size=${size}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  create: async ({ orderId, vehicleId, rating, comment }) => {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ orderId, vehicleId, rating, comment }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Review failed');
    return data;
  },
};

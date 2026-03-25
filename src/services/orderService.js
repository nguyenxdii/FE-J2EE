const BASE_URL = 'http://127.0.0.1:8080/api/orders';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const orderService = {
  // Lấy danh sách đơn hàng của người dùng hiện tại
  getMyOrders: async () => {
    const response = await fetch(`${BASE_URL}/my`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Lấy chi tiết một đơn hàng
  getOrderById: async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    });
    return response.json();
  },

  // Lấy danh sách đơn hàng của một xe (để hiện lịch bận)
  getVehicleOrders: async (vehicleId) => {
    const response = await fetch(`${BASE_URL}/vehicle/${vehicleId}`, {
      headers: getHeaders()
    });
    return response.json();
  }
};

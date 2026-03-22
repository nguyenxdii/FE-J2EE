const BASE_URL = 'http://127.0.0.1:8080/api/orders';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const orderService = {
  // Lấy danh sách đơn hàng của người dùng hiện tại
  getMyOrders: async () => {
    const response = await fetch(`${BASE_URL}/my-orders`, {
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
  }
};

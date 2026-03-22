const BASE_URL = 'http://127.0.0.1:8080/api/deposits';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const depositService = {
  // Lấy danh sách marketplace (Public)
  getListings: async () => {
    const response = await fetch(`${BASE_URL}/listings`);
    return response.json();
  },

  // Đăng bán suất cọc
  createListing: async (orderId, sellingPrice) => {
    const response = await fetch(`${BASE_URL}/listings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ orderId, sellingPrice })
    });
    return response.json();
  },

  // Hủy bài đăng suất cọc
  cancelListing: async (id) => {
    const response = await fetch(`${BASE_URL}/listings/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return response.json();
  },

  // Mua lại suất cọc (WALLET hoặc MOMO)
  buyListing: async (listingId, paymentMethod) => {
    const response = await fetch(`${BASE_URL}/buy`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ listingId, paymentMethod })
    });
    return response.json();
  }
};

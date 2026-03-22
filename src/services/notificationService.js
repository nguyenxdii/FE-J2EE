const BASE_URL = 'http://127.0.0.1:8080/api/notifications';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const notificationService = {
  // Lấy danh sách thông báo của người dùng
  getMyNotifications: async () => {
    const response = await fetch(BASE_URL, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Đánh dấu đã đọc
  markAsRead: async (id) => {
    const response = await fetch(`${BASE_URL}/${id}/read`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return response.json();
  },

  // Đánh dấu tất cả đã đọc
  markAllAsRead: async () => {
    const response = await fetch(`${BASE_URL}/read-all`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return response.json();
  }
};

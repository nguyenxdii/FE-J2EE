import api from './api';

export const notificationService = {
  // Lấy danh sách thông báo
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response;
  },

  // Đánh dấu 1 thông báo là đã đọc
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response;
  },

  // Đánh dấu tất cả là đã đọc
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response;
  }
};

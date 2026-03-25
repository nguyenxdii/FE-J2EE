const BASE_URL = 'http://127.0.0.1:8080/api';

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const adminService = {
  getCategories: async () => {
    const res = await fetch(`${BASE_URL}/categories`, { headers: authHeader() });
    if (!res.ok) throw new Error('Load categories failed');
    return res.json();
  },

  createCategory: async ({ name, description, iconFile }) => {
    const fd = new FormData();
    fd.append('name', name);
    if (description) fd.append('description', description);
    if (iconFile) fd.append('icon', iconFile);
    const res = await fetch(`${BASE_URL}/categories`, { method: 'POST', headers: authHeader(), body: fd });
    if (!res.ok) throw new Error('Create category failed');
    return res.json();
  },

  updateCategory: async (id, { name, description, iconFile }) => {
    const fd = new FormData();
    fd.append('name', name);
    if (description) fd.append('description', description);
    if (iconFile) fd.append('icon', iconFile);
    const res = await fetch(`${BASE_URL}/categories/${id}`, { method: 'PUT', headers: authHeader(), body: fd });
    if (!res.ok) throw new Error('Update category failed');
    return res.json();
  },

  deleteCategory: async (id) => {
    const res = await fetch(`${BASE_URL}/categories/${id}`, { method: 'DELETE', headers: authHeader() });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Xóa danh mục thất bại');
    }
    return res.json();
  },
  
  toggleHideCategory: async (id) => {
    const res = await fetch(`${BASE_URL}/categories/${id}/toggle-hide`, { method: 'PATCH', headers: authHeader() });
    if (!res.ok) throw new Error('Toggle hide category failed');
    return res.json();
  },

  getVehicles: async (params = {}) => {
    const q = new URLSearchParams(params);
    const res = await fetch(`${BASE_URL}/admin/vehicles?${q.toString()}`, { headers: authHeader() });
    if (!res.ok) throw new Error('Load vehicles failed');
    return res.json();
  },

  createVehicle: async (payload) => {
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (k === 'images' || k === 'newImages' || k === 'removedImages' || k === 'specs') return;
      if (v !== undefined && v !== null && v !== '') fd.append(k, v);
    });
    
    // Đảm bảo gửi kèm các trường trong specs nếu có (phẳng hóa ra FormData)
    if (payload.fuelType) fd.append('fuelType', payload.fuelType);
    if (payload.transmission) fd.append('transmission', payload.transmission);

    (payload.images || []).forEach((f) => fd.append('images', f));
    
    const res = await fetch(`${BASE_URL}/admin/vehicles`, { method: 'POST', headers: authHeader(), body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Thêm xe thất bại');
    return data;
  },

  updateVehicle: async (id, payload) => {
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (k === 'newImages' || k === 'removedImages' || k === 'images' || k === 'specs') return;
      if (v !== undefined && v !== null && v !== '') fd.append(k, v);
    });
    
    if (payload.fuelType) fd.append('fuelType', payload.fuelType);
    if (payload.transmission) fd.append('transmission', payload.transmission);

    (payload.removedImages || []).forEach((img) => fd.append('removedImages', img));
    (payload.newImages || []).forEach((f) => fd.append('newImages', f));
    
    const res = await fetch(`${BASE_URL}/admin/vehicles/${id}`, { method: 'PUT', headers: authHeader(), body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Cập nhật xe thất bại');
    return data;
  },

  toggleVehicleVisibility: async (id) => {
    const res = await fetch(`${BASE_URL}/admin/vehicles/${id}/toggle-visibility`, { method: 'PATCH', headers: authHeader() });
    if (!res.ok) throw new Error('Toggle vehicle visibility failed');
    return res.json();
  },

  deleteVehicle: async (id) => {
    const res = await fetch(`${BASE_URL}/admin/vehicles/${id}`, { method: 'DELETE', headers: authHeader() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Delete vehicle failed');
    return data;
  },

  // --- QUẢN LÝ NGƯỜI DÙNG ---
  getUsers: async (params = {}) => {
    const q = new URLSearchParams(params);
    const res = await fetch(`${BASE_URL}/admin/users?${q.toString()}`, { headers: authHeader() });
    if (!res.ok) throw new Error('Load users failed');
    return res.json();
  },

  toggleUserLock: async (userId) => {
    const res = await fetch(`${BASE_URL}/admin/users/${userId}/toggle-lock`, { method: 'PATCH', headers: authHeader() });
    if (!res.ok) throw new Error('Toggle user lock failed');
    return res.json();
  },

  // --- DUYỆT KYC (CCCD / GPLX) ---
  getPendingKYC: async () => {
    const res = await fetch(`${BASE_URL}/admin/kyc/pending`, { headers: authHeader() });
    if (!res.ok) throw new Error('Load pending KYC failed');
    return res.json();
  },

  approveKYC: async (kycId) => {
    const res = await fetch(`${BASE_URL}/admin/kyc/${kycId}/approve`, { method: 'POST', headers: authHeader() });
    if (!res.ok) throw new Error('Approve KYC failed');
    return res.json();
  },

  rejectKYC: async (kycId, reason) => {
    const res = await fetch(`${BASE_URL}/admin/kyc/${kycId}/reject`, { 
      method: 'POST', 
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (!res.ok) throw new Error('Reject KYC failed');
    return res.json();
  },

  // --- QUẢN LÝ BÀI ĐĂNG & GIAO DỊCH ---
  getAllPosts: async () => {
    const res = await fetch(`${BASE_URL}/admin/deposits`, { headers: authHeader() });
    if (!res.ok) throw new Error('Load posts failed');
    return res.json();
  },

  getTransactionMonitor: async () => {
    const res = await fetch(`${BASE_URL}/admin/transactions/monitor`, { headers: authHeader() });
    if (!res.ok) throw new Error('Load transaction history failed');
    return res.json();
  },
};

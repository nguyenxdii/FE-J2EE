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
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Delete category failed');
    return data;
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
      if (k === 'images') return;
      if (v !== undefined && v !== null && v !== '') fd.append(k, v);
    });
    (payload.images || []).forEach((f) => fd.append('images', f));
    const res = await fetch(`${BASE_URL}/admin/vehicles`, { method: 'POST', headers: authHeader(), body: fd });
    if (!res.ok) throw new Error('Create vehicle failed');
    return res.json();
  },

  updateVehicle: async (id, payload) => {
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (k === 'newImages' || k === 'removedImages') return;
      if (v !== undefined && v !== null && v !== '') fd.append(k, v);
    });
    (payload.removedImages || []).forEach((img) => fd.append('removedImages', img));
    (payload.newImages || []).forEach((f) => fd.append('newImages', f));
    const res = await fetch(`${BASE_URL}/admin/vehicles/${id}`, { method: 'PUT', headers: authHeader(), body: fd });
    if (!res.ok) throw new Error('Update vehicle failed');
    return res.json();
  },

  hideVehicle: async (id) => {
    const res = await fetch(`${BASE_URL}/admin/vehicles/${id}/hide`, { method: 'PATCH', headers: authHeader() });
    if (!res.ok) throw new Error('Hide vehicle failed');
    return res.json();
  },

  deleteVehicle: async (id) => {
    const res = await fetch(`${BASE_URL}/admin/vehicles/${id}`, { method: 'DELETE', headers: authHeader() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Delete vehicle failed');
    return data;
  },
};

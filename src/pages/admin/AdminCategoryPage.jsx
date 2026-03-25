import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

export function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories'); // Public endpoint for listing
      if (res) setCategories(res);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description || '' });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    if (selectedFile) {
      data.append('icon', selectedFile);
    }

    try {
      let res;
      if (editingCategory) {
        res = await api.put(`/admin/categories/${editingCategory.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        res = await api.post('/admin/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      if (res.success) {
        toast.success(editingCategory ? 'Đã cập nhật danh mục' : 'Đã thêm danh mục mới');
        setIsDialogOpen(false);
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.message || 'Lỗi khi lưu danh mục');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xoá danh mục này?')) return;
    try {
      const res = await api.delete(`/admin/categories/${id}`);
      if (res.success) {
        toast.success('Đã xoá danh mục');
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.message || 'Không thể xoá danh mục');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý danh mục xe</h2>
          <p className="text-gray-500">Thêm, sửa, xoá các loại xe (Sedan, SUV, Hatchback...).</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Thêm danh mục
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
            <div className="col-span-full py-12 text-center text-gray-400">Đang tải...</div>
        ) : categories.map((cat) => (
          <Card key={cat.id} className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border">
                        {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{cat.name}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1">{cat.description || 'Không có mô tả'}</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleOpenDialog(cat)}>
                        <Edit2 className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(cat.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên danh mục</label>
              <Input 
                required 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="VD: Xe 4 chỗ (Sedan)"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mô tả</label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Mô tả ngắn về loại xe..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Icon / Hình ảnh</label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              {editingCategory?.image && !selectedFile && (
                  <p className="text-[10px] text-gray-500 italic">Để trống nếu không muốn thay đổi ảnh cũ.</p>
              )}
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
              <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingCategory ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

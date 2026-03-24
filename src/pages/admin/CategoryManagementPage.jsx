import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export function CategoryManagementPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', iconFile: null });

  const load = async () => {
    try {
      setItems(await adminService.getCategories());
    } catch {
      toast.error('Không tải được danh mục');
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) return toast.warning('Nhập tên danh mục');
    try {
      await adminService.createCategory(form);
      toast.success('Đã thêm danh mục');
      setForm({ name: '', description: '', iconFile: null });
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteCategory(id);
      toast.success('Đã xóa danh mục');
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Quản lý danh mục</h2>
      <Card className="p-4 space-y-3">
        <Input placeholder="Tên danh mục" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        <Input placeholder="Mô tả" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
        <Input type="file" accept="image/*" onChange={(e) => setForm((p) => ({ ...p, iconFile: e.target.files?.[0] || null }))} />
        <Button onClick={handleCreate}>Thêm danh mục</Button>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((c) => (
          <Card key={c.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-gray-500">{c.description}</p>
              </div>
              <Button variant="destructive" onClick={() => handleDelete(c.id)}>Xóa</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { vehicleService } from '@/services/vehicleService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const emptyForm = {
  name: '', categoryId: '', brand: '', model: '', year: '', licensePlate: '',
  pricePerDay: '', depositAmount: '', description: '', fuelType: '', transmission: '', images: [],
};

export function VehicleManagementPage() {
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(0);

  const load = async () => {
    try {
      const [v, c] = await Promise.all([
        adminService.getVehicles({ page, size: 10 }),
        vehicleService.getCategories(),
      ]);
      setRows(v.data || []);
      setCategories(c);
    } catch {
      toast.error('Không tải được danh sách xe');
    }
  };

  useEffect(() => { load(); }, [page]);

  const handleCreate = async () => {
    try {
      await adminService.createVehicle(form);
      toast.success('Đã thêm xe');
      setForm(emptyForm);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Quản lý xe</h2>
      <Card className="p-4 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <Input placeholder="Tên xe" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <Input placeholder="Hãng" value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} />
          <Input placeholder="Model" value={form.model} onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))} />
          <Input placeholder="Năm" type="number" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} />
          <Input placeholder="Biển số" value={form.licensePlate} onChange={(e) => setForm((p) => ({ ...p, licensePlate: e.target.value }))} />
          <Input placeholder="Giá/ngày" type="number" value={form.pricePerDay} onChange={(e) => setForm((p) => ({ ...p, pricePerDay: e.target.value }))} />
          <Input placeholder="Tiền cọc" type="number" value={form.depositAmount} onChange={(e) => setForm((p) => ({ ...p, depositAmount: e.target.value }))} />
          <Input placeholder="Loại nhiên liệu" value={form.fuelType} onChange={(e) => setForm((p) => ({ ...p, fuelType: e.target.value }))} />
          <Input placeholder="Hộp số" value={form.transmission} onChange={(e) => setForm((p) => ({ ...p, transmission: e.target.value }))} />
          <select className="border rounded-md px-3 py-2" value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}>
            <option value="">Chọn danh mục</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <Input placeholder="Mô tả" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
        <Input type="file" multiple accept="image/*" onChange={(e) => setForm((p) => ({ ...p, images: Array.from(e.target.files || []) }))} />
        <Button onClick={handleCreate}>Thêm xe</Button>
      </Card>

      <div className="space-y-3">
        {rows.map((v) => (
          <Card key={v.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{v.name}</p>
              <p className="text-sm text-gray-500">{v.brand} - {v.model} - {v.status}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={async () => { await adminService.hideVehicle(v.id); load(); }}>Ẩn</Button>
              <Button variant="destructive" onClick={async () => { try { await adminService.deleteVehicle(v.id); load(); } catch (e) { toast.error(e.message); } }}>Xóa</Button>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Trang trước</Button>
        <Button variant="outline" onClick={() => setPage((p) => p + 1)}>Trang sau</Button>
      </div>
    </div>
  );
}

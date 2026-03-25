import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { vehicleService } from '@/services/vehicleService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Edit2, Trash2, Eye, EyeOff, Plus, AlertCircle, X } from 'lucide-react';
import { LoadingOverlay } from '@/components/shared/LoadingOverlay';

const emptyForm = {
  name: '', categoryId: '', brand: '', model: '', year: '', licensePlate: '',
  pricePerDay: '', depositAmount: '', description: '', fuelType: '', transmission: '', 
  mileage: '', location: 'Hà Nội', images: [],
};

export function AdminVehiclePage() {
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Image handling for updates
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);

  // Confirmation state
  const [confirmConfig, setConfirmConfig] = useState({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
    actionLabel: 'Xác nhận'
  });

  const load = async () => {
    setLoading(true);
    try {
      const [v, c] = await Promise.all([
        adminService.getVehicles({ page, size: 10 }),
        vehicleService.getCategories(),
      ]);
      setRows(v.data?.content || []);
      setCategories(c);
    } catch {
      toast.error('Không tải được danh sách xe');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page]);

  const validateForm = () => {
    if (!form.name || !form.brand || !form.licensePlate || !form.pricePerDay || !form.categoryId) {
      toast.warning('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return false;
    }
    return true;
  }

  const handleSave = async () => {
    if (!validateForm()) return;
    
    const action = editingId ? 'Cập nhật' : 'Thêm';
    
    setConfirmConfig({
      open: true,
      title: `${action} thông tin xe?`,
      description: `Bạn có chắc chắn muốn ${action.toLowerCase()} xe "${form.name}" (${form.licensePlate}) không?`,
      actionLabel: action,
      onConfirm: async () => {
        setActionLoading(true);
        try {
          if (editingId) {
            await adminService.updateVehicle(editingId, {
              ...form,
              removedImages,
              newImages: newImageFiles
            });
            toast.success('Đã cập nhật thông tin xe');
          } else {
            await adminService.createVehicle({
              ...form,
              images: newImageFiles
            });
            toast.success('Đã thêm xe mới thành công');
          }
          resetForm();
          load();
        } catch (e) {
          toast.error(e.message);
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  const startEdit = (v) => {
    setEditingId(v.id);
    setForm({
      name: v.name,
      categoryId: v.categoryId,
      brand: v.brand,
      model: v.model,
      year: v.year,
      licensePlate: v.licensePlate,
      pricePerDay: v.pricePerDay,
      depositAmount: v.depositAmount,
      description: v.description || '',
      fuelType: v.specs?.fuelType || '',
      transmission: v.specs?.transmission || '',
      mileage: v.mileage || '',
      location: v.location || 'Hà Nội',
    });
    setExistingImages(v.images || []);
    setRemovedImages([]);
    setNewImageFiles([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setExistingImages([]);
    setRemovedImages([]);
    setNewImageFiles([]);
  };

  const handleRemoveExisting = (imgUrl) => {
    setRemovedImages(p => [...p, imgUrl]);
    setExistingImages(p => p.filter(url => url !== imgUrl));
  };

  const handleDelete = (id, name) => {
    setConfirmConfig({
      open: true,
      title: 'Xóa xe khỏi hệ thống?',
      description: `Hành động này sẽ xóa vĩnh viễn xe "${name}". Bạn có chắc chắn không?`,
      actionLabel: 'Xóa',
      variant: 'destructive',
      onConfirm: async () => {
        try {
          await adminService.deleteVehicle(id);
          toast.success('Đã xóa xe');
          load();
        } catch (e) {
          toast.error(e.message);
        }
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      {actionLoading && <LoadingOverlay message={editingId ? "Đang lưu thay đổi..." : "Đang tạo xe mới..."} />}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Quản lý xe</h2>
        {editingId && (
          <Button variant="ghost" onClick={resetForm} className="text-gray-500">
            Hủy chỉnh sửa
          </Button>
        )}
      </div>

      <Card className="p-6 border-none shadow-2xl bg-white space-y-6">
        <h3 className="font-bold text-lg flex items-center gap-2 border-b pb-2">
          {editingId ? <Edit2 className="h-5 w-5 text-blue-600" /> : <Plus className="h-5 w-5 text-green-600" />}
          {editingId ? `Sửa thông tin xe: ${form.licensePlate}` : 'Thêm xe mới vào đội'}
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Tên xe *</label>
            <Input placeholder="Honda Vision 2023" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Hãng *</label>
            <Input placeholder="Honda" value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Model</label>
            <Input placeholder="Vision" value={form.model} onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Năm sản xuất</label>
            <Input type="number" placeholder="2023" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Biển số *</label>
            <Input placeholder="29A-123.45" disabled={!!editingId} value={form.licensePlate} onChange={(e) => setForm((p) => ({ ...p, licensePlate: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Danh mục *</label>
            <select 
              className="w-full border rounded-md px-3 h-10 bg-gray-50 focus:bg-white transition-colors" 
              value={form.categoryId} 
              onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
            >
              <option value="">Chọn danh mục</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Giá thuê/ngày *</label>
            <Input type="number" placeholder="150000" value={form.pricePerDay} onChange={(e) => setForm((p) => ({ ...p, pricePerDay: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Tiền cọc yêu cầu</label>
            <Input type="number" placeholder="2000000" value={form.depositAmount} onChange={(e) => setForm((p) => ({ ...p, depositAmount: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Loại nhiên liệu</label>
            <Input placeholder="Xăng" value={form.fuelType} onChange={(e) => setForm((p) => ({ ...p, fuelType: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Hộp số</label>
            <Input placeholder="Tự động" value={form.transmission} onChange={(e) => setForm((p) => ({ ...p, transmission: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Số KM đã đi (Mileage)</label>
            <Input type="number" placeholder="5000" value={form.mileage} onChange={(e) => setForm((p) => ({ ...p, mileage: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Địa điểm (Khu vực)</label>
            <Input placeholder="Hà Nội" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Mô tả chi tiết</label>
            <Input placeholder="Mô tả về tình trạng xe, ưu điểm..." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-gray-500 uppercase">Hình ảnh xe</label>
          
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
              {existingImages.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} className="h-20 w-20 object-cover rounded-md border" alt="" />
                  <button 
                    onClick={() => handleRemoveExisting(url)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={(e) => setNewImageFiles(Array.from(e.target.files || []))} 
            className="cursor-pointer"
          />
          {newImageFiles.length > 0 && <p className="text-xs text-blue-600 font-medium italic">Đã chọn {newImageFiles.length} ảnh mới</p>}
        </div>

        <Button 
          onClick={handleSave} 
          className={`w-full h-12 text-lg font-bold shadow-lg ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-black'}`}
        >
          {editingId ? 'Lưu cập nhật' : 'Xác nhận thêm xe'}
        </Button>
      </Card>

      <div className="space-y-4">
        <h3 className="font-bold text-xl flex items-center gap-2">
          Danh sách xe hệ thống
          <span className="text-xs font-normal text-gray-400">({rows.length} xe trên trang này)</span>
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-gray-200" /></div>
        ) : (
          <div className="grid gap-4">
            {rows.map((v) => (
              <Card key={v.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-blue-200 hover:shadow-md">
                <div className="flex gap-4 items-center">
                  <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {v.images?.[0] ? (
                      <img src={v.images[0]} className="h-full w-full object-cover" alt="" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-300 font-bold text-xs uppercase">No IMG</div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900">{v.name}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase ${
                        v.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 
                        v.status === 'RENTING' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {v.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                      {v.brand} • {v.model} • <span className="text-blue-600 font-bold">{v.licensePlate}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Giá thuê: {new Intl.NumberFormat('vi-VN').format(v.pricePerDay)}đ/ngày</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex-1 sm:flex-none border-gray-200 ${v.status === 'HIDDEN' ? 'text-amber-600 bg-amber-50 border-amber-200' : ''}`} 
                    onClick={async () => { await adminService.toggleVehicleVisibility(v.id); load(); }}
                  >
                    {v.status === 'HIDDEN' ? (
                      <>
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Hiện
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3.5 w-3.5 mr-1" />
                        Ẩn
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none border-blue-100 text-blue-600 hover:bg-blue-50" onClick={() => startEdit(v)}>
                    <Edit2 className="h-3.5 w-3.5 mr-1" />
                    Sửa
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 sm:flex-none text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(v.id, v.name)}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Xóa
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 py-4">
        <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
          Trang trước
        </Button>
        <span className="text-sm font-bold text-gray-500">Trang {page + 1}</span>
        <Button variant="outline" size="sm" disabled={rows.length < 10} onClick={() => setPage((p) => p + 1)}>
          Trang sau
        </Button>
      </div>

      <AlertDialog open={confirmConfig.open} onOpenChange={(o) => setConfirmConfig(p => ({ ...p, open: o }))}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className={`h-5 w-5 ${confirmConfig.variant === 'destructive' ? 'text-red-500' : 'text-blue-500'}`} />
              {confirmConfig.title}
            </AlertDialogTitle>
            <AlertDialogDescription>{confirmConfig.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmConfig.onConfirm}
              className={confirmConfig.variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-black'}
            >
              {confirmConfig.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

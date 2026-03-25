import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
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
import { Loader2, Edit2, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import { LoadingOverlay } from '@/components/shared/LoadingOverlay';

export function CategoryManagementPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', iconFile: null });
  const [editingId, setEditingId] = useState(null);
  
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
      setItems(await adminService.getCategories());
    } catch {
      toast.error('Không tải được danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.name.trim()) return toast.warning('Nhập tên danh mục');
    
    const action = editingId ? 'Cập nhật' : 'Thêm';
    
    setConfirmConfig({
      open: true,
      title: `${action} danh mục?`,
      description: `Bạn có chắc chắn muốn ${action.toLowerCase()} danh mục "${form.name}" không?`,
      actionLabel: action,
      onConfirm: async () => {
        setActionLoading(true);
        try {
          if (editingId) {
            await adminService.updateCategory(editingId, form);
            toast.success('Đã cập nhật danh mục');
          } else {
            await adminService.createCategory(form);
            toast.success('Đã thêm danh mục');
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

  const handleDelete = (id, name) => {
    setConfirmConfig({
      open: true,
      title: 'Xóa danh mục?',
      description: `Hành động này không thể hoàn tác. Bạn có chắc muốn xóa danh mục "${name}"?`,
      actionLabel: 'Xóa',
      variant: 'destructive',
      onConfirm: async () => {
        try {
          await adminService.deleteCategory(id);
          toast.success('Đã xóa danh mục');
          load();
        } catch (e) {
          toast.error(e.message);
        }
      }
    });
  };

  const handleToggleHide = async (id, name, isHidden) => {
    try {
      await adminService.toggleHideCategory(id);
      toast.success(`Đã ${isHidden ? 'hiện' : 'ẩn'} danh mục ${name}`);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setForm({ name: c.name, description: c.description || '', iconFile: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: '', description: '', iconFile: null });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {actionLoading && <LoadingOverlay message={editingId ? "Đang cập nhật..." : "Đang tạo danh mục..."} />}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Quản lý danh mục</h2>
        {editingId && (
          <Button variant="ghost" onClick={resetForm} className="text-gray-500">
            Hủy sửa
          </Button>
        )}
      </div>

      <Card className="p-6 border-none shadow-xl bg-white/50 backdrop-blur-sm space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          {editingId ? <Edit2 className="h-5 w-5 text-blue-600" /> : <Plus className="h-5 w-5 text-green-600" />}
          {editingId ? 'Sửa danh mục' : 'Thêm danh mục mới'}
        </h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên danh mục</label>
            <Input 
              placeholder="Ví dụ: Xe tay ga, Xe số..." 
              value={form.name} 
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} 
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mô tả</label>
            <Input 
              placeholder="Mô tả ngắn gọn..." 
              value={form.description} 
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} 
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Icon danh mục (Ảnh)</label>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setForm((p) => ({ ...p, iconFile: e.target.files?.[0] || null }))} 
              className="bg-white"
            />
            {editingId && <p className="text-[10px] text-gray-400">Để trống nếu không muốn thay đổi biểu tượng</p>}
          </div>
          <Button 
            onClick={handleSave} 
            className={`w-full h-12 text-base font-bold ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-black'}`}
          >
            {editingId ? 'Lưu thay đổi' : 'Tạo danh mục'}
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl text-gray-800">Danh sách hiện có</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{items.length} danh mục</span>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-gray-300" /></div>
        ) : (
          <div className="grid gap-4">
            {items.map((c) => (
              <Card key={c.id} className={`p-4 transition-all hover:shadow-md border-l-4 ${c.hidden ? 'border-l-amber-400 bg-gray-50 opacity-80' : 'border-l-green-500 bg-white'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {c.image && <img src={c.image} alt="" className="w-10 h-10 object-cover rounded-lg bg-gray-100" />}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900">{c.name}</p>
                        {c.hidden && <span className="text-[8px] bg-amber-100 text-amber-700 px-1 rounded uppercase font-bold tracking-tighter">Đang ẩn</span>}
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1">{c.description || 'Không có mô tả'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleToggleHide(c.id, c.name, c.hidden)} 
                      className={`border-gray-200 ${c.hidden ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-gray-500'}`}
                      title={c.hidden ? "Hiện danh mục" : "Ẩn danh mục"}
                    >
                      {c.hidden ? (
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
                    <Button variant="outline" size="sm" onClick={() => startEdit(c)} className="border-blue-100 text-blue-600 hover:bg-blue-50">
                      <Edit2 className="h-3.5 w-3.5 mr-1" />
                      Sửa
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id, c.name)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={confirmConfig.open} onOpenChange={(o) => setConfirmConfig(p => ({ ...p, open: o }))}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmConfig.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmConfig.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
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

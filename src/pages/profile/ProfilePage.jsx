import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { User, Mail, Phone, Camera, Loader2, ShieldCheck, Lock, Save, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import defaultAvatar from "@/assets/images/avatar.png";

export function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  
  const [formData, setFormData] = useState({ fullName: '', phone: '' });
  const [passData, setPassData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success) {
        setProfile(response.data);
        setFormData({
          fullName: response.data.fullName || '',
          phone: response.data.phone || ''
        });
      }
    } catch (error) {
      toast.error("Không thể tải thông tin hồ sơ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const avatarFile = fileInputRef.current.files[0];
      const response = await authService.updateProfile(formData, avatarFile);
      if (response.success) {
        toast.success("Cập nhật hồ sơ thành công!");
        window.location.reload();
      } else {
        toast.error(response.message || "Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      return toast.error("Mật khẩu mới không khớp");
    }

    setIsChangingPass(true);
    try {
      const response = await authService.changePassword(passData.oldPassword, passData.newPassword);
      if (response.success) {
        toast.success("Đổi mật khẩu thành công!");
        setIsChangingPass(false);
        setPassData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(response.message || "Mật khẩu cũ không chính xác");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsChangingPass(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column: Info & Avatar */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card>
            <CardContent className="pt-8 flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
                  <img 
                    src={avatarPreview || (profile.avatar && profile.avatar !== "" ? profile.avatar : defaultAvatar)} 
                    alt="Avatar" 
                    className={`w-full h-full object-cover ${isEditing ? 'group-hover:opacity-75' : '' } transition-opacity`}
                  />
                </div>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white drop-shadow-md" />
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-gray-900">{profile.fullName}</h2>
                <p className="text-sm text-gray-500 font-medium">{profile.role}</p>
                <div className="flex items-center justify-center mt-2 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-semibold ring-1 ring-green-100">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Đã xác thực
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500">Thông tin tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 mr-3 text-gray-400" />
                <span className="text-gray-900">{profile.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 mr-3 text-gray-400" />
                <span className="text-gray-900">{profile.phone || "Chưa cập nhật"}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Tabs/Forms */}
        <div className="w-full md:w-2/3 space-y-8">
          {/* Edit Profile */}
          <Card className="shadow-sm border-gray-100">
            <CardHeader>
              <CardTitle>Chỉnh sửa hồ sơ</CardTitle>
              <CardDescription>Cập nhật thông tin cá nhân của bạn.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input 
                    id="fullName" 
                    value={formData.fullName} 
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50 border-transparent focus:ring-0" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input 
                    id="phone" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50 border-transparent focus:ring-0" : ""}
                  />
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50/50 border-t pt-4">
                {isEditing ? (
                  <div className="flex gap-2 ml-auto">
                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Hủy</Button>
                    <Button disabled={isUpdating} className="bg-gray-900">
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Lưu thay đổi
                    </Button>
                  </div>
                ) : (
                  <Button type="button" onClick={() => setIsEditing(true)} className="ml-auto bg-blue-600 hover:bg-blue-700">
                    <Edit2 className="mr-2 h-4 w-4" />
                    Đổi thông tin
                  </Button>
                )}
              </CardFooter>
            </form>
          </Card>

          {/* Change Password */}
          <Card className="shadow-sm border-gray-100">
            <CardHeader>
              <CardTitle>Đổi mật khẩu</CardTitle>
              <CardDescription>Bảo vệ tài khoản bằng mật khẩu mạnh.</CardDescription>
            </CardHeader>
            <form onSubmit={handleChangePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
                  <Input 
                    id="oldPassword" 
                    type="password"
                    value={passData.oldPassword} 
                    onChange={(e) => setPassData({...passData, oldPassword: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      value={passData.newPassword} 
                      onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      value={passData.confirmPassword} 
                      onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50/50 border-t pt-4">
                <Button variant="outline" disabled={isChangingPass} className="ml-auto border-gray-300">
                  {isChangingPass && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Đổi mật khẩu
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

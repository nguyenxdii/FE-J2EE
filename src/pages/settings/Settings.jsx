import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';

const Settings = () => {
  const navigate = useNavigate();
  const [kycStatus, setKycStatus] = useState('NOT_VERIFIED');
  const [balance, setBalance] = useState(5000000); // Mặc định 5 triệu để Dino test

  // 1. Quản lý trạng thái thông tin cá nhân
  const [formData, setFormData] = useState({
    fullName: "Trần Lâm Chí Khanh",
    email: "khanhlmht0985@gmail.com",
    phone: "0332410796",
    language: "Tiếng Việt"
  });

  // 2. Lấy số dư ví thực tế từ Backend (nếu có)
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await userService.getWalletBalance();
        if (data) setBalance(data);
      } catch (error) {
        console.log("Sử dụng số dư mặc định để demo");
      }
    };
    fetchBalance();
  }, []);

  // 3. Xử lý thay đổi Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Đã lưu thay đổi thành công, Dino ơi!");
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa tài khoản vĩnh viễn không?");
    if (confirm) alert("Yêu cầu xóa đã được gửi đi.");
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-[1200px] mx-auto py-8 px-4">
        <section className="space-y-8">
          
          {/* 1. Tiêu đề trang */}
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl font-bold text-slate-800">Cài đặt tài khoản</h1>
            <p className="text-slate-500 text-sm">Cập nhật thông tin và quản lý ví của bạn</p>
          </div>

          {/* 2. Thẻ hồ sơ tóm tắt */}
          <div className="flex flex-col md:flex-row items-center justify-between bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img 
                  alt="Ảnh đại diện" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-50 shadow-sm" 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.fullName}`}
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{formData.fullName}</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded-full">Thành viên Premium</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  <span>TP. Hồ Chí Minh, Việt Nam</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tham gia từ</p>
              <p className="font-bold text-slate-700">Tháng 10, 2025</p>
            </div>
          </div>

          {/* 3. THẺ TÀI CHÍNH & BẢO MẬT (Xác minh + Số dư + Tin cậy) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cột 1 & 2: Xác minh KYC */}
            <div className={`md:col-span-2 p-8 rounded-3xl flex items-start gap-6 border transition-all ${
              kycStatus === 'APPROVED' ? 'bg-green-50 border-green-100' : 
              kycStatus === 'PENDING' ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'
            }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                kycStatus === 'APPROVED' ? 'bg-green-200' : kycStatus === 'PENDING' ? 'bg-blue-200' : 'bg-orange-200'
              }`}>
                <span className="material-symbols-outlined text-3xl">
                  {kycStatus === 'APPROVED' ? 'verified' : kycStatus === 'PENDING' ? 'pending' : 'shield_person'}
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-800">
                    Xác minh danh tính (KYC)
                    <span className={`ml-2 text-[10px] text-white px-2 py-0.5 rounded-full uppercase ${
                      kycStatus === 'APPROVED' ? 'bg-green-600' : kycStatus === 'PENDING' ? 'bg-blue-600' : 'bg-orange-600'
                    }`}>
                      {kycStatus === 'APPROVED' ? 'Đã xác thực' : kycStatus === 'PENDING' ? 'Đang chờ duyệt' : 'Chưa xác thực'}
                    </span>
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">Cần thiết để thực hiện các giao dịch ký gửi xe.</p>
                </div>
                {kycStatus === 'NOT_VERIFIED' && (
                  <button onClick={() => navigate('/kyc')} className="px-6 py-2 bg-white text-orange-700 border border-orange-200 font-bold rounded-xl hover:bg-orange-100 transition-all text-sm">
                    Bắt đầu xác minh ngay →
                  </button>
                )}
              </div>
            </div>

            {/* Cột 3: Số dư ví (MỚI THÊM) */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-blue-100 flex flex-col justify-center items-center text-center group hover:border-blue-300 transition-all">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-blue-600 text-3xl">account_balance_wallet</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-1">Số dư ví</h4>
              <p className="text-2xl font-black text-blue-600 tracking-tight">
                {balance.toLocaleString()} <span className="text-xs font-medium">VND</span>
              </p>
              <button 
                onClick={() => navigate('/wallet')}
                className="mt-4 text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-700"
              >
                Nạp thêm tiền
              </button>
            </div>
          </div>

          {/* 4. Form Thông tin & Độ tin cậy */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-3 text-slate-800">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Họ và tên</label>
                  <input name="fullName" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-slate-700 font-medium" type="text" value={formData.fullName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                  <input name="email" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-slate-700 font-medium" type="email" value={formData.email} onChange={handleChange} />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={handleSave} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all">Lưu thay đổi</button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-green-600 text-3xl block">verified_user</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-1">Độ tin cậy</h4>
              <p className="text-xs text-slate-400 mb-4">Bảo vệ lớp kép (2FA)</p>
              <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="w-2 h-2 rounded-full bg-slate-200"></span>
              </div>
            </div>
          </div>

          {/* 5. Vùng nguy hiểm */}
          <div className="border border-red-100 bg-red-50/30 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-red-600">Vùng nguy hiểm</h4>
              <p className="text-xs text-slate-500 mt-1">Xóa vĩnh viễn tài khoản. Hành động này không thể hoàn tác.</p>
            </div>
            <button onClick={handleDeleteAccount} className="px-6 py-2.5 text-red-600 font-bold border border-red-200 rounded-xl hover:bg-red-600 hover:text-white transition-all">Xóa tài khoản</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';

export default function UploadKYC() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Bước 1: Chọn loại, Bước 2: Up ảnh
  const [docType, setDocType] = useState('CCCD'); 
  const [loading, setLoading] = useState(false);

  // State cho file và preview của 2 mặt
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);

  // Xử lý chọn ảnh cho từng mặt
  const handleFileChange = (e, side) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (side === 'front') {
        setFrontFile(selectedFile);
        setFrontPreview(URL.createObjectURL(selectedFile));
      } else {
        setBackFile(selectedFile);
        setBackPreview(URL.createObjectURL(selectedFile));
      }
    }
  };

  // Hàm gửi dữ liệu lên Server
  const handleUpload = async () => {
    if (!frontFile || !backFile) return alert("Dino ơi, bạn cần tải lên cả mặt trước và mặt sau nhé!");
    
    setLoading(true);
    try {
      // Gửi mặt trước
      const res1 = await userService.uploadKYC(frontFile);
      // Gửi mặt sau (Nếu API của bạn hỗ trợ gửi 2 file thì gộp lại, ở đây mình giả định gửi lần lượt)
      const res2 = await userService.uploadKYC(backFile);
      
      if (res1.success && res2.success) {
        alert("Tuyệt vời Dino! Hồ sơ đã gửi thành công. Chờ Admin duyệt nhé.");
        navigate('/settings');
      }
    } catch (error) {
      alert("Có lỗi khi upload ảnh rồi Dino!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f9fb] min-h-screen flex flex-col font-['Inter']">
      {/* 1. Top AppBar (Cập nhật theo Step) */}
      {/* Thay thế đoạn header cũ bằng đoạn này */}
<header className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100">
  <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-4">
      <button 
        onClick={() => step === 2 ? setStep(1) : navigate('/settings')} 
        className="p-2 hover:bg-gray-100 rounded-full transition-all"
      >
        <span className="material-symbols-outlined text-blue-600">arrow_back</span>
      </button>
      {/* ĐÃ ĐỔI THÀNH TIẾNG VIỆT Ở ĐÂY */}
      <h1 className="font-['Manrope'] font-bold text-lg text-slate-900">Xác minh danh tính</h1>
    </div>
    <div className="flex items-center gap-2">
      <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full bg-blue-600 transition-all duration-500 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
      </div>
      {/* ĐÃ ĐỔI THÀNH BƯỚC Ở ĐÂY */}
      <span className="text-xs font-bold text-blue-600">Bước {step}/2</span>
    </div>
  </div>
</header>

      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-12">
        {step === 1 ? (
          /* --- BƯỚC 1: CHỌN LOẠI GIẤY TỜ --- */
          <section className="animate-in fade-in duration-500">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-['Manrope'] font-extrabold mb-3">Chọn loại giấy tờ xác thực</h2>
              <p className="text-gray-500">Vui lòng chọn loại giấy tờ bạn đang có sẵn</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => setDocType('CCCD')}
                className={`group p-8 rounded-[2rem] border-2 text-left transition-all relative ${docType === 'CCCD' ? 'border-blue-600 bg-white shadow-xl' : 'border-transparent bg-white/50'}`}
              >
                {docType === 'CCCD' && <div className="absolute top-6 right-6 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-white text-xs">check</span></div>}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${docType === 'CCCD' ? 'bg-blue-50' : 'bg-gray-100'}`}>
                  <span className="material-symbols-outlined text-4xl text-blue-600">badge</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Căn cước công dân</h3>
                <p className="text-gray-500 text-sm">Dùng CCCD gắn chíp hoặc chứng minh nhân dân cũ.</p>
              </button>

              <button 
                onClick={() => setDocType('PASSPORT')}
                className={`group p-8 rounded-[2rem] border-2 text-left transition-all relative ${docType === 'PASSPORT' ? 'border-blue-600 bg-white shadow-xl' : 'border-transparent bg-white/50'}`}
              >
                {docType === 'PASSPORT' && <div className="absolute top-6 right-6 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-white text-xs">check</span></div>}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${docType === 'PASSPORT' ? 'bg-blue-50' : 'bg-gray-100'}`}>
                  <span className="material-symbols-outlined text-4xl text-blue-600">travel_explore</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Hộ chiếu</h3>
                <p className="text-gray-500 text-sm">Sử dụng hộ chiếu phổ thông còn thời hạn.</p>
              </button>
            </div>
          </section>
        ) : (
          /* --- BƯỚC 2: TẢI ẢNH 2 MẶT (Bento Grid Style) --- */
          <section className="animate-in fade-in duration-500">
            <div className="mb-10 text-left">
              <h2 className="text-3xl font-['Manrope'] font-extrabold mb-3">Tải ảnh giấy tờ tùy thân</h2>
              <p className="text-gray-500 text-sm">Vui lòng cung cấp hình ảnh rõ nét của {docType === 'CCCD' ? 'CMND/CCCD' : 'Hộ chiếu'}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mặt trước */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase ml-1">Mặt trước</p>
                <div className="relative group aspect-[1.6/1]">
                  <input type="file" onChange={(e) => handleFileChange(e, 'front')} className="hidden" id="front" accept="image/*" />
                  <label htmlFor="front" className="block w-full h-full border-2 border-dashed border-blue-200 rounded-[1.5rem] bg-white cursor-pointer hover:border-blue-600 transition-all overflow-hidden">
                    {frontPreview ? (
                      <img src={frontPreview} className="w-full h-full object-cover" alt="Front" />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center bg-blue-50/30">
                         <span className="material-symbols-outlined text-4xl text-blue-600/40 mb-2">add_a_photo</span>
                         <p className="text-xs font-bold text-blue-600/60">Tải lên mặt trước</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Mặt sau */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase ml-1">Mặt sau</p>
                <div className="relative group aspect-[1.6/1]">
                  <input type="file" onChange={(e) => handleFileChange(e, 'back')} className="hidden" id="back" accept="image/*" />
                  <label htmlFor="back" className="block w-full h-full border-2 border-dashed border-blue-200 rounded-[1.5rem] bg-white cursor-pointer hover:border-blue-600 transition-all overflow-hidden">
                    {backPreview ? (
                      <img src={backPreview} className="w-full h-full object-cover" alt="Back" />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center bg-blue-50/30">
                         <span className="material-symbols-outlined text-4xl text-blue-600/40 mb-2">add_a_photo</span>
                         <p className="text-xs font-bold text-blue-600/60">Tải lên mặt sau</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-10 p-4 bg-blue-50 rounded-2xl flex items-start gap-3 border border-blue-100">
              <span className="material-symbols-outlined text-blue-600">verified_user</span>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Dữ liệu được mã hóa và bảo mật theo tiêu chuẩn <b>ISO 27001</b>. Chúng tôi cam kết không chia sẻ thông tin cho bên thứ ba.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* 4. Footer Fixed */}
      <footer className="p-8 bg-white border-t border-gray-100 sticky bottom-0 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => step === 2 ? setStep(1) : navigate('/settings')}
            className="px-8 py-3 text-gray-500 font-bold hover:text-gray-800"
          >
            Quay lại
          </button>
          
          <button 
            onClick={() => step === 1 ? setStep(2) : handleUpload()}
            disabled={loading}
            className={`px-12 py-4 rounded-full font-bold shadow-lg transition-all active:scale-95 ${loading ? 'bg-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}`}
          >
            {step === 1 ? "Tiếp tục" : (loading ? "Đang gửi..." : "Hoàn tất")}
          </button>
        </div>
      </footer>
    </div>
  );
}
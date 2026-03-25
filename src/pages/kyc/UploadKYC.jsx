import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { userService } from '@/services/userService';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  Loader2, 
  CreditCard, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

export default function UploadKYC() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState('CCCD'); 
  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState(null); // 'PENDING', 'VERIFIED', 'REJECTED', null
  const [initialLoading, setInitialLoading] = useState(true);

  React.useEffect(() => {
    userService.getProfile().then(res => {
      if (res.success) {
        setKycStatus(res.data.identity?.verifyStatus);
      }
      setInitialLoading(false);
    });
  }, []);

  // State quản lý files
  const [files, setFiles] = useState({
    cccdFront: null,
    cccdBack: null,
    drivingLicense: null
  });

  const [previews, setPreviews] = useState({
    cccdFront: null,
    cccdBack: null,
    drivingLicense: null
  });

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [key]: file }));
      setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
    }
  };

  const handleUpload = async () => {
    if (docType === 'CCCD' && (!files.cccdFront || !files.cccdBack)) {
      return toast.error("Vui lòng tải lên đầy đủ 2 mặt CCCD");
    }
    if (docType === 'LICENSE' && !files.drivingLicense) {
      return toast.error("Vui lòng tải lên ảnh Bằng lái xe");
    }

    setLoading(true);
    try {
      const res = await userService.uploadIdentity(files);
      if (res.success) {
        toast.success("Hồ sơ đã được gửi thành công. Vui lòng chờ kiểm duyệt!");
        navigate('/profile');
      } else {
        toast.error(res.message || "Có lỗi xảy ra khi tải lên");
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Đang kiểm tra hồ sơ...</p>
      </div>
    );
  }

  if (kycStatus === 'PENDING') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50/50 p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6 rounded-[2.5rem] shadow-2xl bg-white border-none">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600">
            <Clock className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">Hồ sơ đang chờ duyệt</h2>
            <p className="text-gray-500">Chúng tôi đã nhận được hồ sơ xác minh của bạn. Vui lòng chờ 1-2 ngày làm việc để hệ thống xem xét.</p>
          </div>
          <Button onClick={() => navigate('/profile')} className="w-full h-12 rounded-2xl bg-gray-900">Quay lại hồ sơ</Button>
        </Card>
      </div>
    );
  }

  if (kycStatus === 'VERIFIED') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50/50 p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6 rounded-[2.5rem] shadow-2xl bg-white border-none">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">Đã xác minh thành công</h2>
            <p className="text-gray-500">Tài khoản của bạn đã được xác thực chính chủ. Bạn có thể sử dụng đầy đủ các tính năng của ShopCar.</p>
          </div>
          <Button onClick={() => navigate('/profile')} className="w-full h-12 rounded-2xl bg-blue-600">Quay lại hồ sơ</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50 py-12 px-4 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => step === 1 ? navigate('/profile') : setStep(1)} className="gap-2 text-gray-500 hover:bg-white">
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <div className="flex items-center gap-2">
             {[1, 2].map((i) => (
               <div key={i} className={`h-2 w-12 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-gray-200'} transition-all duration-500`} />
             ))}
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Xác minh danh tính</h1>
              <p className="text-gray-500 text-lg">Chọn loại giấy tờ bạn muốn sử dụng để xác thực tài khoản</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className={`cursor-pointer transition-all border-2 rounded-[2rem] ${docType === 'CCCD' ? 'border-blue-600 bg-white shadow-2xl shadow-blue-100' : 'border-transparent bg-white/50 hover:border-gray-200'}`}
                onClick={() => setDocType('CCCD')}
              >
                <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                  <div className={`p-5 rounded-3xl ${docType === 'CCCD' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-500'}`}>
                    <CreditCard className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">Căn cước công dân</h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">Sử dụng CCCD gắn chip hoặc CMND còn hạn</p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all border-2 rounded-[2rem] ${docType === 'LICENSE' ? 'border-blue-600 bg-white shadow-2xl shadow-blue-100' : 'border-transparent bg-white/50 hover:border-gray-200'}`}
                onClick={() => setDocType('LICENSE')}
              >
                <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                  <div className={`p-5 rounded-3xl ${docType === 'LICENSE' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-500'}`}>
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">Bằng lái xe</h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">Sử dụng giấy phép lái xe ô tô/xe máy cấp bởi Bộ GTVT</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-6 rounded-[1.5rem] flex gap-4 shadow-sm">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
              <div className="text-xs text-amber-800 leading-relaxed">
                <b className="text-sm block mb-1">Quy định xác thực:</b>
                Hệ thống yêu cầu xác minh để đảm bảo an toàn cho các giao dịch thuê xe. 
                Bạn chỉ cần cung cấp <b>mặt trước và mặt sau</b> đối với CCCD, hoặc <b>ảnh chụp mặt trước</b> đối với Bằng lái xe. 
                Hình ảnh cần rõ nét, không bị lóa sáng và phải là ảnh chụp bản gốc.
              </div>
            </div>

            <Button className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-[1.5rem] group shadow-xl shadow-blue-200 transition-all hover:scale-[1.02]" onClick={() => setStep(2)}>
              Tiếp tục
              <ArrowLeft className="w-6 h-6 ml-2 rotate-180 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight text-center">
                 Tải lên hình ảnh
              </h1>
               <p className="text-gray-500 italic">"Hãy đảm bảo ảnh chụp không bị rung, mờ và đủ ánh sáng"</p>
            </div>

            {/* Warning Note - Moved here to be shown once */}
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0 text-amber-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-amber-900 font-black uppercase text-xs tracking-widest">Lưu ý quan trọng</h4>
                <div className="text-amber-800 text-sm leading-relaxed">
                  Nếu bạn không có bằng lái xe hợp lệ hoặc bằng lái không đủ điều kiện vận hành loại xe đã đặt, 
                  bạn sẽ <b>không được phép nhận xe</b> và có thể bị <b>khấu trừ 100% tiền cọc</b> theo quy định của ShopCar.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {docType === 'CCCD' ? (
                <>
                  <UploadField 
                    label="Mặt trước CCCD" 
                    preview={previews.cccdFront} 
                    onChange={(e) => handleFileChange(e, 'cccdFront')} 
                  />
                  <UploadField 
                    label="Mặt sau CCCD" 
                    preview={previews.cccdBack} 
                    onChange={(e) => handleFileChange(e, 'cccdBack')} 
                  />
                </>
              ) : (
                <div className="md:col-span-2 max-w-md mx-auto w-full">
                  <UploadField 
                    label="Ảnh Bằng lái xe (Mặt trước)" 
                    preview={previews.drivingLicense} 
                    onChange={(e) => handleFileChange(e, 'drivingLicense')} 
                  />
                </div>
              )}
            </div>

            <div className="space-y-4 pt-8">
              <Button 
                className="w-full h-16 bg-gray-900 hover:bg-black text-white text-lg font-black rounded-[1.5rem] shadow-xl shadow-gray-200 transition-all hover:scale-[1.02]" 
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <CheckCircle2 className="w-6 h-6 mr-3 text-green-400" />}
                Xác nhận & Gửi hồ sơ
              </Button>
              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium tracking-wide">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                DỮ LIỆU ĐƯỢC BẢO MẬT TUYỆT ĐỐI THEO TIÊU CHUẨN ISO 27001
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UploadField({ label, preview, onChange }) {
  return (
    <div className="space-y-4">
      <label className="text-sm font-black text-gray-600 uppercase tracking-widest ml-1">{label}</label>

      <div className="relative aspect-[1.58/1] rounded-[2rem] border-2 border-dashed border-gray-200 bg-white hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-100 transition-all cursor-pointer overflow-hidden group">
        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={onChange} accept="image/*" />
        {preview ? (
          <img src={preview} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
            <div className="p-4 bg-gray-50 rounded-full text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300">
              <Upload className="w-8 h-8" />
            </div>
            <p className="text-xs font-bold text-gray-400 group-hover:text-blue-600 uppercase tracking-tighter">Nhấn để tải ảnh lên</p>
          </div>
        )}
      </div>
    </div>
  );
}
import { Loader2 } from 'lucide-react';

export function LoadingOverlay({ message = "Đang xử lý..." }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center space-y-4 max-w-xs w-full">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-40"></div>
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin relative z-10" />
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-900">{message}</p>
          <p className="text-xs text-gray-500 mt-1">Vui lòng không tắt trình duyệt</p>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Loader2, ArrowLeft, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { walletService } from '@/services/walletService';

export function WalletCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error

  useEffect(() => {
    const confirmTx = async () => {
      // Chuyển toàn bộ searchParams thành object
      const params = Object.fromEntries(searchParams.entries());
      const resultCode = params.resultCode;
      
      try {
        // Gọi backend để cập nhật trạng thái ngay lập tức (dùng cho môi trường Local thiếu IPN)
        await walletService.confirmTransaction(params);
        
        if (resultCode === '0') {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error('Lỗi khi confirm giao dịch:', err);
        if (resultCode === '0') {
          setStatus('success');
        } else {
          setStatus('error');
        }
      }
    };

    confirmTx();
  }, [searchParams]);

  const amount = searchParams.get('amount');
  const message = searchParams.get('message') || 'Giao dịch không thành công';

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amt);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-8 text-center space-y-6">
          {status === 'loading' && (
            <div className="py-12 flex flex-col items-center space-y-4">
              <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
              <p className="text-gray-500 font-medium">Đang xác thực giao dịch...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="animate-in zoom-in duration-500">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle2 className="w-20 h-20 text-green-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Thanh toán thành công!</h2>
              <p className="text-gray-500 mt-2">Cảm ơn bạn. Số tiền đã được cộng vào ví.</p>
              
              {amount && (
                <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Số tiền nạp</p>
                  <p className="text-2xl font-black text-blue-600">{formatCurrency(amount)}</p>
                </div>
              )}
            </div>
          )}

          {status === 'error' && (
            <div className="animate-in zoom-in duration-500">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 p-4 rounded-full">
                  <XCircle className="w-20 h-20 text-red-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Thanh toán thất bại</h2>
              <p className="text-gray-500 mt-2">{message}</p>
            </div>
          )}

          <div className="pt-6 space-y-3">
            <Button 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
              onClick={() => navigate('/wallet')}
            >
              <Wallet className="mr-2 h-5 w-5" />
              Quay lại ví của tôi
            </Button>
            <Button 
              variant="ghost" 
              className="w-full h-12 text-gray-500 hover:bg-gray-50"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { depositService } from '@/services/depositService';
import { ListingCard } from '@/components/shared/ListingCard';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  ShoppingBag, 
  Wallet, 
  CreditCard, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { VehicleDetailModal } from '@/components/shared/VehicleDetailModal';

export function MarketplacePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await depositService.getListings();
      if (res.success) {
        setListings(res.data);
      }
    } catch (error) {
      toast.error('Không thể tải danh sách suất cọc');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBuyDialog = (listing) => {
    setSelectedListing(listing);
    setIsBuyDialogOpen(true);
  };

  const handleConfirmPurchase = async (paymentMethod) => {
    if (!selectedListing) return;

    try {
      setIsPurchasing(true);
      const res = await depositService.buyListing(selectedListing.id, paymentMethod);
      
      if (res.success) {
        if (paymentMethod === 'MOMO' && res.data.payUrl) {
          toast.success('Đang chuyển hướng đến MoMo...');
          window.location.href = res.data.payUrl;
        } else {
          toast.success('Mua suất cọc thành công!');
          setIsBuyDialogOpen(false);
          fetchListings(); // Refresh list
          // Redirect to my orders to see the new order
          setTimeout(() => navigate('/my-orders'), 2000);
        }
      } else {
        toast.error(res.message || 'Giao dịch thất bại');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi thực hiện giao dịch');
    } finally {
      setIsPurchasing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 border-b border-indigo-500/30 py-16 mb-10">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 shadow-xl border border-white/10">
            <ShoppingBag className="w-8 h-8 text-blue-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-md">
            Chợ Suất Cọc <span className="text-blue-400">ShopCar</span>
          </h1>
          <p className="text-blue-100/80 text-lg max-w-2xl mx-auto font-medium">
            Săn deal siêu hời. Tiết kiệm chi phí với các suất thuê xe sang nhượng từ cộng đồng người dùng.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {listings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Hiện chưa có suất cọc nào được rao bán</h3>
                <p className="text-gray-500 mt-2">Hãy quay lại sau hoặc đăng bán suất cọc của bạn nhé!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {listings.map((listing) => listing && (
                  <ListingCard 
                    key={listing.id} 
                    listing={listing} 
                    onBuy={handleOpenBuyDialog} 
                    onViewDetails={(v) => {
                      // Map to Home-style car object for modal
                      setSelectedCar({
                        ...v,
                        make: v.brand,
                        price: v.pricePerDay,
                        fuelType: v.specs?.fuelType,
                        transmission: v.specs?.transmission,
                        image: v.images?.[0],
                        originalData: v
                      });
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <VehicleDetailModal
        car={selectedCar}
        isOpen={!!selectedCar}
        onClose={() => setSelectedCar(null)}
      />

      {/* Buy Confirmation Dialog */}
      <Dialog open={isBuyDialogOpen} onOpenChange={setIsBuyDialogOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white rounded-3xl overflow-hidden p-0 border-none shadow-2xl">
          <div className="bg-gray-900 p-8 text-white relative">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black flex items-center tracking-tight">
                Xác nhận mua lại
              </DialogTitle>
              <DialogDescription className="text-gray-400 mt-2">
                Bạn đang mua suất cọc xe {selectedListing?.order?.vehicle?.model || 'này'}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
              <span className="text-gray-500 font-medium">Giá cần thanh toán</span>
              <span className="text-xl font-black text-blue-700">
                {selectedListing && formatCurrency(selectedListing?.sellingPrice || 0)}
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-700 ml-1">Chọn phương thức thanh toán:</p>
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  variant="outline"
                  className="h-16 justify-between px-6 border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50/30 rounded-2xl group transition-all"
                  onClick={() => handleConfirmPurchase('WALLET')}
                  disabled={isPurchasing}
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-xl mr-4 text-blue-600 group-hover:scale-110 transition-transform">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">Ví ShopCar</p>
                      <p className="text-[10px] text-gray-500">Thanh toán ngay bằng số dư ví</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                </Button>

                <Button 
                  variant="outline"
                  className="h-16 justify-between px-6 border-2 border-gray-100 hover:border-[#D13B63] hover:bg-[#D13B63]/5 rounded-2xl group transition-all"
                  onClick={() => handleConfirmPurchase('MOMO')}
                  disabled={isPurchasing}
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-[#D13B63]/10 rounded-xl mr-4 text-[#D13B63] group-hover:scale-110 transition-transform">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">Ví MoMo</p>
                      <p className="text-[10px] text-gray-500">Cổng thanh toán MoMo an toàn</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#D13B63]" />
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[10px] text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
              <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
              <p>Lưu ý: Sau khi mua, suất cọc sẽ thuộc sở hữu của bạn. Số tiền cọc gốc sẽ được dùng để đối trừ khi bạn nhận xe thực tế.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

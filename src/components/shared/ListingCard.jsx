import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Calendar, Tag, Info, ShoppingCart, User } from "lucide-react";
import dayjs from "dayjs";

export function ListingCard({ listing, onBuy, onViewDetails }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };


  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-none shadow-lg bg-white group">
      <div className="relative h-48 overflow-hidden bg-gray-50 flex items-center justify-center">
        <ImageWithFallback
          src={listing.vehicleImage}
          alt={listing.vehicleName || 'Car'}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-blue-600/90 backdrop-blur-md text-white border-none px-3 py-1">
            Đang rao bán
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-white text-xs font-medium flex items-center">
            <User className="w-3 h-3 mr-1" />
            Người bán: {listing.sellerFullName || 'Người dùng ShopCar'}
          </p>
        </div>
      </div>
      
      <CardContent className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
            {listing.vehicleBrand} {listing.vehicleName}
          </h3>
          <div className="flex items-center text-xs text-gray-400 mt-1">
            <Calendar className="w-3 h-3 mr-1" />
            Hết hạn: {dayjs(listing.expiredAt).format('DD/MM/YYYY')}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">Tiền cọc gốc</p>
            <p className="text-sm font-semibold text-gray-500 line-through decoration-red-300">
              {formatPrice(listing.originalDeposit || 0)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-blue-500 uppercase font-black tracking-tighter">Giá sang nhượng</p>
            <p className="text-xl font-black text-blue-700">
              {formatPrice(listing.sellingPrice)}
            </p>
          </div>
        </div>

        {(listing.originalDeposit || 0) > 0 && (listing.sellingPrice || 0) < (listing.originalDeposit || 0) && (
          <div className="flex items-center justify-between text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-fit">
            <Tag className="w-3.5 h-3.5 mr-1.5" />
            <span className="font-bold">
              Tiết kiệm {Math.round((1 - (listing.sellingPrice || 0) / listing.originalDeposit) * 100)}%
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-5 pt-0 gap-2">
        <Button 
          variant="outline"
          className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl"
          onClick={() => onViewDetails && onViewDetails({ id: listing.vehicleId, brand: listing.vehicleBrand, name: listing.vehicleName })}
        >
          <Info className="w-4 h-4 mr-2" />
          Chi tiết xe
        </Button>
        <Button 
          onClick={() => onBuy(listing)} 
          className="flex-1 bg-gray-900 hover:bg-black text-white shadow-md"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Mua ngay
        </Button>
      </CardFooter>
    </Card>
  );
}

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Calendar, Fuel, Settings, MapPin } from "lucide-react";

export function VehicleCard({ car, onViewDetails }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  const deduplicate = (str) => {
    if (!str) return str;
    return Array.from(new Set(str.split(',').map(s => s.trim()))).join(', ');
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
        <ImageWithFallback
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
          {car.make} {car.model}
        </h3>
        <p className="text-2xl mb-3 text-blue-600 font-bold">
          {formatPrice(car.price)}
          <span className="text-sm text-gray-500 font-normal ml-1">/ ngày</span>
        </p>
        <div className="grid grid-cols-2 gap-y-2 text-[13px] text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="line-clamp-1">Số km: {formatMileage(car.mileage)} km</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-gray-400" />
            <span className="line-clamp-1">Nhiên liệu: {deduplicate(car.fuelType)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-400" />
            <span className="line-clamp-1">Hộp số: {deduplicate(car.transmission)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="truncate">Khu vực: {car.location || 'Hồ Chí Minh'}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onViewDetails(car)} 
          className="w-full"
        >
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
}

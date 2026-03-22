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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <ImageWithFallback
          src={car.image}
          alt={`${car.year} ${car.make} ${car.model}`}
          className="w-full h-48 object-cover"
        />
        <Badge 
          className="absolute top-2 left-2" 
          variant={car.condition === 'New' ? 'default' : car.condition === 'Certified' ? 'secondary' : 'outline'}
        >
          {car.condition === 'New' ? 'Mới' : car.condition === 'Used' ? 'Cũ' : car.condition}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="mb-2">
          {car.year} {car.make} {car.model}
        </h3>
        <p className="text-2xl mb-3 text-blue-600">
          {formatPrice(car.price)}
          <span className="text-sm text-gray-500 font-normal ml-1">/ ngày</span>
        </p>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatMileage(car.mileage)} miles</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{car.location}</span>
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import {
  Calendar,
  Fuel,
  Settings,
  MapPin,
  Phone,
  Mail,
  Heart,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function VehicleDetailModal({
  car,
  isOpen,
  onClose,
}) {
  if (!car) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat("vi-VN").format(mileage);
  };

  const deduplicate = (str) => {
    if (!str) return str;
    return Array.from(new Set(str.split(',').map(s => s.trim()))).join(', ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {car.year} {car.make} {car.model}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative">
              <ImageWithFallback
                src={car.image}
                alt={`${car.make} ${car.model}`}
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            {/* Additional images placeholder */}
            <div className="grid grid-cols-3 gap-2">
              {(car.originalData?.images || [car.image]).map(
                (img, i) => (
                  <ImageWithFallback
                    key={i}
                    src={img}
                    alt={`${car.make} ${car.model} view ${i}`}
                    className="w-full h-16 object-cover rounded cursor-pointer hover:opacity-80"
                  />
                ),
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <div>
              <p className="text-3xl text-blue-600 font-bold">
                {formatPrice(car.price)}{" "}
                <span className="text-lg text-gray-500 font-normal">
                  / ngày
                </span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Số km đã đi</p>
                  <p className="font-semibold text-gray-900">{formatMileage(car.mileage)} km</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Fuel className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Nhiên liệu</p>
                  <p className="font-semibold text-gray-900">{deduplicate(car.fuelType)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Settings className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Hộp số</p>
                  <p className="font-semibold text-gray-900">{deduplicate(car.transmission)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Car className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Dòng xe</p>
                  <p className="font-semibold text-gray-900">{car.model}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2">Mô tả chi tiết</h3>
              <p className="text-gray-600">
                {car.description ||
                  `Chiếc ${car.make} ${car.model} đời ${car.year} này đang trong tình trạng tuyệt vời và được trang bị đầy đủ các tính năng hiện đại. Phù hợp cho việc đi đi lại hàng ngày và các chuyến đi cuối tuần.`}
              </p>
            </div>

            <div>
              <h3 className="mb-2">Tính năng nổi bật</h3>
              <div className="flex flex-wrap gap-2">
                {(
                  car.features || [
                    "Phanh ABS",
                    "Khởi động thông minh",
                    "Tiết kiệm xăng",
                    "Đèn LED",
                    "Cốp rộng",
                  ]
                ).map((feature, index) => (
                  <Badge key={index} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Dealer Information */}
            <div>
              <h3 className="mb-2">Thông tin liên hệ</h3>
              <div className="space-y-2">
                <p>{car.dealer?.name || "Cửa hàng xe máy Premium"}</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{car.dealer?.phone || "090 123 4567"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{car.dealer?.email || "contact@premiumcar.com"}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Gọi ngay
              </Button>
              <Button variant="outline" className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Gửi tin nhắn
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

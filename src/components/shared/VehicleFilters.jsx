import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export function VehicleFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  availableMakes = ['Tất cả hãng', 'Honda', 'Yamaha', 'Suzuki', 'VinFast'],
  availableYears = ['Tất cả năm', '2024', '2023', '2022', '2021', '2020']
}) {
  const fuelTypes = ['Tất cả loại nhiên liệu', 'Xăng', 'Điện'];
  const transmissions = ['Tất cả hộp số', 'Số', 'Tay ga', 'Côn tay'];
  const conditions = ['Tất cả tình trạng', 'Mới', 'Cũ'];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bộ lọc tìm kiếm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="make">Hãng xe</Label>
          <Select 
            value={filters.make} 
            onValueChange={(value) => onFiltersChange({ ...filters, make: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn hãng xe" />
            </SelectTrigger>
            <SelectContent>
              {availableMakes.map((make) => (
                <SelectItem key={make} value={make}>{make}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Khoảng giá (mỗi ngày)</Label>
          <div className="px-2 py-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value })}
              max={1000000}
              min={0}
              step={10000}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
        </div>

        <div>
          <Label htmlFor="year">Năm sản xuất</Label>
          <Select 
            value={filters.year} 
            onValueChange={(value) => onFiltersChange({ ...filters, year: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fuel">Loại nhiên liệu</Label>
          <Select 
            value={filters.fuelType} 
            onValueChange={(value) => onFiltersChange({ ...filters, fuelType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn nhiên liệu" />
            </SelectTrigger>
            <SelectContent>
              {fuelTypes.map((fuel) => (
                <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="transmission">Hộp số</Label>
          <Select 
            value={filters.transmission} 
            onValueChange={(value) => onFiltersChange({ ...filters, transmission: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn hộp số" />
            </SelectTrigger>
            <SelectContent>
              {transmissions.map((transmission) => (
                <SelectItem key={transmission} value={transmission}>{transmission}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="condition">Tình trạng</Label>
          <Select 
            value={filters.condition} 
            onValueChange={(value) => onFiltersChange({ ...filters, condition: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn tình trạng" />
            </SelectTrigger>
            <SelectContent>
              {conditions.map((condition) => (
                <SelectItem key={condition} value={condition}>{condition}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={onClearFilters} variant="outline" className="w-full">
          Xóa tất cả bộ lọc
        </Button>
      </CardContent>
    </Card>
  );
}

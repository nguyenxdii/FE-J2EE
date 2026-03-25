import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export function VehicleFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  categories = [],
  availableMakes = ['Tất cả hãng', 'Honda', 'Yamaha', 'Suzuki', 'VinFast'],
  availableYears = ['Tất cả năm', '2024', '2023', '2022', '2021', '2020']
}) {
  const fuelTypes = ['Tất cả loại nhiên liệu', 'Xăng', 'Điện'];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
      <CardHeader className="pb-3 pt-6 px-6">
        <CardTitle className="text-lg font-bold text-gray-900 border-l-4 border-blue-600 pl-3">Bộ lọc tìm kiếm</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-xs font-black text-black uppercase tracking-widest pl-1">Loại xe</Label>
          <Select 
            value={filters.categoryId || "all"} 
            onValueChange={(value) => onFiltersChange({ ...filters, categoryId: value === "all" ? "" : value })}
          >
            <SelectTrigger className="h-11 rounded-xl bg-gray-50 border-none">
              <SelectValue placeholder="Chọn loại xe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại xe</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="make" className="text-xs font-black text-black uppercase tracking-widest pl-1">Hãng xe</Label>
          <Select 
            value={filters.make} 
            onValueChange={(value) => onFiltersChange({ ...filters, make: value })}
          >
            <SelectTrigger className="h-11 rounded-xl bg-gray-50 border-none">
              <SelectValue placeholder="Chọn hãng xe" />
            </SelectTrigger>
            <SelectContent>
              {availableMakes.map((make) => (
                <SelectItem key={make} value={make}>{make}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-black text-black uppercase tracking-widest pl-1">Giá / ngày</Label>
          <div className="px-2 pt-1 font-bold">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value })}
              max={2000000}
              min={0}
              step={10000}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-black">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year" className="text-xs font-black text-black uppercase tracking-widest pl-1">Năm sản xuất</Label>
          <Select 
            value={filters.year} 
            onValueChange={(value) => onFiltersChange({ ...filters, year: value })}
          >
            <SelectTrigger className="h-11 rounded-xl bg-gray-50 border-none">
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
           <Label htmlFor="fuel" className="text-xs font-black text-black uppercase tracking-widest pl-1">Nhiên liệu</Label>
          <Select 
            value={filters.fuelType} 
            onValueChange={(value) => onFiltersChange({ ...filters, fuelType: value })}
          >
            <SelectTrigger className="h-11 rounded-xl bg-gray-50 border-none">
              <SelectValue placeholder="Chọn nhiên liệu" />
            </SelectTrigger>
            <SelectContent>
              {fuelTypes.map((fuel) => (
                <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
            onClick={onClearFilters} 
            variant="outline" 
            className="w-full h-11 border-black text-black hover:bg-gray-100 font-bold rounded-xl transition-all mt-4"
        >
          Xóa tất cả bộ lọc
        </Button>
      </CardContent>
    </Card>
  );
}

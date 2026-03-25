import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';
import { vehicleService } from '@/services/vehicleService';
import { VehicleCard } from '@/components/shared/VehicleCard';

export function VehicleSearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brand, setBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rentalDate, setRentalDate] = useState('');
  const [sort, setSort] = useState('ratingDesc'); // ratingDesc | priceAsc | priceDesc

  const mappedVehicles = useMemo(() => {
    return vehicles.map((v) => ({
      id: v.id,
      make: v.brand,
      model: v.model,
      year: v.year,
      price: v.pricePerDay,
      mileage: v.mileage || 0,
      fuelType: v.specs?.fuelType || 'Xăng',
      transmission: v.specs?.transmission || 'Tự động',
      location: v.location || 'Hà Nội',
      image: v.images?.[0] || 'https://placehold.co/600x400?text=No+Image',
      condition: v.year >= 2023 ? 'New' : 'Used',
      description: v.description,
      originalData: v
    }));
  }, [vehicles]);

  const runSearch = async (override = {}) => {
    const nextSort = override.sort ?? sort;
    setLoading(true);
    try {
      const res = await vehicleService.searchVehicles({
        keyword,
        categoryId: categoryId || undefined,
        brand: brand || undefined,
        minPrice: minPrice === '' ? null : Number(minPrice),
        maxPrice: maxPrice === '' ? null : Number(maxPrice),
        rentalDate: rentalDate || undefined,
        sort: nextSort
      });
      setVehicles(res);
    } catch (e) {
      console.error('searchVehicles failed', e);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      setLoading(true);
      try {
        const [cRes, vRes] = await Promise.all([
          vehicleService.getCategories(),
          vehicleService.getVehicles()
        ]);

        if (cancelled) return;
        setCategories(cRes);
        const categoryFromQuery = searchParams.get('categoryId');
        if (categoryFromQuery) {
          setCategoryId(categoryFromQuery);
        }

        const uniqueBrands = Array.from(new Set(vRes.map((v) => v.brand))).sort();
        setBrands(uniqueBrands);

        const initialRes = await vehicleService.searchVehicles({
          sort: 'ratingDesc',
          categoryId: categoryFromQuery || undefined,
        });
        if (cancelled) return;
        setVehicles(initialRes);
      } catch (e) {
        console.error('init search page failed', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const handleViewDetails = (car) => {
    window.scrollTo(0, 0);
    navigate(`/vehicles/${car.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <Card className="p-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keyword">Từ khóa</Label>
                <Input
                  id="keyword"
                  placeholder="Nhập tên xe... (hoặc để trống)"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Loại xe</Label>
                <Select value={categoryId} onValueChange={(value) => setCategoryId(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại xe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả loại xe</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Hãng xe</Label>
                <Select value={brand} onValueChange={(value) => setBrand(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hãng xe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả hãng</SelectItem>
                    {brands.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Khoảng giá (VND/ngày)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Tối thiểu"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Tối đa"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ngày muốn thuê</Label>
                <Input type="date" value={rentalDate} onChange={(e) => setRentalDate(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Sắp xếp</Label>
                <Select
                  value={sort}
                  onValueChange={(value) => {
                    setSort(value);
                    runSearch({ sort: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn kiểu sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ratingDesc">Đánh giá cao nhất</SelectItem>
                    <SelectItem value="priceAsc">Giá tăng dần</SelectItem>
                    <SelectItem value="priceDesc">Giá giảm dần</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full"
                onClick={() => runSearch()}
                disabled={loading}
              >
                <Search className="w-4 h-4 mr-2" />
                Tìm kiếm
              </Button>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Kết quả tìm kiếm</h2>
                <p className="text-gray-600">Tìm thấy {mappedVehicles.length} xe</p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                {mappedVehicles.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">
                      Không tìm thấy xe nào khớp với yêu cầu của bạn
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setKeyword('');
                        setCategoryId('');
                        setBrand('');
                        setMinPrice('');
                        setMaxPrice('');
                        setRentalDate('');
                        setSort('ratingDesc');
                        runSearch({ sort: 'ratingDesc' });
                      }}
                    >
                      Xóa bộ lọc
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {mappedVehicles.map((car) => (
                      <VehicleCard key={car.id} car={car} onViewDetails={handleViewDetails} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


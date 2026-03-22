import { useState, useMemo, useEffect } from 'react';
import { HeroSection } from '@/components/shared/HeroSection';
import { VehicleFilters } from '@/components/shared/VehicleFilters';
import { VehicleCard } from '@/components/shared/VehicleCard';
import { VehicleDetailModal } from '@/components/shared/VehicleDetailModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { vehicleService } from '@/services/vehicleService';

export function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    make: 'Tất cả hãng',
    priceRange: [0, 2000000], // Adjusted for VND
    year: 'Tất cả năm',
    fuelType: 'Tất cả loại nhiên liệu',
    transmission: 'Tất cả hộp số',
    condition: 'Tất cả tình trạng',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [vData, cData] = await Promise.all([
          vehicleService.getVehicles(),
          vehicleService.getCategories()
        ]);
        setVehicles(vData);
        setCategories(cData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mappedVehicles = useMemo(() => {
    return vehicles.map(v => ({
      id: v.id,
      make: v.brand,
      model: v.model,
      year: v.year,
      price: v.pricePerDay,
      mileage: 0, // Not in backend
      fuelType: v.specs.fuelType,
      transmission: v.specs.transmission,
      location: 'Hà Nội', // Default location
      image: v.images[0] || 'https://placehold.co/600x400?text=No+Image',
      condition: v.year >= 2023 ? 'New' : 'Used',
      description: v.description,
      originalData: v // Keep original for modal
    }));
  }, [vehicles]);

  const availableMakes = useMemo(() => {
    const brands = Array.from(new Set(vehicles.map(v => v.brand)));
    return ['Tất cả hãng', ...brands.sort()];
  }, [vehicles]);

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(vehicles.map(v => v.year.toString())));
    return ['Tất cả năm', ...years.sort((a, b) => b.localeCompare(a))];
  }, [vehicles]);

  const filteredCars = useMemo(() => {
    return mappedVehicles.filter((car) => {
      // Search term filter
      const searchMatch = searchTerm === '' || 
        car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${car.year}`.includes(searchTerm);

      // Make filter
      const makeMatch = filters.make === 'Tất cả hãng' || car.make === filters.make;

      // Price range filter
      const priceMatch = car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1];

      // Year filter
      const yearMatch = filters.year === 'Tất cả năm' || car.year.toString() === filters.year;

      // Fuel type filter
      const fuelMatch = filters.fuelType === 'Tất cả loại nhiên liệu' || car.fuelType === filters.fuelType;

      // Transmission filter
      const transmissionMatch = filters.transmission === 'Tất cả hộp số' || car.transmission === filters.transmission;

      // Condition filter
      const conditionMatch = filters.condition === 'Tất cả tình trạng' || car.condition === filters.condition;

      return searchMatch && makeMatch && priceMatch && yearMatch && fuelMatch && transmissionMatch && conditionMatch;
    });
  }, [searchTerm, filters, mappedVehicles]);

  const handleSearch = (search, make) => {
    setSearchTerm(search);
    if (make !== 'all-makes') {
      const actualMake = availableMakes.find(m => m.toLowerCase() === make.toLowerCase());
      if (actualMake) setFilters(prev => ({ ...prev, make: actualMake }));
    }
  };

  const clearFilters = () => {
    setFilters({
      make: 'Tất cả hãng',
      priceRange: [0, 2000000],
      year: 'Tất cả năm',
      fuelType: 'Tất cả loại nhiên liệu',
      transmission: 'Tất cả hộp số',
      condition: 'Tất cả tình trạng',
    });
    setSearchTerm('');
  };

  return (
    <div className="flex flex-col">
      <HeroSection onSearch={handleSearch} availableMakes={availableMakes} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <VehicleFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
              availableMakes={availableMakes}
              availableYears={availableYears}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2>Xe đang có sẵn</h2>
                <p className="text-gray-600">
                  Tìm thấy {filteredCars.length} xe
                </p>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Tìm kiếm xe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64"
                />
                <Button variant="outline">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                {/* Cars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCars.map((car) => (
                    <VehicleCard
                      key={car.id}
                      car={car}
                      onViewDetails={setSelectedCar}
                    />
                  ))}
                </div>

                {/* No Results */}
                {filteredCars.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">
                      Không tìm thấy xe nào khớp với yêu cầu của bạn
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Xóa tất cả bộ lọc
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Car Details Modal */}
      <VehicleDetailModal
        car={selectedCar}
        isOpen={!!selectedCar}
        onClose={() => setSelectedCar(null)}
      />
    </div>
  );
}

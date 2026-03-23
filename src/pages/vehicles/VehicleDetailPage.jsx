import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vehicleService } from '@/services/vehicleService';
import { VehicleDetailModal } from '@/components/shared/VehicleDetailModal';

export function VehicleDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      try {
        const v = await vehicleService.getVehicleById(id);
        if (!cancelled) setVehicle(v);
      } catch (e) {
        console.error('Failed to load vehicle', e);
        if (!cancelled) setVehicle(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const mappedCar = useMemo(() => {
    if (!vehicle) return null;
    return {
      id: vehicle.id,
      make: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.pricePerDay,
      mileage: 0,
      fuelType: vehicle.specs?.fuelType,
      transmission: vehicle.specs?.transmission,
      location: 'Hà Nội',
      image: vehicle.images?.[0] || 'https://placehold.co/600x400?text=No+Image',
      condition: vehicle.year >= 2023 ? 'New' : 'Used',
      description: vehicle.description,
      originalData: vehicle
    };
  }, [vehicle]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* reuse modal UI for detail (carousel/specs can be enhanced later) */}
      {loading ? null : (
        <VehicleDetailModal
          car={mappedCar}
          isOpen={!!mappedCar}
          onClose={() => navigate('/vehicles')}
        />
      )}
    </div>
  );
}


import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vehicleService } from '@/services/vehicleService';
import { reviewService } from '@/services/reviewService';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export function VehicleDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(0);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const [reviewMeta, setReviewMeta] = useState({ avgRating: 0, totalReviews: 0 });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      try {
        const [v, rv] = await Promise.all([
          vehicleService.getVehicleById(id),
          reviewService.getByVehicle(id, 0, 5),
        ]);
        if (!cancelled) {
          setVehicle(v);
          setReviews(rv.items || []);
          setHasMoreReviews(!!rv.hasMore);
          setReviewMeta({ avgRating: rv.avgRating ?? v.avgRating ?? 0, totalReviews: rv.totalReviews ?? 0 });
        }
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

  useEffect(() => {
    const run = async () => {
      try {
        const result = await vehicleService.getVehicleAvailabilityByMonth(id, month);
        setOccupiedDates(result.occupiedDates || []);
      } catch (e) {
        setOccupiedDates([]);
      }
    };
    run();
  }, [id, month]);

  const images = vehicle?.images || [];
  const canPrev = imageIndex > 0;
  const canNext = imageIndex < images.length - 1;

  const handleBookNow = async () => {
    if (!authService.isAuthenticated()) {
      navigate('/login', { state: { from: `/vehicles/${id}` } });
      return;
    }

    // Luôn fetch profile mới nhất để tránh dữ liệu stale trong localStorage
    try {
      const profileResult = await authService.getProfile();
      if (profileResult.success) {
        const updatedUser = profileResult.data;
        // Cập nhật localStorage
        const currentUser = authService.getCurrentUser();
        localStorage.setItem('user', JSON.stringify({ ...currentUser, ...updatedUser }));
        
        if (updatedUser.identity?.verifyStatus !== 'VERIFIED') {
          toast.warning('Bạn cần xác minh CCCD trước khi đặt xe');
          return;
        }
      } else {
        // Nếu fetch profile lỗi, fallback về check localStorage
        const user = authService.getCurrentUser();
        if (user?.identity?.verifyStatus !== 'VERIFIED') {
          toast.warning('Bạn cần xác minh CCCD trước khi đặt xe');
          return;
        }
      }
    } catch (error) {
       const user = authService.getCurrentUser();
        if (user?.identity?.verifyStatus !== 'VERIFIED') {
          toast.warning('Bạn cần xác minh CCCD trước khi đặt xe');
          return;
        }
    }

    navigate(`/booking/${id}`);
  };

  const loadMoreReviews = async () => {
    const next = reviewPage + 1;
    const data = await reviewService.getByVehicle(id, next, 5);
    setReviews((prev) => [...prev, ...(data.items || [])]);
    setReviewPage(next);
    setHasMoreReviews(!!data.hasMore);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {loading || !vehicle ? null : (
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <Button variant="ghost" onClick={() => navigate('/vehicles')}>Quay lại tìm kiếm</Button>
          <Card className="p-6 grid md:grid-cols-2 gap-6">
            <div>
              <div className="relative">
                <img src={images[imageIndex] || 'https://placehold.co/800x500'} alt={vehicle.name} className="rounded-xl w-full h-80 object-cover" />
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
                  <Button size="icon" variant="secondary" disabled={!canPrev} onClick={() => setImageIndex((p) => p - 1)}><ChevronLeft /></Button>
                  <Button size="icon" variant="secondary" disabled={!canNext} onClick={() => setImageIndex((p) => p + 1)}><ChevronRight /></Button>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 mt-3">
                {images.map((img, idx) => (
                  <img key={img} src={img} alt="" className={`h-16 w-full object-cover rounded cursor-pointer ${idx === imageIndex ? 'ring-2 ring-blue-600' : ''}`} onClick={() => setImageIndex(idx)} />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold">{vehicle.name.replace(/\s\d{4}$/, '')}</h1>
              <p className="text-gray-600">{vehicle.brand} - {vehicle.model} - {vehicle.year}</p>
              <p className="text-blue-700 text-2xl font-bold">{new Intl.NumberFormat('vi-VN').format(vehicle.pricePerDay)} đ/ngày</p>
              <p className="text-gray-700">Cọc: {new Intl.NumberFormat('vi-VN').format(vehicle.depositAmount)} đ</p>
              <p className="text-gray-600">{vehicle.description}</p>
              <div className="pt-2">
                <p>Nhiên liệu: {vehicle.specs?.fuelType || '-'}</p>
                <p>Hộp số: {vehicle.specs?.transmission || '-'}</p>
                <p>Động cơ: {vehicle.specs?.engine || '-'}</p>
              </div>
              <Button className="w-full" onClick={handleBookNow}>Đặt xe ngay</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">Lịch còn trống theo tháng</h2>
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="border rounded px-3 py-2 mb-4" />
            <p className="text-sm text-gray-600">Ngày đã có đơn: {occupiedDates.length > 0 ? occupiedDates.join(', ') : 'Chưa có ngày bị chiếm lịch trong tháng này'}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <h2 className="text-xl font-semibold">Đánh giá {reviewMeta.avgRating} ({reviewMeta.totalReviews})</h2>
            </div>
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="border rounded-lg p-3">
                  <div className="flex justify-between">
                    <p className="font-semibold">{r.userName}</p>
                    <p>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                  </div>
                  <p className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</p>
                  <p>{r.comment}</p>
                </div>
              ))}
            </div>
            {hasMoreReviews && (
              <Button variant="outline" className="mt-4" onClick={loadMoreReviews}>
                Tải thêm đánh giá
              </Button>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}


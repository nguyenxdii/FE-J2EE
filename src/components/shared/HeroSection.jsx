import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

export function HeroSection({ 
  onSearch,
  availableMakes = ['Tất cả hãng', 'Honda', 'Yamaha', 'Suzuki', 'VinFast']
}) {
  return (
    <div className="relative h-96 flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Luxury cars in showroom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl px-4">
        <h1 className="text-4xl md:text-6xl mb-4 font-bold">
          Tìm Kiếm Chiếc Xe Hoàn Hảo
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Khám phá hàng nghìn phương tiện chất lượng từ các đối tác tin cậy. Chiếc xe mơ ước chỉ cách bạn một cú nhấp chuột.
        </p>

        {/* Search Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm hãng xe, dòng xe hoặc từ khóa..."
                className="bg-white border-0 text-black"
                id="search-input"
              />
            </div>
            <div className="w-full md:w-48">
              <Select defaultValue="all-makes">
                <SelectTrigger className="bg-white border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableMakes.map((make) => (
                    <SelectItem key={make} value={make.toLowerCase().replace(' ', '-')}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                const searchInput = document.getElementById('search-input');
                onSearch(searchInput?.value || '', 'all-makes');
              }}
            >
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

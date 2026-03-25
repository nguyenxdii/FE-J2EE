import React from 'react';
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

export function HeroSection() {
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
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
          Tìm Kiếm Chiếc Xe Hoàn Hảo
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90 font-medium">
          Khám phá hàng nghìn phương tiện chất lượng từ các đối tác tin cậy. Chiếc xe mơ ước chỉ cách bạn một cú nhấp chuột.
        </p>
      </div>
    </div>
  );
}

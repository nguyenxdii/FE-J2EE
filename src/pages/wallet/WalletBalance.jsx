import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Dùng linh kiện có sẵn của nhóm
import { Wallet } from 'lucide-react';

export default function WalletBalance() {
  const [balance, setBalance] = useState(0);

 useEffect(() => {
    // Gọi đúng địa chỉ bạn vừa test trên trình duyệt
    fetch('http://127.0.0.1:8080/api/users/balance')
        .then(res => res.json())
        .then(data => {
            console.log("Dữ liệu nhận được:", data);
            if(data.balance !== undefined) {
                setBalance(data.balance); // Cập nhật state để hiển thị
            }
        })
        .catch(err => console.error("Lỗi kết nối BE:", err));
}, []);

return (
    <div className="p-6">
      <Card className="w-full max-w-md mx-auto bg-blue-600 text-white">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm opacity-80">SỐ DƯ KHẢ DỤNG</p>
            <Wallet className="h-5 w-5" />
          </div>
          <div className="text-3xl font-bold mt-2">
            {balance.toLocaleString('vi-VN')} đ
          </div>
          <p className="text-xs mt-4 opacity-70">Cập nhật lúc: {new Date().toLocaleTimeString()}</p>
        </CardContent>
      </Card>
    </div>
);
}

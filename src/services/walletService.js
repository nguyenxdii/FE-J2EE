const BASE_URL = 'http://127.0.0.1:8080/api/wallet';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const walletService = {
  // Lấy số dư ví hiện tại
  getWalletBalance: async () => {
    const response = await fetch(`${BASE_URL}/balance`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Lấy lịch sử giao dịch
  getTransactionHistory: async () => {
    const response = await fetch(`${BASE_URL}/transactions`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Tạo yêu cầu nạp tiền qua MoMo -> Trả về payUrl
  depositMomo: async (amount) => {
    const response = await fetch(`${BASE_URL}/deposit/momo`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount, paymentMethod: 'MOMO' })
    });
    return response.json();
  },
  // Xác nhận trạng thái giao dịch từ callback params
  confirmTransaction: async (params) => {
    const response = await fetch(`${BASE_URL}/confirm`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params)
    });
    return response.json();
  }
};

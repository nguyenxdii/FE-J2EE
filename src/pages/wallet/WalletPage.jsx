import React, { useState, useEffect } from "react";
import { walletService } from "@/services/walletService";
import momoLogo from "@/assets/icons/MOMO-Logo-App.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Wallet,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Loader2,
  TrendingUp,
  CreditCard,
  XCircle,
  ArrowLeft,
  RotateCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import dayjs from "dayjs";

export function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const displayedTransactions = showAllTransactions
    ? transactions
    : (transactions || []).slice(0, 5);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchWalletData = async (isManual = false) => {
    try {
      if (isManual) setLoadingHistory(true);
      else setLoading(true);

      const [balanceRes, historyRes] = await Promise.all([
        walletService.getWalletBalance(),
        walletService.getTransactionHistory(),
      ]);

      if (balanceRes.success) setBalance(balanceRes.data);
      if (historyRes.success) setTransactions(historyRes.data);
    } catch (error) {
      toast.error("Không thể tải dữ liệu ví");
    } finally {
      setLoading(false);
      setLoadingHistory(false);
    }
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount < 50000) {
      toast.error("Số tiền nạp tối thiểu là 50.000đ");
      return;
    }

    try {
      setIsDepositLoading(true);
      const res = await walletService.depositMomo(amount);
      if (res.success && res.data) {
        toast.success("Đang chuyển hướng đến MoMo...");
        window.location.href = res.data;
      } else {
        toast.error(res.message || "Lỗi khi tạo yêu cầu nạp tiền");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi kết nối");
    } finally {
      setIsDepositLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getTransactionIcon = (type, status) => {
    if (status === "PENDING") return <History className="text-amber-500" />;
    if (status === "FAILED") return <XCircle className="text-gray-400" />;

    switch (type) {
      case "DEPOSIT":
        return <PlusCircle className="text-green-500" />;
      case "PAY":
        return <ArrowUpRight className="text-red-500" />;
      case "RECEIVE":
        return <ArrowDownLeft className="text-blue-500" />;
      default:
        return <History />;
    }
  };

  const getTransactionLabel = (type) => {
    switch (type) {
      case "DEPOSIT":
        return "Nạp tiền";
      case "PAY":
        return "Thanh toán";
      case "RECEIVE":
        return "Nhận tiền";
      default:
        return "Giao dịch";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Đang tải dữ liệu ví...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group mb-2"
      >
        <div className="p-2 bg-gray-100 rounded-lg mr-3 group-hover:bg-gray-200 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </div>
        Quay lại trang chủ
      </Link>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Ví của tôi
          </h1>
          <p className="text-gray-500">
            Quản lý số dư và theo dõi lịch sử giao dịch của bạn
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={() => fetchWalletData(true)}
            disabled={loadingHistory}
            className="h-12 border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl px-4 flex items-center gap-2"
            title="Tải lại lịch sử"
          >
            <RotateCw
              className={`h-5 w-5 ${loadingHistory ? "animate-spin" : ""}`}
            />
            <span className="font-bold">Làm mới lịch sử</span>
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 md:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg h-12 px-6 rounded-xl transition-all hover:scale-105 font-bold">
                <PlusCircle className="mr-2 h-5 w-5" />
                Nạp tiền vào ví
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                  Nạp tiền qua MoMo
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Số tiền muốn nạp (VND)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-medium">
                      ₫
                    </span>
                    <Input
                      type="number"
                      placeholder="Ví dụ: 50000"
                      className="pl-8 h-12 bg-gray-50/50"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 italic">
                    * Số tiền tối thiểu 50.000đ
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[50000, 100000, 200000].map((amt) => (
                    <Button
                      key={amt}
                      variant="outline"
                      size="sm"
                      className="text-xs border-blue-100 hover:bg-blue-50"
                      onClick={() => setDepositAmount(amt.toString())}
                    >
                      +{formatCurrency(amt)}
                    </Button>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="w-full h-12 bg-[#D13B63] hover:bg-[#B02A4E] text-white font-bold"
                  onClick={handleDeposit}
                  disabled={isDepositLoading}
                >
                  {isDepositLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <img
                      src={momoLogo}
                      alt="Momo"
                      className="h-6 mr-2 bg-white rounded p-0.5"
                    />
                  )}
                  Xác nhận nạp tiền
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Balance Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white rounded-3xl group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>

            <CardContent className="p-8 relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-100 opacity-80">
                    Số dư khả dụng
                  </span>
                  <div className="text-3xl font-black mt-1">
                    {formatCurrency(balance)}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-blue-100 text-sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span>Sẵn sàng cho các chuyến đi tiếp theo</span>
                </div>
                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-full"></div>
                </div>
                <p className="text-[10px] text-blue-100 opacity-60">
                  Cập nhật lúc: {dayjs().format("HH:mm, DD/MM/YYYY")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden bg-white">
            <CardHeader className="pb-2 border-b border-gray-50">
              <CardTitle className="text-sm font-semibold flex items-center text-gray-600">
                <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                Mẹo tài chính
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-sm text-gray-600 leading-relaxed">
              Bạn có thể rao bán "suất cọc" từ các chuyến đi không thể thực hiện
              để nhận lại tới 90% số tiền đã cọc!
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-2">
          <Card className="rounded-3xl border-gray-100 shadow-xl bg-white/70 backdrop-blur-xl h-full overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-gray-50">
              <CardTitle className="text-xl font-bold flex items-center text-gray-900">
                {/* <History className="mr-3 h-6 w-6 text-indigo-600" /> */}
                Lịch sử giao dịch
              </CardTitle>
              {transactions.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 font-medium hover:bg-blue-50"
                  onClick={() => setShowAllTransactions(!showAllTransactions)}
                >
                  {showAllTransactions ? "Thu gọn" : "Xem tất cả"}
                </Button>
              )}
            </CardHeader>
            <CardContent className="px-2 md:px-6 py-4">
              {loadingHistory ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                  <p className="text-sm text-gray-400 font-medium italic">
                    Đang cập nhật lịch sử...
                  </p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-3">
                  <div className="p-4 bg-gray-50 rounded-full">
                    <History className="h-10 w-10 opacity-20" />
                  </div>
                  <p>Bạn chưa có giao dịch nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayedTransactions.map((tx, idx) => (
                    <div
                      key={tx.id || idx}
                      className={`flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all group ${
                        tx.status === "FAILED"
                          ? "opacity-60 grayscale-[0.5]"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl ${
                            tx.status === "PENDING"
                              ? "bg-amber-100 group-hover:bg-amber-200"
                              : tx.status === "FAILED"
                                ? "bg-gray-100 group-hover:bg-gray-200"
                                : tx.type === "DEPOSIT"
                                  ? "bg-green-100 group-hover:bg-green-200"
                                  : tx.type === "PAY"
                                    ? "bg-red-100 group-hover:bg-red-200"
                                    : "bg-blue-100 group-hover:bg-blue-200"
                          } transition-colors`}
                        >
                          {getTransactionIcon(tx.type, tx.status)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm md:text-base">
                            {tx.description}
                            {tx.status === "PENDING" && (
                              <span className="ml-2 inline-flex items-center gap-1.5">
                                <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                                  Đang xử lý
                                </span>
                              </span>
                            )}
                            {tx.status === "FAILED" && (
                              <span className="ml-2 text-[10px] bg-gray-400 text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                                Thất bại
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                            <span className="font-medium text-gray-500">
                              {getTransactionLabel(tx.type)}
                            </span>
                            <span>•</span>
                            <span>
                              {dayjs(tx.createdAt).format("HH:mm - DD/MM/YYYY")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`text-right font-black ${
                          tx.status === "FAILED"
                            ? "text-gray-400 line-through"
                            : tx.status === "PENDING"
                              ? "text-amber-600"
                              : tx.type === "DEPOSIT" || tx.type === "RECEIVE"
                                ? "text-green-600"
                                : "text-red-500"
                        }`}
                      >
                        {tx.type === "DEPOSIT" || tx.type === "RECEIVE"
                          ? "+"
                          : "-"}{" "}
                        {formatCurrency(Math.abs(tx.amount))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

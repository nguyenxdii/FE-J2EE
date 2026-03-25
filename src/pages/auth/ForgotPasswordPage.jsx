import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/authService";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        toast.success("Link reset mật khẩu đã được gửi!");
        setIsSent(true);
      } else {
        toast.error(response.message || "Không thể gửi yêu cầu");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Quên mật khẩu?</h1>
          <p className="text-gray-500 text-sm">
            {isSent
              ? "Vui lòng kiểm tra email của bạn để nhận link đặt lại mật khẩu."
              : "Nhập email của bạn để chúng tôi gửi link đặt lại mật khẩu."}
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email tài khoản</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-11"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gray-900 hover:bg-black text-white shadow-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
                  Đang xử lý...
                </>
              ) : (
                <>
                  Gửi yêu cầu
                  {/* <Send className="ml-2 h-4 w-4" /> */}
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="text-center">
            <Button
              variant="outline"
              className="w-full h-11"
              onClick={() => setIsSent(false)}
            >
              Gửi lại yêu cầu
            </Button>
          </div>
        )}

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

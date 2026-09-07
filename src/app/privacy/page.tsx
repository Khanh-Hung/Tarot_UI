import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Mail, Sparkles, Cookie, UserCheck } from "lucide-react";

export const metadata = {
  title: "Chính Sách Quyền Riêng Tư | Nyxoris Tarot",
  description: "Cam kết bảo vệ quyền riêng tư và thông điệp trải bài tại Nyxoris Tarot.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in text-zinc-300">
      <div className="space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại trang chủ</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Chính Sách Quyền Riêng Tư
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Mọi thông điệp và hành trình trải bài của bạn luôn được trân trọng và giữ kín
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 text-sm leading-relaxed border border-white/10 rounded-2xl bg-[#1c1d22]/80 p-6 sm:p-8 backdrop-blur-md">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-amber-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> 1. Thông Tin Lưu Trữ
          </h2>
          <p className="text-zinc-300">
            Khi bạn đồng hành cùng Nyxoris, mình chỉ lưu những thông tin thật sự cần thiết:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-zinc-300 ml-2">
            <li>
              <strong>Tài khoản:</strong> Email, tên hiển thị (mật khẩu luôn được mã hóa an toàn).
            </li>
            <li>
              <strong>Lịch sử trải bài:</strong> Các lá bài bạn rút và bản luận giải từ AI được lưu trữ để bạn có thể xem lại hành trình nội tâm của mình bất cứ lúc nào.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-amber-200 flex items-center gap-2">
            <Cookie className="w-4 h-4 text-amber-400" /> 2. Cookies & Đối Tác Quảng Cáo
          </h2>
          <p className="text-zinc-300">
            Nyxoris dùng bộ nhớ tạm của trình duyệt (cookies / cache) để giữ phiên đăng nhập và giúp hình ảnh cùng dữ liệu tải nhanh, mượt mà hơn.
          </p>
          <p className="text-zinc-300">
            Để duy trì nền tảng trải nghiệm miễn phí, mình hợp tác hiển thị quảng cáo cùng các đối tác (các bên này có thể sử dụng cookie để gợi ý quảng cáo phù hợp):
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-zinc-300 ml-2">
            <li>
              <strong>Google AdSense:</strong> Mạng quảng cáo hiển thị từ Google. Bạn có thể chủ động tắt quảng cáo cá nhân hóa tại{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:underline font-medium"
              >
                Cài đặt quảng cáo Google
              </a>.
            </li>
            <li>
              <strong>Các đối tác mạng quảng cáo khác:</strong> Danh sách đối tác có thể được mở rộng và cập nhật tại đây khi hệ thống tích hợp thêm.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-amber-200 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400" /> 3. Quyền Làm Chủ Dữ Liệu
          </h2>
          <p className="text-zinc-300">
            Bạn có toàn quyền chỉnh sửa thông tin cá nhân hoặc yêu cầu xóa vĩnh viễn tài khoản cùng toàn bộ lịch sử bốc bài bất cứ lúc nào ngay trong mục Hồ Sơ.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-white/[0.08]">
          <h2 className="text-base font-semibold text-amber-200 flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" /> 4. Kết Nối & Hỗ Trợ
          </h2>
          <p className="text-zinc-300">
            Nếu có bất kỳ câu hỏi, băn khoăn hay góp ý nào về quyền riêng tư, bạn cứ nhắn cho mình qua
            <br />
            email:{" "}
            <a
              href="mailto:suzji.mailer@gmail.com"
              className="text-amber-300 hover:underline font-medium text-sm"
            >
              suzji.mailer@gmail.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}

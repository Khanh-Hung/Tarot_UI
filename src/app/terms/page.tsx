import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft, Sparkles, HeartHandshake, Compass, ShieldCheck, Mail } from "lucide-react";

export const metadata = {
  title: "Điều Khoản Dịch Vụ | Nyxoris Tarot",
  description: "Các nguyên tắc đồng hành và chiêm nghiệm lành mạnh tại Nyxoris Tarot.",
};

export default function TermsPage() {
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
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Điều Khoản Dịch Vụ
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Những nguyên tắc giản dị để cùng tạo nên một không gian chiêm nghiệm an lành
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 text-sm leading-relaxed border border-white/10 rounded-2xl bg-[#1c1d22]/80 p-6 sm:p-8 backdrop-blur-md">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-amber-200 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-400" /> 1. Đồng Hành Cùng Nyxoris
          </h2>
          <p className="text-zinc-300">
            Chào mừng bạn đến với Nyxoris. Khi trải nghiệm các tính năng bốc bài Tarot và trò chuyện cùng AI trên trang web, bạn đồng ý tôn trọng những nguyên tắc chung này để giữ cho không gian luôn tích cực.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-amber-200 flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" /> 2. Tinh Thần Chiêm Nghiệm & Tuyên Bố Trách Nhiệm
          </h2>
          <p className="text-zinc-300">
            Các thông điệp Tarot và góc nhìn từ Nyxoris AI được xây dựng nhằm mục đích <strong>chiêm nghiệm, thấu hiểu nội tâm và thư giãn lành mạnh</strong>.
          </p>
          <p className="text-xs text-zinc-400">
            Tarot là chiếc gương phản chiếu suy nghĩ cá nhân, không mang tính phán quyết tương lai và không thay thế cho các lời khuyên chuyên môn về y tế, tâm lý trị liệu, pháp lý hay đầu tư tài chính.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-amber-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> 3. Không Gian Cá Nhân
          </h2>
          <p className="text-zinc-300">
            Tài khoản là nơi lưu giữ những góc nhìn riêng tư của bạn. Bạn hãy giữ kín mật khẩu của mình để đảm bảo lịch sử trải bài không bị người khác xem nhé.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-amber-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> 4. Tôn Trọng Bản Quyền Sáng Tạo
          </h2>
          <p className="text-zinc-300">
            Giao diện tương tác 3D, thuật toán luận giải và bản sắc của Nyxoris được tạo dựng với rất nhiều tâm huyết. Mình mong bạn cùng trân trọng và không sao chép trái phép.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-white/[0.08]">
          <h2 className="text-base font-semibold text-amber-200 flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" /> 5. Kết Nối & Hỗ Trợ
          </h2>
          <p className="text-zinc-300">
            Nếu có bất kỳ câu hỏi, băn khoăn hay góp ý nào về dịch vụ, bạn cứ nhắn cho mình qua email:{" "}
            <a
              href="mailto:suzji.mailer@gmail.com"
              className="text-amber-300 hover:underline font-medium font-mono text-xs"
            >
              suzji.mailer@gmail.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { Sparkles, Compass, ShieldCheck, Heart, Mail, Sun, ArrowRight, BookOpen } from "lucide-react";

export const metadata = {
  title: "Đôi Lời Gửi Bạn | Nyxoris Tarot",
  description: "Trạm dừng chân bình yên để bạn lắng nghe trực giác, chiêm nghiệm nội tâm và tìm lại sự cân bằng qua nghệ thuật Tarot.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in text-zinc-300">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          Đôi Lời Gửi Bạn
        </h1>
        <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-rose-300/80 font-medium italic">
          <Heart className="w-3.5 h-3.5 text-rose-400/80 inline" />
          <span>Chốn tĩnh lặng giữa huyên náo</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal pt-1">
          Có những ngày lòng bạn đầy giông bão, hay trước mắt là những ngã rẽ mịt mờ sương giăng. Nyxoris được tạo ra không phải để đoán định số phận, mà là một khoảng lặng để bạn ngồi xuống, kết nối với trực giác và soi tỏ ánh sáng bên trong chính mình.
        </p>
      </div>

      {/* 3 Trụ cột giá trị */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#1c1d22]/80 border border-white/10 space-y-3 hover:border-amber-500/30 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Thấu Hiểu Bản Thân</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Mỗi lá bài giúp bạn nhìn nhận lại cảm xúc, lắng nghe trực giác và tìm kiếm câu trả lời sáng suốt cho chính mình mà không bị phán xét.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#1c1d22]/80 border border-white/10 space-y-3 hover:border-purple-500/30 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-300">
            <Sun className="w-5 h-5" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Định Hướng Tích Cực</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Không gieo rắc sợ hãi hay phán xét tương lai, từng thông điệp luôn hướng đến việc khơi dậy niềm tin, hy vọng và giải pháp tích cực cho bạn.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#1c1d22]/80 border border-white/10 space-y-3 hover:border-emerald-500/30 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Riêng Tư Tuyệt Đối</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Mọi câu hỏi và kết quả trải bài của bạn đều được bảo mật hoàn toàn. Bạn có thể thoải mái gửi gắm tâm tư trong không gian an toàn này.
          </p>
        </div>
      </div>

      {/* Nội dung chi tiết & Bức thư gửi bạn */}
      <div className="space-y-8 text-sm leading-relaxed border border-white/10 rounded-3xl bg-[#1c1d22]/60 p-6 sm:p-10 backdrop-blur-md">
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-amber-200 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Khi Bạn Cần Một Điểm Tựa Tĩnh Lặng
          </h2>
          <p className="text-zinc-300 leading-relaxed">
            Giữa nhịp sống hối hả và vô vàn kỳ vọng từ thế giới xung quanh, đôi khi chúng ta dễ bị cuốn đi mà quên mất việc ngồi lại, chậm rãi lắng nghe xem bên trong mình đang thực sự cảm thấy điều gì. Có những ngày bạn đứng trước ngã rẽ cuộc đời với bao nỗi hoang mang, có những đêm dài trăn trở với những câu hỏi chưa có lời giải, hay chỉ đơn thuần là muốn tìm một khoảng lặng đủ an yên để trút bớt những âu lo thường nhật.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            <strong>Nyxoris</strong> được tạo nên như một chốn dừng chân dịu dàng dành cho bạn. Nơi đây không phải để tiên đoán số phận, không mang định kiến hay phán xét bất kỳ ai. Thay vào đó, mỗi lá bài lật mở tựa như một tấm gương phản chiếu, giúp bạn soi tỏ những cảm xúc sâu kín, kết nối lại với trực giác nguyên bản và mở ra những góc nhìn sáng suốt hơn giữa muôn vàn rối ren.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            Dù phía trước là bầu trời nắng ấm hay những thử thách còn đang đón đợi, mong bạn hãy luôn nhớ rằng: Mọi thông điệp ở đây chỉ là một ngọn nến nhỏ thắp sáng góc nhìn, còn người nắm giữ sức mạnh để viết tiếp câu chuyện cuộc đời mình luôn luôn là chính bạn. Chúc bạn luôn tìm thấy sự thông tuệ và bình yên trên mỗi bước đi.
          </p>
        </section>

        {/* Khối lời nhắc trách nhiệm / Disclaimer văn minh */}
        <div className="p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 flex gap-3.5 items-start text-xs text-amber-200/90 leading-relaxed">
          <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300">Lời nhắn nhủ từ Nyxoris: </span>
            Các thông điệp trải bài mang ý nghĩa chiêm nghiệm nội tâm, khai phóng góc nhìn và nâng đỡ tinh thần. Tarot không thay thế cho các lời khuyên chuyên môn về y tế, tài chính hay pháp lý. Hãy đón nhận với một tâm thế cởi mở và tỉnh thức.
          </div>
        </div>

        {/* Liên hệ minh bạch chuẩn AdSense */}
        <section className="space-y-4 pt-6 border-t border-white/[0.08]">
          <h2 className="text-lg font-bold text-amber-200 flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-400" /> Luôn Ở Đây Lắng Nghe Bạn
          </h2>
          <p className="text-zinc-300 leading-relaxed">
            Hành trình đối thoại với nội tâm đôi khi sẽ mang lại cho bạn những rung cảm bất ngờ, hay những trăn trở khó gọi tên thành lời. Dù là một lời góp ý chân thành để Nyxoris ngày một tốt hơn, một thắc mắc cần hỗ trợ, hay đơn giản chỉ là một mẩu chuyện bạn muốn tìm người sẻ chia sau trải bài — hãy cứ thoải mái gửi thư về đây nhé. Mọi tâm tình của bạn đều luôn được đón nhận và lắng nghe bằng tất cả sự chân thành:
          </p>
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-zinc-400">Hòm thư tâm tình & hỗ trợ: </span>
              <a href="mailto:suzji.mailer@gmail.com" className="text-amber-300 font-semibold hover:underline">
                suzji.mailer@gmail.com
              </a>
            </div>
            <span className="text-zinc-400">Luôn sẵn lòng hồi đáp bạn trong vòng 24 - 48 giờ</span>
          </div>
        </section>

        {/* CTA */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/reading"
            className="px-6 py-3 rounded-xl silver-gradient-btn font-bold text-xs sm:text-sm text-zinc-950 flex items-center gap-2 shadow-lg hover:scale-105 transition active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-zinc-950" />
            <span>Lật mở lá bài dành riêng cho bạn</span>
            <ArrowRight className="w-4 h-4 text-zinc-950" />
          </Link>
        </div>
      </div>
    </div>
  );
}


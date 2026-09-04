import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Nyxoris | Nền Tảng Tarot & Luận Giải Chiêm Tinh Học 3D",
  description: "Trải nghiệm bốc bài Tarot 3D tương tác và nhận bản luận giải sâu sắc về nội tâm từ Nyxoris AI.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} dark h-screen overflow-hidden antialiased`}
    >
      <body
        className="h-screen overflow-hidden flex flex-col bg-[#18191c] text-zinc-100 font-sans selection:bg-zinc-200 selection:text-zinc-950"
      >
        <AuthProvider>
          {/* Header luôn cố định ở trên cùng */}
          <Navbar />

          {/* Container chứa nội dung cuộn bên dưới Header */}
          <div id="main-scroll-container" className="flex-1 min-h-0 overflow-y-auto [scrollbar-gutter:stable] relative flex flex-col">
            {/* Hào quang nền vũ trụ nhẹ nhàng */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-zinc-800/10 rounded-full blur-3xl"></div>
              <div className="absolute top-1/3 -right-40 w-96 h-96 bg-zinc-700/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-zinc-800/10 rounded-full blur-3xl"></div>
            </div>

            <main className="flex-1 relative z-10">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
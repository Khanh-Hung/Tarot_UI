import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Oracle Tarot & AI Healing Consultation Platform",
  description: "Trải nghiệm bốc bài Tarot 3D tương tác và luận giải chữa lành với AI thông minh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark h-screen overflow-hidden">
      <body
        className={`${inter.className} h-screen overflow-hidden flex flex-col bg-[#060910] text-slate-100 antialiased selection:bg-slate-200 selection:text-slate-950`}
      >
        <AuthProvider>
          {/* Header luôn cố định ở trên cùng */}
          <Navbar />

          {/* Container chứa nội dung cuộn bên dưới Header */}
          <div className="flex-1 min-h-0 overflow-y-auto relative flex flex-col">
            {/* Hào quang nền vũ trụ nhẹ nhàng */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-slate-800/15 rounded-full blur-3xl"></div>
              <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-950/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-slate-700/10 rounded-full blur-3xl"></div>
            </div>

            <main className="flex-1 relative z-10">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
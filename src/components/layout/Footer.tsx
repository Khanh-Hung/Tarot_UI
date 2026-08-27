import React from "react";
import { Moon } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.07] bg-[#05070D] py-8 px-4 text-center text-xs text-slate-400 ">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5 silver-gradient-text  text-sm font-semibold">
          <Moon className="w-4 h-4 text-slate-300" />
          <span>Oracle Tarot & AI Healing Consultation Platform</span>
        </div>
        <p className="max-w-md text-slate-400 text-xs leading-relaxed">
          Nền tảng luận giải Tarot thông minh bằng trí tuệ nhân tạo, soi sáng tâm thức và đồng hành cùng bạn dưới ánh trăng chiêm tinh.
        </p>
        <p className="mt-2 text-[11px] text-slate-500">
          © {new Date().getFullYear()} Oracle AI Engineering. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
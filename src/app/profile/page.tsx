"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Sparkles,
  History,
  Star,
  BookOpen,
  Check,
  Loader2,
  ArrowRight,
  Shield,
  Mail,
  Camera,
  Layers,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
import { profileService } from "@/features/profile/services/profileService";
import { ProfileDto } from "@/features/profile/types/profile.types";
import { tarotService } from "@/features/tarot/services/tarotService";
import { DeckDto, ZodiacSign } from "@/features/tarot/types/tarot.types";
import { CustomSelect, OptionItem } from "@/components/ui/CustomSelect";
import { Avatar } from "@/components/ui/Avatar";
import { getFriendlyErrorMessage } from "@/lib/errorMapping";

const ZODIAC_LIST: { code: ZodiacSign; name: string; symbol: string }[] = [
  { code: "ARIES", name: "Bạch Dương", symbol: "♈" },
  { code: "TAURUS", name: "Kim Ngưu", symbol: "♉" },
  { code: "GEMINI", name: "Song Tử", symbol: "♊" },
  { code: "CANCER", name: "Cự Giải", symbol: "♋" },
  { code: "LEO", name: "Sư Tử", symbol: "♌" },
  { code: "VIRGO", name: "Xử Nữ", symbol: "♍" },
  { code: "LIBRA", name: "Thiên Bình", symbol: "♎" },
  { code: "SCORPIO", name: "Bọ Cạp", symbol: "♏" },
  { code: "SAGITTARIUS", name: "Nhân Mã", symbol: "♐" },
  { code: "CAPRICORN", name: "Ma Kết", symbol: "♑" },
  { code: "AQUARIUS", name: "Bảo Bình", symbol: "♒" },
  { code: "PISCES", name: "Song Ngư", symbol: "♓" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading, updateUserZodiac } = useAuth();

  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [decks, setDecks] = useState<DeckDto[]>([]);
  const [totalReadings, setTotalReadings] = useState<number>(0);

  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacSign>("UNKNOWN");
  const [favoriteDeckId, setFavoriteDeckId] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    async function loadData() {
      if (!isAuthenticated) return;
      setIsLoading(true);
      try {
        const [profileData, decksData, historyData] = await Promise.all([
          profileService.getMyProfile(),
          tarotService.getDecks(),
          user?.userId ? tarotService.getReadingHistory(user.userId, 0, 1) : Promise.resolve({ totalElements: 0 }),
        ]);

        setProfile(profileData);
        setDecks(decksData);
        setTotalReadings(historyData.totalElements || 0);

        setDisplayName(profileData.displayName || profileData.userName || "");
        setAvatarUrl(profileData.avatarUrl || "");
        setSelectedZodiac(profileData.zodiacSign || (user?.zodiacSign as ZodiacSign) || "UNKNOWN");
        setFavoriteDeckId(profileData.favoriteDeckId || "");
      } catch (err: unknown) {
        console.error("Failed to load profile:", err);
        setErrorMsg("Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, user?.userId, user?.zodiacSign]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSaving(true);

    try {
      const updated = await profileService.updateMyProfile({
        displayName: displayName.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
        zodiacSign: selectedZodiac !== "UNKNOWN" ? selectedZodiac : undefined,
        favoriteDeckId: favoriteDeckId || undefined,
      });

      setProfile(updated);
      if (selectedZodiac !== "UNKNOWN") {
        updateUserZodiac(selectedZodiac);
      }
      setSuccessMsg("Cập nhật hồ sơ thành công!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: unknown) {
      setErrorMsg(getFriendlyErrorMessage(err, "Có lỗi xảy ra khi cập nhật hồ sơ. Vui lòng thử lại sau."));
    } finally {
      setIsSaving(false);
    }
  };

  const zodiacOptions: OptionItem[] = [
    { value: "UNKNOWN", label: "-- Chưa chọn cung hoàng đạo --" },
    ...ZODIAC_LIST.map((z) => ({
      value: z.code,
      label: z.name,
      icon: z.symbol,
    })),
  ];

  const deckOptions: OptionItem[] = [
    { value: "", label: "-- Chưa chọn bộ bài yêu thích --" },
    ...decks.map((d) => ({
      value: String(d.id || ""),
      label: d.nameVi,
    })),
  ];

  const currentZodiacSign = profile?.zodiacSign || selectedZodiac;
  const currentZodiacObj = currentZodiacSign && currentZodiacSign !== "UNKNOWN"
    ? ZODIAC_LIST.find((z) => z.code === currentZodiacSign)
    : null;

  const currentFavId = profile?.favoriteDeckId || favoriteDeckId;
  const favoriteDeckObj = currentFavId
    ? decks.find((d) => String(d.id) === String(currentFavId) || String(d.code) === String(currentFavId))
    : null;

  if (isAuthLoading || (isLoading && isAuthenticated)) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 pb-36 sm:pb-44 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* 🌟 HEADER */}
      <div className="border-b border-[#2c2e35] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-300" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">Hồ Sơ Cá Nhân</h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-normal">
            Quản lý năng lượng hoàng đạo, bộ bài ưa thích và cài đặt hiển thị
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/history"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-300 bg-[#212227] hover:bg-[#2b2c33] border border-[#31333a] transition"
          >
            <History className="w-3.5 h-3.5 text-zinc-400" />
            <span>Xem lịch sử ({totalReadings})</span>
          </Link>
          <Link
            href="/reading"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold silver-gradient-btn transition shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
            <span>Bốc bài mới</span>
          </Link>
        </div>
      </div>

      {/* 🌟 STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="rounded-2xl border border-[#2b2d35] bg-[#1a1b1f] p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300 shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Tổng quẻ đã xem</p>
            <p className="text-xl font-bold text-white mt-0.5">{totalReadings}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#2b2d35] bg-[#1a1b1f] p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300 shrink-0">
            <Star className="w-5 h-5 text-indigo-300" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Cung Hoàng Đạo</p>
            <p className="text-sm font-bold text-white mt-0.5 truncate">
              {currentZodiacObj ? `${currentZodiacObj.symbol} ${currentZodiacObj.name.split(" ")[0]}` : "Chưa thiết lập"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#2b2d35] bg-[#1a1b1f] p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300 shrink-0">
            <BookOpen className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Bộ bài ưa thích</p>
            <p className="text-sm font-bold text-white mt-0.5 truncate">
              {favoriteDeckObj ? favoriteDeckObj.nameVi : "Chưa thiết lập"}
            </p>
          </div>
        </div>
      </div>

      {/* 🌟 PROFILE FORM */}
      <div className="rounded-3xl border border-[#2b2d35] bg-[#191a1e] p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar & Identifiers Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-[#2b2d35]">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#3b3d46] bg-[#23242a] p-1 flex items-center justify-center shadow-lg shrink-0 overflow-hidden">
                <Avatar
                  src={avatarUrl}
                  alt={displayName || user?.username}
                  size="xl"
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                {displayName || user?.username}
              </h2>
              <p className="text-xs text-zinc-400 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>{user?.email}</span>
              </p>
            </div>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Tên hiển thị (Display Name)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Nhập tên bạn muốn AI gọi..."
                className="w-full rounded-xl bg-[#212227] border border-[#31333a] focus:border-zinc-400 focus:outline-none px-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 transition"
                maxLength={50}
              />
              <p className="text-[10px] text-zinc-500 mt-1">
                AI Tarot Reader sẽ xưng hô với bạn bằng tên này khi luận giải
              </p>
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-zinc-400" />
                <span>Đường dẫn ảnh đại diện (Avatar URL)</span>
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.png"
                className="w-full rounded-xl bg-[#212227] border border-[#31333a] focus:border-zinc-400 focus:outline-none px-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 transition font-mono"
              />
              <p className="text-[10px] text-zinc-500 mt-1">
                Để trống nếu bạn muốn dùng chữ cái đầu mặc định
              </p>
            </div>

            {/* Zodiac Sign */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-zinc-400" />
                <span>Cung Hoàng Đạo Mặc Định</span>
              </label>
              <CustomSelect
                options={zodiacOptions}
                value={selectedZodiac}
                onChange={(val) => setSelectedZodiac(val as ZodiacSign)}
                placeholder="Chọn cung hoàng đạo..."
              />
              <p className="text-[10px] text-zinc-500 mt-1">
                Giúp AI tự động liên kết năng lượng chiêm tinh học khi bạn xem bài
              </p>
            </div>

            {/* Favorite Deck */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                <span>Bộ Bài Yêu Thích</span>
              </label>
              <CustomSelect
                options={deckOptions}
                value={favoriteDeckId}
                onChange={(val) => setFavoriteDeckId(val)}
                placeholder="Chọn bộ bài yêu thích..."
              />
              <p className="text-[10px] text-zinc-500 mt-1">
                Bộ bài sẽ được ưu tiên chọn sẵn khi bạn bắt đầu bốc bài mới
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2b2d35]">
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 transition"
            >
              Hủy bỏ
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold silver-gradient-btn transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-zinc-950" />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

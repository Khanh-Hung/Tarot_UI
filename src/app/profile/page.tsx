"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Sparkles,
  History,
  Star,
  Check,
  Loader2,
  Mail,
  Camera,
  Layers,
  ShieldCheck,
  AlertCircle,
  Info,
  Calendar,
  Heart,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
import { profileService } from "@/features/profile/services/profileService";
import { Gender, ProfileDto, RelationshipStatus } from "@/features/profile/types/profile.types";
import { tarotService } from "@/features/tarot/services/tarotService";
import { DeckDto, ZodiacSign } from "@/features/tarot/types/tarot.types";
import { CustomSelect, OptionItem } from "@/components/ui/CustomSelect";
import { Avatar } from "@/components/ui/Avatar";
import { calculateZodiacFromDate, toIsoDateString } from "@/features/tarot/utils/birthCalculations";
import { ImageCropperModal } from "@/components/ui/ImageCropperModal";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { DatePicker } from "@/components/ui/DatePicker";
import { authService } from "@/features/auth/services/authService";
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
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [gender, setGender] = useState<Gender>("UNKNOWN");
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacSign>("UNKNOWN");
  const [favoriteDeckId, setFavoriteDeckId] = useState<string>("");
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus>("UNKNOWN");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [rawAvatarImage, setRawAvatarImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const storedUntil = localStorage.getItem("email_verify_resend_until");
      if (storedUntil) {
        const diff = Math.ceil((parseInt(storedUntil, 10) - Date.now()) / 1000);
        if (diff > 0) {
          setResendCountdown(diff);
          setIsLinkSent(true);
        } else {
          localStorage.removeItem("email_verify_resend_until");
        }
      }
    } catch {
      // ignore localStorage errors in private browsing
    }
  }, []);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((c) => {
        if (c <= 1) {
          try {
            localStorage.removeItem("email_verify_resend_until");
          } catch {}
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleSendVerificationLink = async () => {
    const emailToVerify = profile?.email || user?.email;
    if (!emailToVerify || isSendingLink || resendCountdown > 0) return;
    setIsSendingLink(true);
    setErrorMsg("");
    try {
      await authService.sendVerificationEmail(emailToVerify);
      setIsLinkSent(true);
      setResendCountdown(60);
      try {
        localStorage.setItem("email_verify_resend_until", (Date.now() + 60000).toString());
      } catch {}
      setSuccessMsg("Đã gửi liên kết kích hoạt đến email của bạn! Vui lòng kiểm tra Hộp thư đến (hoặc mục Spam / Thư rác nếu không thấy thư).");
      setTimeout(() => setSuccessMsg(""), 8000);
    } catch (err: unknown) {
      setErrorMsg(getFriendlyErrorMessage(err, "Không thể gửi liên kết kích hoạt. Vui lòng thử lại."));
    } finally {
      setIsSendingLink(false);
    }
  };

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
        setDateOfBirth(profileData.dateOfBirth || "");
        setGender(profileData.gender || "UNKNOWN");
        const autoZodiac = profileData.dateOfBirth ? calculateZodiacFromDate(profileData.dateOfBirth) : "UNKNOWN";
        setSelectedZodiac(autoZodiac !== "UNKNOWN" ? autoZodiac : (profileData.zodiacSign || (user?.zodiacSign as ZodiacSign) || "UNKNOWN"));
        setFavoriteDeckId(profileData.favoriteDeckId || "");
        setRelationshipStatus(profileData.relationshipStatus || "UNKNOWN");
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

  const handleDateOfBirthChange = (val: string) => {
    setDateOfBirth(val);
    if (val) {
      const z = calculateZodiacFromDate(val);
      if (z !== "UNKNOWN") {
        setSelectedZodiac(z);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSaving(true);

    try {
      // 1. Chuyển đổi định dạng Gender sang Enum chuẩn của Account API (.NET: Male / Female / Other)
      let accountGender: "Male" | "Female" | "Other" | null = null;
      if (gender === "MALE") accountGender = "Male";
      else if (gender === "FEMALE") accountGender = "Female";
      else if (gender === "OTHER") accountGender = "Other";

      const isoDob = dateOfBirth ? (toIsoDateString(dateOfBirth) || null) : null;

      // 2. Gọi API bên Account Service (G:\New folder (7) - port 5000: ngày sinh, giới tính, tên hiển thị)
      await profileService.updateAccountProfile({
        displayName: displayName.trim() || undefined,
        dateOfBirth: isoDob,
        gender: accountGender,
      });

      // 3. Gọi API bên Tarot Service (G:\New folder (6)\BE - port 8080: cung hoàng đạo, bộ bài, mối quan hệ, ngày sinh, giới tính)
      await profileService.updateMyProfile({
        displayName: displayName.trim() || undefined,
        dateOfBirth: isoDob,
        gender: gender !== "UNKNOWN" ? gender : null,
        zodiacSign: selectedZodiac !== "UNKNOWN" ? selectedZodiac : undefined,
        favoriteDeckId: favoriteDeckId || undefined,
        relationshipStatus: relationshipStatus,
      });

      // 4. Đồng bộ lại dữ liệu hồ sơ mới nhất từ Tarot Service (tự động tính toán Lá bài Bản Mệnh từ ngày sinh mới)
      const updated = await profileService.getMyProfile();
      setProfile(updated);
      setDateOfBirth(updated.dateOfBirth || "");
      setGender(updated.gender || "UNKNOWN");
      if (selectedZodiac !== "UNKNOWN") {
        updateUserZodiac(selectedZodiac);
      }
      setSuccessMsg("Cập nhật hồ sơ và ngày sinh thành công!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: unknown) {
      console.error("Profile update failed:", err);
      setErrorMsg(getFriendlyErrorMessage(err, "Có lỗi xảy ra khi cập nhật hồ sơ. Vui lòng thử lại sau."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP, GIF)!");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Dung lượng ảnh tối đa là 10MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setRawAvatarImage(src);
      setIsCropperOpen(true);
      setErrorMsg("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = async (croppedDataUrl: string) => {
    setIsCropperOpen(false);
    setIsUploadingAvatar(true);
    setErrorMsg("");

    try {
      const res = await fetch(croppedDataUrl);
      const blob = await res.blob();

      const uploadResult = await tarotService.uploadAvatar(blob);
      setAvatarUrl(uploadResult.url);
      setSuccessMsg("Cập nhật ảnh đại diện thành công!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: unknown) {
      console.error("Failed to upload avatar to server:", err);
      // Nếu server upload có sự cố, vẫn gán preview để người dùng trải nghiệm
      setAvatarUrl(croppedDataUrl);
      setErrorMsg("Không thể lưu ảnh lên máy chủ lúc này. Vui lòng thử lại!");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const genderOptions: OptionItem[] = [
    { value: "UNKNOWN", label: "-- Chưa chọn / Giữ bí mật --" },
    { value: "MALE", label: "Nam" },
    { value: "FEMALE", label: "Nữ" },
    { value: "OTHER", label: "Khác" },
  ];

  const relationshipOptions: OptionItem[] = [
    { value: "UNKNOWN", label: "-- Chưa chọn / Giữ bí mật --" },
    { value: "SINGLE", label: "Độc thân" },
    { value: "DATING", label: "Tìm hiểu / Mập mờ" },
    { value: "IN_RELATIONSHIP", label: "Đang trong mối quan hệ" },
    { value: "COMPLICATED", label: "Mối quan hệ phức tạp / Trục trặc" },
    { value: "MARRIED", label: "Đã kết hôn" },
  ];

  const zodiacOptions: OptionItem[] = [
    { value: "UNKNOWN", label: "-- Chưa chọn cung hoàng đạo --", icon: <span className="text-zinc-400 text-xs">✨</span> },
    ...ZODIAC_LIST.map((z) => ({
      value: z.code,
      label: z.name,
      icon: <span className="text-amber-300 font-semibold text-sm">{z.symbol}</span>,
    })),
  ];

  const deckOptions: OptionItem[] = [
    { value: "", label: "-- Chưa chọn bộ bài yêu thích --" },
    ...decks.map((d) => ({
      value: String(d.id || ""),
      label: d.nameVi,
    })),
  ];

  const birthZodiac = dateOfBirth ? calculateZodiacFromDate(dateOfBirth) : "UNKNOWN";
  const birthZodiacItem = ZODIAC_LIST.find((z) => z.code === birthZodiac);

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
            Quản lý thông tin cá nhân, năng lượng hoàng đạo và tùy chọn trải nghiệm
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

      {/* 🌟 PROFILE FORM */}
      <div className="rounded-3xl border border-[#2b2d35] bg-[#191a1e] p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar & Identifiers Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 pb-6 border-b border-[#2b2d35]">
            <div
              className="relative group cursor-pointer shrink-0"
              onClick={() => fileInputRef.current?.click()}
              title="Nhấp để chọn ảnh đại diện từ máy tính"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#3b3d46] bg-[#23242a] p-1 flex items-center justify-center shadow-lg overflow-hidden group-hover:border-zinc-300 transition-colors">
                <Avatar
                  src={avatarUrl}
                  alt={displayName || user?.username}
                  size="xl"
                  className="w-full h-full"
                />
              </div>

              {/* Hover Overlay with Camera Icon */}
              <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                <Camera className="w-6 h-6 mb-0.5 text-zinc-100 drop-shadow" />
                <span className="text-[10px] font-semibold text-zinc-200">Đổi ảnh</span>
              </div>

              {/* Uploading Spinner */}
              {isUploadingAvatar && (
                <div className="absolute inset-0 rounded-full bg-black/75 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Camera Badge Icon on Avatar Corner */}
              <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#25262c] border-2 border-[#191a1e] flex items-center justify-center text-zinc-300 group-hover:bg-zinc-100 group-hover:text-zinc-950 transition-colors shadow-md">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white truncate">
                {displayName || user?.username}
              </h2>
              <div className="text-xs sm:text-sm text-zinc-400 flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </div>
                {(profile?.isEmailVerified ?? user?.isEmailVerified) ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Đã xác thực</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendVerificationLink}
                    disabled={isSendingLink || resendCountdown > 0}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSendingLink ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    <span>
                      {isSendingLink
                        ? "Đang gửi link..."
                        : resendCountdown > 0
                        ? `Gửi lại sau (${resendCountdown}s)`
                        : isLinkSent
                        ? "Gửi lại link kích hoạt"
                        : "Chưa xác thực • Gửi link kích hoạt"}
                    </span>
                  </button>
                )}
              </div>
              {isLinkSent && !(profile?.isEmailVerified ?? user?.isEmailVerified) && (
                <AlertBanner variant="warning" className="mt-2.5 !p-2 sm:!p-2.5 !text-[11px]">
                  <span>
                    <strong>Mẹo:</strong> Nếu không thấy email trong Hộp thư đến, bạn vui lòng kiểm tra thêm mục <em>Spam (Thư rác)</em> hoặc <em>Quảng cáo</em> nhé.
                  </span>
                </AlertBanner>
              )}
            </div>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <AlertBanner
              variant="error"
              message={errorMsg}
              onClose={() => setErrorMsg("")}
            />
          )}

          {successMsg && (
            <AlertBanner
              variant="success"
              message={successMsg}
              onClose={() => setSuccessMsg("")}
            />
          )}

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Tên hiển thị
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
                AI sẽ xưng hô với bạn bằng tên này khi luận giải
              </p>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Ngày sinh</span>
              </label>
              <DatePicker
                value={dateOfBirth}
                onChange={handleDateOfBirthChange}
                maxDate={new Date().toISOString().split("T")[0]}
                placeholder="Chọn ngày sinh (dd/mm/yyyy)..."
              />
              <p className="text-[10px] text-zinc-500 mt-1">
                Dùng để tính toán Lá bài Bản Mệnh và năng lượng Hoàng đạo
              </p>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Giới tính</span>
              </label>
              <CustomSelect
                options={genderOptions}
                value={gender}
                onChange={(val) => setGender(val as Gender)}
                placeholder="Chọn giới tính..."
              />
              <p className="text-[10px] text-zinc-500 mt-1">
                Giúp AI định hình đại từ xưng hô và góc nhìn thực tế
              </p>
            </div>

            {/* Relationship Status */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Tình Trạng Mối Quan Hệ</span>
              </label>
              <CustomSelect
                options={relationshipOptions}
                value={relationshipStatus}
                onChange={(val) => setRelationshipStatus(val as RelationshipStatus)}
                placeholder="Chọn tình trạng mối quan hệ..."
              />
              <p className="text-[10px] text-zinc-500 mt-1">
                Giúp AI phân tích đúng chiều hướng các quẻ bói tình cảm
              </p>
            </div>

            {/* Zodiac Sign */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cung Hoàng Đạo Mặc Định</span>
                </label>
                {birthZodiac !== "UNKNOWN" && birthZodiac !== selectedZodiac && (
                  <button
                    type="button"
                    onClick={() => setSelectedZodiac(birthZodiac)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
                    title="Bấm để khôi phục về Cung chuẩn theo ngày sinh"
                  >
                    ↺ Khôi phục ({birthZodiacItem?.symbol} {birthZodiacItem?.name})
                  </button>
                )}
              </div>
              <CustomSelect
                options={zodiacOptions}
                value={selectedZodiac}
                onChange={(val) => setSelectedZodiac(val as ZodiacSign)}
                placeholder="Chọn cung hoàng đạo..."
              />
              <p className="text-[10px] text-zinc-500 mt-1">
                Tự động suy luận từ ngày sinh, hoặc tùy chỉnh theo Cung Mọc / Mặt Trăng của bạn
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

      {/* Hidden File Input for Avatar Selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={rawAvatarImage}
        onSave={handleCropSave}
        cropShape="round"
        title="Cắt & Căn Chỉnh Ảnh Đại Diện"
        outputSize={512}
      />
    </div>
  );
}

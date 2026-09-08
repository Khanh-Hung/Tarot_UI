"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useQuota } from "@/features/tarot/hooks/useQuota";
import {
  CreateReadingResponse,
  DeckCode,
  DeckDto,
  SpreadType,
  ZodiacSign,
} from "@/features/tarot/types/tarot.types";
import { tarotService } from "@/features/tarot/services/tarotService";
import { getFriendlyErrorMessage } from "@/lib/errorMapping";
import { EnergyQuotaModal } from "@/features/ads/components/EnergyQuotaModal";
import { ShareTarotStoryModal } from "@/features/tarot/components/ShareTarotStoryModal";
import { ThreeTarotFan } from "@/features/tarot/components/ThreeTarotFan";
import { ReadingFormSkeleton } from "@/components/ui/Skeleton";
import { ReadingWizardStep } from "@/features/tarot/components/ReadingWizardStep";
import { ReadingResultStep } from "@/features/tarot/components/ReadingResultStep";

function ReadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: isAuthLoading, updateUserZodiac } = useAuth();
  const { quota, setQuota } = useQuota();

  const [stage, setStage] = useState<"FORM" | "PICKING" | "RESULT">("FORM");
  const [step, setStep] = useState<1 | 2>(1);
  const [question, setQuestion] = useState("");
  const initialDeck = (searchParams.get("deckCode") as DeckCode) || "RIDER_WAITE_CLASSIC";
  const [deckCode, setDeckCode] = useState<DeckCode>(initialDeck);
  const [spreadType, setSpreadType] = useState<SpreadType>("DAILY_ORACLE");
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacSign>(
    (user?.zodiacSign as ZodiacSign) || "UNKNOWN"
  );
  const [decks, setDecks] = useState<DeckDto[]>([]);
  const [isReadingLoading, setIsReadingLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [readingResult, setReadingResult] = useState<CreateReadingResponse | null>(null);
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Load danh sách bộ bài Tarot
  useEffect(() => {
    async function loadDecks() {
      try {
        const data = await tarotService.getDecks();
        setDecks(data);
      } catch (e: unknown) {
        console.error("Failed to load decks:", e);
      }
    }
    loadDecks();
  }, []);

  // Tự động chọn Cung Hoàng Đạo từ user khi đã đăng nhập
  useEffect(() => {
    if (user?.zodiacSign && user.zodiacSign !== "UNKNOWN") {
      setSelectedZodiac(user.zodiacSign as ZodiacSign);
    }
  }, [user?.zodiacSign]);

  // Cuộn lên đỉnh trang khi có kết quả
  useEffect(() => {
    if (stage === "RESULT") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [stage]);

  // Chuyển từ Bước 1 sang Bước 2
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setErrorMsg("Vui lòng nhập hoặc chọn một câu hỏi bạn đang băn khoăn.");
      return;
    }
    if (selectedZodiac === "UNKNOWN" && user?.zodiacSign && user.zodiacSign !== "UNKNOWN") {
      setSelectedZodiac(user.zodiacSign as ZodiacSign);
    }
    setErrorMsg("");
    setStep(2);
  };

  // Chuyển từ Form sang Bàn xòe bài 78 lá (Picking)
  const handleProceedToPicking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!question.trim()) {
      setStep(1);
      setErrorMsg("Vui lòng nhập câu hỏi bạn đang trăn trở.");
      return;
    }

    const needsZodiac = !user?.zodiacSign || user.zodiacSign === "UNKNOWN";
    if (needsZodiac && (!selectedZodiac || selectedZodiac === "UNKNOWN")) {
      setErrorMsg("Vui lòng chọn Cung Hoàng Đạo để AI kết nối năng lượng chính xác nhất.");
      return;
    }

    const isOracle = spreadType === "DAILY_ORACLE";
    const canProceed = isOracle
      ? (quota ? (quota.dailyFreeRemaining > 0 || quota.bonusReadings > 0) : true)
      : (quota ? quota.bonusReadings > 0 : true);

    if (quota && !canProceed) {
      setIsQuotaModalOpen(true);
      return;
    }

    setErrorMsg("");
    setStage("PICKING");
  };

  // Xác nhận bài đã bốc và gọi API giải quẻ
  const handleConfirmSelectedCards = async (
    picked: { cardId: string | number; isReversed: boolean }[]
  ) => {
    const isOracle = spreadType === "DAILY_ORACLE";
    const canRead = isOracle
      ? (quota ? (quota.dailyFreeRemaining > 0 || quota.bonusReadings > 0) : true)
      : (quota ? quota.bonusReadings > 0 : true);

    if (quota && !canRead) {
      setIsQuotaModalOpen(true);
      return;
    }

    setErrorMsg("");
    setIsReadingLoading(true);
    const startTimestamp = Date.now();

    try {
      const resultPromise = tarotService.createReading({
        userId: user!.userId,
        userQuestion: question,
        deckCode,
        zodiacSign: selectedZodiac !== "UNKNOWN" ? selectedZodiac : undefined,
        spreadType,
        selectedCardIds: picked.map((p) => p.cardId),
        isReversedList: picked.map((p) => p.isReversed),
      });

      const [result] = await Promise.all([
        resultPromise,
        new Promise((resolve) => {
          const elapsed = Date.now() - startTimestamp;
          const remaining = Math.max(0, 2000 - elapsed);
          setTimeout(resolve, remaining);
        }),
      ]);

      setReadingResult(result);
      setStage("RESULT");
      if (selectedZodiac !== "UNKNOWN") {
        updateUserZodiac(selectedZodiac);
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("tarot_quota_updated"));
      }
    } catch (err: unknown) {
      const msg = getFriendlyErrorMessage(err, "Không thể thực hiện quẻ bói lúc này. Vui lòng thử lại sau.");
      if (msg.includes("hết lượt")) {
        setIsQuotaModalOpen(true);
      }
      setErrorMsg(msg);
    } finally {
      setIsReadingLoading(false);
    }
  };

  const handleReset = () => {
    setReadingResult(null);
    setQuestion("");
    setStep(1);
    setStage("FORM");
    if (user?.zodiacSign && user.zodiacSign !== "UNKNOWN") {
      setSelectedZodiac(user.zodiacSign as ZodiacSign);
    }
  };

  if (isAuthLoading) {
    return <ReadingFormSkeleton />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* GIAI ĐOẠN 1: FORM WIZARD 2 BƯỚC */}
      {stage === "FORM" && (
        <ReadingWizardStep
          step={step}
          setStep={setStep}
          question={question}
          setQuestion={setQuestion}
          deckCode={deckCode}
          setDeckCode={setDeckCode}
          spreadType={spreadType}
          setSpreadType={setSpreadType}
          selectedZodiac={selectedZodiac}
          setSelectedZodiac={setSelectedZodiac}
          decks={decks}
          quota={quota}
          errorMsg={errorMsg}
          onProceedToStep2={handleProceedToStep2}
          onStartReading={handleProceedToPicking}
          onOpenQuotaModal={() => setIsQuotaModalOpen(true)}
        />
      )}

      {/* GIAI ĐOẠN 2: BÀN TRẢI 78 LÁ BÀI 3D THREE.JS */}
      {stage === "PICKING" && (
        <div className="space-y-4">
          {errorMsg && (
            <div className="max-w-md mx-auto p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center animate-shake">
              ⚠️ {errorMsg}
            </div>
          )}
          <ThreeTarotFan
            deckCode={deckCode}
            userQuestion={question}
            spreadType={spreadType}
            maxCards={spreadType === "DAILY_ORACLE" ? 1 : 3}
            onConfirmSelection={handleConfirmSelectedCards}
            onCancel={() => setStage("FORM")}
            isLoading={isReadingLoading}
          />
        </div>
      )}

      {/* GIAI ĐOẠN 3: KẾT QUẢ LUẬN GIẢI & CHAT */}
      {stage === "RESULT" && readingResult && (
        <ReadingResultStep
          readingResult={readingResult}
          spreadType={spreadType}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onReset={handleReset}
        />
      )}

      {/* MODAL HẠN MỨC NĂNG LƯỢNG */}
      <EnergyQuotaModal
        isOpen={isQuotaModalOpen}
        onClose={() => setIsQuotaModalOpen(false)}
        quota={quota}
        onQuotaUpdated={(newQuota) => setQuota(newQuota)}
        userId={user?.userId}
      />

      {/* MODAL XUẤT ẢNH STORY */}
      {readingResult && (
        <ShareTarotStoryModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          reading={readingResult}
          zodiacSign={selectedZodiac}
        />
      )}
    </div>
  );
}

export default function ReadingPage() {
  return (
    <Suspense fallback={<ReadingFormSkeleton />}>
      <ReadingContent />
    </Suspense>
  );
}
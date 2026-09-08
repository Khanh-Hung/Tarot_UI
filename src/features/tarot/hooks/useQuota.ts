"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { tarotService } from "../services/tarotService";
import { UserQuotaDto } from "../types/tarot.types";

export function useQuota() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [quota, setQuota] = useState<UserQuotaDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshQuota = useCallback(async () => {
    if (!isAuthenticated || !user?.userId) {
      setQuota(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await tarotService.getUserQuota(user.userId);
      setQuota(data);
    } catch (err: unknown) {
      console.error("Failed to fetch quota:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.userId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("tarot_mock_streak_full");
      } catch {
        // ignore
      }
    }
    if (isAuthLoading) return;
    refreshQuota();

    const handleQuotaUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<UserQuotaDto>;
      if (customEvent?.detail) {
        setQuota(customEvent.detail);
      } else {
        refreshQuota();
      }
    };

    window.addEventListener("tarot_quota_updated", handleQuotaUpdated);
    return () => {
      window.removeEventListener("tarot_quota_updated", handleQuotaUpdated);
    };
  }, [isAuthLoading, refreshQuota]);

  const updateQuotaLocal = useCallback((newQuota: UserQuotaDto) => {
    setQuota(newQuota);
    window.dispatchEvent(new CustomEvent("tarot_quota_updated", { detail: newQuota }));
  }, []);

  return {
    quota,
    setQuota,
    updateQuotaLocal,
    isLoading: isAuthLoading || isLoading,
    refreshQuota,
  };
}

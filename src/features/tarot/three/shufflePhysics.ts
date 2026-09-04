import * as THREE from "three";

export type ShufflePhase =
  | "IDLE"
  | "VORTEX"
  | "GATHER"
  | "OVERHAND"
  | "WATERFALL"
  | "SPLIT"
  | "RIFFLE"
  | "DEAL";

export type SpreadMode = "RIBBON" | "FAN";

export interface CardTransform {
  targetX: number;
  targetY: number;
  targetZ: number;
  targetRotX: number;
  targetRotZ: number;
  targetScale: number;
}

export interface ShuffleCalcParams {
  index: number;
  totalCards: number;
  currentPhase: ShufflePhase;
  isSpread: boolean;
  spreadMode: SpreadMode;
  currentTime: number;
  shuffleStartTime: number;
  isHover: boolean;
}

/**
 * Tính toán vị trí và góc xoay 3D cho lá bài ở vị trí index
 * tương ứng với từng giai đoạn trong nghi thức xáo bài hoàng gia hoặc thế trải bài.
 */
export const calculateCardShuffleTransform = ({
  index: i,
  totalCards: total,
  currentPhase,
  isSpread,
  spreadMode,
  currentTime,
  shuffleStartTime,
  isHover,
}: ShuffleCalcParams): CardTransform => {
  const normalized = (i - (total - 1) / 2) / ((total - 1) / 2); // -1 đến +1

  let targetX = 0;
  let targetY = 0;
  let targetZ = i * 0.005;
  let targetRotZ = 0;
  let targetRotX = 0;
  const targetScale = isHover ? 1.06 : 1.0;

  if (currentPhase === "VORTEX") {
    // 🌀 BƯỚC 1: TRỘN BÀI XOÁY NƯỚC VÒNG TRÒN KHẮP BÀN TAROT
    const elapsed = (currentTime - shuffleStartTime) * 0.0035;
    const orbitRadius = 0.85 + (i % 8) * 0.38;
    const orbitSpeed = 1.3 + (i % 5) * 0.35;
    const theta = elapsed * orbitSpeed + (i * ((Math.PI * 2) / total) * 3.2);

    targetX = Math.cos(theta) * orbitRadius;
    targetY = Math.sin(theta) * (orbitRadius * 0.55) - 0.7;
    targetZ = (i % 12) * 0.012;
    targetRotZ = theta + i * 0.2;
    targetRotX = 0.18;
  } else if (currentPhase === "GATHER") {
    // 📦 BƯỚC 2: GOM BÀI VỀ 1 CỌC TẠI TÂM
    targetX = 0;
    targetY = -1.1;
    targetZ = i * 0.005;
    targetRotZ = Math.sin(i * 99) * 0.04;
    targetRotX = 0.12;
  } else if (currentPhase === "OVERHAND") {
    // 🎴 BƯỚC 3: TRÁO BÀI TỪ DƯỚI LÊN TRÊN (OVERHAND SHUFFLE)
    const elapsed = currentTime - shuffleStartTime;
    const packetIndex = Math.floor(i / 15);
    const packetProgress = (elapsed - packetIndex * 350) / 350;

    if (packetProgress < 0) {
      targetX = 0;
      targetY = -1.1;
      targetZ = i * 0.005;
      targetRotZ = 0;
      targetRotX = 0.15;
    } else if (packetProgress <= 1.0) {
      const u = packetProgress;
      const arc = Math.sin(u * Math.PI);
      targetX = arc * 1.5;
      targetY = -1.1 + arc * 1.1;
      targetZ = 0.05 + u * 0.5 + (i % 15) * 0.006;
      targetRotZ = arc * 0.22;
      targetRotX = 0.15 + arc * 0.1;
    } else {
      targetX = 0;
      targetY = -1.1;
      targetZ = 0.3 + (i % 15) * 0.006;
      targetRotZ = 0;
      targetRotX = 0.15;
    }
  } else if (currentPhase === "WATERFALL") {
    // 🌊 BƯỚC 4: THÁC NƯỚC UỐN CONG RƠI CASCADE TỰ NHIÊN XẾP VỀ CỌC TÂM
    const elapsed = currentTime - shuffleStartTime;
    const dropTime = i * 12;
    const dropProgress = Math.max(0, Math.min(1, (elapsed - dropTime) / 320));
    const isLeft = i % 2 === 0;

    if (dropProgress === 0) {
      // Đang uốn vòm cầu chuẩn bị thả rơi
      const arch = Math.sin((i / total) * Math.PI) * 0.45;
      targetX = isLeft ? -0.4 : 0.4;
      targetY = -0.9 + arch;
      targetZ = 0.25 + (i % 10) * 0.006;
      targetRotZ = isLeft ? -0.1 : 0.1;
      targetRotX = 0.22;
    } else {
      const p = dropProgress;
      const startX = isLeft ? -0.4 : 0.4;
      targetX = THREE.MathUtils.lerp(startX, 0, p);
      targetY = THREE.MathUtils.lerp(-0.9, -1.1, p);
      targetZ = THREE.MathUtils.lerp(0.25, i * 0.005, p);
      targetRotZ = THREE.MathUtils.lerp(isLeft ? -0.1 : 0.1, 0, p);
      targetRotX = THREE.MathUtils.lerp(0.22, 0.15, p);
    }
  } else if (currentPhase === "SPLIT") {
    // ✂️ BƯỚC 5: CẮT CỌC BÀI LÀM 2 NỬA BAY SANG HAI BÊN
    const isLeft = i < total / 2;
    const halfIdx = isLeft ? i : i - total / 2;
    targetX = isLeft ? -1.7 : 1.7;
    targetY = -0.8;
    targetZ = halfIdx * 0.008;
    targetRotZ = isLeft ? -0.22 : 0.22;
    targetRotX = 0.2;
  } else if (currentPhase === "RIFFLE") {
    // 🌊 BƯỚC 6: CHẺ BÀI ĐAN XEN LƯỢN SÓNG 3D
    const isLeft = i % 2 === 0;
    targetX = isLeft ? -0.25 : 0.25;
    targetY = -0.9 + Math.sin(i * 0.35) * 0.15;
    targetZ = i * 0.005;
    targetRotZ = isLeft ? -0.06 : 0.06;
    targetRotX = 0.15;
  } else if (isSpread) {
    // 🎴 BƯỚC 7: TRẢI BÀI HOÀN CHỈNH RA NỬA DƯỚI BÀN THẢM
    if (spreadMode === "RIBBON") {
      targetX = normalized * 3.8;
      targetY = -(normalized ** 2) * 0.38 - 1.05 + (isHover ? 0.45 : 0);
      targetRotZ = -normalized * 0.2;
      targetRotX = 0.25;
      targetZ = isHover ? 0.6 : i * 0.005;
    } else {
      const angle = normalized * Math.PI * 0.32;
      targetX = 0;
      targetY = -2.2 + (isHover ? 0.35 : 0);
      targetRotZ = -angle;
      targetRotX = 0.05;
      targetZ = isHover ? 0.6 : i * 0.005;
    }
  } else {
    targetX = 0;
    targetY = -1.1;
    targetZ = i * 0.005;
    targetRotZ = 0;
    targetRotX = 0.15;
  }

  return {
    targetX,
    targetY,
    targetZ,
    targetRotX,
    targetRotZ,
    targetScale,
  };
};

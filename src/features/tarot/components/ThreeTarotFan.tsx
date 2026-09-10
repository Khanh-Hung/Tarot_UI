"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, RotateCcw, ArrowRight, Moon, CheckCircle2, Eye, LayoutGrid, Maximize2, Minimize2, RotateCw } from "lucide-react";
import { CardDto, SpreadType } from "../types/tarot.types";
import { tarotService } from "../services/tarotService";
import { renderTarotCardBackCanvas } from "../three/cardCanvas";
import {
  createGoldenParticleSystem,
  updateParticleAnimation,
  ParticleSystemHandle,
} from "../three/particleSystem";
import {
  calculateCardShuffleTransform,
  ShufflePhase,
  SpreadMode,
} from "../three/shufflePhysics";

interface ThreeTarotFanProps {
  deckCode: string;
  userQuestion: string;
  spreadType?: SpreadType;
  maxCards?: number;
  onConfirmSelection: (selectedCards: { cardId: string | number; isReversed: boolean }[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const slotYPos = 1.65;

// ⚡ Reusable cached vectors for 60fps zero-allocation animate loop
const vScaleDrawn = new THREE.Vector3(1.04, 1.04, 1.04);
const vScaleOne = new THREE.Vector3(1, 1, 1);
const vScaleDynamic = new THREE.Vector3();

export const ThreeTarotFan: React.FC<ThreeTarotFanProps> = ({
  deckCode,
  userQuestion,
  spreadType = "PAST_PRESENT_FUTURE",
  maxCards = 3,
  onConfirmSelection,
  onCancel,
  isLoading = false,
}) => {
  const effectiveMaxCards = maxCards || 3;

  const slotNames = React.useMemo(() => {
    if (effectiveMaxCards === 1 || spreadType === "DAILY_ORACLE") {
      return [
        {
          title: "Thông Điệp Ngày Mới",
          shortTitle: "Thông Điệp",
          desc: "Năng lượng chủ đạo và lời chỉ dẫn cho ngày hôm nay",
          icon: "☀️",
        },
      ];
    }
    if (spreadType === "TWO_PATHS_CHOICE") {
      return [
        {
          title: "Thực Tại Hiện Tại",
          shortTitle: "Thực Tại",
          desc: "Nguồn năng lượng và tình huống bạn đang đối diện",
          icon: "🧭",
        },
        {
          title: "Ngả Rẽ / Phương Án A",
          shortTitle: "Hướng A",
          desc: "Tiềm năng, chuyển biến và kết quả theo hướng A",
          icon: "🅰️",
        },
        {
          title: "Ngả Rẽ / Phương Án B",
          shortTitle: "Hướng B",
          desc: "Tiềm năng, chuyển biến và kết quả theo hướng B",
          icon: "🅱️",
        },
      ];
    }
    if (spreadType === "LOVE_RELATIONSHIP") {
      return [
        {
          title: "Năng Lượng Của Bạn",
          shortTitle: "Bản Thân",
          desc: "Tâm tư, cảm xúc và góc nhìn của bạn trong mối quan hệ",
          icon: "💖",
        },
        {
          title: "Tâm Ý Đối Phương",
          shortTitle: "Đối Phương",
          desc: "Cảm nhận, suy nghĩ và thái độ của người ấy",
          icon: "💫",
        },
        {
          title: "Sự Kết Nối & Tương Lai",
          shortTitle: "Kết Nối",
          desc: "Sợi dây liên kết, bài học chung và hướng phát triển",
          icon: "💞",
        },
      ];
    }
    if (spreadType === "MIND_BODY_SPIRIT") {
      return [
        {
          title: "Tâm Trí (Mind)",
          shortTitle: "Tâm Trí",
          desc: "Suy nghĩ, niềm tin cốt lõi và góc nhìn lý trí",
          icon: "🧠",
        },
        {
          title: "Thể Chất (Body)",
          shortTitle: "Thể Chất",
          desc: "Hành động thực tế, năng lượng thể chất và vật chất",
          icon: "🌿",
        },
        {
          title: "Tâm Hồn (Spirit)",
          shortTitle: "Tâm Hồn",
          desc: "Trực giác, sự thấu suốt và tiếng gọi linh hồn",
          icon: "✨",
        },
      ];
    }
    if (spreadType === "SITUATION_OBSTACLE_ADVICE") {
      return [
        {
          title: "Thực Trạng Vấn Đề",
          shortTitle: "Thực Trạng",
          desc: "Bối cảnh thực tế và điều đang thực sự diễn ra",
          icon: "🔍",
        },
        {
          title: "Rào Cản & Thách Thức",
          shortTitle: "Trở Ngại",
          desc: "Khó khăn cốt lõi cần phải vượt qua hoặc đối diện",
          icon: "⚡",
        },
        {
          title: "Lời Khuyên Hành Động",
          shortTitle: "Lời Khuyên",
          desc: "Hướng dẫn xử lý và giải pháp tối ưu cho bạn",
          icon: "💡",
        },
      ];
    }
    if (spreadType === "HORSESHOE") {
      return [
        {
          title: "Ảnh Hưởng Quá Khứ",
          shortTitle: "Quá Khứ",
          desc: "Nền tảng và sự kiện trong quá khứ dẫn đến hiện tại",
          icon: "🕰️",
        },
        {
          title: "Hiện Tại Cốt Lõi",
          shortTitle: "Hiện Tại",
          desc: "Tình trạng thực tế và cảm xúc ở thời điểm này",
          icon: "📍",
        },
        {
          title: "Ẩn Số Tiềm Tàng",
          shortTitle: "Ẩn Số",
          desc: "Yếu tố bí mật, nỗi sợ hoặc điều bạn chưa nhận thấy",
          icon: "🔮",
        },
        {
          title: "Hành Động Tối Ưu",
          shortTitle: "Lời Khuyên",
          desc: "Cách tiếp cận hoặc giải pháp hành động tốt nhất",
          icon: "🗝️",
        },
        {
          title: "Kết Quả Sau Cùng",
          shortTitle: "Kết Quả",
          desc: "Kết cục tiềm năng nếu đi theo hướng hành động này",
          icon: "🏆",
        },
      ];
    }
    if (spreadType === "CELTIC_CROSS") {
      return [
        {
          title: "Hiện Tại Cốt Lõi",
          shortTitle: "1. Hiện Tại",
          desc: "Bối cảnh và trạng thái tinh thần cốt lõi của bạn",
          icon: "1️⃣",
        },
        {
          title: "Thách Thức / Trở Ngại",
          shortTitle: "2. Trở Ngại",
          desc: "Lực cản hoặc yếu tố xung đột trực tiếp",
          icon: "2️⃣",
        },
        {
          title: "Tiềm Thức / Nền Tảng",
          shortTitle: "3. Tiềm Thức",
          desc: "Nguyên nhân sâu xa hoặc điều định hình vấn đề",
          icon: "3️⃣",
        },
        {
          title: "Quá Khứ Gần",
          shortTitle: "4. Quá Khứ",
          desc: "Sự kiện vừa xảy ra đang dần lùi xa",
          icon: "4️⃣",
        },
        {
          title: "Mục Tiêu / Tiềm Năng",
          shortTitle: "5. Mục Tiêu",
          desc: "Kết quả tốt nhất có thể đạt được hoặc lý tưởng",
          icon: "5️⃣",
        },
        {
          title: "Tương Lai Gần",
          shortTitle: "6. Tương Lai",
          desc: "Xu hướng biến chuyển trong thời gian ngắn sắp tới",
          icon: "6️⃣",
        },
        {
          title: "Thái Độ Bản Thân",
          shortTitle: "7. Bản Thân",
          desc: "Tâm lý, niềm tin và vị thế của bạn",
          icon: "7️⃣",
        },
        {
          title: "Môi Trường Xung Quanh",
          shortTitle: "8. Môi Trường",
          desc: "Tác động từ người khác hoặc hoàn cảnh bên ngoài",
          icon: "8️⃣",
        },
        {
          title: "Hy Vọng & Nỗi Sợ",
          shortTitle: "9. Hy Vọng",
          desc: "Mong muốn thầm kín hoặc sự bất an trong lòng",
          icon: "9️⃣",
        },
        {
          title: "Kết Quả Cuối Cùng",
          shortTitle: "10. Kết Quả",
          desc: "Lời giải đáp tổng kết và định hướng đường dài",
          icon: "🔟",
        },
      ];
    }
    return [
      {
        title: "Quá Khứ và Nền Tảng",
        shortTitle: "Quá Khứ",
        desc: "Nguồn gốc, nguyên nhân sâu xa tạo nên hoàn cảnh",
        icon: "🌒",
      },
      {
        title: "Hiện Tại và Trở Ngại",
        shortTitle: "Hiện Tại",
        desc: "Năng lượng thực tế và nút thắt bạn đang đối diện",
        icon: "🌕",
      },
      {
        title: "Tương Lai và Xu Hướng",
        shortTitle: "Tương Lai",
        desc: "Kết quả và hướng đi phát triển tự nhiên",
        icon: "🌘",
      },
    ];
  }, [effectiveMaxCards, spreadType]);

  const slotPositions = React.useMemo((): { x: number; y: number; scale: number }[] => {
    if (effectiveMaxCards === 1) {
      return [{ x: 0, y: 1.65, scale: 1.0 }];
    }
    if (effectiveMaxCards === 3) {
      return [
        { x: -2.1, y: 1.65, scale: 1.0 },
        { x: 0, y: 1.65, scale: 1.0 },
        { x: 2.1, y: 1.65, scale: 1.0 },
      ];
    }
    if (effectiveMaxCards === 5) {
      // Vòng cung móng ngựa (Horseshoe arch)
      return [
        { x: -2.8, y: 1.5, scale: 0.88 },
        { x: -1.4, y: 1.8, scale: 0.88 },
        { x: 0, y: 1.95, scale: 0.88 },
        { x: 1.4, y: 1.8, scale: 0.88 },
        { x: 2.8, y: 1.5, scale: 0.88 },
      ];
    }
    if (effectiveMaxCards === 10) {
      // Celtic Cross: 2 tầng 5 lá cân xứng, tỉ lệ scale 0.72 vừa vặn
      const xs = [-2.8, -1.4, 0, 1.4, 2.8];
      const row1 = xs.map((x) => ({ x, y: 2.15, scale: 0.72 }));
      const row2 = xs.map((x) => ({ x, y: 0.95, scale: 0.72 }));
      return [...row1, ...row2];
    }
    const scale = effectiveMaxCards > 5 ? 0.72 : 0.9;
    const spacing = Math.min(1.5, 6.0 / effectiveMaxCards);
    const startX = -((effectiveMaxCards - 1) * spacing) / 2;
    return Array.from({ length: effectiveMaxCards }, (_, i) => ({
      x: startX + i * spacing,
      y: 1.65,
      scale,
    }));
  }, [effectiveMaxCards]);
  const mountRef = useRef<HTMLDivElement>(null);
  const [deckCards, setDeckCards] = useState<CardDto[]>([]);
  const [selectedCards, setSelectedCards] = useState<{ card: CardDto; isReversed: boolean }[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const isShufflingRef = useRef(false);
  const [spreadMode, setSpreadMode] = useState<SpreadMode>("RIBBON");


  // References cho Three.js scene
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cardMeshesRef = useRef<THREE.Group[]>([]);
  const hoveredMeshRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isSpreadRef = useRef<boolean>(false);
  const spreadModeRef = useRef<SpreadMode>("RIBBON");
  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null);
  const isMobileRef = useRef<boolean>(false);

  useEffect(() => {
    isShufflingRef.current = isShuffling;
  }, [isShuffling]);

  useEffect(() => {
    spreadModeRef.current = spreadMode;
  }, [spreadMode]);

  useEffect(() => {
    async function loadCards() {
      try {
        const cards = await tarotService.getCardsByDeck(deckCode);
        setDeckCards(cards);
      } catch (err) {
        console.error("Failed to load deck cards:", err);
      }
    }
    loadCards();
  }, [deckCode]);

  const shufflePhaseRef = useRef<ShufflePhase>("IDLE");
  const shuffleStartTimeRef = useRef<number>(0);

  const [, setDrawnCardsMap] = useState<{ [cardId: string]: { slotIndex: number; isReversed: boolean } }>({});
  const selectedCardsRef = useRef<{ card: CardDto; isReversed: boolean }[]>([]);

  useEffect(() => {
    selectedCardsRef.current = selectedCards;
  }, [selectedCards]);

  const [isRevealing, setIsRevealing] = useState(false);
  const isRevealingRef = useRef<boolean>(false);
  const revealStartTimeRef = useRef<number>(0);

  const [loadingStepText, setLoadingStepText] = useState("✨ Đang kết nối năng lượng các lá bài...");

  useEffect(() => {
    if (!isRevealing && !isLoading) return;
    setLoadingStepText("✨ Đang kết nối năng lượng các lá bài...");

    const t1 = setTimeout(() => {
      setLoadingStepText("🔮 Đang luận giải biểu tượng & chiều bài...");
    }, 1800);

    const t2 = setTimeout(() => {
      setLoadingStepText("📜 Đang hoàn thiện lời khuyên & thông điệp...");
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isRevealing, isLoading]);

  // Khi không còn loading (ví dụ xảy ra lỗi từ server), reset lại isRevealing để nút trở về bình thường
  useEffect(() => {
    if (!isLoading && isRevealing) {
      setIsRevealing(false);
      isRevealingRef.current = false;
    }
  }, [isLoading]);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const confirmAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window !== "undefined") {
        setIsPortrait(window.innerHeight > window.innerWidth);
      }
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  // 🔄 Khóa màn hình nằm ngang (Landscape) khi phóng to giống YouTube
  const lockScreenLandscape = async () => {
    try {
      const orientation: any = screen.orientation || (screen as any).mozOrientation || (screen as any).msOrientation;
      if (orientation && typeof orientation.lock === "function") {
        await orientation.lock("landscape");
      }
    } catch (err) {
      console.warn("Landscape orientation lock not supported or failed:", err);
    }
  };

  const unlockScreenOrientation = () => {
    try {
      const orientation: any = screen.orientation || (screen as any).mozOrientation || (screen as any).msOrientation;
      if (orientation && typeof orientation.unlock === "function") {
        orientation.unlock();
      }
    } catch {
      // ignore
    }
  };

  const toggleFullscreen = async () => {
    const isCurrentlyFs = Boolean(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement
    );

    if (!isCurrentlyFs && !isFullscreen) {
      const el = tableContainerRef.current;
      if (el) {
        const reqFs =
          el.requestFullscreen ||
          (el as any).webkitRequestFullscreen ||
          (el as any).mozRequestFullScreen;

        if (reqFs) {
          try {
            await reqFs.call(el);
            setIsFullscreen(true);
            await lockScreenLandscape();
          } catch {
            setIsFullscreen(true);
            await lockScreenLandscape();
          }
        } else {
          setIsFullscreen(true);
          await lockScreenLandscape();
        }
      }
    } else {
      unlockScreenOrientation();
      const exitFs =
        document.exitFullscreen ||
        (document as any).webkitExitFullscreen ||
        (document as any).mozCancelFullScreen;

      if (exitFs && isCurrentlyFs) {
        try {
          await exitFs.call(document);
        } catch {
          setIsFullscreen(false);
        }
      } else {
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = async () => {
      const active = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement
      );
      setIsFullscreen(active);
      if (active) {
        await lockScreenLandscape();
      } else {
        unlockScreenOrientation();
      }
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        unlockScreenOrientation();
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          setIsFullscreen(false);
          setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
          }, 100);
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  // 🚀 Tự động cuộn mượt mà xuống nút Xác nhận khi đã bốc đủ số lá bài
  useEffect(() => {
    if (selectedCards.length === effectiveMaxCards && !isFullscreen) {
      const timer = setTimeout(() => {
        confirmAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [selectedCards.length, effectiveMaxCards, isFullscreen]);

  const loadCardFrontTexture = (meshGroup: THREE.Group, card: CardDto) => {
    if (!card.imageUrl || !textureLoaderRef.current) return;
    textureLoaderRef.current.load(card.imageUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      const mesh = meshGroup.children[0] as THREE.Mesh;
      if (mesh && Array.isArray(mesh.material)) {
        const frontMat = mesh.material[5] as THREE.MeshStandardMaterial;
        if (frontMat) {
          frontMat.map = tex;
          frontMat.needsUpdate = true;
        }
      }
    });
  };

  const handleCardSelect3D = (meshGroup: THREE.Group, card: CardDto) => {
    setSelectedCards((prev) => {
      if (prev.length >= effectiveMaxCards) return prev;
      if (prev.some((s) => s.card.id === card.id)) return prev;

      const slotIdx = prev.length;
      const isReversed = Math.random() < 0.35;

      meshGroup.userData.isDrawn = true;
      meshGroup.userData.slotIndex = slotIdx;

      // ⚡ Lazy load ảnh mặt trước ngay khi người dùng chọn lá này (tiết kiệm 95% VRAM & Network)
      loadCardFrontTexture(meshGroup, card);

      setDrawnCardsMap((m) => ({
        ...m,
        [String(card.id)]: { slotIndex: slotIdx, isReversed },
      }));

      return [...prev, { card, isReversed }];
    });
  };

  // KÍCH HOẠT SIÊU NGHI THỨC XÁO BÀI 3D TOÀN DIỆN (7 BƯỚC HOÀNG GIA):
  // 1. TRỘN XOÁY NƯỚC -> 2. GOM BÀI -> 3. TRÁO DƯỚI LÊN -> 4. THÁC NƯỚC RƠI -> 5. CẮT CỌC -> 6. CHẺ ĐAN XEN -> 7. TRẢI BÀI
  const start3DShuffleSequence = () => {
    setIsShuffling(true);
    setSelectedCards([]);
    setDrawnCardsMap({});
    isSpreadRef.current = false;
    shuffleStartTimeRef.current = performance.now();

    // Reset toàn bộ lá bài về trạng thái chưa rút
    if (cardMeshesRef.current) {
      cardMeshesRef.current.forEach((g) => {
        g.userData.isDrawn = false;
        delete g.userData.slotIndex;
      });
    }

    // 1. Tráo bài chuyền tay từ dưới lên trên (Overhand Shuffle)
    shuffleStartTimeRef.current = performance.now();
    shufflePhaseRef.current = "OVERHAND";

    setTimeout(() => {
      // 2. Cắt cọc bài làm 2 nửa bay sang trái - phải (Deck Cut & Split)
      shuffleStartTimeRef.current = performance.now();
      shufflePhaseRef.current = "SPLIT";

      setTimeout(() => {
        // 3. Chẻ bài đan xen 1-1 lượn sóng 3D (Riffle Shuffle)
        shuffleStartTimeRef.current = performance.now();
        shufflePhaseRef.current = "RIFFLE";

        setTimeout(() => {
          // 4. Thác nước uốn cong cascade gom gọn về cọc tâm (Waterfall Cascade)
          shuffleStartTimeRef.current = performance.now();
          shufflePhaseRef.current = "WATERFALL";

          setTimeout(() => {
            // Xáo ngẫu nhiên dữ liệu gán cho 3D Meshes (KHÔNG setDeckCards để tránh unmount Three.js Scene!)
            const shuffled = [...deckCards].sort(() => Math.random() - 0.5);
            if (cardMeshesRef.current) {
              cardMeshesRef.current.forEach((g, idx) => {
                g.userData.card = shuffled[idx];
              });
            }

            // 5. Trải bài lướt sóng ra thảm nhung (Ribbon Deal)
            shuffleStartTimeRef.current = performance.now();
            shufflePhaseRef.current = "DEAL";
            isSpreadRef.current = true;

            setTimeout(() => {
              shufflePhaseRef.current = "IDLE";
              setIsShuffling(false);
            }, 800);
          }, 1100);
        }, 850);
      }, 700);
    }, 1300);
  };

  useEffect(() => {
    if (deckCards.length > 0) {
      setTimeout(() => {
        start3DShuffleSequence();
      }, 500);
    }
  }, [deckCards.length]);

  // Khởi tạo Scene Three.js
  useEffect(() => {
    if (!mountRef.current || deckCards.length === 0) return;

    const container = mountRef.current;
    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 640;
    const isMobile = window.innerWidth < 768;

    // 1. SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. CAMERA ĐƯỢC CĂN CHỈNH TỰ ĐỘNG THEO TỈ LỆ KHUNG NHÌN (RESPONSIVE FOV & DISTANCE)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);

    const updateCamera = () => {
      if (!mountRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth || 1000;
      const h = mountRef.current.clientHeight || 640;
      if (w === 0 || h === 0) return;

      const aspect = w / h;
      camera.aspect = aspect;

      const isMobileView = w < 768 || aspect < 1.15;
      isMobileRef.current = isMobileView;

      // Tính toán z để toàn bộ bộ bài 78 lá (boxWidth) và các ô đón bài luôn hiển thị trọn vẹn 100% với lề an toàn
      const targetBoxWidth = isMobileView
        ? effectiveMaxCards === 10 ? 9.2 : 8.4
        : effectiveMaxCards === 10 ? 9.8 : 9.2;
      const targetBoxHeight = isMobileView
        ? effectiveMaxCards === 10 ? 6.6 : 5.6
        : effectiveMaxCards === 10 ? 5.8 : 5.0;

      const fovRad = THREE.MathUtils.degToRad(camera.fov / 2);
      const tanFov = Math.tan(fovRad);

      const zForWidth = (targetBoxWidth / aspect) / (2 * tanFov);
      const zForHeight = targetBoxHeight / (2 * tanFov);

      const idealZ = Math.max(8.8, Math.max(zForWidth, zForHeight));
      const targetY = isMobileView ? (effectiveMaxCards === 10 ? 0.5 : 0.42) : (effectiveMaxCards === 10 ? 0.45 : 0.4);
      const lookAtY = isMobileView ? (effectiveMaxCards === 10 ? 0.35 : 0.28) : (effectiveMaxCards === 10 ? 0.25 : 0.2);

      camera.position.set(0, targetY, idealZ);
      camera.lookAt(0, lookAtY, 0);
      camera.updateProjectionMatrix();

      rendererRef.current.setSize(w, h);
    };

    // 3. RENDERER (Tối ưu pixelRatio & shadowMap trên mọi cấu hình)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;

    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "none";
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    updateCamera();

    // Lắng nghe phục hồi WebGL Context nếu trình duyệt giải phóng bộ nhớ
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn("WebGL Context lost. Waiting for restoration...");
    };
    const handleContextRestored = () => {
      console.info("WebGL Context restored successfully.");
    };
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost);
    renderer.domElement.addEventListener("webglcontextrestored", handleContextRestored);

    // 4. ÁNH SÁNG
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff8ed, 3.2);
    mainLight.position.set(2, 9, 8);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.bias = -0.0005;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xdbeafe, 2.0);
    rimLight.position.set(-7, 4, 6);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0xffecc2, 2.8, 12);
    pointLight.position.set(0, 1.5, 4);
    scene.add(pointLight);

    // 5. MẶT THẢM BÀN TAROT (VELVET MAT)
    const tableGeo = new THREE.PlaneGeometry(32, 24);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x0a1020,
      roughness: 0.8,
      metalness: 0.1,
    });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.set(0, 0, -0.6);
    tableMesh.receiveShadow = true;
    scene.add(tableMesh);

    // 🌟 TẠO CÁC Ô ĐÓN BÀI 3D (HOLOGRAPHIC GOLDEN SLOTS TRÊN MẶT BÀN)
    slotPositions.forEach((pos) => {
      const slotGeo = new THREE.PlaneGeometry(0.85 * pos.scale, 1.45 * pos.scale);
      const slotEdges = new THREE.EdgesGeometry(slotGeo);
      const slotLineMat = new THREE.LineBasicMaterial({
        color: 0xf2d07c,
        linewidth: 2,
        transparent: true,
        opacity: 0.55,
      });
      const slotWireframe = new THREE.LineSegments(slotEdges, slotLineMat);
      slotWireframe.position.set(pos.x, pos.y, 0.005);
      scene.add(slotWireframe);

      const slotBackMat = new THREE.MeshBasicMaterial({
        color: 0x162238,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      });
      const slotBackMesh = new THREE.Mesh(slotGeo, slotBackMat);
      slotBackMesh.position.set(pos.x, pos.y, 0.002);
      scene.add(slotBackMesh);
    });

    // 6. KHỞI TẠO 78 LÁ BÀI 3D (TỈ LỆ VÀNG 0.85 x 1.45)
    const cardCanvas = renderTarotCardBackCanvas(deckCode);
    const cardBackTex = new THREE.CanvasTexture(cardCanvas);
    cardBackTex.colorSpace = THREE.SRGBColorSpace;
    cardBackTex.anisotropy = 4;
    const cardGeo = new THREE.BoxGeometry(0.85, 1.45, 0.012);

    const normalizedDeck = deckCode?.toUpperCase() || "RIDER_WAITE_CLASSIC";
    const edgeColor = normalizedDeck.includes("THOTH")
      ? 0xf0b95a
      : normalizedDeck.includes("MARSEILLE")
      ? 0xe5b84b
      : 0xf2d07c;

    const cardMatBack = new THREE.MeshStandardMaterial({
      map: cardBackTex,
      roughness: 0.25,
      metalness: 0.2,
    });
    const cardMatEdge = new THREE.MeshStandardMaterial({
      color: edgeColor,
      metalness: 0.9,
      roughness: 0.2,
    });

    textureLoaderRef.current = new THREE.TextureLoader();
    const cardGroups: THREE.Group[] = [];

    // Shared default front material for face-down cards initially (0 network requests during shuffle!)
    const defaultFrontMat = new THREE.MeshStandardMaterial({
      map: cardBackTex,
      roughness: 0.25,
      metalness: 0.15,
    });

    deckCards.forEach((card, i) => {
      const materials = [
        cardMatEdge,
        cardMatEdge,
        cardMatEdge,
        cardMatEdge,
        cardMatBack,
        defaultFrontMat.clone(),
      ];

      const cardMesh = new THREE.Mesh(cardGeo, materials);
      cardMesh.castShadow = true;
      cardMesh.receiveShadow = false;
      cardMesh.position.set(0, 0.725, 0);

      const group = new THREE.Group();
      group.add(cardMesh);
      group.userData = {
        card,
        index: i,
        isDrawn: false,
      };

      group.position.set(0, -1.0, i * 0.005);
      group.rotation.set(0, 0, 0);

      scene.add(group);
      cardGroups.push(group);
    });

    // ✨ HỆ THỐNG BỤI SAO VÀNG MA THUẬT KHI LẬT BÀI
    const particleHandle: ParticleSystemHandle = createGoldenParticleSystem(slotPositions, slotYPos, 180);
    scene.add(particleHandle.points);

    cardMeshesRef.current = cardGroups;

    setTimeout(() => {
      isSpreadRef.current = true;
    }, 400);

    // 7. BẮT CHUỘT VÀ CẢM ỨNG (TOUCH) TÍNH TOÁN HOVER & CHỌN BÀI MƯỢT MÀ TRÊN CẢ MOBILE LẪN DESKTOP
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let targetHoverIndex = -1;

    const calculateHoverIndex = (normalizedX: number, normalizedY: number) => {
      const isPickingFinished = selectedCardsRef.current.length >= effectiveMaxCards;
      if (isShufflingRef.current || !isSpreadRef.current || isPickingFinished) return -1;
      if (normalizedY <= -0.95 || normalizedY >= 0.25) return -1;

      if (spreadModeRef.current === "RIBBON") {
        const boundX = isMobileRef.current ? 0.72 : 0.90;
        const clampedX = Math.max(-boundX, Math.min(boundX, normalizedX));
        const norm = (clampedX + boundX) / (boundX * 2);
        return Math.max(0, Math.min(deckCards.length - 1, Math.floor(norm * deckCards.length)));
      } else {
        const angle = Math.atan2(normalizedX, normalizedY + 0.9);
        const maxAngle = isMobileRef.current ? Math.PI * 0.21 : Math.PI * 0.32;
        const norm = (angle + maxAngle) / (maxAngle * 2);
        return Math.max(0, Math.min(deckCards.length - 1, Math.floor(norm * deckCards.length)));
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetHoverIndex = calculateHoverIndex(mouse.x, mouse.y);
    };

    const onClick = (e: MouseEvent) => {
      const isPickingFinished = selectedCardsRef.current.length >= effectiveMaxCards;
      if (isShufflingRef.current || !isSpreadRef.current || isPickingFinished) return;

      if (targetHoverIndex >= 0 && targetHoverIndex < cardGroups.length) {
        const topHit = cardGroups[targetHoverIndex];
        if (topHit && !topHit.userData.isDrawn) {
          const cardData = topHit.userData.card as CardDto;
          handleCardSelect3D(topHit, cardData);
          return;
        }
      }

      // Fallback raycaster
      const rect = renderer.domElement.getBoundingClientRect();
      const clickMouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.setFromCamera(clickMouse, camera);
      const meshes = cardGroups.filter((g) => !g.userData.isDrawn).map((g) => g.children[0]);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const topHit = intersects[0].object.parent as THREE.Group;
        if (topHit && !topHit.userData.isDrawn) {
          const cardData = topHit.userData.card as CardDto;
          handleCardSelect3D(topHit, cardData);
        }
      }
    };

    // 📱 Cảm ứng vuốt ngón tay và chạm rút bài trên màn hình Mobile (Touch Events)
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      targetHoverIndex = calculateHoverIndex(mouse.x, mouse.y);
    };

    const onTouchEnd = () => {
      const isPickingFinished = selectedCardsRef.current.length >= effectiveMaxCards;
      if (isShufflingRef.current || !isSpreadRef.current || isPickingFinished) return;

      if (targetHoverIndex >= 0 && targetHoverIndex < cardGroups.length) {
        const topHit = cardGroups[targetHoverIndex];
        if (topHit && !topHit.userData.isDrawn) {
          const cardData = topHit.userData.card as CardDto;
          handleCardSelect3D(topHit, cardData);
          targetHoverIndex = -1;
        }
      }
    };

    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("click", onClick);
    renderer.domElement.addEventListener("touchstart", onTouchMove, { passive: true });
    renderer.domElement.addEventListener("touchmove", onTouchMove, { passive: true });
    renderer.domElement.addEventListener("touchend", onTouchEnd, { passive: true });

    // 8. ANIMATION LOOP
    let lastTime = performance.now();
    const vScalesNormal = slotPositions.map((p) => new THREE.Vector3(p.scale, p.scale, p.scale));
    const vScalesDrawn = slotPositions.map((p) => new THREE.Vector3(p.scale * 1.04, p.scale * 1.04, p.scale * 1.04));

    const animate = (currentTime: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const isPickingFinished = selectedCardsRef.current.length >= effectiveMaxCards;
      const currentHover =
        !isShufflingRef.current && isSpreadRef.current && !isPickingFinished && targetHoverIndex >= 0
          ? cardGroups[targetHoverIndex]
          : null;
      hoveredMeshRef.current = currentHover;
      renderer.domElement.style.cursor = isPickingFinished ? "default" : currentHover ? "pointer" : "default";

      const total = cardGroups.length;
      const currentMode = spreadModeRef.current;
      const currentPhase = shufflePhaseRef.current;

      // ⚡ Damping độc lập với tốc độ khung hình (100% mượt mà từ 30fps đến 144fps)
      const dampPos = 1 - Math.exp(-14 * delta);
      const dampRot = 1 - Math.exp(-12 * delta);
      const dampScale = 1 - Math.exp(-16 * delta);

      cardGroups.forEach((group, i) => {
        const cardMesh = group.children[0] as THREE.Mesh | undefined;

        // 🚀 NẾU LÁ BÀI ĐÃ ĐƯỢC RÚT:
        if (group.userData.isDrawn) {
          const slotIdx = group.userData.slotIndex ?? 0;
          const pos = slotPositions[slotIdx] || { x: 0, y: 1.65, scale: 1.0 };
          const targetSlotX = pos.x;
          const targetSlotY = pos.y - 0.725 * pos.scale;
          const cardData = selectedCardsRef.current[slotIdx];
          const isRev = cardData ? cardData.isReversed : false;

          if (isRevealingRef.current) {
            // ✨ HIỆU ỨNG 3D LẬT BÀI & PHÁT SÁNG BỤI SAO VÀNG KHI XÁC NHẬN
            const elapsed = currentTime - revealStartTimeRef.current;
            const cardDelay = slotIdx * 350;
            const flipProgress = Math.max(0, Math.min(1, (elapsed - cardDelay) / 550));

            const zArc = Math.sin(flipProgress * Math.PI) * 0.45;
            const targetZ = 0.008 + zArc;
            const rotY = flipProgress * Math.PI;
            // Xoay lá bài ngược quanh chính tâm của cardMesh (không bị thụt xuống dưới)
            const rotZ = isRev ? flipProgress * Math.PI : 0;

            group.position.x = THREE.MathUtils.lerp(group.position.x, targetSlotX, dampPos);
            group.position.y = THREE.MathUtils.lerp(group.position.y, targetSlotY, dampPos);
            group.position.z = THREE.MathUtils.lerp(group.position.z, targetZ, dampPos);

            group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0, dampRot);
            group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, rotY, dampRot);
            group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, 0, dampRot);

            if (cardMesh) {
              cardMesh.rotation.z = THREE.MathUtils.lerp(cardMesh.rotation.z, rotZ, dampRot);
            }

            const targetScaleDrawn = vScalesDrawn[slotIdx] || vScaleDrawn;
            group.scale.lerp(targetScaleDrawn, dampScale);
            return;
          }

          group.position.x = THREE.MathUtils.lerp(group.position.x, targetSlotX, dampPos);
          group.position.y = THREE.MathUtils.lerp(group.position.y, targetSlotY, dampPos);
          group.position.z = THREE.MathUtils.lerp(group.position.z, 0.008, dampPos);

          group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0, dampRot);
          group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, 0, dampRot);
          group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, 0, dampRot);

          if (cardMesh) {
            cardMesh.rotation.z = THREE.MathUtils.lerp(cardMesh.rotation.z, 0, dampRot);
          }

          const targetScaleNormal = vScalesNormal[slotIdx] || vScaleOne;
          group.scale.lerp(targetScaleNormal, dampScale);
          return;
        }

        if (cardMesh && cardMesh.rotation.z !== 0) {
          cardMesh.rotation.z = 0;
        }

        // TÍNH TOÁN VẬT LÝ VÀ VỊ TRÍ TỪ MODULE RIÊNG
        const transform = calculateCardShuffleTransform({
          index: i,
          totalCards: total,
          currentPhase,
          isSpread: isSpreadRef.current,
          spreadMode: currentMode,
          currentTime,
          shuffleStartTime: shuffleStartTimeRef.current,
          isHover: currentHover === group,
          isMobile: isMobileRef.current,
        });

        group.position.x = THREE.MathUtils.lerp(group.position.x, transform.targetX, dampPos);
        group.position.y = THREE.MathUtils.lerp(group.position.y, transform.targetY, dampPos);
        group.position.z = THREE.MathUtils.lerp(group.position.z, transform.targetZ, dampPos);
        group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, transform.targetRotZ, dampRot);
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, transform.targetRotX, dampRot);
        vScaleDynamic.setScalar(transform.targetScale);
        group.scale.lerp(vScaleDynamic, dampScale);
      });

      // ✨ CẬP NHẬT BỤI SAO VÀNG KHI LẬT MỞ BÀI
      if (isRevealingRef.current) {
        particleHandle.material.opacity = Math.min(0.95, particleHandle.material.opacity + delta * 3);
        pointLight.intensity = THREE.MathUtils.lerp(pointLight.intensity, 4.5, delta * 4);
        updateParticleAnimation(particleHandle, delta, slotPositions, slotYPos);
      }

      renderer.render(scene, camera);
    };

    animate(performance.now());

    const handleResize = () => {
      updateCamera();
    };
    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.domElement.removeEventListener("touchstart", onTouchMove);
      renderer.domElement.removeEventListener("touchmove", onTouchMove);
      renderer.domElement.removeEventListener("touchend", onTouchEnd);
      renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", handleContextRestored);
      renderer.dispose();
    };
  }, [deckCards.length, effectiveMaxCards, deckCode, slotPositions]);

  const handleReshuffle3D = () => {
    if (isRevealing) return;
    start3DShuffleSequence();
  };

  const handleQuickPick3D = () => {
    if (isRevealing || deckCards.length < effectiveMaxCards) return;
    const available = cardMeshesRef.current.filter((g) => !g.userData.isDrawn);
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const chosenMeshes = shuffled.slice(0, effectiveMaxCards);

    const chosen: { card: CardDto; isReversed: boolean }[] = [];
    const mapUpdate: { [cardId: string]: { slotIndex: number; isReversed: boolean } } = {};

    chosenMeshes.forEach((m, idx) => {
      m.userData.isDrawn = true;
      m.userData.slotIndex = idx;
      const c = m.userData.card as CardDto;
      const isReversed = Math.random() < 0.35;
      chosen.push({ card: c, isReversed });
      mapUpdate[String(c.id)] = { slotIndex: idx, isReversed };

      // ⚡ Lazy load mặt trước cho các lá bốc nhanh
      loadCardFrontTexture(m, c);
    });

    setSelectedCards(chosen);
    setDrawnCardsMap(mapUpdate);
  };

  const handleConfirm = () => {
    if (selectedCards.length === effectiveMaxCards && !isRevealing) {
      setIsRevealing(true);
      isRevealingRef.current = true;
      revealStartTimeRef.current = performance.now();

      // Bắt đầu gọi API ngay lập tức để chạy song song với hiệu ứng lật bài 3D
      onConfirmSelection(
        selectedCards.map((s) => ({
          cardId: s.card.id,
          isReversed: s.isReversed,
        }))
      );
    }
  };

  const currentSlotIndex = selectedCards.length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-3.5 animate-fade-in select-none">
      {/* 🔮 TIÊU ĐỀ HƯỚNG DẪN */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
          &ldquo;{userQuestion}&rdquo;
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-300">
          {isShuffling ? (
            <span className="text-amber-300 font-medium flex items-center justify-center gap-1.5 animate-pulse">
              <RotateCcw className="w-4 h-4 animate-spin text-amber-300" />
              Đang thực hiện nghi thức xáo bài và hòa hợp năng lượng... Xin vui lòng đợi trong giây lát.
            </span>
          ) : currentSlotIndex < effectiveMaxCards ? (
            <span className="text-slate-100 font-medium">
              ✨ Chạm hoặc click chọn lá bài cho{" "}
              <strong className="text-amber-200 underline underline-offset-4 font-bold">
                {slotNames[currentSlotIndex]?.title || `Lá ${currentSlotIndex + 1}`}
              </strong>{" "}
              ({currentSlotIndex + 1}/{effectiveMaxCards})
            </span>
          ) : isRevealing || isLoading ? (
            <span className="text-amber-300 font-medium flex items-center justify-center gap-1.5 animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              {loadingStepText}
            </span>
          ) : (
            <span className="text-emerald-400 font-medium flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Bạn đã rút đủ bài! Hãy bấm Xem Luận Giải bên dưới.
            </span>
          )}
        </p>
      </div>

      {/* 🎴 KHUNG CANVAS THREE.JS 3D TOÀN CẢNH KẾT HỢP CÁC Ô ĐÓN BÀI & BÀN TRẢI */}
      <div
        ref={tableContainerRef}
        className={`relative overflow-hidden shadow-2xl transition-all duration-300 ${
          isFullscreen
            ? "fixed inset-0 z-[9999] w-screen h-screen rounded-none p-0 flex flex-col justify-between bg-[#0a1020] border-none"
            : "silver-card rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-[#0B132B] via-[#111C3D] to-[#080E20] border border-amber-400/20"
        }`}
      >
        {/* Hướng dẫn xoay ngang trên Mobile nếu thiết bị đang ở chế độ dọc (VD: iOS Safari) */}
        {isFullscreen && isPortrait && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#111c3d]/90 border border-amber-400/50 text-amber-200 text-xs font-semibold flex items-center gap-2 backdrop-blur-md shadow-2xl animate-pulse pointer-events-none whitespace-nowrap">
            <RotateCw className="w-4 h-4 text-amber-300 animate-spin" />
            <span>Xoay ngang điện thoại để có góc nhìn rộng nhất 🔄</span>
          </div>
        )}

        {/* THANH ĐIỀU KHIỂN & TIÊU ĐỀ Ô ĐÓN BÀI TRÊN 3D */}
        <div className={`relative z-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 mb-2 ${isFullscreen ? "pt-4 px-4 sm:px-6" : ""}`}>
          {/* Hàng tiêu đề: Trái là Tên bàn bài, Phải là nút Toàn màn hình (trên Mobile) */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-amber-400/15 border border-amber-300/30 flex items-center justify-center text-amber-200 shadow-md shrink-0">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
                Bàn Trải Bài
              </h3>
            </div>

            {/* Nút Toàn màn hình & Xoay ngang trên Mobile (căn góc phải trên cùng) */}
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Thu nhỏ (Esc)" : "Toàn màn hình & Xoay ngang (Landscape)"}
              className="sm:hidden p-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-xs font-semibold text-slate-200 hover:text-white transition flex items-center justify-center cursor-pointer shadow-md"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-slate-200" />
              )}
            </button>
          </div>

          {/* Hàng công cụ: Chuyển kiểu trải, Xáo lại, Rút nhanh (& Toàn màn hình trên Desktop) */}
          <div className="flex items-center justify-center sm:justify-end gap-1.5 sm:gap-2">
            {/* Nút đổi kiểu trải bài */}
            <div className="inline-flex rounded-xl bg-black/40 border border-white/15 p-0.5 text-xs shrink-0">
              <button
                onClick={() => setSpreadMode("RIBBON")}
                disabled={isShuffling || isRevealing}
                className={`px-2 sm:px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer disabled:opacity-50 whitespace-nowrap ${
                  spreadMode === "RIBBON"
                    ? "bg-amber-400/25 text-amber-200 border border-amber-300/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px] sm:text-xs hidden sm:inline">Trải Cung</span>
                <span className="text-[11px] sm:hidden">Cung</span>
              </button>
              <button
                onClick={() => setSpreadMode("FAN")}
                disabled={isShuffling || isRevealing}
                className={`px-2 sm:px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer disabled:opacity-50 whitespace-nowrap ${
                  spreadMode === "FAN"
                    ? "bg-amber-400/25 text-amber-200 border border-amber-300/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Moon className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px] sm:text-xs hidden sm:inline">Xòe Quạt</span>
                <span className="text-[11px] sm:hidden">Quạt</span>
              </button>
            </div>

            <button
              onClick={() => handleReshuffle3D()}
              disabled={isShuffling || isLoading || isRevealing}
              className="px-2 sm:px-2.5 py-1 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-[11px] sm:text-xs font-semibold text-slate-200 hover:text-white transition flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-md whitespace-nowrap shrink-0"
            >
              <RotateCcw className={`w-3.5 h-3.5 shrink-0 ${isShuffling ? "animate-spin" : ""}`} />
              <span>Xáo lại</span>
            </button>

            <button
              onClick={handleQuickPick3D}
              disabled={isShuffling || isLoading || isRevealing || selectedCards.length >= effectiveMaxCards}
              className="px-2 sm:px-2.5 py-1 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-[11px] sm:text-xs font-bold text-amber-200 transition flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-md whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Rút nhanh</span>
            </button>

            {/* Nút Toàn màn hình & Xoay ngang trên Desktop */}
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Thu nhỏ (Esc)" : "Toàn màn hình & Xoay ngang (Landscape)"}
              className="hidden sm:flex p-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-xs font-semibold text-slate-200 hover:text-white transition items-center justify-center cursor-pointer shadow-md"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-slate-200" />
              )}
            </button>
          </div>
        </div>

        {/* 🌟 HUD TIÊU ĐỀ Ô VỊ TRÍ ĐÓN BÀI NẰM NGAY TRÊN 3D SLOTS (ĐÃ RÚT GỌN 1 HÀNG) */}
        <div
          className={`grid ${
            effectiveMaxCards === 1
              ? "grid-cols-1 max-w-xs"
              : effectiveMaxCards === 5
              ? "grid-cols-5 max-w-3xl"
              : effectiveMaxCards === 10
              ? "grid-cols-5 max-w-3xl"
              : "grid-cols-3 max-w-2xl"
          } gap-1.5 sm:gap-2 mx-auto pt-0.5 pb-0.5 relative z-20 pointer-events-none`}
        >
          {slotNames.map((slot, idx) => {
            const isPicked = selectedCards.length > idx;
            return (
              <div
                key={idx}
                className={`text-center py-1 sm:py-1.5 px-1.5 sm:px-3 rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-1 sm:gap-1.5 ${
                  isPicked
                    ? "bg-amber-400/15 border border-amber-300/30 text-amber-200"
                    : currentSlotIndex === idx
                    ? "bg-white/[0.08] border border-dashed border-amber-300/40 text-amber-100 ring-1 ring-amber-300/20"
                    : "bg-white/[0.02] border border-white/5 opacity-50 text-slate-400"
                }`}
              >
                <span className="text-[10px] sm:text-xs">{slot.icon}</span>
                <span className="text-[9px] sm:text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                  {effectiveMaxCards === 1 ? (
                    slot.title
                  ) : effectiveMaxCards >= 5 ? (
                    slot.shortTitle
                  ) : (
                    <>
                      <span className="sm:hidden">{`Lá ${idx + 1}: ${slot.shortTitle}`}</span>
                      <span className="hidden sm:inline">{`Lá ${idx + 1}: ${slot.title}`}</span>
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* CONTAINER CHỨA CANVAS THREE.JS DUY NHẤT */}
        <div
          ref={mountRef}
          className={`w-full relative transition-opacity duration-300 ${
            isFullscreen ? "flex-1 min-h-0 h-full" : "h-[440px] sm:h-[490px]"
          } ${
            isShuffling || isRevealing ? "cursor-wait pointer-events-none opacity-95" : "cursor-pointer"
          }`}
        />

        {/* Thanh nút bấm nằm ở dưới khung viền khi toàn màn hình */}
        {isFullscreen && (
          <div className="relative z-30 w-full border-t border-white/10 bg-[#0a1020] py-3.5 px-4 flex items-center justify-center gap-4 shrink-0 shadow-2xl">
            <button
              onClick={toggleFullscreen}
              className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              Thu nhỏ (Esc)
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedCards.length < effectiveMaxCards || isShuffling || isLoading || isRevealing}
              className="px-6 py-2.5 rounded-xl silver-gradient-btn font-bold text-xs sm:text-sm flex items-center gap-2 disabled:opacity-40 transition cursor-pointer shadow-xl hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Xem Luận Giải</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        )}
      </div>

      {/* 🚀 NÚT HÀNH ĐỘNG XÁC NHẬN */}
      <div ref={confirmAreaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
        <button
          onClick={onCancel}
          disabled={isLoading || isRevealing}
          className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 font-medium text-sm transition cursor-pointer"
        >
          Quay lại
        </button>

        <button
          onClick={handleConfirm}
          disabled={selectedCards.length < effectiveMaxCards || isShuffling || isLoading || isRevealing}
          className="w-full sm:w-auto px-10 py-3.5 rounded-2xl silver-gradient-btn font-bold text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-2xl hover:scale-105"
        >
          {isLoading || isRevealing ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              <span>{loadingStepText}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Xem Luận Giải</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

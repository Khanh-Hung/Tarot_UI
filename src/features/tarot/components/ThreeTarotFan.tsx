"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, RotateCcw, ArrowRight, Moon, Shuffle, CheckCircle2, Eye, LayoutGrid } from "lucide-react";
import { CardDto } from "../types/tarot.types";
import { tarotService } from "../services/tarotService";

interface ThreeTarotFanProps {
  deckCode: string;
  userQuestion: string;
  onConfirmSelection: (selectedCards: { cardId: number; isReversed: boolean }[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const SLOT_NAMES = [
  { title: "Quá Khứ và Nền Tảng", desc: "Nguồn gốc, nguyên nhân sâu xa tạo nên hoàn cảnh", icon: "🌒" },
  { title: "Hiện Tại và Trở Ngại", desc: "Năng lượng thực tế và nút thắt bạn đang đối diện", icon: "🌕" },
  { title: "Tương Lai và Xu Hướng", desc: "Kết quả và hướng đi phát triển tự nhiên", icon: "🌘" },
];

// Hàm tạo Canvas vẽ mặt lưng lá bài Tarot 3D chuẩn 100%
const renderTarotCardBackCanvas = (): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1600;
  const ctx = canvas.getContext("2d")!;

  // 1. NỀN XANH ĐÊM HUYỀN BÍ & CHIỀU SÂU VŨ TRỤ (CHUẨN ĐỘ SÂU ĐẸP MẮT)
  const bgGrad = ctx.createRadialGradient(512, 800, 100, 512, 800, 900);
  bgGrad.addColorStop(0, "#1c2b4d");
  bgGrad.addColorStop(0.5, "#121b33");
  bgGrad.addColorStop(1, "#080d1a");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1600);

  // 2. HOA VĂN LƯỚI ĐAN MẮT CÁO RIDER-WAITE 1909 (SACRED DIAMOND CROSSHATCH GRID)
  ctx.save();
  ctx.beginPath();
  ctx.rect(60, 60, 904, 1480);
  ctx.clip();

  ctx.strokeStyle = "rgba(242, 208, 124, 0.16)";
  ctx.lineWidth = 2;
  const step = 48;
  for (let x = -1600; x < 2600; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 1600, 1600);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, 1600);
    ctx.lineTo(x + 1600, 0);
    ctx.stroke();
  }

  // Các điểm sao nhỏ tại giao điểm lưới
  ctx.fillStyle = "rgba(255, 235, 175, 0.35)";
  for (let y = 100; y < 1500; y += step * 2) {
    for (let x = 100; x < 924; x += step * 2) {
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 3. KHUNG VIỀN ĐÔI MẠ VÀNG KIM LOẠI (DUAL GILDED FILIGREE BORDER)
  ctx.strokeStyle = "#F2D07C";
  ctx.lineWidth = 16;
  ctx.strokeRect(36, 36, 952, 1528);

  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 3;
  ctx.strokeRect(56, 56, 912, 1488);

  ctx.strokeStyle = "rgba(242, 208, 124, 0.6)";
  ctx.lineWidth = 4;
  ctx.strokeRect(72, 72, 880, 1456);

  // 4. HOA VĂN 4 GÓC HOÀNG GIA (GILDED CORNER FLOURISHES)
  const drawCornerOrnament = (cx: number, cy: number, rot: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    ctx.strokeStyle = "#F5D77F";
    ctx.fillStyle = "#F2D07C";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();

    // Tia hào quang góc
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(0, 45);
    ctx.moveTo(20, 0);
    ctx.lineTo(45, 0);
    ctx.stroke();

    ctx.restore();
  };

  drawCornerOrnament(100, 100, 0);
  drawCornerOrnament(924, 100, Math.PI / 2);
  drawCornerOrnament(924, 1500, Math.PI);
  drawCornerOrnament(100, 1500, -Math.PI / 2);

  // 5. TRUNG TÂM: MẶT TRĂNG & MẶT TRỜI THÁI CỰC ĐỐI XỨNG 180° (CELESTIAL SUN & MOON MANDALA)
  ctx.save();
  ctx.translate(512, 800);

  // Vòng tròn chiêm tinh ngoài
  ctx.strokeStyle = "#F2D07C";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(0, 0, 220, 0, Math.PI * 2);
  ctx.stroke();

  ctx.setLineDash([10, 8]);
  ctx.strokeStyle = "rgba(255, 245, 215, 0.7)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 195, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 12 Tia Hào Quang Mặt Trời Tỏa Rộng
  for (let r = 0; r < 12; r++) {
    const angle = (r * Math.PI * 2) / 12;
    ctx.save();
    ctx.rotate(angle);
    ctx.strokeStyle = "#F5D77F";
    ctx.lineWidth = r % 2 === 0 ? 5 : 3;
    ctx.beginPath();
    ctx.moveTo(0, 140);
    ctx.lineTo(0, r % 2 === 0 ? 185 : 170);
    ctx.stroke();
    ctx.restore();
  }

  // Đĩa Mặt Trời Trung Tâm Mạ Vàng
  const sunGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 130);
  sunGrad.addColorStop(0, "#FFF5D0");
  sunGrad.addColorStop(0.6, "#E5B84B");
  sunGrad.addColorStop(1, "#8A6414");
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 125, 0, Math.PI * 2);
  ctx.fill();

  // Vầng Trăng Khuyết Đối Xứng Hai Chiều
  ctx.fillStyle = "#121b33";
  ctx.beginPath();
  ctx.arc(38, -20, 105, 0, Math.PI * 2, true);
  ctx.fill();

  // Ngôi sao 8 cánh Alchemical Star trung tâm
  ctx.fillStyle = "#FFF7D6";
  for (let s = 0; s < 8; s++) {
    const sAngle = (s * Math.PI * 2) / 8;
    ctx.save();
    ctx.rotate(sAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-12, 35);
    ctx.lineTo(0, 85);
    ctx.lineTo(12, 35);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Tâm điểm ngọc sáng
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // 6. CHU KỲ MẶT TRĂNG (LUNAR PHASES ĐỐI XỨNG TRÊN VÀ DƯỚI)
  ctx.fillStyle = "#F5D77F";
  ctx.font = "bold 34px serif";
  ctx.textAlign = "center";
  ctx.fillText("🌑    🌓    🌕    🌗    🌘", 512, 240);
  ctx.fillText("🌘    🌗    🌕    🌓    🌑", 512, 1360);

  return canvas;
};

export const ThreeTarotFan: React.FC<ThreeTarotFanProps> = ({
  deckCode,
  userQuestion,
  onConfirmSelection,
  onCancel,
  isLoading = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [deckCards, setDeckCards] = useState<CardDto[]>([]);
  const [selectedCards, setSelectedCards] = useState<{ card: CardDto; isReversed: boolean }[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const isShufflingRef = useRef(false);
  const [spreadMode, setSpreadMode] = useState<"RIBBON" | "FAN">("RIBBON");

  // Tạo sẵn DataURL của mặt lưng lá bài đồng bộ 100% với canvas 3D
  const cardBackDataUrl = useMemo(() => {
    if (typeof document === "undefined") return "";
    return renderTarotCardBackCanvas().toDataURL("image/png");
  }, []);

  // References cho Three.js scene
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cardMeshesRef = useRef<THREE.Group[]>([]);
  const hoveredMeshRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isSpreadRef = useRef<boolean>(false);
  const spreadModeRef = useRef<"RIBBON" | "FAN">("RIBBON");

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

  const [shufflePhase, setShufflePhase] = useState<"IDLE" | "VORTEX" | "GATHER" | "OVERHAND" | "WATERFALL" | "SPLIT" | "RIFFLE" | "DEAL">("IDLE");
  const shufflePhaseRef = useRef<"IDLE" | "VORTEX" | "GATHER" | "OVERHAND" | "WATERFALL" | "SPLIT" | "RIFFLE" | "DEAL">("IDLE");
  const shuffleStartTimeRef = useRef<number>(0);

  useEffect(() => {
    shufflePhaseRef.current = shufflePhase;
  }, [shufflePhase]);

  const [drawnCardsMap, setDrawnCardsMap] = useState<{ [cardId: number]: { slotIndex: number; isReversed: boolean } }>({});
  const drawnCardsMapRef = useRef<{ [cardId: number]: { slotIndex: number; isReversed: boolean } }>({});

  useEffect(() => {
    drawnCardsMapRef.current = drawnCardsMap;
  }, [drawnCardsMap]);

  const selectedCardsRef = useRef<{ card: CardDto; isReversed: boolean }[]>([]);
  useEffect(() => {
    selectedCardsRef.current = selectedCards;
  }, [selectedCards]);

  const [isRevealing, setIsRevealing] = useState(false);
  const isRevealingRef = useRef<boolean>(false);
  const revealStartTimeRef = useRef<number>(0);

  const handleCardSelect3D = (meshGroup: THREE.Group, card: CardDto) => {
    setSelectedCards((prev) => {
      if (prev.length >= 3) return prev;
      if (prev.some((s) => s.card.id === card.id)) return prev;

      const slotIdx = prev.length;
      const isReversed = Math.random() < 0.35;

      meshGroup.userData.isDrawn = true;
      meshGroup.userData.slotIndex = slotIdx;

      setDrawnCardsMap((m) => ({
        ...m,
        [card.id]: { slotIndex: slotIdx, isReversed },
      }));

      return [...prev, { card, isReversed }];
    });
  };

  // KÍCH HOẠT SIÊU NGHI THỨC XÁO BÀI 3D TOÀN DIỆN (7 BƯỚC HOÀNG GIA):
  // 1. TRỘN XOÁY NƯỚC -> 2. GOM BÀI -> 3. TRÁO DƯỚI LÊN -> 4. THÁC NƯỚC RƠI TỰ DO -> 5. CẮT CỌC -> 6. CHẺ ĐAN XEN -> 7. TRẢI BÀI
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

    // 1. Trộn bài xoáy nước vòng tròn khắp mặt thảm (Tarot Vortex Wash)
    setShufflePhase("VORTEX");

    setTimeout(() => {
      // 2. Gom toàn bộ bài về 1 cọc tại tâm
      setShufflePhase("GATHER");

      setTimeout(() => {
        // 3. Tráo bài chuyền tay từ dưới lên trên (Overhand Shuffle 4 đợt)
        shuffleStartTimeRef.current = performance.now();
        setShufflePhase("OVERHAND");

        setTimeout(() => {
          // 4. Thác nước rơi tự do từ trên cao (Spring Cascade Waterfall)
          shuffleStartTimeRef.current = performance.now();
          setShufflePhase("WATERFALL");

          setTimeout(() => {
            // 5. Cắt cọc bài làm 2 nửa bay sang trái - phải (Deck Cut & Split)
            setShufflePhase("SPLIT");

            setTimeout(() => {
              // 6. Chẻ bài đan xen 1-1 lượn sóng 3D (Riffle Shuffle)
              setShufflePhase("RIFFLE");

              setTimeout(() => {
                // Xáo ngẫu nhiên thứ tự mảng lá bài
                const shuffled = [...deckCards].sort(() => Math.random() - 0.5);
                setDeckCards(shuffled);

                // 7. Trải bài lướt sóng ra thảm nhung (Ribbon Deal)
                setShufflePhase("DEAL");
                isSpreadRef.current = true;

                setTimeout(() => {
                  setShufflePhase("IDLE");
                  setIsShuffling(false);
                }, 800);
              }, 1000);
            }, 700);
          }, 1600);
        }, 1500);
      }, 500);
    }, 1800);
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

    // 1. SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. CAMERA ĐƯỢC CĂN CHỈNH BAO QUÁT CẢ 3 VỊ TRÍ ĐÓN BÀI VÀ BÀN TRẢI 78 LÁ
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 8.8);
    camera.lookAt(0, 0.2, 0);

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. ÁNH SÁNG
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff8ed, 3.2);
    mainLight.position.set(2, 9, 8);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
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

    // 🌟 TẠO 3 Ô ĐÓN BÀI 3D (3 HOLOGRAPHIC GOLDEN SLOTS TRÊN MẶT BÀN)
    const slotXPositions = [-2.1, 0, 2.1];
    const slotYPos = 1.65;

    slotXPositions.forEach((slotX) => {
      // Khung viền mạ vàng 3D của ô chờ (khớp khít 100% với kích thước lá bài 0.85 x 1.45)
      const slotGeo = new THREE.PlaneGeometry(0.85, 1.45);
      const slotEdges = new THREE.EdgesGeometry(slotGeo);
      const slotLineMat = new THREE.LineBasicMaterial({
        color: 0xf2d07c,
        linewidth: 2,
        transparent: true,
        opacity: 0.55,
      });
      const slotWireframe = new THREE.LineSegments(slotEdges, slotLineMat);
      slotWireframe.position.set(slotX, slotYPos, 0.005);
      scene.add(slotWireframe);

      // Thảm nền ô chờ
      const slotBackMat = new THREE.MeshBasicMaterial({
        color: 0x162238,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      });
      const slotBackMesh = new THREE.Mesh(slotGeo, slotBackMat);
      slotBackMesh.position.set(slotX, slotYPos, 0.002);
      scene.add(slotBackMesh);
    });

    // 6. KHỞI TẠO 78 LÁ BÀI 3D (TỈ LỆ VÀNG 0.85 x 1.45) & BỤI SAO MA THUẬT
    const cardCanvas = renderTarotCardBackCanvas();
    const cardBackTex = new THREE.CanvasTexture(cardCanvas);
    cardBackTex.anisotropy = 16;
    const cardGeo = new THREE.BoxGeometry(0.85, 1.45, 0.012);

    const cardMatBack = new THREE.MeshStandardMaterial({
      map: cardBackTex,
      roughness: 0.25,
      metalness: 0.2,
    });
    const cardMatEdge = new THREE.MeshStandardMaterial({
      color: 0xf2d07c,
      metalness: 0.9,
      roughness: 0.2,
    });

    const textureLoader = new THREE.TextureLoader();
    const cardGroups: THREE.Group[] = [];

    deckCards.forEach((card, i) => {
      // Mặt trước lá bài (Face 5: -Z) được nạp hình ảnh lá bài tương ứng
      const cardMatFront = new THREE.MeshStandardMaterial({
        map: cardBackTex,
        roughness: 0.25,
        metalness: 0.15,
      });

      if (card.imageUrl) {
        textureLoader.load(card.imageUrl, (tex) => {
          tex.anisotropy = 16;
          tex.center.set(0.5, 0.5);
          tex.repeat.set(-1, 1); // Đảo trục X để khi lật 180 độ không bị ngược gương
          cardMatFront.map = tex;
          cardMatFront.needsUpdate = true;
        });
      }

      const materials = [
        cardMatEdge,
        cardMatEdge,
        cardMatEdge,
        cardMatEdge,
        cardMatBack, // Face 4 (+Z): Mặt lưng bài khi úp
        cardMatFront, // Face 5 (-Z): Mặt trước hình vẽ lá bài khi lật mở
      ];

      const cardMesh = new THREE.Mesh(cardGeo, materials);
      cardMesh.castShadow = true;
      cardMesh.receiveShadow = true;
      cardMesh.position.set(0, 0.725, 0);

      const group = new THREE.Group();
      group.add(cardMesh);
      group.userData = {
        card,
        index: i,
        isDrawn: false,
      };

      // Ban đầu ở cọc bài
      group.position.set(0, -1.0, i * 0.005);
      group.rotation.set(0, 0, 0);

      scene.add(group);
      cardGroups.push(group);
    });

    // ✨ HỆ THỐNG BỤI SAO VÀNG MA THUẬT KHI LẬT BÀI (GOLDEN STARLIGHT PARTICLES)
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount; p++) {
      const slotX = slotXPositions[p % 3];
      particlePositions[p * 3] = slotX + (Math.random() - 0.5) * 1.4;
      particlePositions[p * 3 + 1] = slotYPos + (Math.random() - 0.5) * 1.8;
      particlePositions[p * 3 + 2] = 0.05 + Math.random() * 0.4;

      particleVelocities[p * 3] = (Math.random() - 0.5) * 0.35;
      particleVelocities[p * 3 + 1] = 0.3 + Math.random() * 0.7;
      particleVelocities[p * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const createSparkleTexture = () => {
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext("2d")!;
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255, 250, 220, 1)");
      grad.addColorStop(0.25, "rgba(242, 208, 124, 0.9)");
      grad.addColorStop(0.65, "rgba(212, 175, 55, 0.3)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(32, 32, 32, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(c);
    };

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      map: createSparkleTexture(),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(starParticles);

    cardMeshesRef.current = cardGroups;

    setTimeout(() => {
      isSpreadRef.current = true;
    }, 400);

    // 7. BẮT CHUỘT VÀ TÍNH TOÁN HOVER MƯỢT MÀ KHÔNG RUNG LẮC
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let targetHoverIndex = -1;

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Tính toán lá bài được hover trực tiếp dựa trên vị trí chuột liên tục
      if (!isShufflingRef.current && isSpreadRef.current && mouse.y > -0.9 && mouse.y < 0.15) {
        if (spreadModeRef.current === "RIBBON") {
          const clampedX = Math.max(-0.88, Math.min(0.88, mouse.x));
          const norm = (clampedX + 0.88) / (0.88 * 2); // 0 -> 1
          targetHoverIndex = Math.floor(norm * deckCards.length);
        } else {
          const angle = Math.atan2(mouse.x, mouse.y + 0.9);
          const maxAngle = Math.PI * 0.32;
          const norm = (angle + maxAngle) / (maxAngle * 2);
          targetHoverIndex = Math.floor(norm * deckCards.length);
        }
        targetHoverIndex = Math.max(0, Math.min(deckCards.length - 1, targetHoverIndex));
      } else {
        targetHoverIndex = -1;
      }
    };

    const onClick = (e: MouseEvent) => {
      if (isShufflingRef.current || !isSpreadRef.current) return;

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

    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("click", onClick);

    // 8. ANIMATION LOOP
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const currentHover =
        !isShufflingRef.current && isSpreadRef.current && targetHoverIndex >= 0
          ? cardGroups[targetHoverIndex]
          : null;
      hoveredMeshRef.current = currentHover;

      const total = cardGroups.length;
      const currentMode = spreadModeRef.current;
      const currentPhase = shufflePhaseRef.current;

      cardGroups.forEach((group, i) => {
        // 🚀 NẾU LÁ BÀI ĐÃ ĐƯỢC RÚT:
        if (group.userData.isDrawn) {
          const slotIdx = group.userData.slotIndex ?? 0;
          const targetSlotX = slotXPositions[slotIdx] || 0;
          const targetSlotY = slotYPos - 0.725;
          const cardData = selectedCardsRef.current[slotIdx];
          const isRev = cardData ? cardData.isReversed : false;

          if (isRevealingRef.current) {
            // ✨ HIỆU ỨNG 3D LẬT BÀI & PHÁT SÁNG BỤI SAO VÀNG KHI XÁC NHẬN
            const elapsed = currentTime - revealStartTimeRef.current;
            const cardDelay = slotIdx * 400; // Mỗi lá lật cách nhau 400ms
            const flipProgress = Math.max(0, Math.min(1, (elapsed - cardDelay) / 550));

            // Đường cong bay bổng nhấc lên khỏi mặt bàn
            const zArc = Math.sin(flipProgress * Math.PI) * 0.45;
            const targetZ = 0.008 + zArc;

            // Xoay 180 độ quanh trục Y để lộ mặt trước
            const rotY = flipProgress * Math.PI;
            // Nếu lá bài bị ngược (reversed), xoay thêm 180 độ quanh trục Z
            const rotZ = isRev ? (flipProgress * Math.PI) : 0;

            group.position.x = THREE.MathUtils.lerp(group.position.x, targetSlotX, delta * 12);
            group.position.y = THREE.MathUtils.lerp(group.position.y, targetSlotY, delta * 12);
            group.position.z = THREE.MathUtils.lerp(group.position.z, targetZ, delta * 12);

            group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0, delta * 12);
            group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, rotY, delta * 12);
            group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, rotZ, delta * 12);

            group.scale.lerp(new THREE.Vector3(1.04, 1.04, 1.04), delta * 10);
            return;
          }

          group.position.x = THREE.MathUtils.lerp(group.position.x, targetSlotX, delta * 10);
          group.position.y = THREE.MathUtils.lerp(group.position.y, targetSlotY, delta * 10);
          group.position.z = THREE.MathUtils.lerp(group.position.z, 0.008, delta * 10);

          group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0, delta * 10);
          group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, 0, delta * 10);
          group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, 0, delta * 10);

          group.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 10);
          return;
        }

        const isHover = currentHover === group;
        const normalized = (i - (total - 1) / 2) / ((total - 1) / 2); // -1 đến +1

        let targetX = 0;
        let targetY = 0;
        let targetZ = i * 0.005;
        let targetRotZ = 0;
        let targetRotX = 0;
        let targetScale = isHover ? 1.06 : 1.0;

        if (currentPhase === "VORTEX") {
          // 🌀 BƯỚC 1: TRỘN BÀI XOÁY NƯỚC VÒNG TRÒN KHẮP BÀN TAROT
          const elapsed = (currentTime - shuffleStartTimeRef.current) * 0.0035;
          const orbitRadius = 0.85 + (i % 8) * 0.38;
          const orbitSpeed = 1.3 + (i % 5) * 0.35;
          const theta = elapsed * orbitSpeed + (i * (Math.PI * 2 / total) * 3.2);

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
          const elapsed = currentTime - shuffleStartTimeRef.current;
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
          // 🌊 BƯỚC 4: THÁC NƯỚC RƠI TỰ DO TỪ TRÊN CAO (SPRING CASCADE WATERFALL)
          const elapsed = currentTime - shuffleStartTimeRef.current;
          const dropTime = i * 16; // Độ trễ rơi từng lá 16ms
          const dropProgress = Math.max(0, Math.min(1, (elapsed - dropTime) / 380));

          if (dropProgress === 0) {
            targetX = -1.6 + (i * 0.004);
            targetY = 0.7;
            targetZ = 0.7 + (i * 0.005);
            targetRotZ = 0.32;
            targetRotX = 0.38;
          } else {
            const p = dropProgress;
            targetX = THREE.MathUtils.lerp(-1.6, 0, p);
            targetY = THREE.MathUtils.lerp(0.7, -1.1, p);
            targetZ = THREE.MathUtils.lerp(0.7, i * 0.005, p);
            targetRotZ = THREE.MathUtils.lerp(0.32, 0, p);
            targetRotX = THREE.MathUtils.lerp(0.38, 0.15, p);
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
          // 🌊 BƯỚC 5: CHẺ BÀI ĐAN XEN LƯỢN SÓNG 3D
          const isLeft = i % 2 === 0;
          targetX = isLeft ? -0.25 : 0.25;
          targetY = -0.9 + Math.sin(i * 0.35) * 0.15;
          targetZ = i * 0.005;
          targetRotZ = isLeft ? -0.06 : 0.06;
          targetRotX = 0.15;
        } else if (isSpreadRef.current) {
          // 🎴 BƯỚC 6: TRẢI BÀI HOÀN CHỈNH RA NỬA DƯỚI BÀN THẢM
          if (currentMode === "RIBBON") {
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

        group.position.x = THREE.MathUtils.lerp(group.position.x, targetX, delta * 12);
        group.position.y = THREE.MathUtils.lerp(group.position.y, targetY, delta * 12);
        group.position.z = THREE.MathUtils.lerp(group.position.z, targetZ, delta * 15);
        group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, targetRotZ, delta * 12);
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetRotX, delta * 12);
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 15);
      });

      // ✨ CẬP NHẬT BỤI SAO VÀNG KHI LẬT MỞ BÀI
      if (isRevealingRef.current) {
        particleMat.opacity = Math.min(0.95, particleMat.opacity + delta * 3);
        pointLight.intensity = THREE.MathUtils.lerp(pointLight.intensity, 4.5, delta * 4);

        const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
        const positions = posAttr.array as Float32Array;
        for (let p = 0; p < particleCount; p++) {
          positions[p * 3 + 1] += particleVelocities[p * 3 + 1] * delta;
          positions[p * 3] += particleVelocities[p * 3] * delta;
          if (positions[p * 3 + 1] > 3.2) {
            positions[p * 3 + 1] = 1.2;
            const sX = slotXPositions[p % 3];
            positions[p * 3] = sX + (Math.random() - 0.5) * 1.2;
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate(performance.now());

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 640;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.dispose();
    };
  }, [deckCards]);

  const handleReshuffle3D = () => {
    if (isRevealing) return;
    start3DShuffleSequence();
  };

  const handleQuickPick3D = () => {
    if (isRevealing || deckCards.length < 3) return;
    const available = cardMeshesRef.current.filter((g) => !g.userData.isDrawn);
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const chosenMeshes = shuffled.slice(0, 3);

    const chosen: { card: CardDto; isReversed: boolean }[] = [];
    const mapUpdate: { [cardId: number]: { slotIndex: number; isReversed: boolean } } = {};

    chosenMeshes.forEach((m, idx) => {
      m.userData.isDrawn = true;
      m.userData.slotIndex = idx;
      const c = m.userData.card as CardDto;
      const isReversed = Math.random() < 0.35;
      chosen.push({ card: c, isReversed });
      mapUpdate[c.id] = { slotIndex: idx, isReversed };
    });

    setSelectedCards(chosen);
    setDrawnCardsMap(mapUpdate);
  };

  const handleConfirm = () => {
    if (selectedCards.length === 3 && !isRevealing) {
      setIsRevealing(true);
      isRevealingRef.current = true;
      revealStartTimeRef.current = performance.now();

      // Sau khi 3 lá bài lật mở hoàn chỉnh và phát sáng lung linh (~2.1s), chuyển tiếp sang AI Reader
      setTimeout(() => {
        onConfirmSelection(
          selectedCards.map((s) => ({
            cardId: s.card.id,
            isReversed: s.isReversed,
          }))
        );
      }, 2100);
    }
  };

  const currentSlotIndex = selectedCards.length;

  return (
    <div className="w-full space-y-6 animate-fade-in select-none">
      {/* 🔮 TIÊU ĐỀ HƯỚNG DẪN */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/20 text-xs text-slate-100 mb-2 shadow-xl backdrop-blur-md">
          <Moon className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>Bàn Trải Bài 3D WebGL Toàn Cảnh (78 Lá Mạ Vàng Chuẩn 1909)</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-bold text-white leading-relaxed">
          &ldquo;{userQuestion}&rdquo;
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-300">
          {isShuffling ? (
            <span className="text-amber-300 font-medium flex items-center justify-center gap-1.5 animate-pulse">
              <RotateCcw className="w-4 h-4 animate-spin text-amber-300" />
              Đang thực hiện nghi thức xáo bài và hòa hợp năng lượng... Xin vui lòng đợi trong giây lát.
            </span>
          ) : currentSlotIndex < 3 ? (
            <span className="text-slate-100 font-medium">
              👉 Hãy rê chuột trên thảm bài 3D và click chọn lá cho{" "}
              <strong className="text-amber-200 underline underline-offset-4 font-bold">
                {SLOT_NAMES[currentSlotIndex].title}
              </strong>{" "}
              ({currentSlotIndex + 1}/3)
            </span>
          ) : isRevealing ? (
            <span className="text-amber-300 font-medium flex items-center justify-center gap-1.5 animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              Đang lật mở 3 lá bài & kết nối năng lượng vũ trụ...
            </span>
          ) : (
            <span className="text-emerald-400 font-medium flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Bạn đã rút đủ 3 lá bài! Hãy bấm xác nhận để AI bắt đầu luận giải.
            </span>
          )}
        </p>
      </div>

      {/* 🎴 KHUNG CANVAS THREE.JS 3D TOÀN CẢNH KẾT HỢP CẢ 3 Ô ĐÓN BÀI & BÀN TRẢI */}
      <div className="rounded-3xl p-4 sm:p-6 silver-card relative overflow-hidden bg-gradient-to-b from-[#0B132B] via-[#111C3D] to-[#080E20] border border-amber-400/20 shadow-2xl">
        {/* THANH ĐIỀU KHIỂN & TIÊU ĐỀ 3 Ô ĐÓN BÀI TRÊN 3D */}
        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-400/15 border border-amber-300/30 flex items-center justify-center text-amber-200 shadow-md">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white">
                Bàn Trải 3D Velvet Không Gian Thực
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Nút đổi kiểu trải bài */}
            <div className="inline-flex rounded-xl bg-black/40 border border-white/15 p-0.5 text-xs">
              <button
                onClick={() => setSpreadMode("RIBBON")}
                disabled={isShuffling || isRevealing}
                className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer disabled:opacity-50 ${
                  spreadMode === "RIBBON"
                    ? "bg-amber-400/25 text-amber-200 border border-amber-300/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Trải Cung</span>
              </button>
              <button
                onClick={() => setSpreadMode("FAN")}
                disabled={isShuffling || isRevealing}
                className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer disabled:opacity-50 ${
                  spreadMode === "FAN"
                    ? "bg-amber-400/25 text-amber-200 border border-amber-300/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Xòe Quạt</span>
              </button>
            </div>

            <button
              onClick={() => handleReshuffle3D()}
              disabled={isShuffling || isLoading || isRevealing}
              className="px-2.5 py-1 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-xs font-semibold text-slate-200 hover:text-white transition flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-md"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isShuffling ? "animate-spin" : ""}`} />
              <span>Xáo lại</span>
            </button>

            <button
              onClick={handleQuickPick3D}
              disabled={isShuffling || isLoading || isRevealing}
              className="px-2.5 py-1 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-xs font-bold text-amber-200 transition flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Rút nhanh</span>
            </button>
          </div>
        </div>

        {/* 🌟 HUD TIÊU ĐỀ 3 Ô VỊ TRÍ ĐÓN BÀI NẰM NGAY TRÊN 3D SLOTS */}
        <div className="grid grid-cols-3 gap-2 max-w-4xl mx-auto pt-1 pb-1 relative z-20 pointer-events-none">
          {SLOT_NAMES.map((slot, idx) => {
            const isPicked = selectedCards.length > idx;
            return (
              <div
                key={idx}
                className={`text-center p-2 rounded-2xl transition-all duration-500 backdrop-blur-sm ${
                  isPicked
                    ? "bg-amber-400/10 border border-amber-300/30"
                    : currentSlotIndex === idx
                    ? "bg-white/[0.08] border border-dashed border-amber-300/40"
                    : "bg-white/[0.02] border border-white/5 opacity-60"
                }`}
              >
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-200 bg-amber-400/20 px-2 py-0.5 rounded-full mb-0.5">
                  <span>{slot.icon}</span>
                  <span>Lá {idx + 1}</span>
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{slot.title}</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-300 line-clamp-1 hidden sm:block">
                  {slot.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* CONTAINER CHỨA CANVAS THREE.JS DUY NHẤT */}
        <div
          ref={mountRef}
          className={`w-full h-[540px] sm:h-[620px] relative transition-opacity duration-300 ${
            isShuffling || isRevealing ? "cursor-wait pointer-events-none opacity-95" : "cursor-pointer"
          }`}
        />
      </div>

      {/* 🚀 NÚT HÀNH ĐỘNG XÁC NHẬN */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
        <button
          onClick={onCancel}
          disabled={isLoading || isRevealing}
          className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 font-medium text-sm transition cursor-pointer"
        >
          Nhập lại câu hỏi
        </button>

        <button
          onClick={handleConfirm}
          disabled={selectedCards.length < 3 || isShuffling || isLoading || isRevealing}
          className="w-full sm:w-auto px-10 py-3.5 rounded-2xl silver-gradient-btn font-bold text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-2xl hover:scale-105"
        >
          {isLoading || isRevealing ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              <span>{isRevealing ? "Đang khai mở 3 lá bài & bụi sao..." : "AI Reader đang kết nối năng lượng..."}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Xác Nhận 3 Lá Bài & Luận Giải</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

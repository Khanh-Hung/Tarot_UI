/**
 * Module sinh Texture Mặt Lưng Lá Bài Tarot 3D độc bản theo từng trường phái:
 * 1. RIDER_WAITE_CLASSIC: Xanh đêm vũ trụ hoàng gia, hoa văn mắt cáo 1909 & Mandala trăng sao.
 * 2. THOTH_TAROT: Tím huyền bí Hermetic, hình học thiêng liêng (Sacred Geometry) & Ngôi sao 7 cánh Heptagram.
 * 3. TAROT_DE_MARSEILLE: Đỏ rượu vang Burgundy hoàng triều, hoa bách hợp Fleur-de-lis & Mặt trời Le Soleil 1709.
 */

// ==========================================
// 1. RIDER-WAITE CLASSIC (1909 COSMIC ROYAL BLUE)
// ==========================================
function renderRiderWaiteBack(ctx: CanvasRenderingContext2D) {
  // 1. NỀN XANH ĐÊM HUYỀN BÍ & CHIỀU SÂU VŨ TRỤ
  const bgGrad = ctx.createRadialGradient(512, 800, 100, 512, 800, 900);
  bgGrad.addColorStop(0, "#1c2b4d");
  bgGrad.addColorStop(0.5, "#121b33");
  bgGrad.addColorStop(1, "#080d1a");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1600);

  // 2. HOA VĂN LƯỚI ĐAN MẮT CÁO RIDER-WAITE 1909
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

  // Điểm sao nhỏ tại giao điểm lưới
  ctx.fillStyle = "rgba(255, 235, 175, 0.35)";
  for (let y = 100; y < 1500; y += step * 2) {
    for (let x = 100; x < 924; x += step * 2) {
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 3. KHUNG VIỀN ĐÔI MẠ VÀNG KIM LOẠI
  ctx.strokeStyle = "#F2D07C";
  ctx.lineWidth = 16;
  ctx.strokeRect(36, 36, 952, 1528);

  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 3;
  ctx.strokeRect(56, 56, 912, 1488);

  ctx.strokeStyle = "rgba(242, 208, 124, 0.6)";
  ctx.lineWidth = 4;
  ctx.strokeRect(72, 72, 880, 1456);

  // 4. HOA VĂN 4 GÓC HOÀNG GIA
  const drawCorner = (cx: number, cy: number, rot: number) => {
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
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(0, 45);
    ctx.moveTo(20, 0);
    ctx.lineTo(45, 0);
    ctx.stroke();
    ctx.restore();
  };
  drawCorner(100, 100, 0);
  drawCorner(924, 100, Math.PI / 2);
  drawCorner(924, 1500, Math.PI);
  drawCorner(100, 1500, -Math.PI / 2);

  // 5. TRUNG TÂM: MẶT TRĂNG & MẶT TRỜI THÁI CỰC ĐỐI XỨNG
  ctx.save();
  ctx.translate(512, 800);

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

  const sunGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 130);
  sunGrad.addColorStop(0, "#FFF5D0");
  sunGrad.addColorStop(0.6, "#E5B84B");
  sunGrad.addColorStop(1, "#8A6414");
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 125, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#121b33";
  ctx.beginPath();
  ctx.arc(38, -20, 105, 0, Math.PI * 2, true);
  ctx.fill();

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

  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 6. CHU KỲ MẶT TRĂNG
  ctx.fillStyle = "#F5D77F";
  ctx.font = "bold 34px serif";
  ctx.textAlign = "center";
  ctx.fillText("🌑    🌓    🌕    🌗    🌘", 512, 240);
  ctx.fillText("🌘    🌗    🌕    🌓    🌑", 512, 1360);
}

// ==========================================
// 2. THOTH TAROT (HERMETIC OCCULT AMETHYST & SACRED GEOMETRY)
// ==========================================
function renderThothBack(ctx: CanvasRenderingContext2D) {
  // 1. NỀN TÍM MA THUẬT & OBSIDIAN AMETHYST
  const bgGrad = ctx.createRadialGradient(512, 800, 80, 512, 800, 950);
  bgGrad.addColorStop(0, "#330b42");
  bgGrad.addColorStop(0.45, "#1c0428");
  bgGrad.addColorStop(1, "#0a0110");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1600);

  // 2. HÌNH HỌC THIÊNG LIÊNG (FLOWER OF LIFE / INTERSECTING GEOMETRIC RINGS)
  ctx.save();
  ctx.beginPath();
  ctx.rect(60, 60, 904, 1480);
  ctx.clip();

  ctx.strokeStyle = "rgba(217, 83, 232, 0.12)";
  ctx.lineWidth = 1.5;
  const radius = 130;
  for (let y = 100; y < 1550; y += radius * 1.5) {
    for (let x = 80; x < 960; x += radius * 1.732) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Lưới tia năng lượng từ tâm tỏa ra 24 hướng
  ctx.strokeStyle = "rgba(240, 185, 90, 0.14)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 24; i++) {
    const a = (i * Math.PI * 2) / 24;
    ctx.beginPath();
    ctx.moveTo(512, 800);
    ctx.lineTo(512 + Math.cos(a) * 900, 800 + Math.sin(a) * 900);
    ctx.stroke();
  }
  ctx.restore();

  // 3. VIỀN KÉP TÍM ÁNH KIM & VÀNG HUYỀN BÍ
  ctx.strokeStyle = "#D953E8";
  ctx.lineWidth = 12;
  ctx.strokeRect(36, 36, 952, 1528);

  ctx.strokeStyle = "#F3CA68";
  ctx.lineWidth = 4;
  ctx.strokeRect(52, 52, 920, 1496);

  ctx.strokeStyle = "rgba(217, 83, 232, 0.45)";
  ctx.lineWidth = 3;
  ctx.strokeRect(68, 68, 888, 1464);

  // 4. BIỂU TƯỢNG 4 GÓC: TAM GIÁC GIẢ KIM THUẬT
  const drawThothCorner = (cx: number, cy: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = "#F3CA68";
    ctx.fillStyle = "rgba(217, 83, 232, 0.3)";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(24, 20);
    ctx.lineTo(-24, 20);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    ctx.fillStyle = "#FFF";
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  drawThothCorner(105, 105);
  drawThothCorner(919, 105);
  drawThothCorner(919, 1495);
  drawThothCorner(105, 1495);

  // 5. TRUNG TÂM: NGÔI SAO 7 CÁNH HEPTAGRAM (STAR OF BABALON) & VÒNG TRÒN MA PHÁP
  ctx.save();
  ctx.translate(512, 800);

  ctx.strokeStyle = "#F3CA68";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(0, 0, 240, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#D953E8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 215, 0, Math.PI * 2);
  ctx.stroke();

  // Vành đai 12 cánh hoa sen huyền học (Hermetic Lotus)
  for (let p = 0; p < 12; p++) {
    const angle = (p * Math.PI * 2) / 12;
    ctx.save();
    ctx.rotate(angle);
    ctx.strokeStyle = "rgba(243, 202, 104, 0.6)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 160, 45, 0, Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  // Ngôi sao 7 cánh Heptagram thiêng liêng
  ctx.strokeStyle = "#FFF4D0";
  ctx.lineWidth = 4;
  ctx.fillStyle = "rgba(125, 25, 150, 0.4)";
  ctx.beginPath();
  const points = 7;
  const stepJump = 3;
  const starRadius = 155;
  for (let i = 0; i <= points; i++) {
    const idx = (i * stepJump) % points;
    const a = (idx * Math.PI * 2) / points - Math.PI / 2;
    const px = Math.cos(a) * starRadius;
    const py = Math.sin(a) * starRadius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Đĩa trung tâm: Thập tự hoa hồng Rose Cross
  const centerGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 65);
  centerGrad.addColorStop(0, "#FFE082");
  centerGrad.addColorStop(0.7, "#D953E8");
  centerGrad.addColorStop(1, "#4A0E5C");
  ctx.fillStyle = centerGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#F3CA68";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Chữ thập hoa hồng mạ vàng
  ctx.fillStyle = "#FFF";
  ctx.fillRect(-6, -38, 12, 76);
  ctx.fillRect(-38, -6, 76, 12);
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, Math.PI * 2);
  ctx.fillStyle = "#FFD54F";
  ctx.fill();

  ctx.restore();

  // 6. CÁC BIỂU TƯỢNG GIẢ KIM THUẬT (ALCHEMICAL ELEMENTS TRÊN VÀ DƯỚI)
  ctx.fillStyle = "#F3CA68";
  ctx.font = "bold 36px serif";
  ctx.textAlign = "center";
  ctx.fillText("🜂   🜁   🜀   🜄   🜃", 512, 240);
  ctx.fillText("🜃   🜄   🜀   🜁   🜂", 512, 1360);
}

// ==========================================
// 3. TAROT DE MARSEILLE (1709 FRENCH RENAISSANCE BURGUNDY)
// ==========================================
function renderMarseilleBack(ctx: CanvasRenderingContext2D) {
  // 1. NỀN ĐỎ RƯỢU VANG BURGUNDY VƯƠNG TRIỀU PHÁP
  const bgGrad = ctx.createRadialGradient(512, 800, 100, 512, 800, 950);
  bgGrad.addColorStop(0, "#4e1219");
  bgGrad.addColorStop(0.5, "#2a060a");
  bgGrad.addColorStop(1, "#140103");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1600);

  // 2. HOA VĂN THẢM KHẮC GỖ PHỤC HƯNG (FRENCH WOODCUT RENAISSANCE TAPESTRY)
  ctx.save();
  ctx.beginPath();
  ctx.rect(60, 60, 904, 1480);
  ctx.clip();

  ctx.strokeStyle = "rgba(235, 195, 120, 0.16)";
  ctx.lineWidth = 2.5;
  const gridStep = 72;
  for (let x = -1600; x < 2600; x += gridStep) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 1600, 1600);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, 1600);
    ctx.lineTo(x + 1600, 0);
    ctx.stroke();
  }

  // Hoa bách hợp Fleur-de-lis mini bên trong các mắt lưới
  ctx.fillStyle = "rgba(255, 220, 150, 0.28)";
  ctx.font = "18px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let y = 100; y < 1500; y += gridStep) {
    for (let x = 100; x < 924; x += gridStep) {
      ctx.fillText("⚜", x, y);
    }
  }
  ctx.restore();

  // 3. KHUNG VIỀN KHẮC GỖ MẠ VÀNG VƯƠNG GIẢ
  ctx.strokeStyle = "#E5B84B";
  ctx.lineWidth = 14;
  ctx.strokeRect(36, 36, 952, 1528);

  ctx.strokeStyle = "rgba(255, 240, 200, 0.9)";
  ctx.lineWidth = 3;
  ctx.strokeRect(54, 54, 916, 1492);

  ctx.strokeStyle = "rgba(229, 184, 75, 0.5)";
  ctx.lineWidth = 5;
  ctx.strokeRect(70, 70, 884, 1460);

  // 4. HOA BÁCH HỢP HOÀNG GIA (FLEUR-DE-LIS) TẠI 4 GÓC
  const drawFleurDeLisCorner = (cx: number, cy: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = "#E5B84B";
    ctx.font = "bold 56px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("⚜", 0, 0);
    ctx.restore();
  };
  drawFleurDeLisCorner(110, 110);
  drawFleurDeLisCorner(914, 110);
  drawFleurDeLisCorner(914, 1490);
  drawFleurDeLisCorner(110, 1490);

  // 5. TRUNG TÂM: MẶT TRỜI CỔ ĐIỂN "LE SOLEIL" VỚI 16 TIA LỬA LƯỢN SÓNG
  ctx.save();
  ctx.translate(512, 800);

  // Vòng nguyệt quế tròn bao quanh
  ctx.strokeStyle = "#E5B84B";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(0, 0, 230, 0, Math.PI * 2);
  ctx.stroke();

  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = "rgba(255, 230, 160, 0.8)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 205, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 16 Tia Lửa Baroque Khắc Gỗ Uốn Lượn (8 tia thẳng nhọn, 8 tia uốn lượn)
  for (let r = 0; r < 16; r++) {
    const angle = (r * Math.PI * 2) / 16;
    ctx.save();
    ctx.rotate(angle);
    ctx.fillStyle = r % 2 === 0 ? "#FFD54F" : "#FFA000";
    ctx.strokeStyle = "#FFF2CC";
    ctx.lineWidth = 2;

    if (r % 2 === 0) {
      // Tia nhọn thẳng
      ctx.beginPath();
      ctx.moveTo(-14, 135);
      ctx.lineTo(0, 200);
      ctx.lineTo(14, 135);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // Tia uốn sóng ngọn lửa
      ctx.beginPath();
      ctx.moveTo(-10, 135);
      ctx.quadraticCurveTo(15, 165, 0, 195);
      ctx.quadraticCurveTo(-12, 165, 10, 135);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  // Đĩa Mặt Trời Khắc Gỗ
  const sunGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 135);
  sunGrad.addColorStop(0, "#FFF9E6");
  sunGrad.addColorStop(0.5, "#E5B84B");
  sunGrad.addColorStop(1, "#8A2A14");
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 130, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#FFF";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Biểu tượng Fleur-de-lis vàng rực rỡ ở tâm mặt trời
  ctx.fillStyle = "#FFFDE6";
  ctx.font = "bold 96px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⚜", 0, 0);

  ctx.restore();

  // 6. BIỂU TƯỢNG VƯƠNG TRIỀU PHÁP ĐỐI XỨNG TRÊN VÀ DƯỚI
  ctx.fillStyle = "#E5B84B";
  ctx.font = "bold 40px serif";
  ctx.textAlign = "center";
  ctx.fillText("⚜   ✦   ⚜   ✦   ⚜", 512, 240);
  ctx.fillText("⚜   ✦   ⚜   ✦   ⚜", 512, 1360);
}

// ==========================================
// MAIN EXPORT FUNCTION
// ==========================================
export const renderTarotCardBackCanvas = (deckCode = "RIDER_WAITE_CLASSIC"): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1600;
  const ctx = canvas.getContext("2d")!;

  const normalizedDeck = deckCode?.toUpperCase() || "RIDER_WAITE_CLASSIC";

  if (normalizedDeck.includes("THOTH")) {
    renderThothBack(ctx);
  } else if (normalizedDeck.includes("MARSEILLE")) {
    renderMarseilleBack(ctx);
  } else {
    renderRiderWaiteBack(ctx);
  }

  return canvas;
};

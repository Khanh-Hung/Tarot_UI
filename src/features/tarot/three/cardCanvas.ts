/**
 * Hàm tạo Canvas vẽ mặt lưng lá bài Tarot 3D chuẩn hoàng gia (1024x1600)
 * Gồm hoa văn lưới đan mắt cáo Rider-Waite 1909, viền mạ vàng kim loại,
 * 4 góc vương giả, đĩa mặt trời - mặt trăng đối xứng và chu kỳ tuần trăng.
 */
export const renderTarotCardBackCanvas = (): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1600;
  const ctx = canvas.getContext("2d")!;

  // 1. NỀN XANH ĐÊM HUYỀN BÍ & CHIỀU SÂU VŨ TRỤ
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

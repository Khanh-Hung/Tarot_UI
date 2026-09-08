import React from "react";

interface RealisticFlameIconProps {
  className?: string;
  glow?: boolean;
}

/**
 * Biểu tượng ngọn lửa thực tế chuẩn màu emoji 🔥:
 * - Vỏ ngoài: Gradient đỏ thắm ở chóp -> đỏ cam -> cam ấm ở đáy
 * - Lõi trong: Gradient vàng sáng rực rỡ ở đáy tâm ngọn lửa
 */
export const RealisticFlameIcon: React.FC<RealisticFlameIconProps> = ({
  className = "w-4 h-4",
  glow = true,
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} ${glow ? "drop-shadow-[0_0_10px_rgba(255,85,0,0.7)]" : ""}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient vỏ lửa ngoài: Đỏ rực ở đỉnh -> Đỏ cam -> Cam tươi ở đáy */}
        <linearGradient id="flameOuterGrad" x1="12" y1="2" x2="12" y2="23.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff1e00" />
          <stop offset="35%" stopColor="#ff4d00" />
          <stop offset="70%" stopColor="#ff7b00" />
          <stop offset="100%" stopColor="#ffa200" />
        </linearGradient>
        {/* Gradient lõi lửa vàng sáng bên trong giống hệt emoji 🔥 */}
        <linearGradient id="flameInnerGrad" x1="12" y1="11.5" x2="12" y2="21.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff9900" />
          <stop offset="45%" stopColor="#ffea00" />
          <stop offset="100%" stopColor="#fffad1" />
        </linearGradient>
      </defs>

      {/* Vỏ ngoài ngọn lửa đỏ cam */}
      <path
        d="M12 2C10.6 4.6 9 6.8 9 9.3C9 10.5 9.5 11.5 10.3 12.3C8.2 11.1 7 8.7 7 8.7C4.8 11.2 4 13.8 4 16.2C4 20.6 7.6 23.5 12 23.5C16.4 23.5 20 20.6 20 16.2C20 12.8 17.5 9.8 15.4 7.2C15.4 8.7 14.4 10 13.7 10.7C14.5 8.2 13.5 5.2 12 2Z"
        fill="url(#flameOuterGrad)"
      />

      {/* Lõi trong màu vàng chói rực lửa */}
      <path
        d="M12 11.5C10.8 13 9.8 14.6 9.8 16.3C9.8 18.3 10.8 20.2 12 21.2C13.2 20.2 14.2 18.3 14.2 16.3C14.2 14.6 13.2 13 12 11.5Z"
        fill="url(#flameInnerGrad)"
      />
    </svg>
  );
};

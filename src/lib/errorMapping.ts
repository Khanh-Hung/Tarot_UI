/**
 * Error Mapping Utility
 * Chuyển đổi mã lỗi và thông điệp tiếng Anh từ Backend thành thông báo tiếng Việt thân thiện với người dùng
 */

interface ApiErrorData {
  code?: string;
  message?: string;
}

const ERROR_CODE_MAP: Record<string, string> = {
  // Xác thực & Tài khoản (Authentication & Account)
  INVALID_CREDENTIALS: "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.",
  EMAIL_ALREADY_EXISTS: "Địa chỉ email này đã được sử dụng. Vui lòng đăng nhập hoặc chọn email khác.",
  USER_ALREADY_EXISTS: "Tài khoản với email này đã tồn tại. Vui lòng đăng nhập.",
  USER_NOT_FOUND: "Không tìm thấy tài khoản người dùng tương ứng.",
  USER_DEACTIVATED: "Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ hỗ trợ.",
  UNAUTHORIZED: "Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.",
  FORBIDDEN: "Bạn không có quyền thực hiện hành động này.",
  TOKEN_EXPIRED: "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.",

  // Bốc bài & Luận giải Tarot (Tarot & Reading)
  ZODIAC_REQUIRED: "Vui lòng chọn Cung Hoàng Đạo để AI kết nối năng lượng chính xác nhất.",
  CARDS_EMPTY: "Hệ thống dữ liệu bài Tarot đang trống. Vui lòng tải lại trang.",
  READING_NOT_FOUND: "Không tìm thấy phiên xem bài tương ứng.",
  AI_SERVICE_UNAVAILABLE: "Hệ thống AI đang bận kết nối năng lượng. Vui lòng thử lại sau ít giây.",
  DAILY_QUOTA_EXCEEDED: "Bạn đã dùng hết lượt bói bài hôm nay. Hãy xem một đoạn video ngắn để nhận thêm lượt nhé!",
  AD_REQUIRED_FOR_SPREAD: "Trải bài 3 lá chuyên sâu yêu cầu 1 lượt thưởng từ video tài trợ. Vui lòng xem một đoạn quảng cáo ngắn để mở khóa.",
  DAILY_AD_LIMIT_REACHED: "Bạn đã đạt giới hạn nhận thưởng tối đa 8 video/ngày. Hãy quay lại vào ngày mai nhé!",

  // Lỗi hệ thống chung (General & System)
  INTERNAL_SERVER_ERROR: "Máy chủ đang gặp sự cố tạm thời. Vui lòng thử lại sau ít phút.",
  NETWORK_ERROR: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền mạng.",
  VALIDATION_ERROR: "Dữ liệu nhập vào chưa đúng định dạng. Vui lòng kiểm tra lại.",
};

const ENGLISH_PATTERNS: { pattern: RegExp; translation: string }[] = [
  { pattern: /invalid email or password/i, translation: "Email hoặc mật khẩu không chính xác." },
  { pattern: /account with this email already exists/i, translation: "Email này đã được sử dụng để đăng ký." },
  { pattern: /user not found/i, translation: "Không tìm thấy thông tin tài khoản." },
  { pattern: /deactivated/i, translation: "Tài khoản của bạn đã bị tạm khóa." },
  { pattern: /zodiac.*required/i, translation: "Vui lòng chọn Cung Hoàng Đạo để AI kết nối năng lượng." },
  { pattern: /network error/i, translation: "Lỗi kết nối mạng. Vui lòng kiểm tra lại Internet." },
  { pattern: /timeout/i, translation: "Quá thời gian phản hồi từ máy chủ. Vui lòng thử lại." },
  { pattern: /unauthorized|401/i, translation: "Email hoặc mật khẩu không chính xác." },
  { pattern: /forbidden|403/i, translation: "Bạn không có quyền thực hiện hành động này." },
  { pattern: /not found|404/i, translation: "Không tìm thấy dữ liệu yêu cầu." },
  { pattern: /watching a rewarded ad is required/i, translation: "Trải bài 3 lá chuyên sâu yêu cầu xem 1 video quảng cáo ngắn để mở khóa." },
  { pattern: /daily.*reading.*quota.*exceeded/i, translation: "Bạn đã dùng hết lượt bói bài hôm nay. Hãy xem một đoạn video ngắn để nhận thêm lượt nhé!" },
  { pattern: /daily.*rewarded.*ad.*limit/i, translation: "Bạn đã đạt giới hạn nhận thưởng tối đa trong ngày. Hãy quay lại vào ngày mai nhé!" },
  { pattern: /500|internal server/i, translation: "Máy chủ đang bận hoặc gặp sự cố. Vui lòng thử lại sau." },
];

/**
 * Trích xuất và dịch thông báo lỗi sang tiếng Việt
 * @param err Lỗi bắt được từ try/catch (AxiosError hoặc Error thông thường)
 * @param fallbackMessage Thông điệp mặc định nếu không khớp mẫu nào
 */
export function getFriendlyErrorMessage(
  err: unknown,
  fallbackMessage = "Đã xảy ra lỗi. Vui lòng thử lại sau."
): string {
  if (!err) return fallbackMessage;

  const response = (err as { response?: { status?: number; data?: ApiErrorData } })?.response;
  const status = response?.status;
  const data = response?.data;

  // 1. Khớp theo mã lỗi chuẩn trả về từ Backend (code: "INVALID_CREDENTIALS", ...)
  if (data?.code) {
    const upperCode = data.code.toUpperCase();
    if (ERROR_CODE_MAP[upperCode]) {
      return ERROR_CODE_MAP[upperCode];
    }
  }

  // 2. Khớp theo HTTP Status Code đặc thù
  if (status === 401) {
    return "Email hoặc mật khẩu không chính xác.";
  }
  if (status === 403) {
    return "Bạn không có quyền thực hiện thao tác này.";
  }
  if (status === 404) {
    return "Không tìm thấy dữ liệu yêu cầu.";
  }
  if (status === 409) {
    return "Thông tin này đã tồn tại trong hệ thống.";
  }
  if (status && status >= 500) {
    return "Máy chủ đang gặp sự cố tạm thời. Vui lòng thử lại sau ít phút.";
  }

  // 3. Khớp theo nội dung thông điệp tiếng Anh (message)
  const rawMessage = data?.message || (err as { message?: string })?.message || "";
  if (rawMessage) {
    for (const item of ENGLISH_PATTERNS) {
      if (item.pattern.test(rawMessage)) {
        return item.translation;
      }
    }
  }

  return fallbackMessage;
}

export interface DeckLore {
  deckCode: string;
  name: string;
  originalName: string;
  author: string;
  illustrator: string;
  year: string;
  school: string;
  coverImage: string;
  summary: string;
  history: string;
  artStyle: string;
  keyDifferences: string[];
  bestFor: string;
  spiritualMeaning: string;
}

export const DECK_LORE_MAP: Record<string, DeckLore> = {
  RIDER_WAITE_CLASSIC: {
    deckCode: "RIDER_WAITE_CLASSIC",
    name: "Rider-Waite Classic",
    originalName: "Rider-Waite-Smith (RWS) Tarot",
    author: "Arthur Edward Waite (Hội Kín Golden Dawn)",
    illustrator: "Pamela Colman Smith (Pixie)",
    year: "1909 (London, Vương Quốc Anh)",
    school: "Huyền học Phương Tây & Hội Kín Golden Dawn",
    coverImage: "/cards/rws/m00.jpg",
    summary:
      "Bộ bài Tarot chuẩn mực quốc tế phổ biến nhất thế giới. Lần đầu tiên trong lịch sử, tất cả 56 lá bài Ẩn Phụ đều được vẽ tranh minh họa sinh động với cảnh sắc con người và cốt truyện cụ thể.",
    history:
      "Được thiết kế vào năm 1909 bởi học giả huyền học Arthur Edward Waite và được nữ họa sĩ Pamela Colman Smith vẽ tay dưới sự bảo trợ của nhà xuất bản William Rider & Son. Waite muốn tạo ra một bộ bài thoát ly khỏi các tranh in khô khan trước đó, đưa các biểu tượng thần bí của Kabbalah, Chiêm tinh và Giả kim thuật vào hình ảnh trực quan mà bất kỳ ai cũng có thể cảm nhận bằng trực giác.",
    artStyle:
      "Phong cách vẽ tay màu nước kết hợp nét mực đen kinh điển đầu thế kỷ XX. Mỗi bức tranh như một vở kịch sân khấu với trang phục thời Trung Cổ và Phục Hưng, mang đậm tính ẩn dụ và giàu cảm xúc con người.",
    keyDifferences: [
      "Lần đầu tiên 56 lá Ẩn Phụ (Minor Arcana) có tranh vẽ cảnh đời thực (Scenic Pips) thay vì chỉ là các biểu tượng đếm số.",
      "Đảo vị trí hai lá bài kinh điển: Số VIII là Sức Mạnh (Strength) và Số XI là Công Lý (Justice) để đồng bộ với vòng Hoàng Đạo Golden Dawn.",
      "Trở thành tiêu chuẩn nền tảng (De facto standard) cho hơn 90% các bộ bài Tarot hiện đại ngày nay.",
    ],
    bestFor:
      "Mọi đối tượng từ người mới bắt đầu đến Reader chuyên nghiệp. Cực kỳ hiệu quả cho các câu hỏi về tâm lý thực tế, tình cảm, sự nghiệp, tài chính và định hướng cuộc sống hàng ngày.",
    spiritualMeaning:
      "Hành trình của Kẻ Khờ (The Fool's Journey) – biểu trưng cho hành trình tiến hóa tâm thức từ sự ngây thơ ban đầu qua mọi thử thách nhân sinh để đạt đến sự giác ngộ trọn vẹn (The World).",
  },

  THOTH_ALEISTER: {
    deckCode: "THOTH_ALEISTER",
    name: "Thoth Tarot",
    originalName: "Aleister Crowley Thoth Tarot Deck",
    author: "Aleister Crowley (Nhà Sáng Lập Triết Học Thelema)",
    illustrator: "Lady Frieda Harris (Họa Sĩ Quý Tộc Anh)",
    year: "1944 (Hoàn thành sau 5 năm vẽ tay 1938–1944)",
    school: "Huyền học Thelema, Chiêm tinh học Kabbalah & Giả kim thuật Hermetic",
    coverImage: "/cards/thoth/m00.jpg",
    summary:
      "Bộ bài Tarot huyền bí bậc nhất lịch sử. Kết hợp sâu sắc giữa triết học Thelema, Cây Sự Sống (Tree of Life), hình học thiêng liêng và trường phái tranh Art Deco trừu tượng đa chiều.",
    history:
      "Ban đầu, Aleister Crowley chỉ định nhờ Lady Frieda Harris vẽ lại bộ bài trong vòng 6 tháng. Tuy nhiên, lòng say mê nghệ thuật và tri thức huyền học sâu sắc đã khiến hai người dành trọn 5 năm (1938–1944) để tạo nên 78 kiệt tác sơn dầu. Bộ bài được xuất bản kèm cuốn sách kinh điển 'The Book of Thoth' nhưng chỉ được in bài hoàn chỉnh sau khi cả hai tác giả qua đời.",
    artStyle:
      "Trường phái hội họa Art Deco kết hợp hình học vi phân tổng hợp (Projective Synthetic Geometry). Tranh sử dụng năng lượng màu sắc quang phổ rực rỡ, các vòng xoáy luân xa và không gian đa chiều huyền bí.",
    keyDifferences: [
      "Đổi tên nhiều lá Ẩn Chính sang danh xưng Hermetic: The Magus (thay The Magician), The Priestess, Adjustment VIII (thay Justice), Lust XI (thay Strength), Art XIV (thay Temperance), The Aeon XX (thay Judgement), The Universe XXI (thay The World).",
      "Bộ Hoàng Gia đổi thành: Princess (Page), Prince (Knight), Queen, Knight (King).",
      "Bộ Tiền (Pentacles) đổi tên thành Bộ Đĩa (Disks) tượng trưng cho vật chất và nguyên tố Đất.",
      "Mỗi lá Ẩn Phụ mang một danh xưng triết học duy nhất: Dominion, Virtue, Love, Abundance, Peace, Change, Works, Power, Science...",
    ],
    bestFor:
      "Thiền định, khám phá chiều sâu tiềm thức (Shadow Work), phân tích tâm linh cao cấp, các câu hỏi về nghiệp quả, bước ngoặt số phận và chuyển hóa nội tâm.",
    spiritualMeaning:
      "Khám phá Ý Chí Chân Thật (True Will) và sự hợp nhất giữa Bản Ngã với Đại Vũ Trụ theo luật Thelema: 'Do what thou wilt shall be the whole of the Law. Love is the law, love under will.'",
  },

  MARSEILLE_HERMETIC: {
    deckCode: "MARSEILLE_HERMETIC",
    name: "Tarot de Marseille",
    originalName: "Classic Tarot de Marseille (Bản Phục Chế Nicolas Conver 1760)",
    author: "Nicolas Conver (Nghệ Nhân Khắc Gỗ Marseille)",
    illustrator: "Phục chế kỹ thuật số chuẩn mực bởi Dr. Yoav Ben-Dov (CBD)",
    year: "1760 (Marseille, Vương Quốc Pháp) / Nguồn gốc từ thế kỷ XVII",
    school: "Trường phái Cổ Điển Pháp & Châu Âu Thời Phục Hưng",
    coverImage: "/cards/marseille/m00.jpg",
    summary:
      "Cội nguồn lâu đời nhất của Tarot hiện đại châu Âu. Mang phong cách tranh in khắc gỗ Trung Cổ mộc mạc với hệ màu nguyên bản và tên gọi tiếng Pháp cổ truyền thống.",
    history:
      "Tarot de Marseille bắt nguồn từ các xưởng in tranh khắc gỗ tại thành phố cảng Marseille (Pháp) từ thế kỷ XVII - XVIII. Bản in năm 1760 của Nicolas Conver được xem là tiêu chuẩn vàng của phong cách này. Vào năm 2010, Tiến sĩ Yoav Ben-Dov đã dành nhiều năm tại Thư viện Quốc gia Pháp để phục chế kỹ thuật số trung thực từng nét khắc và bảng màu nguyên thủy của Conver.",
    artStyle:
      "Phong cách tranh in khắc gỗ mộc bản (Woodcut) với các đường viền đen dứt khoát và bảng màu cơ bản nguyên thủy (đỏ son, vàng nghệ, xanh lam, xanh lục, trắng, da thịt).",
    keyDifferences: [
      "56 lá Ẩn Phụ là các biểu tượng đếm số hình học tự nhiên (Non-scenic Pips: gậy đan chéo, kiếm cong hoa văn...) đòi hỏi Reader giải đoán bằng trực giác số học và nguyên tố.",
      "Tên các lá bài in bằng tiếng Pháp cổ: I. Le Bateleur, II. La Papesse, V. Le Pape, XVI. La Maison Dieu, Le Mat...",
      "Lá số XIII không in tên (L'Arcane sans nom) tượng trưng cho cái chết và sự vô danh của chuyển hóa.",
      "Thứ tự kinh điển thời Trung Cổ: Số VIII là La Justice (Công Lý), Số XI là La Force (Sức Mạnh).",
    ],
    bestFor:
      "Đọc bài theo trường phái trực giác nguyên bản châu Âu (Open Reading), giải đoán cấu trúc hình học, các câu hỏi cần góc nhìn khách quan, logic và không bị chi phối bởi cảm xúc.",
    spiritualMeaning:
      "Tấm gương phản chiếu vũ trụ quan Trung Cổ và thời kỳ Khai Sáng – nơi con người đối diện với Thượng Đế, Tự Nhiên, Định Mệnh và Xã Hội bằng sự thông tuệ thuần khiết.",
  },
};

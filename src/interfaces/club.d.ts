export interface ClubItem {
  id: string;
  avatar: string;       // URL ảnh hoặc Base64
  name: string;         // Tên CLB
  foundingDate: string; // Ngày thành lập (format YYYY-MM-DD)
  description: string;  // Nội dung HTML từ TinyEditor
  leader: string;       // Tên chủ nhiệm (nhập text)
  isActive: boolean;    // Hoạt động (Có/Không)
}
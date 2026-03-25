export interface RegHistory {
  action: 'Approved' | 'Rejected';
  time: string;
  note?: string;
  operator: string; // VD: "Admin"
}

export interface RegistrationItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  strength: string; // Sở trường
  clubId: string;   // Liên kết với ClubItem.id
  reason: string;   // Lý do đăng ký
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  history: RegHistory[];
}
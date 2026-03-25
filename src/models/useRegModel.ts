import { useState, useCallback } from 'react';
import { RegistrationItem, RegHistory } from '@/interfaces/registration';
import dayjs from 'dayjs';

export default () => {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([
    // Dữ liệu mẫu để bạn dễ hình dung giao diện
    {
      id: 'reg_001',
      fullName: 'Nguyễn Văn Thành viên',
      email: 'member@gmail.com',
      phone: '0987654321',
      gender: 'male',
      address: 'Hà Nội',
      strength: 'Lập trình React',
      clubId: '1', // ID của CLB Tin học (từ useClubModel)
      reason: 'Em muốn học hỏi thêm',
      status: 'approved',
      history: [
        { action: 'Approved', time: '10:00 20/03/2026', operator: 'Admin', note: 'Đủ điều kiện' }
      ]
    }
  ]);

  /**
   * 1. Thêm mới đơn đăng ký
   */
  const addReg = useCallback((item: Omit<RegistrationItem, 'id' | 'status' | 'history'>) => {
    const newItem: RegistrationItem = {
      ...item,
      id: `REG_${Date.now()}`,
      status: 'pending',
      history: [],
    };
    setRegistrations((prev) => [...prev, newItem]);
  }, []);

  /**
   * 2. Cập nhật trạng thái (Duyệt/Từ chối) - Dùng cho cả đơn lẻ và hàng loạt
   */
  const updateStatus = useCallback((ids: string[], status: 'approved' | 'rejected', note?: string) => {
    const time = dayjs().format('HH:mm DD/MM/YYYY');
    
    setRegistrations((prev) =>
      prev.map((item) => {
        if (ids.includes(item.id)) {
          const newHistory: RegHistory = {
            action: status === 'approved' ? 'Approved' : 'Rejected',
            time,
            note: note || (status === 'approved' ? 'Đã duyệt vào hệ thống' : ''),
            operator: 'Admin',
          };
          return {
            ...item,
            status,
            rejectionReason: status === 'rejected' ? note : item.rejectionReason,
            history: [...(item.history || []), newHistory],
          };
        }
        return item;
      }),
    );
  }, []);

  /**
   * 3. Thay đổi Câu lạc bộ (Mục 3) - Dùng cho cả đơn lẻ và hàng loạt
   */
  const changeClub = useCallback((ids: string[], newClubId: string) => {
    const time = dayjs().format('HH:mm DD/MM/YYYY');
    
    setRegistrations((prev) =>
      prev.map((item) => {
        if (ids.includes(item.id)) {
          const historyNote: RegHistory = {
            action: 'Approved', // Vẫn giữ trạng thái Approved nhưng ghi nhận đổi CLB
            time,
            note: `Chuyển sang CLB mới (ID: ${newClubId})`,
            operator: 'Admin',
          };
          return {
            ...item,
            clubId: newClubId,
            history: [...(item.history || []), historyNote],
          };
        }
        return item;
      }),
    );
  }, []);

  /**
   * 4. Xóa đơn đăng ký
   */
  const deleteReg = useCallback((id: string) => {
    setRegistrations((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return {
    registrations,
    addReg,
    updateStatus,
    changeClub,
    deleteReg,
  };
};
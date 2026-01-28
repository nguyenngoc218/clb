import { useState } from 'react';

export default () => {
  const [soNgauNhien, setSoNgauNhien] = useState<number>(0);
  const [soLanDoan, setSoLanDoan] = useState<number>(0);
  const [thongBao, setThongBao] = useState<string>('Nhập một số từ 1 đến 100');
  const [kthucTroChoi, setKthucTroChoi] = useState<boolean>(false);

  const batDautt = () => {
    setSoNgauNhien(Math.floor(Math.random() * 100) + 1);
    setSoLanDoan(0);
    setThongBao('Trò chơi mới bắt đầu! Đoán số từ 1-100');
    setKthucTroChoi(false);
  };

  const doanSo = (soDoan: number) => {
    const soLanDoan1 = soLanDoan + 1;
    setSoLanDoan(soLanDoan1);

    if (soDoan === soNgauNhien) {
      setThongBao('Chúc mừng! Bạn đã đoán đúng!');
      setKthucTroChoi(true);
    } else if (soLanDoan1 >= 10) {
      setThongBao(`Bạn đã hết lượt! Số đúng là ${soNgauNhien}.`);
      setKthucTroChoi(true);
    } else if (soDoan < soNgauNhien) {
      setThongBao('Bạn đoán quá thấp!');
    } else {
      setThongBao('Bạn đoán quá cao!');
    }
  };

  return { soNgauNhien, soLanDoan, thongBao, kthucTroChoi, batDautt, doanSo };
};
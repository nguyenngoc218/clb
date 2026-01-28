import { useModel } from 'umi';
import { useState, useEffect } from 'react';

export default () => {
  const { thongBao, soLanDoan, kthucTroChoi, batDautt, doanSo } = useModel('Bai1');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => { batDautt(); }, []);

  const handleGuess = () => {
    const num = parseInt(inputValue);
    if (!isNaN(num)) {
      doanSo(num);
      setInputValue('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Bài 1: Trò chơi đoán số</h2>
      <p>Số lần đã đoán: {soLanDoan}/10</p>
      <p><strong>Thông báo: {thongBao}</strong></p>
      
      {!kthucTroChoi ? (
        <div>
          <input 
            type="number" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
          />
          <button onClick={handleGuess}>Đoán</button>
        </div>
      ) : (
        <button onClick={batDautt}>Chơi lại</button>
      )}
    </div>
  );
};
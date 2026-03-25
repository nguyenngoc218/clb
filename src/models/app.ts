import { useState } from 'react';

// ================= STORAGE =================
const KEY = 'APP_DATA';

const loadData = () => {
  const raw = localStorage.getItem(KEY);
  return raw
    ? JSON.parse(raw)
    : {
        soVanBang: [],
        quyetDinh: [],
        vanBang: [],
      };
};

const saveData = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

// ================= MODEL =================
export default function useAppModel() {
  const [data, setData] = useState(loadData());

  const refresh = () => {
    setData(loadData());
  };

  // ================= SỔ VĂN BẰNG =================
  const getOrCreateSo = (year) => {
    const store = loadData();

    let so = store.soVanBang.find((s) => s.nam === year);

    if (!so) {
      so = {
        id: Date.now().toString(),
        nam: year,
        currentNumber: 0,
      };

      store.soVanBang.push(so);
      saveData(store);
    }

    refresh();
    return so;
  };

  // ================= VĂN BẰNG =================
  const addVanBang = (item) => {
    const store = loadData();

    const so = store.soVanBang.find((s) => s.nam === item.nam);

    if (!so) {
      alert('Chưa có sổ cho năm này');
      return;
    }

    const newNumber = (so.currentNumber || 0) + 1;

    const newVB = {
      id: Date.now().toString(),
      ...item,
      soVaoSo: newNumber,
      dynamicFields: [], // 👈 phụ lục
    };

    so.currentNumber = newNumber;

    store.vanBang.push(newVB);

    saveData(store);
    refresh();
  };

  // ================= PHỤ LỤC =================
  const savePhuLuc = (id, fields) => {
    const store = loadData();

    const vb = store.vanBang.find((v) => v.id === id);

    if (vb) {
      vb.dynamicFields = fields;
    }

    saveData(store);
    refresh();
  };

  // ================= QUYẾT ĐỊNH (OPTION) =================
  const addQuyetDinh = (item) => {
    const store = loadData();

    const newQD = {
      id: Date.now().toString(),
      ...item,
    };

    store.quyetDinh.push(newQD);

    saveData(store);
    refresh();
  };

  // ================= RETURN =================
  return {
    data,
    getOrCreateSo,
    addVanBang,
    savePhuLuc,
    addQuyetDinh,
    refresh,
  };
}
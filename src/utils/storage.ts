export const KEY = "APP_DATA";

export const loadData = () => {
  const raw = localStorage.getItem(KEY);
  return raw
    ? JSON.parse(raw)
    : {
        soVanBang: [], // theo năm
        quyetDinh: [],
        vanBang: [],
        fieldConfig: [],
      };
};

export const saveData = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

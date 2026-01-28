const STORAGE_KEY = 'todo_list_data';

export const TodoService = {
  getList: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveList: (list: any[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
};
import { useState, useEffect } from 'react';
import { TodoService } from '@/services/Bai2';

export default () => {
  const [todos, setTodos] = useState<{id: number, text: string}[]>([]);

  useEffect(() => {
    setTodos(TodoService.getList());
  }, []);

  const addTodo = (text: string) => {
    const newList = [...todos, { id: Date.now(), text }];
    setTodos(newList);
    TodoService.saveList(newList);
  };

  const deleteTodo = (id: number) => {
    const newList = todos.filter(t => t.id !== id);
    setTodos(newList);
    TodoService.saveList(newList);
  };

  const editTodo = (id: number, newText: string) => {
    const newList = todos.map(t => t.id === id ? { ...t, text: newText } : t);
    setTodos(newList);
    TodoService.saveList(newList);
  };

  return { todos, addTodo, deleteTodo, editTodo };
};
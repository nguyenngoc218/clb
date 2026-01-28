import { useModel } from 'umi';
import { useState } from 'react';

export default () => {
  const { todos, addTodo, deleteTodo, editTodo } = useModel('Bai2');
  const [text, setText] = useState('');

  return (
    <div style={{ padding: 20 }}>
      <h2>Bài 2: Todo List</h2>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => { addTodo(text); setText(''); }}>Thêm</button>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text} 
            <button onClick={() => {
              const val = prompt('Sửa nội dung:', todo.text);
              if (val) editTodo(todo.id, val);
            }}>Sửa</button>
            <button onClick={() => deleteTodo(todo.id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
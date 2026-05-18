import React, { useState, useRef, useEffect } from "react";

function TodoList({ todos, onAdd, onToggle, onDelete, isActiveOnly }) {
  const [inputText, setInputText] = useState("");
  const [filter, setFilter] = useState("ALL"); 
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleAddTodo = () => {
    if (inputText.trim() === "") {
      alert("할 일을 입력해주세요!");
      return;
    }
    // App.jsx에서 받아온 API 전송 함수(onAdd) 실행
    onAdd(inputText); 
    setInputText(""); 
    if (inputRef.current) inputRef.current.focus();
  };

  // 서버 명세서에 맞춰 done ➔ completed 로 변경하여 필터링
  const filteredTodos = todos.filter((todo) => {
    if (isActiveOnly && todo.completed) return false;
    if (filter === "DONE") return todo.completed === true;
    if (filter === "UNDONE") return todo.completed === false;
    return true; 
  });

  return (
    <div className="todo-app-card">
      <div className="add-todo-group">
        <input
          type="text"
          ref={inputRef}
          placeholder="서버에 저장할 할 일을 입력하세요"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
          className="todo-input"
        />
        <button onClick={handleAddTodo} className="add-button">추가</button>
      </div>

      <div className="filter-button-group">
        <button 
          onClick={() => setFilter("ALL")} 
          className={filter === "ALL" ? "filter-active" : "filter-inactive"}
        >전체</button>
        <button 
          onClick={() => setFilter("DONE")} 
          className={filter === "DONE" ? "filter-active" : "filter-inactive"}
        >완료</button>
        <button 
          onClick={() => setFilter("UNDONE")} 
          className={filter === "UNDONE" ? "filter-active" : "filter-inactive"}
        >미완료</button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className="todo-item-row">
            {/* 완료 체크 토글 */}
            <span className="checkbox-wrap" onClick={() => onToggle(todo.id, todo.completed)}>
              {todo.completed ? <span className="checked">✔️</span> : <span className="unchecked"></span>}
            </span>
            
            {/* 할 일 내용 텍스트 */}
            <span 
              className="task-text" 
              style={{ 
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "#adb5bd" : "var(--text-color, #333)",
                cursor: "pointer"
              }}
              onClick={() => onToggle(todo.id, todo.completed)}
            >
              {todo.content}
            </span>

            {/* 🔥 새로 추가된 삭제 버튼 */}
            <button className="delete-button" onClick={() => onDelete(todo.id)}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  // [필수 구현 2] localStorage 불러오기 및 초기값 설정
  // useState의 초기값으로 함수를 전달하면 (Lazy Initialization), 최초 렌더링 시에만 실행됩니다.
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      return JSON.parse(savedTodos); // 문자열을 배열로 변환해서 불러오기
    }
    // 저장된 데이터가 없으면 기본값 제공
    return [
      { id: 1, text: "집 가기", done: false, priority: "HIGH" },
      { id: 2, text: "과제하기", done: false, priority: "MEDIUM" },
      { id: 3, text: "잠 자기", done: false, priority: "LOW" },
    ];
  });

  const [inputText, setInputText] = useState("");
  const [inputPriority, setInputPriority] = useState("MEDIUM");
  const [filter, setFilter] = useState("ALL"); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // [선택 구현 1] useRef를 이용한 input 자동 focus
  const inputRef = useRef(null);

  // 페이지가 처음 열렸을 때 딱 한 번만 실행됨
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // 🚨 [필수 구현 2 - 콘솔 확인용 1] 컴포넌트가 렌더링될 때마다 실행되는 로그
  console.log("🔄 컴포넌트 렌더링됨 (input 창 타이핑 중...)");

  // 🚨 [필수 구현 2 - 콘솔 확인용 2] todos 배열이 변경될 때만 실행되는 로그 및 localStorage 저장
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos)); // 배열을 문자열로 변환해서 저장
    console.log("💾 todos가 변경되어 localStorage에 저장되었습니다!");
  }, [todos]);

  // [필수 구현 1] 할 일 추가 기능
  const handleAddTodo = () => {
    if (inputText.trim() === "") {
      alert("할 일을 입력해주세요!");
      return;
    }
    const newTodo = {
      id: Date.now(),
      text: inputText,
      done: false,
      priority: inputPriority,
    };
    setTodos([...todos, newTodo]);
    setInputText(""); // 추가 후 input 값 비우기
    inputRef.current.focus(); // 추가한 뒤에도 다시 입력창에 포커스 유지
  };

  const handleToggleDone = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "DONE") return todo.done === true;
    if (filter === "UNDONE") return todo.done === false;
    return true; 
  });

  return (
    <div className="todo-app-card">
      <h2 className="app-title">🔥 To Do List 🔥</h2>

      <div className="add-todo-group">
        <div className="custom-select-container">
          <div 
            className="custom-select-trigger"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {inputPriority === "HIGH" && <span className="text-high">High</span>}
            {inputPriority === "MEDIUM" && <span className="text-medium">Medium</span>}
            {inputPriority === "LOW" && <span className="text-low">Low</span>}
            <span className="arrow">{isDropdownOpen ? "▲" : "▼"}</span>
          </div>
          
          {isDropdownOpen && (
            <ul className="custom-select-options">
              <li onClick={() => { setInputPriority("HIGH"); setIsDropdownOpen(false); }}>High</li>
              <li onClick={() => { setInputPriority("MEDIUM"); setIsDropdownOpen(false); }}>Medium</li>
              <li onClick={() => { setInputPriority("LOW"); setIsDropdownOpen(false); }}>Low</li>
            </ul>
          )}
        </div>

        <input
          type="text"
          ref={inputRef} /* useRef 연결 */
          placeholder="새로운 할 일을 입력하세요"
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
          <li
            key={todo.id}
            className={`todo-item-row ${todo.priority.toLowerCase()}`}
            onClick={() => handleToggleDone(todo.id)}
          >
            <span className="checkbox-wrap">
              {todo.done ? <span className="checked">✔️</span> : <span className="unchecked"></span>}
            </span>
            <span 
              className="task-text" 
              style={{ 
                textDecoration: todo.done ? "line-through" : "none",
                color: todo.done ? "#adb5bd" : "var(--text-color, #333)" 
              }}
            >
              {todo.text}
            </span>
            <span className={`priority-badge badge-${todo.priority.toLowerCase()}`}>
              {todo.priority}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
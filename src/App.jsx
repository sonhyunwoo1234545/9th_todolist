import React, { useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "집 가기", done: false, priority: "HIGH" },
    { id: 2, text: "과제하기", done: false, priority: "MEDIUM" },
    { id: 3, text: "잠 자기", done: false, priority: "LOW" },
  ]);

  const [inputText, setInputText] = useState("");
  const [inputPriority, setInputPriority] = useState("MEDIUM");
  const [filter, setFilter] = useState("ALL"); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    setInputText(""); 
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
      <h2 className="app-title">🔥 To Do List</h2>

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
                color: todo.done ? "#adb5bd" : "#333" 
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
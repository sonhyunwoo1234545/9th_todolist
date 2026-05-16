import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import TodoList from "./TodoList";
import ApiTest from "./ApiTest";
import "./App.css";

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      return JSON.parse(savedTodos);
    }
    return [
      { id: 1, text: "집 가기", done: false, priority: "HIGH" },
      { id: 2, text: "과제하기", done: false, priority: "MEDIUM" },
      { id: 3, text: "잠 자기", done: false, priority: "LOW" },
    ];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <BrowserRouter>
      <div className="app-container">
        <h2 className="app-title">🔥 To Do List 🔥</h2>
        
        <nav className="navigation">
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>전체</NavLink>
          <NavLink to="/active" className={({ isActive }) => isActive ? "active" : ""}>미완료</NavLink>
          <NavLink to="/api" className={({ isActive }) => isActive ? "active" : ""}>API 테스트</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<TodoList todos={todos} setTodos={setTodos} />} />
          <Route path="/active" element={<TodoList todos={todos} setTodos={setTodos} isActiveOnly={true} />} />
          <Route path="/api" element={<ApiTest />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
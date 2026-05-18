import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import TodoList from "./TodoList";
import ApiTest from "./ApiTest";
import axios from "axios";
import "./App.css";

// 현우 님의 학번과 서버 주소 설정
const STUDENT_CODE = "20222666"; 
const BASE_URL = "https://congachu.dev";

function App() {
  const [todos, setTodos] = useState([]);

  // 1. 투두 조회 (GET)
  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/todos?code=${STUDENT_CODE}`);
      console.log("✅ [GET] 서버에서 투두 목록을 성공적으로 불러왔습니다!", res.data);
      setTodos(res.data);
    } catch (error) {
      console.error("❌ [GET] 투두 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 2. 투두 추가 (POST)
  const addTodo = async (newContent) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/todos?code=${STUDENT_CODE}`, {
        content: newContent
      });
      console.log("✅ [POST] 새로운 할 일이 서버에 추가되었습니다!", res.data);
      setTodos((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("❌ [POST] 투두 추가 실패:", error);
    }
  };

  // 3. 완료 상태 변경 (POST) ➔ 405 에러 완전 해결!
  const toggleTodo = async (id, currentCompleted) => {
    try {
      // 서버 규칙에 맞춰 patch/put이 아닌 post로 요청을 보냅니다.
      const res = await axios.post(`${BASE_URL}/api/todos/${id}`, {
        completed: !currentCompleted 
      });
      console.log(`✅ [POST-Update] 완료 상태가 서버에 업데이트되었습니다! (ID: ${id})`, res.data);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, completed: !currentCompleted } : todo))
      );
    } catch (error) {
      console.error("❌ [POST-Update] 완료상태 변경 실패:", error);
    }
  };

  // 4. 투두 삭제 (DELETE)
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/todos/${id}`);
      console.log(`✅ [DELETE] 할 일이 서버에서 완전히 삭제되었습니다! (ID: ${id})`);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("❌ [DELETE] 투두 삭제 실패:", error);
    }
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <h2 className="app-title">🔥 To Do List</h2>
        
        <nav className="navigation">
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>전체</NavLink>
          <NavLink to="/active" className={({ isActive }) => isActive ? "active" : ""}>미완료</NavLink>
          <NavLink to="/api" className={({ isActive }) => isActive ? "active" : ""}>API 테스트</NavLink>
        </nav>

        <Routes>
          <Route 
            path="/" 
            element={<TodoList todos={todos} onAdd={addTodo} onToggle={toggleTodo} onDelete={deleteTodo} />} 
          />
          <Route 
            path="/active" 
            element={<TodoList todos={todos} onAdd={addTodo} onToggle={toggleTodo} onDelete={deleteTodo} isActiveOnly={true} />} 
          />
          <Route path="/api" element={<ApiTest />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
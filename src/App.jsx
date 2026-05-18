import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import TodoList from "./TodoList";
import ApiTest from "./ApiTest";
import axios from "axios";
import "./App.css";

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

  // 컴포넌트가 처음 렌더링될 때 서버에서 데이터를 한 번 불러옵니다.
  useEffect(() => {
    fetchTodos();
  }, []);

  // 2. 투두 추가 (POST)
  const addTodo = async (newContent) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/todos?code=${STUDENT_CODE}`, {
        content: newContent // 명세서에 따라 text가 아닌 content 사용
      });
      console.log("✅ [POST] 새로운 할 일이 서버에 추가되었습니다!", res.data);
      setTodos((prev) => [...prev, res.data]); // 서버에서 받은 새 데이터를 화면 목록에 추가
    } catch (error) {
      console.error("❌ [POST] 투두 추가 실패:", error);
    }
  };

  // 3. 완료 상태 변경 (PATCH)
  const toggleTodo = async (id, currentCompleted) => {
    try {
      const res = await axios.patch(`${BASE_URL}/api/todos/${id}`, {
        completed: !currentCompleted // 명세서에 따라 done이 아닌 completed 사용
      });
      console.log(`✅ [PATCH] 완료 상태가 서버에 업데이트되었습니다! (ID: ${id})`, res.data);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, completed: !currentCompleted } : todo))
      );
    } catch (error) {
      console.error("❌ [PATCH] 완료상태 변경 실패:", error);
    }
  };

  // 4. 투두 삭제 (DELETE)
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/todos/${id}`);
      console.log(`✅ [DELETE] 할 일이 서버에서 완전히 삭제되었습니다! (ID: ${id})`);
      setTodos((prev) => prev.filter((todo) => todo.id !== id)); // 화면에서도 삭제
    } catch (error) {
      console.error("❌ [DELETE] 투두 삭제 실패:", error);
    }
  };

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
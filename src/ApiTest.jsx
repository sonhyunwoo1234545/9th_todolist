import React, { useState, useEffect } from "react";
import axios from "axios";

function ApiTest() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://example.com");
        setPosts(response.data);
      } catch (err) {
        setError("⚠️ 실패");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="api-status">⏳ Loading... 데이터를 불러오는 중입니다.</div>;
  if (error) return <div className="api-status error">{error}</div>;

  return (
    <div className="todo-app-card">
      <h3 className="api-title">📰 API 요청 성공 목록</h3>
      <ul className="api-list">
        {posts.map((post) => (
          <li key={post.id} className="api-item">
            <h4>{post.title}</h4>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ApiTest;
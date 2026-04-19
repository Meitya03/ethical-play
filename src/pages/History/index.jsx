import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, clearHistory } from '../../utils/history';
import { marked } from 'marked';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClear = () => {
    if (window.confirm('确定要清除所有历史记录吗？')) {
      clearHistory();
      setHistory([]);
    }
  };

  return (
    <div className="history-page">
      <header>
        <button className="back-btn" onClick={() => navigate(-1)}>← 返回</button>
        <h1>伦理足迹</h1>
        <p>回顾你的每一次抉择与 AI 深度评价</p>
      </header>

      <div className="history-container">
        {history.length === 0 ? (
          <div className="empty-state">
            <p>暂无历史记录，去开始一场伦理挑战吧！</p>
            <button onClick={() => navigate('/select-role')}>开始挑战</button>
          </div>
        ) : (
          <>
            <div className="history-list">
              {history.map((record) => (
                <div key={record.id} className="history-card">
                  <div className="card-header">
                    <span className="profession-tag">{record.profession}</span>
                    <span className="date">{record.date}</span>
                  </div>
                  <div className="card-body">
                    <div className="case-preview">
                      <strong>情景回顾：</strong>
                      <p>{record.caseText.length > 150 ? record.caseText.substring(0, 150) + '...' : record.caseText}</p>
                    </div>
                    <div className="analysis-preview">
                      <strong>AI 深度分析报告：</strong>
                      <div
                        className="markdown-content"
                        dangerouslySetInnerHTML={{ __html: marked.parse(record.analysis || '') }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="clear-btn" onClick={handleClear}>清除所有记录</button>
          </>
        )}
      </div>
    </div>
  );
};

export default History;

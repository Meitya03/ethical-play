import React from 'react';

export default function LoadingError({ loading, error }) {
  if (loading) {
    return <div className="loading">加载中，请稍候...</div>;
  }
  if (error) {
    return <div className="error">错误：{error}</div>;
  }
  return null;
}

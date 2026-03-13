import React from 'react';

export default function ResultDisplay({ analysis, imageUrl, onReset }) {
  return (
    <div className="result-display">
      <h2>结果分析</h2>
      <p className="analysis">{analysis}</p>
      {imageUrl && (
        <>
          <h3>情景图片</h3>
          <img src={imageUrl} alt="伦理情景" className="result-image" />
        </>
      )}
      <button onClick={onReset} className="reset-btn">重新开始</button>
    </div>
  );
}
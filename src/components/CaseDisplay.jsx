import React from 'react';

export default function CaseDisplay({ caseText, options, onOptionSelect, disabled }) {
  if (!caseText || !options) return null;

  return (
    <div className="case-display">
      <h2>伦理困境</h2>
      <p className="case-text">{caseText}</p>
      <h3>请选择你的行动：</h3>
      <div className="options">
        {Object.entries(options).map(([key, text]) => (
          <button
            key={key}
            onClick={() => onOptionSelect(key)}
            disabled={disabled}
            className="option-btn"
          >
            <strong>{key}.</strong> {text}
          </button>
        ))}
      </div>
    </div>
  );
}
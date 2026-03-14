import React from 'react';

export default function CaseDisplay({ caseText, options, onOptionSelect, disabled }) {
  if (!caseText || !options) return null;

  console.log('CaseDisplay接收的options:', options);
  console.log('options类型:', typeof options);

  // 确保options是一个对象
  let processedOptions = options;
  if (typeof options === 'string') {
    try {
      // 尝试将字符串解析为对象
      processedOptions = JSON.parse(options);
    } catch (error) {
      // 如果解析失败，返回错误消息
      return <div className="error">选项数据格式错误</div>;
    }
  } else if (!Array.isArray(options) && typeof options !== 'object') {
    // 如果不是对象或数组，返回错误消息
    return <div className="error">选项数据格式错误</div>;
  }

  // 如果是数组，转换为对象
  if (Array.isArray(processedOptions)) {
    const arrayOptions = processedOptions;
    processedOptions = {};
    arrayOptions.forEach((option, index) => {
      processedOptions[index] = option;
    });
  }

  console.log('处理后的options:', processedOptions);

  return (
    <div className="case-display">
      <h2>伦理困境</h2>
      <p className="case-text">{caseText}</p>
      <h3>请选择你的行动：</h3>
      <div className="options">
        {Object.entries(processedOptions).map(([key, text]) => (
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

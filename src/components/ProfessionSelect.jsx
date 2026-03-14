import React from 'react';

const professions = [
  { id: 'engineer', name: '工程师' },
  { id: 'doctor', name: '医生' },
  { id: 'lawyer', name: '律师' },
  { id: 'scientist', name: '科学家' }
];

export default function ProfessionSelect({ onSelect, disabled }) {
  return (
    <div className="profession-select">
      <h2>请选择你的职业：</h2>
      <div className="buttons">
        {professions.map(p => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            disabled={disabled}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}

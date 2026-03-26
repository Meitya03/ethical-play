import React from 'react';
import { useSearchParams } from 'react-router-dom';

const MutiRound = () => {
  const [searchParams] = useSearchParams();
  const profession = searchParams.get('profession');
  
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe 
        src={`/src/pages/mutiRound/index.html?profession=${encodeURIComponent(profession || '')}`} 
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="多轮分支故事"
      />
    </div>
  );
};

export default MutiRound;
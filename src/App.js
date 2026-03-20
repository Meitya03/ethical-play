import React, { useState, useEffect } from 'react';
import { fetchCaseAndOptions, fetchResultWithImage, setCozeTokens } from './api';
import ProfessionSelect from './components/ProfessionSelect';
import CaseDisplay from './components/CaseDisplay';
import ResultDisplay from './components/ResultDisplay';
import LoadingError from './components/LoadingError';
import './App.css';

function App() {
  const [profession, setProfession] = useState('');
  const [currentCase, setCurrentCase] = useState(null);
  const [options, setOptions] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 初始化 token（建议从环境变量读取）
  useEffect(() => {
    const caseToken = import.meta.env.VITE_COZE_CASE_TOKEN;
    const roleToken = import.meta.env.VITE_COZE_ROLE_TOKEN;
    if (caseToken && roleToken) {
      setCozeTokens(caseToken, roleToken);
    } else {
      console.warn('未设置 Coze Token，请在 .env 文件中定义 VITE_COZE_CASE_TOKEN 和 VITE_COZE_ROLE_TOKEN');
    }
  }, []);

  const handleProfessionSelect = async (selected) => {
    setProfession(selected);
    setLoading(true);
    setError('');
    try {
      const data = await fetchCaseAndOptions(selected);
      console.log('API返回的数据:', data);
      console.log('options类型:', typeof data.options);
      console.log('options值:', data.options);
      setCurrentCase(data.case);
      setOptions(data.options); // 假设返回的是 {A: "...", B: "...", ...}
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = async (optionKey) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchResultWithImage(profession, currentCase, optionKey);
      setResult({
        analysis: data.analysis,
        imageUrl: data.image_url
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProfession('');
    setCurrentCase(null);
    setOptions(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="App">
      <header>
        <h1>工程伦理情景模拟</h1>
      </header>

      <LoadingError loading={loading} error={error} />

      {!profession && !loading && (
        <ProfessionSelect onSelect={handleProfessionSelect} disabled={loading} />
      )}

      {profession && currentCase && !result && (
        <CaseDisplay
          caseText={currentCase}
          options={options}
          onOptionSelect={handleOptionSelect}
          disabled={loading}
        />
      )}

      {result && (
        <ResultDisplay
          analysis={result.analysis}
          imageUrl={result.imageUrl}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;

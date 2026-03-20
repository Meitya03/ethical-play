import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchCaseAndOptions, fetchResultWithImage, setCozeTokens } from '../../api/ai';
import ProfessionSelect from '../../components/ProfessionSelect';
import CaseDisplay from '../../components/CaseDisplay';
import ResultDisplay from '../../components/ResultDisplay';
import LoadingError from '../../components/LoadingErr';
import './EthicalCase.css';

function EthicalCase() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profession, setProfession] = useState('');
  const [currentCase, setCurrentCase] = useState(null);
  const [options, setOptions] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 初始化 token（从环境变量读取）
  useEffect(() => {
    const caseToken = import.meta.env.VITE_COZE_CASE_TOKEN;
    const roleToken = import.meta.env.VITE_COZE_ROLE_TOKEN;
    if (caseToken && roleToken) {
      setCozeTokens(caseToken, roleToken);
    } else {
      console.warn('未设置 Coze Token，请在 .env 文件中定义 VITE_COZE_CASE_TOKEN 和 VITE_COZE_ROLE_TOKEN');
    }
  }, []);

  // 检查是否有传递的角色信息
  useEffect(() => {
    if (location.state && location.state.profession) {
      const selectedProfession = location.state.profession;
      setProfession(selectedProfession);
      // 直接获取案例和选项
      const fetchCase = async () => {
        setLoading(true);
        setError('');
        try {
          const data = await fetchCaseAndOptions(selectedProfession);
          console.log('API返回的数据:', data);
          console.log('options类型:', typeof data.options);
          console.log('options值:', data.options);
          setCurrentCase(data.case);
          setOptions(data.options);
        } catch (err) {
          setError(err.message || '获取案例失败');
        } finally {
          setLoading(false);
        }
      };
      fetchCase();
    }
  }, [location.state]);

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
      setOptions(data.options);
    } catch (err) {
      setError(err.message || '获取案例失败');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = async (optionKey) => {
    if (!profession || !currentCase) return;

    setLoading(true);
    setError('');
    try {
      const data = await fetchResultWithImage(profession, currentCase, optionKey);
      setResult({
        analysis: data.analysis,
        imageUrl: data.image_url
      });
    } catch (err) {
      setError(err.message || '获取结果失败');
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
    navigate('/select-role');
  };

  return (
    <div className="ethical-case">
      <header>
        <h1>AI 伦理情景模拟</h1>
        <p>通过 AI 生成真实伦理困境，探索不同选择的后果</p>
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

export default EthicalCase;

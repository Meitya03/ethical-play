import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { setCozeTokens, fetchMultiRoundCase, resumeMultiRoundCase } from '../../api/ai';
import { saveHistory } from '../../utils/history';
import { useAuth } from '../../context/AuthContext';
import ProfessionSelect from '../../components/ProfessionSelect';
import CaseDisplay from '../../components/CaseDisplay';
import ResultDisplay from '../../components/ResultDisplay';
import LoadingError from '../../components/LoadingErr';
import './EthicalCase.css';

function EthicalCase() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const containerRef = useRef(null);
  const [profession, setProfession] = useState('');
  const [currentCase, setCurrentCase] = useState(null);
  const [options, setOptions] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [multiRoundState, setMultiRoundState] = useState({
    eventId: null,
    interruptType: null,
    currentStep: 0
  });

  // 状态切换动画
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: 'power2.out' }
      );
    }
  }, [profession, currentCase, result]);

  // 初始化 token（从环境变量读取）
  useEffect(() => {
    const multiRoundToken = import.meta.env.VITE_COZE_MULTI_ROUND_TOKEN;
    if (multiRoundToken) {
      setCozeTokens(multiRoundToken);
    } else {
      console.warn('未设置 Coze Token，请在 .env 文件中定义 VITE_COZE_MULTI_ROUND_TOKEN');
    }
  }, []);

  // 检查是否有传递的角色信息
  useEffect(() => {
    if (location.state && location.state.profession) {
      const selectedProfession = location.state.profession;
      setProfession(selectedProfession);
      // 直接获取案例和选项
      fetchCaseData(selectedProfession);
    }
  }, [location.state]);

  const fetchCaseData = async (selectedProfession) => {
    setLoading(true);
    setError('');
    try {
      // 只使用多轮工作流
      const data = await fetchMultiRoundCase(selectedProfession);
      console.log('多轮API返回的数据:', data);
      setCurrentCase(data.case || data.message);
      setOptions(data.options);
      if (data.event_id) {
        setMultiRoundState(prev => ({
          ...prev,
          eventId: data.event_id,
          interruptType: data.interrupt_type,
          currentStep: 1
        }));
      }
    } catch (err) {
      setError(err.message || '获取案例失败');
    } finally {
      setLoading(false);
    }
  };

  const handleProfessionSelect = async (selected) => {
    setProfession(selected);
    fetchCaseData(selected);
  };

  const handleOptionSelect = async (optionKey) => {
    if (!profession || !currentCase) return;

    setLoading(true);
    setError('');
    try {
      // 只使用多轮工作流
      if (multiRoundState.eventId) {
        // 多轮模式：继续工作流
        const data = await resumeMultiRoundCase(
          multiRoundState.eventId,
          optionKey,
          multiRoundState.interruptType
        );
        console.log('多轮继续返回的数据:', data);

        // 检查是否还有后续步骤
        if (data.case || data.message) {
          // 还有后续步骤
          setCurrentCase(data.case || data.message);
          setOptions(data.options);
          if (data.event_id) {
            setMultiRoundState(prev => ({
              ...prev,
              eventId: data.event_id,
              interruptType: data.interrupt_type,
              currentStep: prev.currentStep + 1
            }));
          }
        } else {
          // 工作流结束，显示结果
          const analysis = data.analysis || data.result;
          const imageUrl = data.image_url;

          setResult({
            analysis,
            imageUrl
          });

          // 保存到历史记录
          saveHistory({
            profession,
            caseText: currentCase,
            analysis,
            imageUrl
          });
        }
      }
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
    setMultiRoundState({
      eventId: null,
      interruptType: null,
      currentStep: 0
    });
    navigate('/select-role');
  };

  return (
    <div className="ethical-case" ref={containerRef}>
      <div className="top-right-actions">
        {user && <span className="user-info">你好, {user.username}</span>}
        <button onClick={() => navigate('/history')} className="history-btn">历史足迹</button>
        <button onClick={logout} className="logout-btn">退出登录</button>
      </div>
      <header>
        <h1>AI 伦理情景模拟</h1>
        <p>探索工程实践中的道德抉择，通过 AI 预见未来的社会责任</p>
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


import './CaseScene.css';

const CaseScene = () => {
  return (
    <div className="case-scene">
      <div className="scene-header">
        <h1>案例交互场景</h1>
        <p>在真实的工程伦理困境中做出你的选择</p>
      </div>

      <div className="scene-content">
        <div className="case-card">
          <h2>案例一：技术创新与公共安全</h2>
          <p>作为一家科技公司的工程师，你负责开发一款自动驾驶系统。在测试过程中，你发现系统在某些极端情况下可能会出现判断失误，但公司为了抢占市场，要求尽快发布产品。</p>
          <div className="options">
            <button className="option-btn">坚持完善系统，延迟发布</button>
            <button className="option-btn">按照公司要求发布，后续更新修复</button>
          </div>
        </div>

        <div className="case-card">
          <h2>案例二：成本控制与质量保障</h2>
          <p>你是一个建筑项目的负责人，项目预算有限。在施工过程中，你发现使用更便宜的材料可以节省成本，但可能会影响建筑的安全性和使用寿命。</p>
          <div className="options">
            <button className="option-btn">使用高质量材料，申请追加预算</button>
            <button className="option-btn">使用便宜材料，确保项目按时完成</button>
          </div>
        </div>

        <div className="case-card">
          <h2>案例三：商业利益与公共福祉</h2>
          <p>你是一家制药公司的研发人员，公司开发了一种新药，可以治疗一种罕见疾病，但价格昂贵，很多患者无法承担。</p>
          <div className="options">
            <button className="option-btn">建议公司降低价格，让更多患者受益</button>
            <button className="option-btn">按照公司定价策略，确保研发投入回报</button>
          </div>
        </div>
      </div>

      <div className="back-btn-container">
        <button className="back-btn" onClick={() => window.location.href="/"}>
          返回首页
        </button>
      </div>
    </div>
  );
};

export default CaseScene;

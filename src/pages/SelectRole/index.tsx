import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
// @ts-ignore - 暂时忽略类型声明问题
import { generateRoleImage as generateImage } from '../../api/ai/ImageGenerator';
import './SelectRole.css';

// 预设角色数据
const presetRoles = [
  { id: 1, name: '软件工程师', color: '#9b59b6' },
  { id: 2, name: '产品经理', color: '#3498db' },
  { id: 3, name: '数据分析师', color: '#2ecc71' },
  { id: 4, name: '项目经理', color: '#f39c12' },
];

const SelectRole: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [customRole, setCustomRole] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const imageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sectionTitleRefs = useRef<HTMLDivElement[]>([]);
  const createRoleBtnRef = useRef<HTMLButtonElement>(null);
  const navigationButtonsRef = useRef<HTMLDivElement>(null);

  // GSAP Animation
  useEffect(() => {
    if (containerRef.current) {
      // 初始化GSAP时间线
      const timeline = gsap.timeline({ delay: 0.5 });

      // 先将所有元素设置为透明，确保动画从透明开始
      gsap.set([
        '.app-title',
        ...sectionTitleRefs.current,
        ...cardsRef.current,
        inputRef.current,
        createRoleBtnRef.current,
        imageRef.current
      ], { opacity: 0 });

      // 动画顺序：
      // 1. 标题动画
      timeline.to('.app-title', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      });

      // 2. 第一个section标题动画
      if (sectionTitleRefs.current[0]) {
        timeline.to(sectionTitleRefs.current[0], {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, "-=0.3");
      }

      // 3. 预设角色卡片动画
      cardsRef.current.forEach((card, index) => {
        if (card) {
          timeline.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: index * 0.1
          }, "-=0.2");
        }
      });

      // 4. 第二个section标题动画
      if (sectionTitleRefs.current[1]) {
        timeline.to(sectionTitleRefs.current[1], {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, "-=0.3");
      }

      // 5. 输入区域动画
      if (inputRef.current) {
        timeline.to(inputRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, "-=0.4");
      }

      // 6. 创建角色按钮动画
      if (createRoleBtnRef.current) {
        timeline.to(createRoleBtnRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, "-=0.5");
      }

      // 7. 右侧图片容器动画
      if (imageRef.current) {
        timeline.to(imageRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, "-=0.6");
      }

      // 8. 导航按钮动画（如果存在）
      if (navigationButtonsRef.current) {
        timeline.to(navigationButtonsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    }
  }, []);

  // Handle role selection
  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    generateRoleImage(role);
  };

  // Handle custom role creation
  const handleCreateRole = () => {
    if (customRole.trim()) {
      setSelectedRole(customRole.trim());
      generateRoleImage(customRole.trim());
    }
  };

  // Generate role image using AI
  const generateRoleImage = async (role: string) => {
    setIsLoading(true);
    try {
      // 调用AI图像生成API
      const imageUrl = await generateImage(role);
      setImageUrl(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      // 出错时使用模拟图像URL
      const imageUrl = 'https://via.placeholder.com/300x400?text=Role+Image';
      setImageUrl(imageUrl);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="select-role-container" ref={containerRef}>
      <h1 className="app-title">Ethical—Play</h1>

      <div className="role-selection">
        <div className="left-section">
          {/* Preset Roles */}
          <div className="section-title" ref={el => el && (sectionTitleRefs.current[0] = el)}></div>
          <div className="preset-roles">
            {presetRoles.map((role, index) => (
              <div
                key={role.id}
                ref={el => el && (cardsRef.current[index] = el)}
                className={`role-card ${selectedRole === role.name ? 'selected' : ''}`}
                style={{ backgroundColor: role.color }}
                onClick={() => handleRoleSelect(role.name)}
              >
                <div className="role-name">{role.name}</div>
              </div>
            ))}
          </div>

          {/* Free Input */}
          <div className="section-title" ref={el => el && (sectionTitleRefs.current[1] = el)}>Free Input</div>
          <div className="free-input">
            <textarea
              ref={inputRef}
              className="input-area"
              placeholder="在此可以自由描述你的角色身份～"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
            />
            <button
              ref={createRoleBtnRef}
              className="create-role-btn"
              onClick={handleCreateRole}
              disabled={!customRole.trim()}
            >
              create role
            </button>
          </div>
        </div>

        {/* Role Image */}
        <div className="right-section">
          <div className="image-container" ref={imageRef}>
            {isLoading ? (
              <div className="loading">生成中...</div>
            ) : imageUrl ? (
              <img src={imageUrl} alt={selectedRole || ''} className="role-image" />
            ) : (
              <div className="image-placeholder">
                选择角色后将显示角色插图
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedRole && (
        <div className="navigation-buttons" ref={navigationButtonsRef}>
          <button
            className="nav-btn ai-btn"
            onClick={() => navigate(`/muti-round?profession=${encodeURIComponent(selectedRole)}`)}
          >
            进入多轮分支故事
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectRole;

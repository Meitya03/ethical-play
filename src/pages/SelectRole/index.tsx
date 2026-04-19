import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
// @ts-ignore
import { generateRoleImage as generateImage } from '../../api/ai/ImageGenerator';
import { useAuth } from '../../context/AuthContext';
import './SelectRole.css';

// 预设角色 + 你自己的本地/网络图片
const presetRoles = [
  {
    id: 1,
    name: '土木工程师',
    color: 'linear-gradient(135deg, #e0e0f8, #d0d0e8)',
    // 把这里换成你的图片链接
    image: '/images/civil_engineer.png'
  },
  {
    id: 2,
    name: '医生',
    color: 'linear-gradient(135deg, #e8e8e8, #d8d8d8)',
    image: '/images/doctor.png'
  },
  {
    id: 3,
    name: '律师',
    color: 'linear-gradient(135deg, #c8e8e0, #b8d8d0)',
    image: '/images/lawyer.png'
  },
  {
    id: 4,
    name: '软件工程师',
    color: 'linear-gradient(135deg, #f0e8d8, #e8e0c8)',
    image: '/images/software_engineer.png'
  },
];

const SelectRole: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [customRole, setCustomRole] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const imageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const classicTitleRef = useRef<HTMLDivElement>(null);
  const freeInputTitleRef = useRef<HTMLDivElement>(null);
  const createRoleBtnRef = useRef<HTMLButtonElement>(null);
  const navigationButtonsRef = useRef<HTMLDivElement>(null);

  // 入场动画
  useEffect(() => {
    if (containerRef.current) {
      const timeline = gsap.timeline({ delay: 0.5 });

      gsap.set([
        '.app-title',
        classicTitleRef.current,
        freeInputTitleRef.current,
        ...cardsRef.current,
        inputRef.current,
        createRoleBtnRef.current,
        imageRef.current
      ], { opacity: 0 });

      timeline.to('.app-title', {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out'
      });

      if (classicTitleRef.current) {
        timeline.to(classicTitleRef.current, {
          opacity: 1, x: 0, duration: 0.6, ease: 'power2.out'
        }, "-=0.3");
      }

      cardsRef.current.forEach((card, index) => {
        if (card) {
          timeline.to(card, {
            opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: index * 0.1
          }, "-=0.2");
        }
      });

      if (freeInputTitleRef.current) {
        timeline.to(freeInputTitleRef.current, {
          opacity: 1, x: 0, duration: 0.6, ease: 'power2.out'
        }, "-=0.3");
      }

      if (inputRef.current) {
        timeline.to(inputRef.current, {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out'
        }, "-=0.4");
      }

      if (createRoleBtnRef.current) {
        timeline.to(createRoleBtnRef.current, {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out'
        }, "-=0.5");
      }

      if (imageRef.current) {
        timeline.to(imageRef.current, {
          opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out'
        }, "-=0.6");
      }

      if (navigationButtonsRef.current) {
        timeline.to(navigationButtonsRef.current, {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out'
        });
      }
    }
  }, []);

  // 悬浮弹动动画
  useEffect(() => {
    cardsRef.current.forEach((card) => {
      if (!card) return;
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { scale: 1.12, y: -10, duration: 0.5, ease: 'elastic.out(1, 0.6)' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { scale: 1, y: 0, duration: 0.4, ease: 'power2.out' });
      });
    });
  }, []);

  // ✅ 点击预设角色 → 显示你自己的图片
  const handleRoleSelect = (role: (typeof presetRoles)[0]) => {
    setSelectedRole(role.name);
    setImageUrl(role.image); // 直接显示你预设的图
    setIsLoading(false);
  };

  // ✅ 自由创建角色 → 走AI生成
  const handleCreateRole = () => {
    if (customRole.trim()) {
      setSelectedRole(customRole.trim());
      generateRoleImage(customRole.trim());
    }
  };

  // AI生成图片（仅自由创建使用）
  const generateRoleImage = async (role: string) => {
    setIsLoading(true);
    try {
      const imageUrl = await generateImage(role);
      setImageUrl(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      setImageUrl('https://via.placeholder.com/300x500?text=AI+角色');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="select-role-container" ref={containerRef}>
      <h1 className="app-title">Ethical Play</h1>

      <div className="top-right-actions">
        {user && <span className="user-info">你好, {user.username}</span>}
        {user?.role === 'admin' && (
          <button onClick={() => navigate('/admin')} className="admin-btn" style={{ background: 'rgba(124, 58, 237, 0.2)', borderColor: '#7c3aed' }}>
            管理后台
          </button>
        )}
        <button onClick={() => navigate('/history')} className="history-btn">历史足迹</button>
        <button onClick={logout} className="logout-btn">退出登录</button>
      </div>

      <div className="role-selection">
        <div className="left-section">
          <div className="classic-title" ref={classicTitleRef}>CLASSIC CHOICE</div>

          <div className="preset-roles">
            {presetRoles.map((role, index) => (
              <div
                key={role.id}
                ref={el => el && (cardsRef.current[index] = el)}
                className={`role-card ${selectedRole === role.name ? 'selected' : ''}`}
                style={{ background: role.color }}
                onClick={() => handleRoleSelect(role)}
              >
                <div className="role-name">{role.name}</div>
              </div>
            ))}
          </div>

          <div className="free-input-section">
            <div className="free-input-title" ref={freeInputTitleRef}>Free Input</div>
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

        {/* 右侧图片区域 */}
        <div className="right-section">
          <div className="image-container" ref={imageRef}>
            {isLoading ? (
              <div className="loading">生成中...</div>
            ) : imageUrl ? (
              <img src={imageUrl} alt={selectedRole || ''} className="role-image" />
            ) : (
              <div className="image-placeholder">创建角色后将显示专属于你的人物形象呀~</div>
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

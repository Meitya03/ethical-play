import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
// @ts-ignore
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// @ts-ignore
import Lenis from '@studio-freight/lenis';
import img1 from '../../assets/1.jpg';
import img2 from '../../assets/2.jpg';
import img3 from '../../assets/3.jpg';
import img4 from '../../assets/4.jpg';
import img5 from '../../assets/5.jpg';
import './Home.css';
import DissolveEffect from '../../components/DissolveEffect';
import '../../components/DissolveEffect.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const stickyCardsRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // 初始化 Lenis 平滑滚动
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time: number) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 确保所有ScrollTrigger正确初始化
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // 使用 gsap.utils.toArray 获取所有卡片元素
    const cards = gsap.utils.toArray('.sticky-cards .card') as HTMLDivElement[];
    const outro = outroRef.current;
    const homePage = document.querySelector('.home-page');
    
    // 确保有卡片
    if (cards.length === 0) return;
    
    const totalCards = cards.length;
    const segmentSize = 1 / totalCards;

    const cardYOffset = 20;
    const cardScaleStep = 0.1;

    // 初始化卡片位置
    cards.forEach((card, i) => {
      gsap.set(card, {
        xPercent: -50,
        yPercent: -50 + i * cardYOffset,
        scale: 1 - i * cardScaleStep,
        z: -i * 100,
        transformOrigin: 'center bottom',
      });
    });

    // 初始化 outro section 位置
    if (outro) {
      gsap.set(outro, {
        yPercent: 100,
      });
    }

    // 创建滚动触发器
    ScrollTrigger.create({
      trigger: '.sticky-cards',
      start: 'top top',
      end: `+=${window.innerHeight * 8}px`,
      pin: true,
      pinSpacing: true,
      scrub: 0.15,
      onUpdate: (self) => {
        const progress = self.progress;
        const activeIndex = Math.min(Math.floor(progress / segmentSize), totalCards - 1);
        const segProgress = (progress - activeIndex * segmentSize) / segmentSize;

        // 当滚动到最后一张卡片的 80% 时，添加 scrolled 类
        if (activeIndex === totalCards - 1 && segProgress > 0.8) {
          homePage?.classList.add('scrolled');
        } else {
          homePage?.classList.remove('scrolled');
        }

        cards.forEach((card, i) => {
          if (i < activeIndex) {
            // 已经翻开的卡片完全隐藏
            gsap.set(card, {
              yPercent: -50,
              rotationX: 90,
              z: -1000,
              opacity: 0,
              display: 'none',
            });
          } else if (i === activeIndex) {
            // 当前活动的卡片
            const isLastCard = i === totalCards - 1;

            // 计算旋转角度
            const rotation = gsap.utils.interpolate(0, 90, segProgress);

            // 计算透明度
            let opacity = 1;
            let display = 'flex';

            if (segProgress > 0.8) {
              opacity = gsap.utils.interpolate(1, 0, (segProgress - 0.8) / 0.2);
            }

            if (segProgress >= 1) {
              display = 'none';
            }

            gsap.set(card, {
              yPercent: -50,
              rotationX: rotation,
              scale: 1,
              z: gsap.utils.interpolate(0, -500, segProgress),
              opacity: opacity,
              display: display,
            });

            // 如果是最后一张卡片，同时移动 outro section
            if (isLastCard) {
              let outroProgress = 0;
              if (segProgress > 0.8) {
                outroProgress = (segProgress - 0.8) / 0.2;
              }

              const easedValue = outroProgress < 0.5 ? 2 * outroProgress * outroProgress : 1 - Math.pow(-2 * outroProgress + 2, 2) / 2;

              gsap.set(outro, {
                yPercent: 100 - easedValue * 100,
                scale: gsap.utils.interpolate(0.8, 1, easedValue),
                opacity: gsap.utils.interpolate(0, 1, easedValue),
              });
            }
          } else {
            // 后面的卡片
            const behindIndex = i - activeIndex;
            const yOffset = behindIndex * cardYOffset;
            const currentScale = 1 - (behindIndex - segProgress) * cardScaleStep;

            gsap.set(card, {
              yPercent: -50 + yOffset - segProgress * cardYOffset,
              rotationX: 0,
              scale: currentScale,
              z: -behindIndex * 100 + segProgress * 100,
              opacity: 1,
              display: 'flex',
            });
          }
        });
      },
    });

    // 清理函数
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="home-page">
      <DissolveEffect
        imageSrc={img5}
        title="Ethical Play"
        description="在技术与伦理交织的时代，每一次工程决策都关乎未来。"
        contentText="理论认知终需落地实践，真正的工程伦理决策，藏在每一次具体的选择里。通过沉浸式体验，理解工程伦理的核心价值。"
      />
      
      <section className="sticky-cards" ref={stickyCardsRef}>
        <h2 className="section-title">关于此项目</h2>
        <div
          className="card"
          id="card-1"
        >
          <div className="col">
            <p>聚焦工程实践中的核心伦理准则，如安全优先、责任担当、公平正义、环境友好等。通过沉浸式案例，让用户理解 “为何要守伦理”，并建立 “工程不仅是技术，更是责任” 的认知。</p>
            <h1>Ethical Play</h1>
          </div>
          <div className="col">
            <img src={img1} alt="Ethical Play Logo1" />
          </div>
        </div>

        <div
          className="card"
          id="card-2"
        >
          <div className="col">
            <p>模拟工程决策中的伦理困境，如技术创新与公共安全的冲突、成本控制与质量保障的矛盾等。用户可在虚拟场景中做出选择，即时看到不同决策带来的连锁后果，培养 “预见风险” 的能力。
</p>
            <h1>Risk Foresight</h1>
          </div>
          <div className="col">
            <img src={img2} alt="Ethical Play Logo2" />
          </div>
        </div>

        <div
          className="card"
          id="card-3"
        >
          <div className="col">
            <p>探讨工程伦理中的多元价值冲突，如效率与公平、创新与传统、商业利益与公共福祉。通过角色扮演和辩论式交互，引导用户学习在复杂情境中进行价值排序与妥协，找到 “最优解”。
</p>
            <h1>Value Trade-offs</h1>
          </div>
          <div className="col">
            <img src={img3} alt="Ethical Play Logo3" />
          </div>
        </div>

        <div
          className="card"
          id="card-4"
        >
          <div className="col">
            <p>面向下一代工程师，传递 “工程是为了更美好未来” 的使命。展示可持续工程、包容性设计、负责任创新等前沿理念，激励用户成为技术向善的推动者。</p>
            <h1>Future Stewardship</h1>
          </div>
          <div className="col">
            <img src={img4} alt="Ethical Play Logo4" />
          </div>
        </div>
      </section>

      <section className="outro" ref={outroRef}>
        <h1>理论认知终需落地实践，真正的工程伦理决策，藏在每一次具体的选择里。
    进入真实案例场景，用你的判断定义技术向善的边界。</h1>
    <button className="jump-btn" onClick={() => window.location.href="/case-scene"}>
    进入案例交互
  </button>
      </section>
    </div>
  );
};

export default Home;
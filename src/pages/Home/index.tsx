import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
// @ts-ignore
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// @ts-ignore
import Lenis from '@studio-freight/lenis';
import img1 from '../../assets/1.jpg';
import img2 from '../../assets/2.jpg';
import img3 from '../../assets/3.jpg';
import img4 from '../../assets/4.jpg';
import './Home.css';

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

    // 使用 gsap.utils.toArray 获取所有卡片元素
    const cards = gsap.utils.toArray('.sticky-cards .card') as HTMLDivElement[];
    const outro = outroRef.current;
    
    // 确保有卡片
    if (cards.length === 0) return;
    
    const totalCards = cards.length;
    const segmentSize = 1 / totalCards;

    const cardYOffset = 15;
    const cardScaleStep = 0.08;

    // 初始化卡片位置
    cards.forEach((card, i) => {
      gsap.set(card, {
        xPercent: -50,
        yPercent: -50,
        scale: 1 - i * cardScaleStep,
        z: -i * 100,
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
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        const activeIndex = Math.min(Math.floor(progress / segmentSize), totalCards - 1);
        const segProgress = (progress - activeIndex * segmentSize) / segmentSize;

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
            const currentScale = 1 - (behindIndex + segProgress * 0.5) * cardScaleStep;

            gsap.set(card, {
              yPercent: -50 + yOffset,
              rotationX: 0,
              scale: currentScale,
              z: -behindIndex * 100,
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
      <section className="intro">
        <h1>enter frame</h1>
      </section>

      <section className="sticky-cards" ref={stickyCardsRef}>
        <div
          className="card"
          id="card-1"
        >
          <div className="col">
            <p>Quietly</p>
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
            <p>Quietly</p>
            <h1>Ethical Play</h1>
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
            <p>Quietly</p>
            <h1>Ethical Play</h1>
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
            <p>Quietly</p>
            <h1>Ethical Play</h1>
          </div>
          <div className="col">
            <img src={img4} alt="Ethical Play Logo4" />
          </div>
        </div>
      </section>

      <section className="outro" ref={outroRef}>
        <h1>leave frame</h1>
      </section>
    </div>
  );
};

export default Home;
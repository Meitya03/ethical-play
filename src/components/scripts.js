// ensure the ScrollTrigger plugin is registered
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    
    const cards=document.querySelectorAll(".sticky-cards .card");
    const outro=document.querySelector(".outro");
    const totalCards=cards.length;
    const segmentSize=1/totalCards;

    const cardYOffset=15;
    const cardScaleStep=0.08;

    cards.forEach((card,i)=>{
      gsap.set(card,{
        xPercent:-50,
        yPercent:-50,
        scale:1-i*cardScaleStep,
        z: -i * 100,
    });
});
    
    // 初始化outro section位置
    gsap.set(outro, {
        yPercent: 100
    });
    
    ScrollTrigger.create({
        trigger:".sticky-cards",
        start:"top top",
        end:`+=${window.innerHeight*8}px`,
        pin:true,
        pinSpacing:true,
        scrub:0.5,
        onUpdate:(self)=>{
         const progress=self.progress;

         const activeIndex=Math.min(Math.floor(progress/segmentSize), totalCards - 1);
         const segProgress=(progress-activeIndex*segmentSize)/segmentSize;

         cards.forEach((card, i) => {
          if (i < activeIndex) {
          // 已经翻开的卡片完全隐藏
          gsap.set(card, {
            yPercent: -50,
            rotationX: 90,
            z: -1000,
            opacity: 0,
            display: "none"
          })
        } else if (i === activeIndex) {
          // 最后一张卡片
          const isLastCard = i === totalCards - 1;
          
          // 计算旋转角度，让卡片完全翻转到水平
          const rotation = gsap.utils.interpolate(0, 90, segProgress);
          
          // 只有当卡片完全翻转到水平后才开始消失
          let opacity = 1;
          let display = "flex";
          
          if (segProgress > 0.8) {
              // 卡片接近完全翻转时开始消失
              opacity = gsap.utils.interpolate(1, 0, (segProgress - 0.8) / 0.2);
          }
          
          if (segProgress >= 1) {
              display = "none";
          }
          
          gsap.set(card, {
            yPercent: -50,
            rotationX: rotation,
            scale: 1,
            z: gsap.utils.interpolate(0, -500, segProgress),
            opacity: opacity,
            display: display
          })
          
          // 如果是最后一张卡片，同时移动outro section
          if (isLastCard) {
              // 当卡片开始消失时，outro section开始出现
              let outroProgress = 0;
              if (segProgress > 0.8) {
                  outroProgress = (segProgress - 0.8) / 0.2;
              }
              
              const easedValue = outroProgress < 0.5 ? 2 * outroProgress * outroProgress : 1 - Math.pow(-2 * outroProgress + 2, 2) / 2;
              
              gsap.set(outro, {
                  yPercent: 100 - easedValue * 100,
                  scale: gsap.utils.interpolate(0.8, 1, easedValue),
                  opacity: gsap.utils.interpolate(0, 1, easedValue)
              });
          }
        } else {
          const behindIndex = i - activeIndex
          const yOffset = behindIndex * cardYOffset
          const currentScale = 1 - (behindIndex + segProgress * 0.5) * cardScaleStep

          gsap.set(card, {
            yPercent: -50 + yOffset,
            rotationX: 0,
            scale: currentScale,
            z: -behindIndex * 100,
            opacity: 1,
            display: "flex"
          });
        }
      });
    },
  });
});

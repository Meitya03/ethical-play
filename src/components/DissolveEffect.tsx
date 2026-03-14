import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface DissolveEffectProps {
  imageSrc: string;
  title: string;
  description: string;
  contentText: string;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0.89, g: 0.89, b: 0.89 };
}

const vertexShader = `
    varying vec2 vUv;

    void main() {
       vUv = uv;
       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform float uProgress;
    uniform vec2 uResolution;
    uniform vec3 uColor;
    uniform float uSpread;
    varying vec2 vUv;

    float Hash(vec2 p) {
        vec3 p2 = vec3(p.xy, 1.0);
        return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123);
    }

    float noise(in vec2 p) {
       vec2 i = floor(p);
       vec2 f = fract(p);
       f *= f * (3.0 - 2.0 * f);
       return mix(
           mix(Hash(i + vec2(0.0, 0.0)), Hash(i + vec2(1.0, 0.0)), f.x),
           mix(Hash(i + vec2(0.0, 1.0)), Hash(i + vec2(1.0, 1.0)), f.x),
           f.y
       );
    }

    float fbm(in vec2 p) {
        float v = 0.0;
        v += noise(p * 1.0) * 0.5;
        v += noise(p * 2.0) * 0.25;
        v += noise(p * 4.0) * 0.125;
        return v;
    }

     void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / uResolution.y;
        vec2 centeredUv = (uv - 0.5) * vec2(aspect, 1.0);
        
        // uProgress: 0 = image fully visible, 1 = image fully covered
        // dissolve from top to bottom as user scrolls
        float dissolveEdge = (1.0 - uProgress) - uv.y;
        float noiseValue = fbm(centeredUv * 8.0);
        float d = dissolveEdge + noiseValue * uSpread;

        // alpha: 1 = show color (cover image), 0 = transparent (show image)
        float alpha = 1.0 - smoothstep(-0.1, 0.1, d);
        gl_FragColor = vec4(uColor, alpha);
    }
`;

const DissolveEffect = ({ imageSrc, title, description, contentText }: DissolveEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const content = contentRef.current;

    if (!canvas || !container || !content) return;

    const CONFIG = {
      color: '#e3e3db',
      spread: 0.5,
      speed: 2,
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
    });

    const rgb = hexToRgb(CONFIG.color);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) },
        uColor: { value: new THREE.Vector3(rgb.r, rgb.g, rgb.b) },
        uSpread: { value: CONFIG.spread },
      },
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let scrollProgress = 0;

    function resize() {
      if (!container) return;
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
      material.uniforms.uResolution.value.set(width * dpr, height * dpr);
    }

    resize();
    window.addEventListener('resize', resize);

    function animate() {
      material.uniforms.uProgress.value = scrollProgress;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();

    // 使用ScrollTrigger来监听滚动事件，与Lenis集成
    setTimeout(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=300vh',
        scrub: true,
        onUpdate: (self) => {
          scrollProgress = self.progress;
          // 调试日志
          console.log('Scroll progress:', scrollProgress);
        }
      });

      // 确保ScrollTrigger正确初始化
      ScrollTrigger.refresh();
    }, 200);

    const contentH2 = content.querySelector('h2');
    if (contentH2) {
      const text = contentH2.textContent;
      contentH2.innerHTML = text.split(/\s+/).map(word => `<span class="word">${word}</span>`).join(' ');
      const words = contentH2.querySelectorAll('.word');

      gsap.set(words, { opacity: 0.1 });

      ScrollTrigger.create({
        trigger: content,
        start: 'top 80%',
        end: 'center center',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          words.forEach((word, index) => {
            const wordProgress = index / words.length;
            const nextWordProgress = (index + 1) / words.length;
            let opacity = 0.1;
            if (progress >= nextWordProgress) {
              opacity = 1;
            } else if (progress >= wordProgress) {
              const fadeProgress = (progress - wordProgress) / (nextWordProgress - wordProgress);
              opacity = 0.1 + fadeProgress * 0.9;
            }
            (word as HTMLElement).style.opacity = opacity.toString();
          });
        }
      });
    }

    return () => {
      window.removeEventListener('resize', resize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div className="dissolve-effect" ref={containerRef}>
      <div className="dissolve-image">
        <img src={imageSrc} alt="" />
      </div>

      <div className="dissolve-header">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <canvas className="dissolve-canvas" ref={canvasRef} />

      <div className="dissolve-content" ref={contentRef}>
        <h2>{contentText}</h2>
      </div>
    </div>
  );
};

export default DissolveEffect;

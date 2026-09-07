"use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState, useMemo, Component, ErrorInfo, ReactNode } from "react";
import { useAppStore } from "@/store/useAppStore";
import BrandLogo from "@/components/layout/BrandLogo";
import { getAssetPath } from "@/lib/assets";
import * as THREE from "three";

interface RingProps {
  onLoaded: () => void;
  animStep: number;
}

class ThreeErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("3D GLB model loading fallback triggered:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function FloatingGoldParticles({ count = 35 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
      scl[i] = Math.random() * 0.04 + 0.015;
    }
    return [pos, scl];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08;
      pointsRef.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#C4852B"
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Procedural 18K Solid Gold & Agate Gemstone Ring (Zero-fail fallback)
function ProceduralGoldRing() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={meshRef}>
      {/* 18K Gold Band */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.1, 0.16, 32, 64]} />
        <meshStandardMaterial
          color="#C4852B"
          metalness={0.92}
          roughness={0.16}
        />
      </mesh>

      {/* Signature Red Agate Gem Crown */}
      <mesh position={[0, 1.15, 0.4]}>
        <octahedronGeometry args={[0.3, 2]} />
        <meshPhysicalMaterial
          color="#660000"
          metalness={0.1}
          roughness={0.05}
          transmission={0.85}
          ior={1.8}
          transparent
          opacity={0.95}
        />
      </mesh>
    </group>
  );
}

function GLTFModelRing({ modelPath }: { modelPath: string }) {
  const goldModel = useGLTF(modelPath);

  const clonedScene = useMemo(() => {
    const cloned = goldModel.scene.clone(true);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => {
            if (m instanceof THREE.MeshStandardMaterial) {
              if (m.map) m.map.colorSpace = THREE.SRGBColorSpace;
              m.envMapIntensity = 2.2;
              m.needsUpdate = true;
            }
          });
        } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
          if (mesh.material.map) {
            mesh.material.map.colorSpace = THREE.SRGBColorSpace;
          }
          mesh.material.envMapIntensity = 2.2;
          mesh.material.needsUpdate = true;
        }
      }
    });
    return cloned;
  }, [goldModel.scene]);

  return (
    <Center>
      <primitive object={clonedScene} />
    </Center>
  );
}

// Preload the model for instantaneous display
useGLTF.preload(getAssetPath("/models/an-old-ring.glb"));

function AnimatedRing({ 
  onLoaded, 
  animStep, 
  targetProgressRef,
  currentProgressRef,
  contentLayerRef,
  scrollHintRef
}: RingProps & { 
  targetProgressRef: React.MutableRefObject<number>;
  currentProgressRef: React.MutableRefObject<number>;
  contentLayerRef: React.RefObject<HTMLDivElement | null>;
  scrollHintRef: React.RefObject<HTMLDivElement | null>;
}) {
  const modelUrl = useMemo(() => getAssetPath("/models/an-old-ring.glb"), []);
  const groupRef = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    onLoaded();

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, [onLoaded]);

  // Scales & Positions:
  // - State 1 (Top / Unscrolled): 3/4 angled view showcasing amber gemstone (~1.40 desktop, 0.95 mobile)
  // - State 2 (Scrolled step 1): Perfectly sized circular loop framing hero content (~2.25 desktop, 1.05 mobile)
  const initialScale = isMobile ? 0.95 : 1.40;
  const targetExpandedScale = isMobile ? 1.05 : 2.25;
  const initialPosY = isMobile ? -0.30 : -0.20;
  const targetExpandedPosY = isMobile ? -0.28 : -0.16;

  // Euler Rotation Angles for Image 1 (3/4 top angle) and Image 2 (Front portal loop)
  const img1Rot = { x: -0.62, y: -0.28, z: -0.05 };
  const img2Rot = { x: -1.28, y: 0.135, z: 0.018 };

  useFrame((state, delta) => {
    // Single unified physics damping in sync with Three.js render loop (60-120 FPS)
    currentProgressRef.current = THREE.MathUtils.damp(
      currentProgressRef.current,
      targetProgressRef.current,
      9.0,
      delta
    );
    const p = currentProgressRef.current;

    // Stage 1: Ring 3D transform occurs over progress [0.0 -> 0.50]
    const ringProgress = Math.min(1, Math.max(0, p / 0.50));
    // Smooth cubic easeInOut
    const ringFactor = ringProgress * ringProgress * (3 - 2 * ringProgress);

    if (groupRef.current) {
      let targetScale = initialScale + (targetExpandedScale - initialScale) * ringFactor;
      let targetPosY = initialPosY + (targetExpandedPosY - initialPosY) * ringFactor;

      if (animStep === 0) {
        targetScale = 0.25;
        targetPosY = -0.5;
      } else if (animStep === 1) {
        targetScale = initialScale * 1.05;
      }

      groupRef.current.scale.setScalar(targetScale);
      groupRef.current.position.y = targetPosY;

      // Pointer parallax only when resting at top, fades out cleanly to avoid jumps on reverse
      const pointerStrength = Math.max(0, 1 - ringProgress * 2.5) * 0.025;
      const targetRotX = THREE.MathUtils.lerp(img1Rot.x, img2Rot.x, ringFactor) + (state.pointer.y * pointerStrength);
      const targetRotY = THREE.MathUtils.lerp(img1Rot.y, img2Rot.y, ringFactor) + (state.pointer.x * pointerStrength);
      const targetRotZ = THREE.MathUtils.lerp(img1Rot.z, img2Rot.z, ringFactor);

      groupRef.current.rotation.set(targetRotX, targetRotY, targetRotZ);
    }

    // Stage 2: Direct GPU DOM updates for the full-screen content layer [0.50 -> 1.00]
    const contentProgress = Math.min(1, Math.max(0, (p - 0.50) / 0.50));
    const contentFactor = contentProgress * contentProgress * (3 - 2 * contentProgress);

    if (contentLayerRef.current) {
      contentLayerRef.current.style.opacity = `${contentFactor}`;
      contentLayerRef.current.style.transform = `translate3d(0, ${(1 - contentFactor) * 100}%, 0)`;
      contentLayerRef.current.style.pointerEvents = contentFactor > 0.8 ? "auto" : "none";
    }

    if (scrollHintRef.current) {
      scrollHintRef.current.style.opacity = `${Math.max(0, 1 - p * 3)}`;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.20, 0]}>
      <ThreeErrorBoundary fallback={<ProceduralGoldRing />}>
        <Suspense fallback={<ProceduralGoldRing />}>
          <GLTFModelRing modelPath={modelUrl} />
        </Suspense>
      </ThreeErrorBoundary>
      <FloatingGoldParticles count={35} />
    </group>
  );
}

export default function HeroSection() {
  const { t, language } = useAppStore();
  const [modelReady, setModelReady] = useState(false);
  const [animStep, setAnimStep] = useState(0);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  
  // High-performance direct refs (0 React re-renders on scroll for 120fps fluid smoothness)
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const contentLayerRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const handleModelLoaded = () => {
    setModelReady(true);
  };

  useEffect(() => {
    // Safety fallback: ensure loader dismisses even on slow connections
    const timer = setTimeout(() => {
      setModelReady(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Seamless, glitch-free scroll interception & step gate
  useEffect(() => {
    let touchStartY = 0;

    const handleScroll = () => {
      if (window.scrollY > 5) {
        targetProgressRef.current = 1;
        currentProgressRef.current = 1;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const isAtTop = window.scrollY <= 0;

      if (!isAtTop) {
        targetProgressRef.current = 1;
        return;
      }

      // Scrolling down: advance animation smoothly until 100%
      if (e.deltaY > 0) {
        if (targetProgressRef.current < 1) {
          e.preventDefault();
          const delta = Math.min(0.06, Math.max(0.01, Math.abs(e.deltaY) * 0.0008));
          targetProgressRef.current = Math.min(1, targetProgressRef.current + delta);
        }
      }
      // Scrolling up: reverse animation smoothly back to 0%
      else if (e.deltaY < 0) {
        if (targetProgressRef.current > 0) {
          e.preventDefault();
          const delta = Math.min(0.06, Math.max(0.01, Math.abs(e.deltaY) * 0.0008));
          targetProgressRef.current = Math.max(0, targetProgressRef.current - delta);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const isAtTop = window.scrollY <= 0;
      if (!isAtTop || e.touches.length === 0) {
        if (window.scrollY > 5) targetProgressRef.current = 1;
        return;
      }

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY; // positive = swipe up (scroll down)
      const touchDelta = Math.min(0.06, Math.max(0.01, Math.abs(deltaY) * 0.0025));

      if (deltaY > 0 && targetProgressRef.current < 1) {
        e.preventDefault();
        targetProgressRef.current = Math.min(1, targetProgressRef.current + touchDelta);
        touchStartY = currentY;
      } else if (deltaY < 0 && targetProgressRef.current > 0) {
        e.preventDefault();
        targetProgressRef.current = Math.max(0, targetProgressRef.current - touchDelta);
        touchStartY = currentY;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isAtTop = window.scrollY <= 0;
      if (!isAtTop) return;

      if (["ArrowDown", "PageDown", " "].includes(e.key) && targetProgressRef.current < 1) {
        e.preventDefault();
        targetProgressRef.current = Math.min(1, targetProgressRef.current + 0.15);
      } else if (["ArrowUp", "PageUp"].includes(e.key) && targetProgressRef.current > 0) {
        e.preventDefault();
        targetProgressRef.current = Math.max(0, targetProgressRef.current - 0.15);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (modelReady) {
      const t1 = setTimeout(() => setAnimStep(1), 100);
      const t2 = setTimeout(() => setAnimStep(2), 700);
      const t3 = setTimeout(() => setLoaderVisible(false), 1400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [modelReady]);

  return (
    <>
      {/* Portal Loader */}
      {loaderVisible && (
        <div 
          className={`fixed inset-0 z-[100] bg-[#FFFFFF] dark:bg-[#FAF9F5] flex flex-col items-center justify-center transition-all duration-500 ease-out ${
            animStep >= 2 ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
          }`}
        >
          <div className="relative flex flex-col items-center justify-center mb-8">
            <BrandLogo variant="gold" size="lg" showSubline={false} />
            <div className="absolute -inset-4 rounded-full border border-[#C4852B]/40 animate-ping pointer-events-none"></div>
          </div>
          
          <div className="flex flex-col items-center gap-2 tracking-[0.25em] text-center px-4">
            <span className="text-xs font-brand-en text-zinc-950 uppercase font-bold tracking-[0.3em]">
              NAFISE EBADI JEWELLERY
            </span>
            <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-mono font-bold">
              {language === 'fa' ? 'در حال آماده‌سازی ورود...' : 'Revealing Collection...'}
            </span>
          </div>
        </div>
      )}
      
      {/* Hero Section Container */}
      <section 
        ref={sectionRef}
        className="relative w-full max-w-full overflow-hidden h-screen min-h-[580px] md:min-h-[660px] flex items-center justify-center bg-[#FAF9F5] text-zinc-950 transition-colors duration-500 pt-14 md:pt-20"
      >
        
        {/* Zero-Lag Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-[radial-gradient(circle,rgba(196,133,43,0.18)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>

        {/* High-Performance 3D Canvas */}
        {isHeroVisible && (
          <div className="absolute inset-0 z-0 top-0 pointer-events-none">
            <Canvas 
              camera={{ position: [0, 0, 7.2], fov: 40 }} 
              dpr={1}
              gl={{ powerPreference: "high-performance", antialias: true, alpha: true, stencil: false, depth: true }}
              onCreated={({ gl }) => {
                gl.setClearColor('#FAF9F5', 1);
              }}
            >
              <ambientLight intensity={1.8} />
              <directionalLight position={[10, 15, 10]} intensity={4} color="#ffffff" />
              <directionalLight position={[-10, 10, -5]} intensity={2.5} color="#fff4e0" />
              <spotLight position={[0, 12, 6]} angle={0.35} penumbra={1} intensity={3.5} color="#ffffff" />
              <pointLight position={[0, -5, 5]} intensity={1.5} color="#C4852B" />
              
              <Suspense fallback={<ProceduralGoldRing />}>
                <AnimatedRing 
                  onLoaded={handleModelLoaded} 
                  animStep={animStep} 
                  targetProgressRef={targetProgressRef}
                  currentProgressRef={currentProgressRef} 
                  contentLayerRef={contentLayerRef}
                  scrollHintRef={scrollHintRef}
                />
              </Suspense>
            </Canvas>
          </div>
        )}
        
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,249,245,0.05)_30%,rgba(250,249,245,0.85)_100%)] opacity-90 z-0 pointer-events-none"></div>

        {/* Initial Scroll Hint (fades out as animation advances) */}
        <div 
          ref={scrollHintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-200"
          style={{ opacity: 1 }}
        >
          <span className="text-[9px] md:text-[10px] font-mono tracking-[0.3em] uppercase text-[#C4852B] font-bold">
            {language === 'fa' ? 'برای کاوش به پایین اسکرول کنید' : 'Scroll to explore'}
          </span>
          <div className="w-5 h-8 rounded-full border-2 border-[#C4852B]/40 flex items-start justify-center p-1">
            <div className="w-1.5 h-2 rounded-full bg-[#C4852B] animate-bounce"></div>
          </div>
        </div>

        {/* Full-Screen Hidden Content Layer: Completely covers the whole hero section */}
        <div 
          ref={contentLayerRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#FAF9F5] text-zinc-950 px-4 sm:px-8 will-change-transform"
          style={{
            opacity: 0,
            transform: 'translate3d(0, 100%, 0)',
            pointerEvents: 'none'
          }}
        >
          {/* Subtle Ambient Radial Gold Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-[radial-gradient(circle,rgba(196,133,43,0.12)_0%,rgba(250,249,245,0)_70%)] pointer-events-none"></div>

          {/* Centered Editorial Content */}
          <div className="relative z-10 text-center flex flex-col items-center max-w-3xl mx-auto pt-6 sm:pt-10">
            
            {/* Badge */}
            <div className="mb-4 md:mb-6 px-4 py-1.5 rounded-full border border-[#C4852B]/60 bg-[#C4852B]/15 backdrop-blur-sm text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-[#A06314] font-bold font-mono shadow-sm">
              {t.hero.badge}
            </div>

            {/* Persian Editorial Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-4 md:mb-6 uppercase text-zinc-950 leading-[1.3] md:leading-[1.25]">
              {t.hero.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base font-semibold max-w-xs sm:max-w-md md:max-w-xl mx-auto mb-8 sm:mb-10 text-[#660000] leading-relaxed tracking-wide">
              {t.hero.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 w-full sm:w-auto px-4 sm:px-0 max-w-xs sm:max-w-none">
              <Link 
                href="/collections"
                className="w-full sm:w-auto text-center px-8 py-3.5 bg-[#660000] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full shadow-[0_8px_25px_rgba(102,0,0,0.4)] hover:bg-[#7D0000] hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                {t.hero.explore}
              </Link>
              
              <Link 
                href="/about"
                className="w-full sm:w-auto text-center px-8 py-3.5 border-2 border-[#C4852B] bg-white text-zinc-950 font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-[#C4852B] hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
              >
                {t.hero.philosophy}
              </Link>
            </div>

          </div>
        </div>

      </section>
    </>
  );
}


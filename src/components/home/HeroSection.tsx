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
        const matName = mesh.material ? (mesh.material as THREE.Material).name : '';

        if (matName === 'Crystal' || mesh.name === 'Object_0') {
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color("#FFFFFF"),
            metalness: 0.0,
            roughness: 0.02,
            transmission: 0.95,
            ior: 2.417,
            transparent: true,
            opacity: 0.95
          });
        } else {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#C4852B"),
            metalness: 0.9,
            roughness: 0.18
          });
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

function AnimatedRing({ onLoaded, animStep }: RingProps) {
  const modelUrl = useMemo(() => getAssetPath("/models/ring-min.glb"), []);
  const groupRef = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    onLoaded();
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [onLoaded]);

  const targetScale = isMobile ? 0.95 : 1.25;
  const targetPosY = isMobile ? -0.42 : -0.55;

  useFrame((state, delta) => {
    if (groupRef.current) {
      let scaleGoal = targetScale;
      let posGoalY = targetPosY;

      if (animStep === 0) {
        scaleGoal = 0.25;
        posGoalY = 0;
      } else if (animStep === 1) {
        scaleGoal = targetScale * 1.35;
        posGoalY = targetPosY * 0.5;
      }

      const currentScale = groupRef.current.scale.x;
      const newScale = THREE.MathUtils.damp(currentScale, scaleGoal, 3.2, delta);
      groupRef.current.scale.setScalar(newScale);

      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        posGoalY,
        3.2,
        delta
      );

      // Continuous Smooth 3D Ring Rotation Spin with subtle pointer parallax
      groupRef.current.rotation.y += delta * 0.35;
      const targetRotX = (state.pointer.y * 0.2) + 0.15;
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 3, delta);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.45, 0]}>
      <ThreeErrorBoundary fallback={<ProceduralGoldRing />}>
        <Suspense fallback={<ProceduralGoldRing />}>
          <GLTFModelRing modelPath={modelUrl} />
        </Suspense>
      </ThreeErrorBoundary>
      <FloatingGoldParticles count={40} />
    </group>
  );
}

export default function HeroSection() {
  const { t, language } = useAppStore();
  const [modelReady, setModelReady] = useState(false);
  const [animStep, setAnimStep] = useState(0);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

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
        className="relative w-full max-w-full overflow-hidden h-[85vh] min-h-[560px] md:min-h-[640px] flex items-center justify-center bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 transition-colors duration-500 pt-14 md:pt-20"
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
                <AnimatedRing onLoaded={handleModelLoaded} animStep={animStep} />
              </Suspense>
            </Canvas>
          </div>
        )}
        
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,249,245,0.05)_30%,rgba(250,249,245,0.85)_100%)] opacity-90 z-0 pointer-events-none"></div>

        {/* Editorial Content Layout */}
        <div 
          className={`relative z-10 text-center px-4 md:px-8 flex flex-col items-center mt-4 md:mt-12 pointer-events-none transition-all duration-700 ${
            animStep >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Badge */}
          <div className="mb-4 md:mb-6 px-4 py-1.5 rounded-full border border-[#C4852B]/50 bg-[#C4852B]/15 backdrop-blur-sm text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-[#C4852B] font-bold font-mono">
            {t.hero.badge}
          </div>

          {/* Persian Editorial Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 md:mb-6 uppercase text-zinc-950 max-w-3xl leading-[1.3] md:leading-[1.25]">
            {t.hero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm font-normal max-w-xs sm:max-w-md md:max-w-lg mx-auto mb-8 text-[#660000] leading-relaxed tracking-wide font-semibold">
            {t.hero.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 w-full sm:w-auto pointer-events-auto px-4 sm:px-0 max-w-xs sm:max-w-none">
            <Link 
              href="/collections"
              className="w-full sm:w-auto text-center px-8 py-3.5 bg-[#660000] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full shadow-[0_8px_25px_rgba(102,0,0,0.35)] hover:bg-[#7D0000] hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              {t.hero.explore}
            </Link>
            
            <Link 
              href="/about"
              className="w-full sm:w-auto text-center px-8 py-3.5 border-2 border-[#C4852B] bg-white/90 backdrop-blur-sm text-zinc-950 font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-[#C4852B] hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
            >
              {t.hero.philosophy}
            </Link>
          </div>
        </div>

      </section>
    </>
  );
}


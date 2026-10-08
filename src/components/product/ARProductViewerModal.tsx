"use client";

import React, { useState, useRef, useEffect, useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { SparkleStarIcon } from "@/components/icons/JewelryIcons";

export interface GemstoneConfig {
  id: string;
  nameFa: string;
  nameEn: string;
  color: string;
  roughness: number;
  metalness: number;
  transmission: number;
  opacity: number;
  ior: number;
  badge: string;
}

export const GEMSTONE_VARIANTS: GemstoneConfig[] = [
  {
    id: "durr-najaf",
    nameFa: "دُرّ نجف شیشه‌ای (کریستال زلال)",
    nameEn: "Crystalline Durr-e Najaf",
    color: "#E2E8F0",
    roughness: 0.04,
    metalness: 0.05,
    transmission: 0.92,
    opacity: 0.95,
    ior: 1.54,
    badge: "زلال و بلورین"
  },
  {
    id: "agate-kabadi",
    nameFa: "عقیق کبدی اصیل (شرابی تیره)",
    nameEn: "Dark Liver Agate",
    color: "#4A121A",
    roughness: 0.22,
    metalness: 0.08,
    transmission: 0.25,
    opacity: 1,
    ior: 1.53,
    badge: "اصیل و فاخر"
  },
  {
    id: "agate-red",
    nameFa: "عقیق سرخ یمنی (عقیق احمر)",
    nameEn: "Red Carnelian Yemeni Agate",
    color: "#991B1B",
    roughness: 0.18,
    metalness: 0.08,
    transmission: 0.35,
    opacity: 1,
    ior: 1.54,
    badge: "یمنی اصل"
  },
  {
    id: "agate-jade",
    nameFa: "عقیق یشمی معدنی (سبز درباری)",
    nameEn: "Imperial Jade-Agate",
    color: "#164E3D",
    roughness: 0.26,
    metalness: 0.06,
    transmission: 0.15,
    opacity: 1,
    ior: 1.52,
    badge: "معدنی کهن"
  },
  {
    id: "agate-lavender",
    nameFa: "عقیق سوسنی / آبی ملایم",
    nameEn: "Lavender Lace Agate",
    color: "#6D7993",
    roughness: 0.22,
    metalness: 0.08,
    transmission: 0.28,
    opacity: 1,
    ior: 1.53,
    badge: "نادر و چشم‌نواز"
  }
];

export const SILVER_FINISHES = [
  {
    id: "polished",
    nameFa: "نقره ۹۲۵ صیقل آینه‌ای",
    color: "#E6EAEE",
    metalness: 0.95,
    roughness: 0.14
  },
  {
    id: "rhodium",
    nameFa: "آبکاری رادیوم لوکس",
    color: "#F8FAFC",
    metalness: 0.98,
    roughness: 0.08
  },
  {
    id: "antique",
    nameFa: "نقره کهنه‌کاری سیاه قلم",
    color: "#94A3B8",
    metalness: 0.85,
    roughness: 0.38
  }
];

interface ModelProps {
  stone: GemstoneConfig;
  silver: typeof SILVER_FINISHES[0];
  scale?: number;
  autoRotate?: boolean;
}

function Ring3DModel({ stone, silver, scale = 1.3 }: ModelProps) {
  const { scene } = useGLTF("/models/ring-opt.glb");

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const meshName = mesh.name || "";
        const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
        const matName = mat?.name || "";

        // Check if this mesh is the Gemstone
        const isGemstone = 
          matName.toLowerCase().includes("crystal") || 
          matName.toLowerCase().includes("stone") ||
          meshName.includes("Object_0") || 
          meshName.includes("Object_2");

        if (isGemstone) {
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(stone.color),
            roughness: stone.roughness,
            metalness: stone.metalness,
            transmission: stone.transmission,
            transparent: stone.transmission > 0 || stone.opacity < 1,
            opacity: stone.opacity,
            ior: stone.ior,
            clearcoat: 1.0,
            clearcoatRoughness: 0.08,
            reflectivity: 0.9,
          });
        } else {
          // 925 Sterling Silver Band
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(silver.color),
            metalness: silver.metalness,
            roughness: silver.roughness,
            envMapIntensity: 1.5,
          });
        }
      }
    });
    return clone;
  }, [scene, stone, silver]);

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
      <primitive object={clonedScene} scale={scale} position={[0, -0.15, 0]} rotation={[0.2, 0.4, 0]} />
    </Float>
  );
}

useGLTF.preload("/models/ring-opt.glb");

interface ARProductViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle?: string;
  initialProduct?: any;
}

export default function ARProductViewerModal({
  isOpen,
  onClose,
  productTitle = "انگشتر نقره ۹۲۵ دست‌ساز نفیسه عبادی",
  initialProduct
}: ARProductViewerModalProps) {
  const [activeStone, setActiveStone] = useState<GemstoneConfig>(GEMSTONE_VARIANTS[0]);
  const [activeSilver, setActiveSilver] = useState(SILVER_FINISHES[0]);
  const [activeTab, setActiveTab] = useState<"3d" | "ar">("3d");
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [ringScale, setRingScale] = useState(1.3);
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when closing modal or switching tab
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("مرورگر شما از دسترسی به دوربین پشتیبانی نمی‌کند.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "دسترسی به دوربین تأیید نشد.";
      setCameraError(msg);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleTabChange = (tab: "3d" | "ar") => {
    setActiveTab(tab);
    if (tab === "ar") {
      setAutoRotate(false);
      startCamera();
    } else {
      stopCamera();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Dark frosted glass backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-[#121110] border border-[#C4852B]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Bar Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-800 bg-[#1A1816] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#660000] text-[#E5A84B] border border-[#C4852B]/40 shadow-sm">
              <SparkleStarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#E5A84B] font-bold">
                  STUDIO 3D & AR TRY-ON
                </span>
                <span className="text-[9px] bg-[#660000]/60 text-white px-2 py-0.5 rounded-full font-mono font-bold border border-[#C4852B]/30">
                  REAL-TIME 925 SILVER
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-zinc-100">
                مشاهده سه‌بعدی ۳۶۰° و پرو مجازی روی دست
              </h3>
            </div>
          </div>

          {/* Close & Tabs */}
          <div className="flex items-center gap-3">
            {/* Mode Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-semibold">
              <button
                onClick={() => handleTabChange("3d")}
                className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "3d" ? "bg-[#660000] text-white shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
              >
                نمای استودیو ۳D
              </button>
              <button
                onClick={() => handleTabChange("ar")}
                className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "ar" ? "bg-[#C4852B] text-black font-bold shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>پرو مجازی AR</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
              aria-label="بستن"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body: Left 3D Viewport, Right Controls */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
          
          {/* 3D / AR Viewport (Span 2) */}
          <div className="lg:col-span-2 relative h-full min-h-[350px] bg-gradient-to-b from-[#181614] to-[#0A0A0A] overflow-hidden flex items-center justify-center">
            
            {/* Live Camera Video (In AR Mode) */}
            {activeTab === "ar" && (
              <div className="absolute inset-0 z-0 overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-opacity duration-500 ${cameraActive ? "opacity-100" : "opacity-0"}`}
                />
                {!cameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 p-6 text-center z-10">
                    <div className="w-16 h-16 rounded-full bg-zinc-900 border border-[#C4852B]/40 flex items-center justify-center mb-4 text-[#C4852B]">
                      📷
                    </div>
                    <p className="text-sm font-semibold mb-2">دوربین در حال راه‌اندازی است یا مجوز نیاز است</p>
                    <p className="text-xs text-zinc-400 max-w-sm mb-4">
                      {cameraError || "برای پرو مجازی روی دست، دسترسی به دوربین دستگاه را تأیید فرمایید."}
                    </p>
                    <button
                      onClick={startCamera}
                      className="px-6 py-2.5 bg-[#660000] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#7D0000] transition-colors cursor-pointer"
                    >
                      تلاش مجدد اتصال به دوربین
                    </button>
                  </div>
                )}

                {/* Hand Alignment Guide Outline */}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    {/* Golden Crosshair Hand Silhouette */}
                    <div className="relative w-64 h-80 border-2 border-dashed border-[#C4852B]/50 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-[10px] font-mono tracking-widest text-[#E5A84B] bg-black/60 px-3 py-1 rounded-full uppercase absolute -top-3">
                        انگشت خود را در کادر قرار دهید
                      </span>
                      {/* Center Point */}
                      <div className="w-4 h-4 border border-[#C4852B] rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Three.js Canvas */}
            <div className="absolute inset-0 z-10">
              <Canvas
                camera={{ position: [0, 1.2, 4.5], fov: 42 }}
                gl={{ antialias: true, alpha: true }}
              >
                <ambientLight intensity={1.2} />
                <directionalLight position={[5, 8, 5]} intensity={2.0} castShadow />
                <directionalLight position={[-5, -2, -5]} intensity={0.8} />
                <pointLight position={[0, 4, 2]} intensity={1.5} color="#FFE6B0" />

                <Suspense fallback={null}>
                  <Ring3DModel 
                    stone={activeStone} 
                    silver={activeSilver} 
                    scale={ringScale}
                    autoRotate={autoRotate}
                  />
                  {activeTab === "3d" && (
                    <ContactShadows position={[0, -1.2, 0]} opacity={0.65} scale={10} blur={2.5} far={4} color="#000000" />
                  )}
                </Suspense>

                <OrbitControls 
                  autoRotate={autoRotate}
                  autoRotateSpeed={1.8}
                  enableZoom={true}
                  minDistance={2.5}
                  maxDistance={8}
                  maxPolarAngle={Math.PI / 1.7}
                />
              </Canvas>
            </div>

            {/* Viewport Floating Quick Actions */}
            <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${autoRotate ? "text-[#E5A84B] font-bold" : "text-zinc-400 hover:text-white"}`}
                >
                  {autoRotate ? "⏸ توقف چرخش" : "▶ چرخش خودکار"}
                </button>
                <span className="text-zinc-600">|</span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  لمس / درگ جهت چرخش ۳۶۰°
                </span>
              </div>

              {activeTab === "ar" && (
                <div className="pointer-events-auto flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSnapshotTaken(true);
                      setTimeout(() => setSnapshotTaken(false), 2500);
                    }}
                    className="px-4 py-2 bg-[#660000] text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-[#7D0000] transition-colors cursor-pointer border border-[#C4852B]/40"
                  >
                    <span>📸</span>
                    <span>{snapshotTaken ? "تصویر ذخیره شد!" : "عکس‌برداری از پرو"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Gem Badge Overlay */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C4852B]/40">
              <span className="text-xs font-bold text-[#E5A84B] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeStone.color }}></span>
                <span>{activeStone.nameFa}</span>
              </span>
            </div>
          </div>

          {/* Right Customization Sidebar (Span 1) */}
          <div className="p-5 sm:p-6 bg-[#161412] border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col justify-between overflow-y-auto">
            
            <div className="space-y-6">
              
              {/* Product Info */}
              <div className="pb-4 border-b border-zinc-800">
                <span className="text-[10px] text-[#C4852B] uppercase font-mono tracking-widest block mb-1 font-bold">
                  NAFISE EBADI 925 JEWELLERY
                </span>
                <h4 className="text-base font-bold text-zinc-100 mb-1">
                  {productTitle}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  نقره استرلینگ دست‌ساز، سازگار با سنگ‌های اصیل معدنی و شناسنامه‌دار.
                </p>
              </div>

              {/* 1. Gemstone Variant Selector (عقیق‌ها و دُرّ نجف) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-zinc-200 uppercase tracking-wide">
                    انتخاب نگین (عقیق و دُرّ نجف):
                  </label>
                  <span className="text-[10px] text-[#E5A84B] font-mono font-bold">
                    {activeStone.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  {GEMSTONE_VARIANTS.map((gem) => {
                    const isSelected = activeStone.id === gem.id;
                    return (
                      <button
                        key={gem.id}
                        onClick={() => setActiveStone(gem)}
                        className={`w-full p-2.5 rounded-xl border text-start flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#660000]/40 border-[#C4852B] shadow-md"
                            : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-5 h-5 rounded-full border border-white/20 shadow-xs flex-shrink-0"
                            style={{ backgroundColor: gem.color }}
                          />
                          <div>
                            <p className="text-xs font-bold text-zinc-200">{gem.nameFa}</p>
                            <p className="text-[10px] text-zinc-400 font-mono">{gem.nameEn}</p>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="text-[#E5A84B] text-xs">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Silver Finish Selector */}
              <div>
                <label className="text-xs font-bold text-zinc-200 uppercase tracking-wide block mb-3">
                  نوع پرداخت و آبکاری نقره ۹۲۵:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SILVER_FINISHES.map((sil) => {
                    const isSelected = activeSilver.id === sil.id;
                    return (
                      <button
                        key={sil.id}
                        onClick={() => setActiveSilver(sil)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#C4852B]/20 border-[#C4852B] text-white"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <span className="text-[11px] font-bold block">{sil.nameFa}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ring Size Scale Slider (Specifically helpful in AR Try-On) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-300 font-semibold">
                    تنظیم مقیاس انگشتر روی دست:
                  </span>
                  <span className="font-mono text-xs text-[#E5A84B]">
                    {Math.round(ringScale * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.0"
                  step="0.05"
                  value={ringScale}
                  onChange={(e) => setRingScale(parseFloat(e.target.value))}
                  className="w-full accent-[#C4852B] cursor-pointer"
                />
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>عیار تضمین شده:</span>
                <span className="font-mono text-white font-bold">SILVER 925 STERLING</span>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-gradient-to-r from-[#660000] to-[#800000] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:from-[#7A0000] hover:to-[#990000] transition-all shadow-md cursor-pointer border border-[#C4852B]/40"
              >
                تأیید و بازگشت به سفارش
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

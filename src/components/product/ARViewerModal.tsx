"use client";

import React, { useState, useRef, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useAppStore } from "@/store/useAppStore";
import { Product } from "@/data/products";

interface ARViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

// Gemstone options (All from user notes: Agate & Durr-e Najaf)
const gemstones = [
  { id: "durr", nameFa: "دُرّ نجف شیشه‌ای", nameEn: "Clear Durr-e Najaf", color: "#F0F8FF", transmission: 0.95, roughness: 0.05, ior: 1.54 },
  { id: "kabadi", nameFa: "عقیق کبدی اصیل", nameEn: "Liver / Deep Agate", color: "#4A0E0E", transmission: 0.45, roughness: 0.15, ior: 1.6 },
  { id: "red", nameFa: "عقیق سرخ یمنی", nameEn: "Yemeni Red Agate", color: "#8B0000", transmission: 0.6, roughness: 0.1, ior: 1.62 },
  { id: "jade", nameFa: "عقیق یشمی طبیعی", nameEn: "Green Jade Agate", color: "#1B4D3E", transmission: 0.4, roughness: 0.2, ior: 1.58 },
  { id: "sousani", nameFa: "عقیق سوسنی (آبی)", nameEn: "Lavender / Blue Agate", color: "#7B68EE", transmission: 0.55, roughness: 0.12, ior: 1.56 },
];

const metals = [
  { id: "silver", nameFa: "نقره استرلینگ ۹۲۵ صیقلی", nameEn: "Mirror 925 Silver", color: "#E8E8E8", metalness: 0.96, roughness: 0.08 },
  { id: "antique", nameFa: "نقره سیاه قلم سنتی", nameEn: "Antique Oxidized Silver", color: "#A0A0A0", metalness: 0.85, roughness: 0.35 },
  { id: "vermeil", nameFa: "روکش آب زرگری رودیوم", nameEn: "Gold Vermeil Accent", color: "#D4AF37", metalness: 0.92, roughness: 0.14 },
];

function ModelMesh({ gem, metal }: { gem: typeof gemstones[0]; metal: typeof metals[0] }) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF("/models/ring-opt.glb");

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  const scene = useMemo(() => {
    if (!gltf || !gltf.scene) return null;
    const clone = gltf.scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
        const isGem = mat?.name?.toLowerCase().includes("crystal") || mesh.name.includes("Object_0");
        if (isGem) {
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(gem.color),
            roughness: gem.roughness,
            metalness: 0.05,
            transmission: gem.transmission,
            transparent: true,
            opacity: 0.95,
            ior: gem.ior,
            clearcoat: 1.0,
            clearcoatRoughness: 0.08,
          });
        } else {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(metal.color),
            metalness: metal.metalness,
            roughness: metal.roughness,
          });
        }
      }
    });
    return clone;
  }, [gltf, gem, metal]);

  if (scene) {
    return (
      <group ref={groupRef} position={[0, -0.1, 0]}>
        <primitive object={scene} scale={1.25} />
      </group>
    );
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 925 Sterling Silver Ring Shank */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[1.35, 0.18, 32, 64]} />
        <meshStandardMaterial
          color={metal.color}
          metalness={metal.metalness}
          roughness={metal.roughness}
        />
      </mesh>

      {/* Engraved Crown Bezel */}
      <mesh position={[0, 1.38, 0.4]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.45, 0.35, 32]} />
        <meshStandardMaterial
          color={metal.color}
          metalness={metal.metalness}
          roughness={metal.roughness}
        />
      </mesh>

      {/* Selected Gemstone (Durr-e Najaf or Agate) */}
      <mesh position={[0, 1.52, 0.45]}>
        <octahedronGeometry args={[0.48, 2]} />
        <meshPhysicalMaterial
          color={gem.color}
          roughness={gem.roughness}
          metalness={0.05}
          transmission={gem.transmission}
          transparent={true}
          opacity={0.92}
          ior={gem.ior}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/ring-opt.glb");

export default function ARViewerModal({ isOpen, onClose, product }: ARViewerModalProps) {
  const { language, addToCart } = useAppStore();
  const [activeTab, setActiveTab] = useState<"3d" | "camera">("3d");
  const [selectedGem, setSelectedGem] = useState(gemstones[0]);
  const [selectedMetal, setSelectedMetal] = useState(metals[0]);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [ringScale, setRingScale] = useState(1);
  const [ringPos, setRingPos] = useState({ x: 50, y: 50 });
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle camera start/stop
  useEffect(() => {
    if (activeTab === "camera" && isOpen) {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          setCameraStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setCameraError(language === "fa" ? "امکان دسترسی به دوربین فراهم نشد. لطفاً مجوز دوربین را فعال کنید." : "Camera access declined or unavailable.");
        });
    } else {
      if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
        setCameraStream(null);
      }
    }

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [activeTab, isOpen, language]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#1A1816] rounded-3xl overflow-hidden shadow-2xl border border-[#C4852B]/40 flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 bg-[#FAF9F5] dark:bg-[#141312]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C4852B] animate-pulse"></span>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-zinc-950 dark:text-white uppercase tracking-wider">
                {language === "fa" ? "مشاهده سه‌بعدی و پرو هوشمند واقعیت افزوده (AR)" : "3D & AI Virtual Try-On Studio"}
              </h3>
              <p className="text-[10px] text-[#A06314] font-mono">
                {product.nameFa || product.nameEn} • عیار ۹۲۵ استرلینگ
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-black dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex items-center justify-center gap-2 p-2 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab("3d")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === "3d"
                ? "bg-[#660000] text-white shadow-md scale-102"
                : "text-zinc-600 dark:text-zinc-400 hover:text-black"
            }`}
          >
            {language === "fa" ? "✦ مدل سه‌بعدی ۳۶۰ درجه" : "✦ Interactive 3D Model"}
          </button>
          <button
            onClick={() => setActiveTab("camera")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === "camera"
                ? "bg-[#660000] text-white shadow-md scale-102"
                : "text-zinc-600 dark:text-zinc-400 hover:text-black"
            }`}
          >
            {language === "fa" ? "📷 تست واقعیت افزوده روی دست (AR)" : "📷 Virtual Hand Camera AR"}
          </button>
        </div>

        {/* Viewer Workspace */}
        <div className="relative flex-1 min-h-[350px] sm:min-h-[420px] bg-gradient-to-b from-[#FAF9F5] to-[#F0EDE6] dark:from-[#1A1816] dark:to-[#0F0E0D] overflow-hidden flex items-center justify-center">
          
          {activeTab === "3d" ? (
            <div className="w-full h-full relative">
              <Canvas camera={{ position: [0, 1.2, 4.5], fov: 45 }}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[5, 10, 5]} intensity={2.5} color="#FFFFFF" />
                <directionalLight position={[-5, 5, -5]} intensity={1.5} color="#FFF2D6" />
                <pointLight position={[0, -2, 2]} intensity={1} color="#C4852B" />
                
                <Suspense fallback={null}>
                  <Center>
                    <ModelMesh gem={selectedGem} metal={selectedMetal} />
                  </Center>
                </Suspense>

                <OrbitControls enableZoom={true} minDistance={2.5} maxDistance={7} autoRotate={false} />
              </Canvas>

              {/* Interaction Hint */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-white font-mono pointer-events-none tracking-widest uppercase">
                {language === "fa" ? "برای چرخش ۳۶۰ درجه انگشتر لمس یا درگ کنید" : "Drag or touch to rotate 360°"}
              </div>
            </div>
          ) : (
            /* Virtual Hand AR Camera View */
            <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-zinc-950">
              {cameraError ? (
                /* Fallback virtual hand illustration */
                <div className="flex flex-col items-center justify-center text-center p-6 text-zinc-300">
                  <div className="relative w-64 h-80 border-2 border-dashed border-[#C4852B]/60 rounded-3xl flex items-center justify-center bg-zinc-900/50">
                    <img 
                      src="/images/campaign_durr_agate_ring.jpg"
                      alt="Virtual Hand Preview"
                      className="w-36 h-36 object-contain drop-shadow-[0_10px_20px_rgba(196,133,43,0.4)] animate-pulse"
                      style={{ transform: `scale(${ringScale})` }}
                    />
                    <span className="absolute bottom-3 text-[10px] text-[#C4852B] font-mono">
                      {language === "fa" ? "پیش‌نمایش مجازی روی دست" : "Simulated Hand Preview"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-4 max-w-sm">
                    {cameraError}
                  </p>
                </div>
              ) : (
                <div className="w-full h-full relative">
                  <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Floating AR Ring Overlay */}
                  <div 
                    className="absolute cursor-move select-none"
                    style={{
                      left: `${ringPos.x}%`,
                      top: `${ringPos.y}%`,
                      transform: `translate(-50%, -50%) scale(${ringScale})`
                    }}
                    onMouseDown={(e) => {
                      const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                      if (!rect) return;
                      const onMove = (me: MouseEvent) => {
                        setRingPos({
                          x: ((me.clientX - rect.left) / rect.width) * 100,
                          y: ((me.clientY - rect.top) / rect.height) * 100
                        });
                      };
                      const onUp = () => {
                        window.removeEventListener("mousemove", onMove);
                        window.removeEventListener("mouseup", onUp);
                      };
                      window.addEventListener("mousemove", onMove);
                      window.addEventListener("mouseup", onUp);
                    }}
                  >
                    <img 
                      src="/images/campaign_durr_agate_ring.jpg"
                      alt="AR Ring"
                      className="w-28 h-28 object-contain rounded-2xl drop-shadow-2xl border border-[#C4852B]/40"
                    />
                  </div>

                  {/* Size and Position Controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 bg-black/75 backdrop-blur-md rounded-2xl text-xs text-white">
                    <span>{language === "fa" ? "تنظیم اندازه انگشتر:" : "Adjust Ring Size:"}</span>
                    <input 
                      type="range"
                      min={0.6}
                      max={1.8}
                      step={0.05}
                      value={ringScale}
                      onChange={(e) => setRingScale(parseFloat(e.target.value))}
                      className="w-32 accent-[#C4852B]"
                    />
                    <span className="text-[10px] text-zinc-300 font-mono">
                      {language === "fa" ? "انگشتر را روی دست جابجا کنید" : "Drag to position on hand"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Customization Options Bar */}
        <div className="p-4 sm:p-6 bg-white dark:bg-[#141312] border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          
          {/* Gemstone Picker */}
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#660000] uppercase font-bold block mb-2">
              {language === "fa" ? "انتخاب نگین طبیعی (عقیق اصیل / دُرّ نجف):" : "Select Natural Gemstone:"}
            </span>
            <div className="flex flex-wrap gap-2">
              {gemstones.map((gem) => (
                <button
                  key={gem.id}
                  onClick={() => setSelectedGem(gem)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    selectedGem.id === gem.id
                      ? "border-[#660000] bg-[#660000] text-white shadow-sm scale-105"
                      : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-[#C4852B]"
                  }`}
                >
                  <span 
                    className="w-3 h-3 rounded-full border border-black/20" 
                    style={{ backgroundColor: gem.color }}
                  />
                  <span>{language === "fa" ? gem.nameFa : gem.nameEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Metal Finish Picker */}
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#A06314] uppercase font-bold block mb-2">
              {language === "fa" ? "پرداخت نهایی نقره استرلینگ ۹۲۵:" : "Silver Finish:"}
            </span>
            <div className="flex flex-wrap gap-2">
              {metals.map((metal) => (
                <button
                  key={metal.id}
                  onClick={() => setSelectedMetal(metal)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    selectedMetal.id === metal.id
                      ? "border-[#A06314] bg-[#A06314] text-white shadow-sm scale-105"
                      : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-[#A06314]"
                  }`}
                >
                  <span 
                    className="w-3 h-3 rounded-full border border-black/20" 
                    style={{ backgroundColor: metal.color }}
                  />
                  <span>{language === "fa" ? metal.nameFa : metal.nameEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div>
              <span className="text-[10px] text-zinc-500 block">
                {language === "fa" ? "قیمت با نگین انتخابی:" : "Price with selection:"}
              </span>
              <span className="font-mono text-base font-bold text-[#C4852B]">
                {product.price.toLocaleString()} تومان
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  addToCart({
                    id: product.id,
                    name: `${product.nameFa} (${selectedGem.nameFa})`,
                    price: product.price,
                    image: product.image,
                    category: product.categoryFa,
                    material: `${product.materialFa} - ${selectedMetal.nameFa}`
                  });
                  onClose();
                }}
                className="px-6 py-2.5 bg-[#660000] hover:bg-[#7D0000] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer"
              >
                {language === "fa" ? "افزودن همین مدل به سبد خرید" : "Add Customized to Bag"}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

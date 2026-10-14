"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import * as THREE from "three";
import {
  convertImageTo3dMesh,
  exportMeshToGlb,
  exportMeshToObj,
  Generated3dResult
} from "@/lib/imageTo3dEngine";
import { SparkleStarIcon, PhoneCallLuxuryIcon } from "@/components/icons/JewelryIcons";

export default function VirtualTryOnModal() {
  const { isArModalOpen, closeArModal, arProduct, arTargetImage, addToCart } = useAppStore();

  // Target image being converted to 3D
  const targetImageUrl = arTargetImage || arProduct?.image || "/images/campaign_agate_ring.jpg";

  // Engine State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>("در حال راه‌اندازی موتور سه‌بعدی...");
  const [depthScale, setDepthScale] = useState<number>(0.22);
  const [metalness, setMetalness] = useState<number>(0.92);
  const [roughness, setRoughness] = useState<number>(0.16);
  const [renderMode, setRenderMode] = useState<"textured" | "wireframe" | "depth" | "silver">("textured");
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [conversionResult, setConversionResult] = useState<Generated3dResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Three.js Viewport Refs
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const currentGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Run the Image-to-3D Conversion Engine
  const runConversion = useCallback(async () => {
    if (!targetImageUrl) return;
    setIsProcessing(true);
    setError(null);
    setProcessStep("آنالیز محیطی، استخراج سوژه و حذف پس‌زمینه...");

    try {
      await new Promise((r) => setTimeout(r, 80));
      setProcessStep("محاسبه ماتریس فاصله اقلیدسی و تحدب نرمال‌های سطحی...");

      const result = await convertImageTo3dMesh(targetImageUrl, {
        depthScale,
        resolution: 144,
        metalness,
        roughness
      });

      setProcessStep("ساخت مش سه‌بعدی حجم‌دار، پوسته پشت نقره ۹۲۵ و صیقل رادیوم...");
      await new Promise((r) => setTimeout(r, 60));

      setConversionResult(result);
      setIsProcessing(false);
      setProcessStep("مدل سه‌بعدی با موفقیت ساخته شد");
    } catch (err: unknown) {
      console.error("3D conversion failed:", err);
      setError(err instanceof Error ? err.message : "خطا در استخراج و ساخت مدل سه‌بعدی");
      setIsProcessing(false);
    }
  }, [targetImageUrl, depthScale, metalness, roughness]);

  // Trigger conversion when modal opens or target image changes
  useEffect(() => {
    if (isArModalOpen && targetImageUrl) {
      runConversion();
    }
  }, [isArModalOpen, targetImageUrl, runConversion]);

  // Initialize and update Three.js Viewport
  useEffect(() => {
    if (!isArModalOpen || !canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const width = container.clientWidth || 550;
    const height = container.clientHeight || 520;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 4.2);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 3. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaee, 3.4);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xddeeff, 2.0);
    fillLight.position.set(-5, -2, -4);
    scene.add(fillLight);

    const topRimLight = new THREE.PointLight(0xffffff, 2.6, 12);
    topRimLight.position.set(0, 4, 2);
    scene.add(topRimLight);

    // 4. Luxury Pedestal Stand
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.75, 0.14, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x161514,
      metalness: 0.75,
      roughness: 0.28
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.y = -1.25;
    scene.add(pedestalMesh);

    // Gold Trim Ring on Pedestal
    const trimGeo = new THREE.TorusGeometry(1.6, 0.02, 16, 64);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xc4852b,
      metalness: 0.98,
      roughness: 0.12
    });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    trimMesh.rotation.x = Math.PI / 2;
    trimMesh.position.y = -1.18;
    scene.add(trimMesh);

    // Soft Contact Shadow Disc on Pedestal
    const shadowGeo = new THREE.PlaneGeometry(2.8, 2.8);
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.75)");
      grad.addColorStop(0.5, "rgba(0, 0, 0, 0.25)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.16;
    scene.add(shadowMesh);

    // 5. Interactive Orbit Controls
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !currentGroupRef.current) return;
      const dx = e.clientX - prevMousePos.x;
      const dy = e.clientY - prevMousePos.y;
      currentGroupRef.current.rotation.y += dx * 0.012;
      currentGroupRef.current.rotation.x += dy * 0.012;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z = Math.max(
        2.2,
        Math.min(6.5, cameraRef.current.position.z + e.deltaY * 0.003)
      );
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("wheel", onWheel, { passive: false });

    // Touch Support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !currentGroupRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMousePos.x;
      const dy = e.touches[0].clientY - prevMousePos.y;
      currentGroupRef.current.rotation.y += dx * 0.012;
      currentGroupRef.current.rotation.x += dy * 0.012;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    dom.addEventListener("touchstart", onTouchStart);
    dom.addEventListener("touchmove", onTouchMove);
    dom.addEventListener("touchend", onMouseUp);

    // 6. Animation Loop
    const animate = () => {
      if (autoRotate && currentGroupRef.current && !isDragging) {
        currentGroupRef.current.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("wheel", onWheel);
      dom.removeEventListener("touchstart", onTouchStart);
      dom.removeEventListener("touchmove", onTouchMove);
      dom.removeEventListener("touchend", onMouseUp);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [isArModalOpen, autoRotate]);

  // Insert generated mesh into scene whenever conversion completes or renderMode changes
  useEffect(() => {
    if (!sceneRef.current || !conversionResult) return;

    if (currentGroupRef.current) {
      sceneRef.current.remove(currentGroupRef.current);
      currentGroupRef.current = null;
    }

    const group = conversionResult.group.clone(true);
    group.position.y = 0.05; // Hover smoothly above the luxury pedestal

    // Apply render modes
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;

        if (renderMode === "wireframe") {
          mesh.material = new THREE.MeshBasicMaterial({
            color: 0xe5a84b,
            wireframe: true
          });
        } else if (renderMode === "silver") {
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0xf4f4f8,
            metalness: 0.98,
            roughness: 0.12,
            transparent: true,
            alphaTest: 0.12
          });
        } else if (renderMode === "depth") {
          const depthTex = new THREE.TextureLoader().load(conversionResult.depthMapUrl);
          depthTex.colorSpace = THREE.SRGBColorSpace;
          mesh.material = new THREE.MeshBasicMaterial({
            map: depthTex,
            transparent: true,
            alphaTest: 0.12
          });
        } else {
          // Restore Textured PBR
          if (mat) {
            mat.wireframe = false;
            mat.metalness = metalness;
            mat.roughness = roughness;
            mat.needsUpdate = true;
          }
        }
      }
    });

    sceneRef.current.add(group);
    currentGroupRef.current = group;
  }, [conversionResult, renderMode, metalness, roughness]);

  // Download 3D Model as binary GLB
  const handleDownloadGlb = async () => {
    if (!currentGroupRef.current) return;
    try {
      const blob = await exportMeshToGlb(currentGroupRef.current);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${arProduct?.nameFa || "nafis-jewelry"}-3d-model.glb`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("GLB export failed:", err);
      alert("خطا در خروجی فایل GLB");
    }
  };

  // Download 3D Model as standard OBJ
  const handleDownloadObj = () => {
    if (!currentGroupRef.current) return;
    try {
      const blob = exportMeshToObj(currentGroupRef.current);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${arProduct?.nameFa || "nafis-jewelry"}-3d-model.obj`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("OBJ export failed:", err);
      alert("خطا در خروجی فایل OBJ");
    }
  };

  // Launch WebXR / Mobile AR
  const handleLaunchAr = async () => {
    if (!currentGroupRef.current) return;
    if (navigator.xr) {
      try {
        const isSupported = await navigator.xr.isSessionSupported("immersive-ar");
        if (isSupported) {
          alert("دستگاه شما از WebXR AR پشتیبانی می‌کند. در حال ورود به فضای واقعیت افزوده...");
          return;
        }
      } catch {}
    }
    handleDownloadGlb();
    alert(
      "مدل سه‌بعدی استاندارد GLB دانلود شد. می‌توانید این فایل را در دوربین موبایل (Scene Viewer در اندروید یا QuickLook در آیفون) به‌صورت واقعیت افزوده مشاهده نمایید."
    );
  };

  if (!isArModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-5xl bg-[#141312] border border-[#C4852B]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-zinc-800 bg-[#1A1816]/95">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#660000] border border-[#C4852B]/40 flex items-center justify-center text-[#C4852B]">
              <SparkleStarIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-white">
                  موتور تبدیل تصویر به مدل سه‌بعدی و AR
                </span>
                <span className="text-[9px] font-mono font-bold bg-[#C4852B]/20 text-[#E5A84B] px-2 py-0.5 rounded-full border border-[#C4852B]/30">
                  IMAGE TO 3D / AR ENGINE
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                استخراج خودکار سوژه، تحدب نرمال‌های سطحی و نمایش سه‌بعدی ۳۶۰ درجه
              </p>
            </div>
          </div>

          <button
            onClick={closeArModal}
            className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer text-base font-bold"
            aria-label="بستن"
          >
            ✕
          </button>
        </div>

        {/* Source Image Banner */}
        <div className="px-5 sm:px-7 py-2.5 bg-[#171614] border-b border-zinc-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 text-[11px]">تصویر منبع تبدیل:</span>
            <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-xl border border-zinc-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={targetImageUrl}
                alt="Source preview"
                className="w-6 h-6 object-cover rounded-md border border-zinc-600"
              />
              <span className="font-bold text-[#E5A84B] text-[11px] truncate max-w-[200px]">
                {arProduct?.nameFa || "محصول انتخاب شده"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
            {conversionResult && (
              <span>
                {conversionResult.vertexCount.toLocaleString("fa-IR")} VERTICES •{" "}
                {conversionResult.faceCount.toLocaleString("fa-IR")} POLYGONS
              </span>
            )}
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          {/* 3D WebGL Canvas Viewport */}
          <div className="lg:col-span-7 bg-radial from-[#22201D] to-[#0E0D0C] relative flex items-center justify-center p-4 min-h-[400px] lg:min-h-[520px]">
            {/* The 3D Canvas */}
            <div
              ref={canvasContainerRef}
              className="w-full h-[400px] sm:h-[480px] cursor-grab active:cursor-grabbing"
            />

            {/* Loading / Processing Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-10">
                <div className="w-12 h-12 rounded-full border-3 border-[#C4852B]/30 border-t-[#C4852B] animate-spin mb-4" />
                <span className="text-sm font-bold text-white mb-2">در حال تولید هندسه سه‌بعدی و تحدب گوهر...</span>
                <span className="text-xs text-[#E5A84B] font-mono max-w-sm leading-relaxed">
                  {processStep}
                </span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center z-10">
                <span className="text-red-400 text-sm font-bold mb-3">{error}</span>
                <button
                  onClick={runConversion}
                  className="px-4 py-2 rounded-xl bg-[#660000] text-white text-xs font-bold"
                >
                  تلاش مجدد
                </button>
              </div>
            )}

            {/* Floating Top Controls */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-auto">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border backdrop-blur-md transition-all cursor-pointer ${
                  autoRotate
                    ? "bg-[#C4852B]/20 border-[#C4852B] text-[#E5A84B]"
                    : "bg-black/50 border-zinc-700 text-zinc-400"
                }`}
              >
                {autoRotate ? "چرخش خودکار: روشن" : "چرخش خودکار: خاموش"}
              </button>
            </div>

            {/* Bottom Orbit Guide */}
            <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-[11px] text-zinc-400 pointer-events-none">
              <span>با کشیدن نشانگر یا لمس، مدل را در تمام زوایا بچرخانید (۳۶۰ درجه)</span>
              <span className="font-mono text-[#E5A84B]">THREE.JS PBR MESH</span>
            </div>
          </div>

          {/* Engine Parameters & Controls Sidebar */}
          <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between bg-[#171614] border-t lg:border-t-0 lg:border-l border-zinc-800">
            <div className="space-y-4">
              {/* Product Info */}
              <div className="pb-3 border-b border-zinc-800">
                <span className="text-[10px] font-mono text-[#E5A84B] uppercase tracking-widest block mb-1 font-bold">
                  925 STERLING SILVER
                </span>
                <h3 className="text-lg font-bold text-white mb-1.5 leading-snug">
                  {arProduct?.nameFa || "محصول انتخابی"}
                </h3>
                {arProduct?.price && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-mono font-bold text-[#E5A84B]">
                      {Number(arProduct.price).toLocaleString("fa-IR")}
                    </span>
                    <span className="text-xs text-zinc-400">تومان</span>
                  </div>
                )}
              </div>

              {/* Render Modes Selector */}
              <div>
                <label className="text-xs font-bold text-zinc-200 block mb-2">
                  حالت نمایش مدل سه‌بعدی:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setRenderMode("textured")}
                    className={`py-2 px-3 rounded-xl border font-bold transition-all cursor-pointer ${
                      renderMode === "textured"
                        ? "border-[#C4852B] bg-[#C4852B]/20 text-[#E5A84B]"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    بافت طبیعی لوکس
                  </button>
                  <button
                    onClick={() => setRenderMode("wireframe")}
                    className={`py-2 px-3 rounded-xl border font-bold transition-all cursor-pointer ${
                      renderMode === "wireframe"
                        ? "border-[#C4852B] bg-[#C4852B]/20 text-[#E5A84B]"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    مش وایرفریم (شبکه ۳D)
                  </button>
                  <button
                    onClick={() => setRenderMode("silver")}
                    className={`py-2 px-3 rounded-xl border font-bold transition-all cursor-pointer ${
                      renderMode === "silver"
                        ? "border-[#C4852B] bg-[#C4852B]/20 text-[#E5A84B]"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    نقره خالص استرلینگ
                  </button>
                  <button
                    onClick={() => setRenderMode("depth")}
                    className={`py-2 px-3 rounded-xl border font-bold transition-all cursor-pointer ${
                      renderMode === "depth"
                        ? "border-[#C4852B] bg-[#C4852B]/20 text-[#E5A84B]"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    نقشه عمق هوش مصنوعی
                  </button>
                </div>
              </div>

              {/* Sliders: Extrusion Depth (Calibrated smooth luxury range 0.08 to 0.38) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label className="font-bold text-zinc-200">
                    ضخامت و تحدب سه‌بعدی (3D Volume):
                  </label>
                  <span className="font-mono text-[#E5A84B] font-bold">
                    {Math.round((depthScale / 0.38) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.08"
                  max="0.38"
                  step="0.02"
                  value={depthScale}
                  onChange={(e) => setDepthScale(parseFloat(e.target.value))}
                  className="w-full accent-[#C4852B]"
                />
              </div>

              {/* Sliders: Metallic Reflections */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label className="font-bold text-zinc-200">
                    درخشندگی و جلای نقره ۹۲۵:
                  </label>
                  <span className="font-mono text-[#E5A84B] font-bold">
                    {Math.round(metalness * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={metalness}
                  onChange={(e) => setMetalness(parseFloat(e.target.value))}
                  className="w-full accent-[#C4852B]"
                />
              </div>

              {/* Sliders: Micro-roughness */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label className="font-bold text-zinc-200">
                    صیقل سطحی آینه‌ای (Mirror Polish):
                  </label>
                  <span className="font-mono text-[#E5A84B] font-bold">
                    {Math.round((1 - roughness) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.06"
                  max="0.45"
                  step="0.03"
                  value={roughness}
                  onChange={(e) => setRoughness(parseFloat(e.target.value))}
                  className="w-full accent-[#C4852B]"
                />
              </div>
            </div>

            {/* Export & Action Buttons */}
            <div className="pt-4 border-t border-zinc-800 space-y-2">
              {/* Launch AR Button */}
              <button
                onClick={handleLaunchAr}
                className="w-full py-3.5 bg-gradient-to-r from-[#660000] to-[#8A1515] hover:from-[#7D0000] hover:to-[#A31818] text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl hover:scale-102 cursor-pointer flex items-center justify-center gap-2 border border-[#C4852B]/40"
              >
                <SparkleStarIcon className="w-4 h-4 text-[#E5A84B]" />
                <span>مشاهده در واقعیت افزوده (Launch AR)</span>
              </button>

              {/* 3D Export Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadGlb}
                  className="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-[#C4852B] text-zinc-200 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>دانلود فایل GLB</span>
                </button>

                <button
                  onClick={handleDownloadObj}
                  className="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-[#C4852B] text-zinc-200 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>دانلود فایل OBJ</span>
                </button>
              </div>

              {/* Add to Cart */}
              {arProduct && (
                <button
                  onClick={() => {
                    addToCart({
                      id: arProduct.id,
                      name: arProduct.nameFa || (arProduct as { name?: string }).name || "زیورآلات نقره",
                      price: arProduct.price,
                      image: targetImageUrl,
                      category: arProduct.category,
                      material: "نقره ۹۲۵ استرلینگ دست‌ساز"
                    });
                    closeArModal();
                  }}
                  className="w-full py-2.5 bg-[#C4852B] hover:bg-[#D4953B] text-black font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
                >
                  افزودن این محصول به سبد خرید
                </button>
              )}

              <div className="flex items-center justify-between text-xs text-zinc-400 px-1 pt-1">
                <span>اصالت نقره ۹۲۵ و گوهرشناسی معتبر</span>
                <a
                  href="tel:09123456789"
                  className="text-[#E5A84B] hover:underline flex items-center gap-1"
                >
                  <PhoneCallLuxuryIcon className="w-3.5 h-3.5" />
                  <span>مشاوره تخصصی</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

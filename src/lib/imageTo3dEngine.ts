import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter.js";

export interface ImageTo3dOptions {
  depthScale?: number; // 0.08 to 0.4 (thickness of volume)
  resolution?: number; // 128 to 160
  metalness?: number; // 0.5 to 1.0
  roughness?: number; // 0.05 to 0.5
}

export interface Generated3dResult {
  group: THREE.Group;
  width: number;
  height: number;
  depthMapUrl: string;
  textureCanvas: HTMLCanvasElement;
  vertexCount: number;
  faceCount: number;
}

/**
 * Loads an image (handling both relative paths and URLs) and returns an HTMLImageElement
 */
export async function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image for 3D conversion: ${url}`));
    img.src = url;
  });
}

/**
 * High-End Luxury Image-to-3D Reconstruction Engine
 * Uses adaptive perimeter background segmentation + Euclidean Distance Transform
 * to inflate the jewelry silhouette into a perfectly smooth, convex, organic 3D shape (zero spikes).
 */
export async function convertImageTo3dMesh(
  imageUrl: string,
  options: ImageTo3dOptions = {}
): Promise<Generated3dResult> {
  const depthScale = options.depthScale ?? 0.22;
  const resolution = options.resolution ?? 144;
  const metalness = options.metalness ?? 0.92;
  const roughness = options.roughness ?? 0.16;

  // 1. Load image
  const img = await loadImageElement(imageUrl);

  // 2. Prepare analysis & texture canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not initialize 2D canvas context");

  const aspect = img.width / img.height;
  const gridW = resolution;
  const gridH = Math.round(resolution / aspect);

  canvas.width = gridW;
  canvas.height = gridH;
  ctx.drawImage(img, 0, 0, gridW, gridH);

  const imgData = ctx.getImageData(0, 0, gridW, gridH);
  const data = imgData.data;

  // 3. Adaptive Perimeter Background Segmentation
  // Sample perimeter border pixels (top, bottom, left, right)
  let bgR = 0, bgG = 0, bgB = 0, bgCount = 0;
  for (let x = 0; x < gridW; x++) {
    for (const y of [0, 1, 2, gridH - 3, gridH - 2, gridH - 1]) {
      const idx = (y * gridW + x) * 4;
      bgR += data[idx]; bgG += data[idx + 1]; bgB += data[idx + 2];
      bgCount++;
    }
  }
  for (let y = 0; y < gridH; y++) {
    for (const x of [0, 1, 2, gridW - 3, gridW - 2, gridW - 1]) {
      const idx = (y * gridW + x) * 4;
      bgR += data[idx]; bgG += data[idx + 1]; bgB += data[idx + 2];
      bgCount++;
    }
  }
  bgR /= bgCount; bgG /= bgCount; bgB /= bgCount;

  // Threshold distance for background removal
  const bgThreshold = 38;
  const mask = new Uint8Array(gridW * gridH);

  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const idx = (y * gridW + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const dist = Math.sqrt(
        Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
      );

      // Distance from center (in range 0..1)
      const nx = (x / (gridW - 1)) * 2 - 1;
      const ny = (y / (gridH - 1)) * 2 - 1;
      const distFromCenter = Math.sqrt(nx * nx + ny * ny);

      // Border safety: perimeter edges are definitely background
      if (distFromCenter > 0.95 || dist < bgThreshold) {
        data[idx + 3] = 0; // Transparent background!
        mask[y * gridW + x] = 0;
      } else {
        // Smooth alpha edge feathering
        const edgeFactor = Math.min(1, Math.max(0, (dist - bgThreshold) / 20));
        data[idx + 3] = Math.round(255 * edgeFactor);
        mask[y * gridW + x] = edgeFactor > 0.3 ? 1 : 0;
      }
    }
  }

  // Put transparent cut-out back into the canvas
  ctx.putImageData(imgData, 0, 0);

  // 4. Euclidean Distance Transform on the foreground mask
  // Calculates distance to the nearest boundary edge for smooth convex inflation
  const distGrid = new Float32Array(gridW * gridH);
  for (let i = 0; i < distGrid.length; i++) {
    distGrid[i] = mask[i] > 0 ? 9999 : 0;
  }

  // Pass 1: Top-Left to Bottom-Right
  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const idx = y * gridW + x;
      if (distGrid[idx] > 0) {
        const left = x > 0 ? distGrid[idx - 1] + 1 : 9999;
        const top = y > 0 ? distGrid[idx - gridW] + 1 : 9999;
        const topLeft = x > 0 && y > 0 ? distGrid[idx - gridW - 1] + 1.414 : 9999;
        const topRight = x < gridW - 1 && y > 0 ? distGrid[idx - gridW + 1] + 1.414 : 9999;
        distGrid[idx] = Math.min(distGrid[idx], left, top, topLeft, topRight);
      }
    }
  }

  // Pass 2: Bottom-Right to Top-Left
  let maxDistance = 0;
  for (let y = gridH - 1; y >= 0; y--) {
    for (let x = gridW - 1; x >= 0; x--) {
      const idx = y * gridW + x;
      if (distGrid[idx] > 0) {
        const right = x < gridW - 1 ? distGrid[idx + 1] + 1 : 9999;
        const bottom = y < gridH - 1 ? distGrid[idx + gridW] + 1 : 9999;
        const botRight = x < gridW - 1 && y < gridH - 1 ? distGrid[idx + gridW + 1] + 1.414 : 9999;
        const botLeft = x > 0 && y < gridH - 1 ? distGrid[idx + gridW - 1] + 1.414 : 9999;
        distGrid[idx] = Math.min(distGrid[idx], right, bottom, botRight, botLeft);
        if (distGrid[idx] > maxDistance) maxDistance = distGrid[idx];
      }
    }
  }

  // 5. Calculate Smooth Convex Depth Array
  const depthGrid = new Float32Array(gridW * gridH);
  const depthCanvas = document.createElement("canvas");
  depthCanvas.width = gridW;
  depthCanvas.height = gridH;
  const depthCtx = depthCanvas.getContext("2d");
  const depthImgData = depthCtx?.createImageData(gridW, gridH);

  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const idx = y * gridW + x;
      const d = distGrid[idx];
      const pIdx = idx * 4;

      if (d <= 0 || maxDistance === 0) {
        depthGrid[idx] = 0;
        if (depthImgData) {
          depthImgData.data[pIdx] = 10;
          depthImgData.data[pIdx + 1] = 10;
          depthImgData.data[pIdx + 2] = 12;
          depthImgData.data[pIdx + 3] = 255;
        }
      } else {
        // Smooth trigonometric dome: sin(d / maxD * PI / 2)
        // Tangent slope at the peak is 0 (ZERO spikes, perfectly flat/smooth top dome)
        const normD = Math.min(1, d / maxDistance);
        const dome = Math.sin(normD * (Math.PI / 2));

        // Subtle micro-surface relief from image luminance (only 5% to catch normal specular reflections)
        const lum = (0.299 * data[pIdx] + 0.587 * data[pIdx + 1] + 0.114 * data[pIdx + 2]) / 255;
        const micro = (lum - 0.5) * 0.05 * normD;

        const finalZ = Math.max(0, dome * depthScale + micro);
        depthGrid[idx] = finalZ;

        if (depthImgData) {
          const val = Math.round(normD * 255);
          depthImgData.data[pIdx] = Math.round(val * 0.9);
          depthImgData.data[pIdx + 1] = Math.round(val * 0.7);
          depthImgData.data[pIdx + 2] = Math.round(val * 0.3);
          depthImgData.data[pIdx + 3] = 255;
        }
      }
    }
  }

  if (depthCtx && depthImgData) {
    depthCtx.putImageData(depthImgData, 0, 0);
  }

  // 6. Smooth Gaussian 3x3 Box Blur on the Depth Grid to guarantee C1 tangent continuity
  const smoothedDepth = new Float32Array(gridW * gridH);
  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const idx = y * gridW + x;
      if (depthGrid[idx] === 0) {
        smoothedDepth[idx] = 0;
        continue;
      }
      let sum = 0, count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (nx >= 0 && nx < gridW && ny >= 0 && ny < gridH) {
            const nVal = depthGrid[ny * gridW + nx];
            if (nVal > 0) {
              sum += nVal;
              count++;
            }
          }
        }
      }
      smoothedDepth[idx] = count > 0 ? sum / count : depthGrid[idx];
    }
  }

  // 7. Build Volumetric 3D Model in Three.js
  const group = new THREE.Group();

  const width = aspect >= 1 ? 2.4 : 2.4 * aspect;
  const height = aspect >= 1 ? 2.4 / aspect : 2.4;

  // Front Geometry
  const frontGeo = new THREE.PlaneGeometry(width, height, gridW - 1, gridH - 1);
  const posAttr = frontGeo.attributes.position;

  for (let i = 0; i < posAttr.count; i++) {
    const rawX = i % gridW;
    const rawY = Math.floor(i / gridW);
    const gridY = gridH - 1 - rawY; // Invert Y for Three.js coordinates
    const z = smoothedDepth[gridY * gridW + rawX] || 0;
    posAttr.setZ(i, z);
  }
  frontGeo.computeVertexNormals();

  // Texture with Transparent Background
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;

  // Front PBR Material
  const frontMat = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.12,
    metalness: metalness,
    roughness: roughness,
    side: THREE.FrontSide
  });

  const frontMesh = new THREE.Mesh(frontGeo, frontMat);
  group.add(frontMesh);

  // Back Solid Silver Plate (encloses the 3D jewelry back)
  const backGeo = new THREE.PlaneGeometry(width, height, gridW - 1, gridH - 1);
  const backPosAttr = backGeo.attributes.position;
  for (let i = 0; i < backPosAttr.count; i++) {
    const rawX = i % gridW;
    const rawY = Math.floor(i / gridW);
    const gridY = gridH - 1 - rawY;
    const z = smoothedDepth[gridY * gridW + rawX] || 0;
    // Invert Z backwards to give solid thickness
    backPosAttr.setZ(i, -z * 0.4);
  }
  backGeo.computeVertexNormals();

  const backMat = new THREE.MeshStandardMaterial({
    color: 0xdedee6,
    metalness: 0.96,
    roughness: 0.18,
    side: THREE.BackSide,
    transparent: true,
    alphaTest: 0.12,
    alphaMap: texture
  });
  const backMesh = new THREE.Mesh(backGeo, backMat);
  group.add(backMesh);

  // Center the 3D jewelry piece at (0, 0, 0)
  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  group.position.sub(center);

  return {
    group,
    width,
    height,
    depthMapUrl: depthCanvas.toDataURL(),
    textureCanvas: canvas,
    vertexCount: posAttr.count * 2,
    faceCount: (frontGeo.index?.count || 0) / 3 * 2
  };
}

/**
 * Exports Three.js 3D Model to binary .glb format
 */
export async function exportMeshToGlb(group: THREE.Group): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      group,
      (gltf) => {
        if (gltf instanceof ArrayBuffer) {
          resolve(new Blob([gltf], { type: "model/gltf-binary" }));
        } else {
          const output = JSON.stringify(gltf, null, 2);
          resolve(new Blob([output], { type: "application/json" }));
        }
      },
      (error) => reject(error),
      { binary: true }
    );
  });
}

/**
 * Exports Three.js 3D Model to standard .obj format
 */
export function exportMeshToObj(group: THREE.Group): Blob {
  const exporter = new OBJExporter();
  const result = exporter.parse(group);
  return new Blob([result], { type: "text/plain" });
}

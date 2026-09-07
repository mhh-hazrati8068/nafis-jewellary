global.self = global;

async function run() {
  const THREE = await import("three");
  const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
  const fs = await import("fs");

  const buffer = fs.readFileSync("public/models/an-old-ring.glb");
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

  const loader = new GLTFLoader();
  loader.parse(arrayBuffer, "", (gltf) => {
    let mesh;
    gltf.scene.traverse((c) => { if (c.isMesh) mesh = c; });
    const geom = mesh.geometry;
    mesh.updateMatrixWorld(true);

    const testAngles = [
      { name: "Image 1 (3/4 top angle)", rx: -0.62, ry: -0.28, rz: -0.05 },
      { name: "Image 2 (Front portal hole)", rx: -1.28, ry: 0.135, rz: 0.018 },
    ];

    testAngles.forEach(({ name, rx, ry, rz }) => {
      const euler = new THREE.Euler(rx, ry, rz, 'YXZ');
      const q = new THREE.Quaternion().setFromEuler(euler);
      
      const v = new THREE.Vector3();
      const pos = geom.attributes.position;
      let min = new THREE.Vector3(Infinity, Infinity, Infinity);
      let max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
      
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        v.applyMatrix4(mesh.matrixWorld);
        v.applyQuaternion(q);
        min.min(v);
        max.max(v);
      }
      
      const size = new THREE.Vector3().subVectors(max, min);
      console.log(`${name}:`);
      console.log(`  Size: [${size.x.toFixed(2)}, ${size.y.toFixed(2)}, ${size.z.toFixed(2)}]`);
      console.log(`  Bounds: min=[${min.x.toFixed(2)}, ${min.y.toFixed(2)}, ${min.z.toFixed(2)}], max=[${max.x.toFixed(2)}, ${max.y.toFixed(2)}, ${max.z.toFixed(2)}]`);
    });
  });
}

run();

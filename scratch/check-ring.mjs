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
    const pos = geom.attributes.position;
    const norm = geom.attributes.normal;
    const index = geom.index;
    mesh.updateMatrixWorld(true);
    
    // Average normal of the flat face (where z > 0.8)
    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vC = new THREE.Vector3();
    const cb = new THREE.Vector3();
    const ab = new THREE.Vector3();
    
    let sumNormal = new THREE.Vector3();
    let count = 0;
    
    for (let i = 0; i < index.count; i += 3) {
      const a = index.getX(i);
      const b = index.getX(i + 1);
      const c = index.getX(i + 2);
      vA.fromBufferAttribute(pos, a).applyMatrix4(mesh.matrixWorld);
      vB.fromBufferAttribute(pos, b).applyMatrix4(mesh.matrixWorld);
      vC.fromBufferAttribute(pos, c).applyMatrix4(mesh.matrixWorld);
      cb.subVectors(vC, vB);
      ab.subVectors(vA, vB);
      cb.cross(ab).normalize();
      
      if (cb.z > 0.8) {
        sumNormal.add(cb);
        count++;
      }
    }
    
    const faceNormal = sumNormal.divideScalar(count).normalize();
    console.log("Average face normal:", faceNormal, "count:", count);
    
    // We want a rotation R such that R * faceNormal = [0, 0, 1]
    const target = new THREE.Vector3(0, 0, 1);
    const q = new THREE.Quaternion().setFromUnitVectors(faceNormal, target);
    const euler = new THREE.Euler().setFromQuaternion(q, 'YXZ');
    console.log("Euler to face camera directly (YXZ radians):", euler.x, euler.y, euler.z);
    console.log("In degrees:", euler.x * 180 / Math.PI, euler.y * 180 / Math.PI, euler.z * 180 / Math.PI);
  });
}

run();

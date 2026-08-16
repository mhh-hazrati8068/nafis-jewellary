const fs = require('fs');
const path = require('path');

// Read GLTF JSON
const gltfPath = path.join(__dirname, '../public/models/diamond_engagement_ring/scene.gltf');
const binPath = path.join(__dirname, '../public/models/diamond_engagement_ring/scene.bin');
const outputPath = path.join(__dirname, '../public/models/ring.glb');

const gltf = JSON.parse(fs.readFileSync(gltfPath, 'utf8'));
const bin = fs.readFileSync(binPath);

// Convert GLTF + BIN into a single binary GLB buffer
// GLB Structure:
// Header: 12 bytes (magic 0x46546C67, version 2, length)
// Chunk 0: JSON (type 0x4E4F534A, length, data)
// Chunk 1: BIN (type 0x004E4942, length, data)

// Modify GLTF buffer uri
delete gltf.buffers[0].uri;
gltf.buffers[0].byteLength = bin.length;

const jsonString = JSON.stringify(gltf);
// Pad JSON to 4-byte boundary
let jsonBuffer = Buffer.from(jsonString, 'utf8');
const jsonPadding = (4 - (jsonBuffer.length % 4)) % 4;
if (jsonPadding > 0) {
  jsonBuffer = Buffer.concat([jsonBuffer, Buffer.alloc(jsonPadding, 0x20)]);
}

// Pad BIN to 4-byte boundary
const binPadding = (4 - (bin.length % 4)) % 4;
let paddedBinBuffer = bin;
if (binPadding > 0) {
  paddedBinBuffer = Buffer.concat([bin, Buffer.alloc(binPadding, 0x00)]);
}

const totalLength = 12 + 8 + jsonBuffer.length + 8 + paddedBinBuffer.length;

const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546C67, 0); // "glTF"
header.writeUInt32LE(2, 4);          // version 2
header.writeUInt32LE(totalLength, 8);

const jsonHeader = Buffer.alloc(8);
jsonHeader.writeUInt32LE(jsonBuffer.length, 0);
jsonHeader.writeUInt32LE(0x4E4F534A, 4); // "JSON"

const binHeader = Buffer.alloc(8);
binHeader.writeUInt32LE(paddedBinBuffer.length, 0);
binHeader.writeUInt32LE(0x004E4942, 4); // "BIN\0"

const glbBuffer = Buffer.concat([
  header,
  jsonHeader,
  jsonBuffer,
  binHeader,
  paddedBinBuffer
]);

fs.writeFileSync(outputPath, glbBuffer);
console.log(`Successfully packed GLB: ${outputPath} (${(glbBuffer.length / 1024).toFixed(1)} KB)`);

const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// CRC32 implementation
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)) >>> 0;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const crcVal = crc32(buf.subarray(4, 8 + len));
  buf.writeUInt32BE(crcVal, 8 + len);
  return buf;
}

function generateIconPNG(size, outputPath) {
  // Raw RGBA scanlines with filter byte 0 at start of each line
  const rawData = Buffer.alloc(size * (size * 4 + 1));
  
  const bgR = 15, bgG = 118, bgB = 110; // #0f766e (Teal)
  const domeR = 255, domeG = 255, domeB = 255;
  const goldR = 251, goldG = 191, goldB = 36; // #fbbf24 (Gold)

  for (let y = 0; y < size; y++) {
    const rowOffset = y * (size * 4 + 1);
    rawData[rowOffset] = 0; // Filter: None
    
    for (let x = 0; x < size; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      
      // Normalized coordinates -1 to 1
      const nx = (x / (size - 1)) * 2 - 1;
      const ny = (y / (size - 1)) * 2 - 1;
      
      // Rounded corner squircle
      const rDist = Math.pow(Math.abs(nx), 3.5) + Math.pow(Math.abs(ny), 3.5);
      
      if (rDist > 1.0) {
        // Transparent outside rounded icon
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
        continue;
      }
      
      // Default background teal with subtle gradient
      const grad = (ny + 1) * 0.15;
      let r = Math.min(255, Math.round(bgR + grad * 30));
      let g = Math.min(255, Math.round(bgG + grad * 40));
      let b = Math.min(255, Math.round(bgB + grad * 40));
      let a = 255;
      
      // Mosque visual
      // Dome: centered around nx=0, ny between -0.2 and 0.15
      const domeDx = nx / 0.38;
      const domeDy = (ny - 0.12) / 0.38;
      const inDome = (domeDy <= 0) && (domeDx * domeDx + domeDy * domeDy <= 1);
      
      // Mosque body: rectangle nx between -0.42 and 0.42, ny between 0.12 and 0.55
      const inBody = (Math.abs(nx) <= 0.42 && ny >= 0.12 && ny <= 0.55);
      
      // Mosque door: arch at bottom
      const inDoor = (Math.abs(nx) <= 0.14 && ny >= 0.30 && ny <= 0.55);
      
      // Minarets: left and right towers
      const inLeftTower = (nx >= -0.58 && nx <= -0.46 && ny >= -0.15 && ny <= 0.55);
      const inRightTower = (nx >= 0.46 && nx <= 0.58 && ny >= -0.15 && ny <= 0.55);
      
      // Crescent moon & star (Gold) near top (ny between -0.55 and -0.32, nx centered)
      const moonDx = nx / 0.15;
      const moonDy = (ny + 0.42) / 0.15;
      const inOuterMoon = (moonDx * moonDx + moonDy * moonDy <= 1);
      const inInnerMoon = ((moonDx - 0.35) * (moonDx - 0.35) + (moonDy + 0.25) * (moonDy + 0.25) <= 0.7);
      const inCrescent = inOuterMoon && !inInnerMoon;

      if (inCrescent) {
        r = goldR; g = goldG; b = goldB;
      } else if (inDoor) {
        r = bgR - 10; g = bgG - 20; b = bgB - 20;
      } else if (inDome || inBody || inLeftTower || inRightTower) {
        r = domeR; g = domeG; b = domeB;
      }
      
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const compressedData = zlib.deflateSync(rawData);
  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  const pngBuf = Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(outputPath, pngBuf);
  console.log(`Generated icon: ${outputPath} (${size}x${size})`);
}

generateIconPNG(192, path.join(__dirname, 'icon-192.png'));
generateIconPNG(512, path.join(__dirname, 'icon-512.png'));

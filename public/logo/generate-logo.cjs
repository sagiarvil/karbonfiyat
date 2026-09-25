'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  table[i] = c >>> 0;
}

function processLogo() {
  const userUploadPath = '/Users/macair1/.gemini/antigravity/brain/93b1729a-b67a-4d35-8d44-98d99cdbbfbc/.user_uploaded/media_1790324019480.png';
  if (!fs.existsSync(userUploadPath)) {
    console.warn('[LOGO-PROCESS] User uploaded image not found at', userUploadPath);
    return;
  }

  const raw = fs.readFileSync(userUploadPath);
  if (raw.readUInt32BE(0) !== 0x89504E47 || raw.readUInt32BE(4) !== 0x0D0A1A0A) {
    console.warn('[LOGO-PROCESS] Invalid PNG signature');
    return;
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks = [];

  while (offset < raw.length) {
    const length = raw.readUInt32BE(offset);
    const type = raw.toString('ascii', offset + 4, offset + 8);
    const data = raw.subarray(offset + 8, offset + 8 + length);

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
    offset += 12 + length;
  }

  console.log(`[LOGO-PROCESS] Input PNG: ${width}x${height}, colorType=${colorType}, bitDepth=${bitDepth}`);

  const compressed = Buffer.concat(idatChunks);
  const decompressed = zlib.inflateSync(compressed);

  // We decode scanlines into raw RGBA
  // Supports colorType 6 (RGBA) and 2 (RGB) and 3 (Indexed) and 0 (Grayscale)
  const bytesPerPixel = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 0 ? 1 : 4;
  const stride = width * bytesPerPixel;
  const rawRgba = Buffer.alloc(width * height * 4);

  // Unfilter PNG scanlines
  let srcOffset = 0;
  const prevRow = Buffer.alloc(stride);
  const currRow = Buffer.alloc(stride);

  for (let y = 0; y < height; y++) {
    const filterType = decompressed[srcOffset++];
    for (let x = 0; x < stride; x++) {
      const rawByte = decompressed[srcOffset++];
      const a = x >= bytesPerPixel ? currRow[x - bytesPerPixel] : 0;
      const b = prevRow[x];
      const c = x >= bytesPerPixel ? prevRow[x - bytesPerPixel] : 0;

      let val = rawByte;
      if (filterType === 1) val = (rawByte + a) & 0xFF;
      else if (filterType === 2) val = (rawByte + b) & 0xFF;
      else if (filterType === 3) val = (rawByte + Math.floor((a + b) / 2)) & 0xFF;
      else if (filterType === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        const pr = (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
        val = (rawByte + pr) & 0xFF;
      }
      currRow[x] = val;
    }

    // Convert currRow to RGBA in rawRgba
    for (let x = 0; x < width; x++) {
      const outIdx = (y * width + x) * 4;
      let r = 0, g = 0, b = 0, a = 255;
      if (colorType === 6) {
        r = currRow[x * 4];
        g = currRow[x * 4 + 1];
        b = currRow[x * 4 + 2];
        a = currRow[x * 4 + 3];
      } else if (colorType === 2) {
        r = currRow[x * 3];
        g = currRow[x * 3 + 1];
        b = currRow[x * 3 + 2];
        a = 255;
      } else if (colorType === 0) {
        r = g = b = currRow[x];
        a = 255;
      }

      // Check watermark text at top: y < height * 0.05
      if (y < height * 0.05) {
        rawRgba[outIdx] = 0;
        rawRgba[outIdx + 1] = 0;
        rawRgba[outIdx + 2] = 0;
        rawRgba[outIdx + 3] = 0;
        continue;
      }

      // INVERT CONTRAST FOR DARK BACKGROUND:
      // In the source image, the arrow line is dark/black (r, g, b < 130) with opacity.
      // Background is white or transparent.
      // We invert:
      // Dark strokes become bright luminous WHITE (255, 255, 255, 255) with electric blue outline.
      // White/light background becomes completely transparent (0, 0, 0, 0).
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      const isStroke = a > 30 && brightness < 180;

      if (isStroke) {
        // Anti-aliased alpha based on darkness
        const strokeAlpha = Math.min(255, Math.round(((255 - brightness) / 255) * (a / 255) * 255 * 1.2));
        rawRgba[outIdx] = 255;     // R: Pure white
        rawRgba[outIdx + 1] = 255; // G: Pure white
        rawRgba[outIdx + 2] = 255; // B: Pure white
        rawRgba[outIdx + 3] = strokeAlpha;
      } else {
        rawRgba[outIdx] = 0;
        rawRgba[outIdx + 1] = 0;
        rawRgba[outIdx + 2] = 0;
        rawRgba[outIdx + 3] = 0;
      }
    }

    prevRow.set(currRow);
  }

  // Create new RGBA PNG
  const outScanlines = Buffer.alloc(height * (1 + width * 4));
  let destOffset = 0;
  for (let y = 0; y < height; y++) {
    outScanlines[destOffset++] = 0; // Filter 0 (None)
    const rowStart = y * width * 4;
    rawRgba.copy(outScanlines, destOffset, rowStart, rowStart + width * 4);
    destOffset += width * 4;
  }

  const outDeflated = zlib.deflateSync(outScanlines, { level: 9 });

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crcVal = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crcVal, 8 + len);
    return buf;
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 6;  // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', outDeflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const finalPng = Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);

  const targetLogoPng = path.resolve(__dirname, 'karbonfiyat-logo.png');
  const targetRootLogoPng = path.resolve(__dirname, '..', 'logo.png');

  fs.writeFileSync(targetLogoPng, finalPng);
  fs.writeFileSync(targetRootLogoPng, finalPng);

  console.log(`✅ [LOGO-PROCESS] Successfully generated inverted contrast arrow logo: ${finalPng.length} bytes`);
}

try {
  processLogo();
} catch (err) {
  console.error('[LOGO-PROCESS ERROR]', err);
}

module.exports = { processLogo };

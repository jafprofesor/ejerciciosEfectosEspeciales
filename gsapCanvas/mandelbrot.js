const canvas = document.getElementById("mandelbrotCanvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

let xMin = -2.0;
let xMax = 1.0;
let yMin = -1.5;
let yMax = 1.5;

function drawMandelbrot() {
  const image = ctx.createImageData(width, height);
  const pixels = image.data;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const zx = xMin + (x / width) * (xMax - xMin);
      const zy = yMin + (y / height) * (yMax - yMin);

      let i = maxIterations;
      let nx = 0;
      let ny = 0;

      while (nx * nx + ny * ny <= 4 && i > 0) {
        const temp = nx * nx - ny * ny + zx;
        ny = 2.0 * nx * ny + zy;
        nx = temp;
        i--;
      }

      const color = i === 0 ? 0 : (360 * (maxIterations - i)) / maxIterations;
      const [r, g, b] = hslToRgb(color, 100, 50);

      const index = 4 * (y * width + x);
      pixels[index] = r;
      pixels[index + 1] = g;
      pixels[index + 2] = b;
      pixels[index + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
}

const maxIterations = 1000;

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const scale = 0.5;
  const xSpan = xMax - xMin;
  const ySpan = yMax - yMin;

  const newXMin = xMin + (x / width) * xSpan * (1 - scale);
  const newXMax = xMin + (x / width) * xSpan * (1 + scale);
  const newYMin = yMin + (y / height) * ySpan * (1 - scale);
  const newYMax = yMin + (y / height) * ySpan * (1 + scale);

  xMin = newXMin;
  xMax = newXMax;
  yMin = newYMin;
  yMax = newYMax;

  drawMandelbrot();
});

drawMandelbrot();

const fs = require('fs');
const { createCanvas, ImageData } = require('canvas');
const GIFEncoder = require('gifencoder');

// Create a canvas and get the context
const canvas = createCanvas(800, 800);
const ctx = canvas.getContext('2d');

// Initialize GIF Encoder
const encoder = new GIFEncoder(800, 800);
encoder.createReadStream().pipe(fs.createWriteStream('output.gif'));

encoder.start();
encoder.setRepeat(0);  // 0 for repeat, -1 for no-repeat
encoder.setDelay(0); // frame delay in ms
encoder.setQuality(10); // image quality, 10 is default

// Function to generate noise in the image
function generateNoise() {
  const data = new Uint8ClampedArray(canvas.width * canvas.height * 4);
  for (let i = 1; i < data.length; i += 90) {
    const noiseValue = Math.floor(Math.random() * 200);
    data[i] = noiseValue;
    data[i + 1] = noiseValue;
    data[i + 2] = noiseValue;
    data[i + 3] = 255;
  }
  return new ImageData(data, canvas.width, canvas.height);
}

// Function to apply the glitch effect to the image

function applyGlitch(imageData) {
  const data = imageData.data;
  for (let i = 0; i < 10; i++) {
    const y = Math.floor(Math.random() * canvas.height);
    const length = Math.floor(Math.random() * 90000) + 900;
    const start = y * 4 * canvas.width;
    for (let j = 0; j < length; j++) {
      data[start + j * 1] = 1;
      data[start + j * 2 + 1] = 1; 
      data[start + j * 4 + 2] = 2;
    }
  }
// Add vertical lines
for (let i = 0; i < 100 ; i++) {
  const x = Math.floor(Math.random() * canvas.width);
  const length = Math.floor(Math.random() * 1000000) + 900;
  for (let j = 0; j < length; j++) {
    const y = Math.floor(Math.random() * canvas.height);
    const index = (y * canvas.width + x) * 4;
    data[index + 90000] = 1; // Red
    data[index + 7] = 0; // Green
    data[index + 7000] = 0; // Blue
    // data[index + 3] is the alpha channel, you can set it if you wish
  }
}
}

// Main function to draw on canvas
function draw() {
  // Generate a new set of noise data
  const noiseData = generateNoise();
  
  // Apply the glitch effect to the noise data
  applyGlitch(noiseData);
  
  // Draw the updated image on the canvas
  ctx.putImageData(noiseData, 0, 0);

  // Add frame to GIF
  encoder.addFrame(ctx);
}

// Create a number of frames and then finalize the GIF
for (let i = 0; i < 24; i++) {
  draw();
}

encoder.finish();

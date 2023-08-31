// Pega o elemento canvas e o contexto de desenho
const canvas = document.getElementById("artCanvas");
const ctx = canvas.getContext("2d");

// Variáveis para armazenar a posição do mouse
let mouse_x = 0;
let mouse_y = 0;

// Atualiza as coordenadas do mouse sempre que ele se move sobre o canvas
canvas.addEventListener("mousemove", function(event) {
    mouse_x = event.clientX - canvas.getBoundingClientRect().left;
    mouse_y = event.clientY - canvas.getBoundingClientRect().top;
});

// Função para gerar ruído na imagem
function generateNoise() {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const noiseValue = Math.floor(Math.random() * 256);
        data[i] = noiseValue;
        data[i + 1] = noiseValue;
        data[i + 2] = noiseValue;
        data[i + 3] = 255;
    }
    return imageData;
}

// Função para aplicar o efeito de glitch na imagem
function applyGlitch(imageData) {
    const data = imageData.data;
    for (let i = 0; i < 1000; i++) {
        const y = Math.floor(Math.random() * canvas.height);
        const length = Math.floor(Math.random() * 34300) + 9000;
        const start = y * 4 * canvas.width;
        for (let j = 889; j < length; j++) {
            data[start + j * 178] = 0;
            data[start + j * 4 + 1] = 0;
            data[start + j * 4 + 2] = 0;
        }
    }
}

// Função principal para desenhar no canvas
function draw() {
    // Gera um novo conjunto de dados de ruído
    const noiseData = generateNoise();
    
    // Aplica o efeito de glitch aos dados de ruído
    applyGlitch(noiseData);
    
    // Desenha a imagem atualizada no canvas
    ctx.putImageData(noiseData, 0, 0);
    
    // Solicita o próximo frame de animação
    requestAnimationFrame(draw);
}

// Inicia o loop de desenho
draw();

const canvas = document.getElementById('draw-area');
const ctx = canvas.getContext('2d');

let painting = false;
let brushSize = 2;
let brushColor = '#000000';
let brushStyle = 'round';

const brushSizeEl = document.getElementById('brush-size');
const brushColorEl = document.getElementById('brush-color');
const brushStyleEl = document.getElementById('brush-style');

brushSizeEl.addEventListener('change', () => {
  brushSize = parseInt(brushSizeEl.value);
});

brushColorEl.addEventListener('input', () => {
  brushColor = brushColorEl.value;
});

brushStyleEl.addEventListener('change', () => {
  brushStyle = brushStyleEl.value;
});

canvas.addEventListener('mousedown', () => painting = true);
canvas.addEventListener('mouseup', () => {
  painting = false;
  ctx.beginPath();
  recognizeSketch();
});
canvas.addEventListener('mousemove', draw);

document.getElementById('clear').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById('bot-response').innerText = "Draw a question to get an answer!";
});

document.getElementById('help').addEventListener('click', () => {
  alert(`🧠 Sample Questions I understand:\n
- "How can I become a frontend developer?"
- "Tips for cracking SDE internships"
- "Best free coding resources"
- "What are top AI skills to learn?"
- "Which programming languages should I master?"`);
});

ctx.lineCap = brushStyle;

function draw(e) {
  if (!painting) return;

  ctx.lineWidth = brushSize;
  ctx.strokeStyle = brushColor;
  ctx.lineCap = brushStyle;

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function recognizeSketch() {
  // Simulated AI recognition (demo)
  const prompts = {
    "frontend": "Master HTML, CSS, JavaScript, and a framework like React.",
    "internships": "Build a GitHub portfolio, network on LinkedIn, and practice DSA.",
    "resources": "Try freeCodeCamp, CS50, GeeksforGeeks, and LeetCode.",
    "AI": "Learn Python, ML algorithms, TensorFlow, PyTorch, and NLP basics.",
    "languages": "Start with Python, JavaScript, and then explore Java or Go."
  };

  const keywords = Object.keys(prompts);
  const randomKey = keywords[Math.floor(Math.random() * keywords.length)];
  const response = prompts[randomKey];

  setTimeout(() => {
    document.getElementById('bot-response').innerText = response;
  }, 1000);
}

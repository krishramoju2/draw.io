const canvas = document.getElementById('draw-area');
const ctx = canvas.getContext('2d');

let painting = false;
let brushSize = 2;
let brushColor = '#000000';
let brushStyle = 'round';
let fontEffect = 'smooth';
let bgStyle = 'plain';

const brushSizeEl = document.getElementById('brush-size');
const brushColorEl = document.getElementById('brush-color');
const brushStyleEl = document.getElementById('brush-style');
const fontStyleEl = document.getElementById('font-style');
const bgStyleEl = document.getElementById('bg-style');

brushSizeEl.addEventListener('change', () => brushSize = parseInt(brushSizeEl.value));
brushColorEl.addEventListener('input', () => brushColor = brushColorEl.value);
brushStyleEl.addEventListener('change', () => brushStyle = brushStyleEl.value);
fontStyleEl.addEventListener('change', () => fontEffect = fontStyleEl.value);
bgStyleEl.addEventListener('change', () => {
  bgStyle = bgStyleEl.value;
  applyBackground();
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
  applyBackground();
  document.getElementById('bot-response').innerText = "Draw a question to get an answer!";
});

document.getElementById('help').addEventListener('click', () => {
  alert(`🧠 Sample Questions I understand:\n
- How can I become a frontend developer?
- Tips for cracking SDE internships
- Best free coding resources
- What are top AI skills to learn?
- Which programming languages should I master?
- How to get into Google or FAANG?
- Should I learn React or Angular?
- What is the best roadmap for data science?
- What are good open source projects for beginners?
- How do I build a resume with no experience?`);
});

function draw(e) {
  if (!painting) return;

  ctx.lineCap = brushStyle;
  ctx.strokeStyle = brushColor;
  ctx.lineWidth = brushSize;

  const x = e.offsetX;
  const y = e.offsetY;

  switch (fontEffect) {
    case 'smooth':
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      break;
    case 'dotted':
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = brushColor;
      ctx.fill();
      break;
    case 'sketchy':
      ctx.lineTo(x + Math.random() * 2 - 1, y + Math.random() * 2 - 1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      break;
    case 'spray':
      for (let i = 0; i < 10; i++) {
        const offsetX = Math.random() * brushSize - brushSize / 2;
        const offsetY = Math.random() * brushSize - brushSize / 2;
        ctx.fillStyle = brushColor;
        ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
      }
      break;
    case 'fur':
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.random() * 10 - 5, y + Math.random() * 10 - 5);
        ctx.stroke();
      }
      break;
    case 'neon':
      ctx.shadowColor = brushColor;
      ctx.shadowBlur = 10;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.shadowBlur = 0;
      break;
    case 'glow':
      ctx.shadowColor = brushColor;
      ctx.shadowBlur = 20;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.shadowBlur = 0;
      break;
    case 'ink':
      ctx.globalAlpha = 0.3 + Math.random() * 0.7;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.globalAlpha = 1;
      break;
    case 'drip':
      ctx.lineTo(x, y);
      ctx.stroke();
      if (Math.random() > 0.95) {
        ctx.beginPath();
        ctx.arc(x, y + 10, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.moveTo(x, y);
      break;
    case 'calligraphy':
      ctx.lineTo(x + brushSize / 2, y - brushSize / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      break;
  }
}

function applyBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  switch (bgStyle) {
    case 'plain':
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      break;

    case 'grid':
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#e0e0e0';
      for (let x = 0; x < canvas.width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      break;

    case 'dots':
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#c0c0c0';
      for (let x = 10; x < canvas.width; x += 25) {
        for (let y = 10; y < canvas.height; y += 25) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;

    case 'ruled':
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#add8e6';
      for (let y = 20; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      break;

    case 'gradient':
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#f8f8ff');
      gradient.addColorStop(1, '#e0f7fa');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      break;
  }
}

function recognizeSketch() {
  const prompts = {
    "frontend": "Master HTML, CSS, JS, and frameworks like React or Vue.",
    "internships": "Build projects, contribute to GitHub, and practice LeetCode.",
    "resources": "Use freeCodeCamp, GeeksforGeeks, CS50, and LeetCode daily.",
    "AI": "Learn Python, ML, NLP, deep learning with TensorFlow or PyTorch.",
    "languages": "Start with Python, then JavaScript or Go. Explore Rust for performance.",
    "faang": "Strong DSA, systems design, real projects, and mock interviews are key.",
    "roadmap": "Python → Numpy/Pandas → ML → DL → Projects → Kaggle → Resume.",
    "open source": "Find beginner-friendly issues on GitHub via 'good first issue' tag.",
    "resume": "Highlight GitHub, skills, projects. No filler words—show impact.",
    "cloud": "Start with AWS, deploy apps, learn CI/CD tools like GitHub Actions."
  };

  const keywords = Object.keys(prompts);
  const randomKey = keywords[Math.floor(Math.random() * keywords.length)];
  const response = prompts[randomKey];

  setTimeout(() => {
    document.getElementById('bot-response').innerText = response;
  }, 1000);
}

// Initialize background on load
applyBackground();


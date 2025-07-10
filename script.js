const canvas = document.getElementById('draw-area');
const ctx = canvas.getContext('2d');

let painting = false;
let brushSize = 2;
let brushColor = '#000000';
let brushStyle = 'round';
let fontEffect = 'smooth';

const brushSizeEl = document.getElementById('brush-size');
const brushColorEl = document.getElementById('brush-color');
const brushStyleEl = document.getElementById('brush-style');
const fontStyleEl = document.getElementById('font-style');

brushSizeEl.addEventListener('change', () => brushSize = parseInt(brushSizeEl.value));
brushColorEl.addEventListener('input', () => brushColor = brushColorEl.value);
brushStyleEl.addEventListener('change', () => brushStyle = brushStyleEl.value);
fontStyleEl.addEventListener('change', () => fontEffect = fontStyleEl.value);

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
      ctx.lineWidth = brushSize;
      ctx.lineTo(x + brushSize / 2, y - brushSize / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      break;
  }
}

function recognizeSketch() {
  const prompts = {
    "frontend": "Master HTML, CSS, JavaScript, and frameworks like React.",
    "internships": "Contribute to GitHub, attend hackathons, and practice LeetCode daily.",
    "resources": "Explore freeCodeCamp, CS50, Odin Project, GeeksforGeeks, and Khan Academy.",
    "AI": "Learn ML, DL, NLP with Python, TensorFlow, HuggingFace, and real datasets.",
    "languages": "Top picks: Python, JavaScript, Go, Rust, and Java depending on domain.",
    "faang": "Focus on DSA, systems design, and mock interviews. Use LeetCode & InterviewBit.",
    "roadmap": "Start with Python → Pandas → ML → DL → Projects → Portfolio → Apply!",
    "open source": "Try EddieHub, GirlScript, MLH, or issues labeled 'good first issue' on GitHub.",
    "resume": "Highlight projects, online courses, GitHub activity, and clear achievements.",
    "cloud": "Learn AWS, GCP or Azure basics. Get hands-on with deployments and CI/CD."
  };

  const keywords = Object.keys(prompts);
  const randomKey = keywords[Math.floor(Math.random() * keywords.length)];
  const response = prompts[randomKey];

  setTimeout(() => {
    document.getElementById('bot-response').innerText = response;
  }, 1000);
}

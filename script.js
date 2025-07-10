const canvas = document.getElementById('draw-area');
const ctx = canvas.getContext('2d');

let painting = false;
let brushSize = 2;
let brushColor = '#000000';
let brushStyle = 'round';
let brushType = 'smooth';

const brushSizeEl = document.getElementById('brush-size');
const brushColorEl = document.getElementById('brush-color');
const brushStyleEl = document.getElementById('brush-style');
const brushTypeEl = document.getElementById('font-style');
const bgStyleEl = document.getElementById('bg-style');

brushSizeEl.addEventListener('change', () => {
  brushSize = parseInt(brushSizeEl.value);
});

brushColorEl.addEventListener('input', () => {
  brushColor = brushColorEl.value;
});

brushStyleEl.addEventListener('change', () => {
  brushStyle = brushStyleEl.value;
});

brushTypeEl.addEventListener('change', () => {
  brushType = brushTypeEl.value;
});

bgStyleEl.addEventListener('change', () => {
  applyBackground(bgStyleEl.value);
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
  applyBackground(bgStyleEl.value);
});

document.getElementById('help').addEventListener('click', () => {
  alert(`🧠 Sample Questions I understand:\n
  - “How do I become a frontend/backend/fullstack developer?”
  - “Best sites to learn AI/DSA/Git/cloud/etc.”
  - “Top languages, tools, frameworks in 2025”
  - “Internship, career advice, cracking interviews”
  - “Portfolio/project hosting, open source, design tools”
  - “Switching careers, staying motivated, time management”
  - and more!`);
});

function draw(e) {
  if (!painting) return;

  ctx.lineWidth = brushSize;
  ctx.strokeStyle = brushColor;
  ctx.lineCap = brushStyle;

  switch (brushType) {
    case 'dotted':
      ctx.beginPath();
      ctx.arc(e.offsetX, e.offsetY, brushSize / 2, 0, 2 * Math.PI);
      ctx.fillStyle = brushColor;
      ctx.fill();
      break;
    case 'spray':
      for (let i = 0; i < 10; i++) {
        const offsetX = e.offsetX + Math.random() * brushSize - brushSize / 2;
        const offsetY = e.offsetY + Math.random() * brushSize - brushSize / 2;
        ctx.fillRect(offsetX, offsetY, 1, 1);
      }
      break;
    default:
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
  }
}

// Background options
function applyBackground(type) {
  const bg = canvas;
  switch (type) {
    case 'grid':
      bg.style.backgroundImage = "linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)";
      bg.style.backgroundSize = "20px 20px";
      break;
    case 'dots':
      bg.style.backgroundImage = "radial-gradient(#ccc 1px, transparent 1px)";
      bg.style.backgroundSize = "20px 20px";
      break;
    case 'ruled':
      bg.style.backgroundImage = "repeating-linear-gradient(#ccc 0 1px, transparent 1px 25px)";
      break;
    case 'gradient':
      bg.style.backgroundImage = "linear-gradient(135deg, #f0f0f0, #ffffff)";
      break;
    case 'paper':
      bg.style.backgroundImage = "url('https://www.transparenttextures.com/patterns/paper-fibers.png')";
      break;
    default:
      bg.style.backgroundColor = '#ffffff';
      bg.style.backgroundImage = '';
  }
}

// 🔍 Vast prompt support
function recognizeSketch() {
  const sketchText = generateRandomSketchKeyword(); // replace with OCR if real
  const responses = [
    { keywords: ["frontend", "web dev"], msg: "Learn HTML, CSS, JavaScript, and React or Vue." },
    { keywords: ["backend", "server"], msg: "Node.js, Express, Django or FastAPI are solid choices." },
    { keywords: ["fullstack"], msg: "Combine frontend + backend, often with MERN or Django stack." },
    { keywords: ["ai", "machine", "ml"], msg: "Start with Python, learn sklearn, TensorFlow, NLP, and DL." },
    { keywords: ["data science", "ds"], msg: "Python, pandas, matplotlib, and real-world datasets." },
    { keywords: ["internship", "job", "resume"], msg: "Build projects, use LinkedIn, and tailor your resume." },
    { keywords: ["cloud", "aws", "azure", "gcp"], msg: "Start with free tiers, then dive into certifications." },
    { keywords: ["git", "github", "version"], msg: "Learn basic Git commands and collaborate on GitHub." },
    { keywords: ["design", "figma", "ui"], msg: "Figma and Canva are great for wireframes and UI mocks." },
    { keywords: ["youtube", "channels"], msg: "Check out Fireship, CodeWithHarry, Amigoscode, Dev Ed." },
    { keywords: ["opensource"], msg: "Start with beginner-friendly repos tagged 'good first issue'." },
    { keywords: ["portfolio", "host"], msg: "Use GitHub Pages, Netlify, or Vercel to deploy sites." },
    { keywords: ["roadmap"], msg: "Explore roadmap.sh for structured dev learning paths." },
    { keywords: ["motivation", "focus"], msg: "Break tasks down, join dev communities, celebrate progress." },
    { keywords: ["tools", "editors"], msg: "VS Code, Git, Chrome DevTools, and Postman are essential." },
    { keywords: ["crack", "interview"], msg: "Practice LeetCode, mock interviews, and behavioral Qs." },
    { keywords: ["freelance"], msg: "Use platforms like Upwork, Fiverr, and Toptal. Build a portfolio." },
    { keywords: ["time", "manage"], msg: "Try Pomodoro, Notion for planning, and daily 3-goal rule." },
    { keywords: ["career", "switch"], msg: "Start with Python, build small apps, get certs, show work." },
    { keywords: ["learning", "start"], msg: "Start small, stay consistent, build one project per topic." },
  ];

  let matched = "Sorry! Couldn't recognize that. Try a clearer sketch or hit Help.";

  for (let item of responses) {
    if (item.keywords.some(k => sketchText.toLowerCase().includes(k))) {
      matched = item.msg;
      break;
    }
  }

  setTimeout(() => {
    document.getElementById('bot-response').innerText = matched;
  }, 1000);
}

// Simulate OCR sketch recognition
function generateRandomSketchKeyword() {
  const keywords = [
    "frontend", "backend", "fullstack", "ml", "cloud", "interview", "github",
    "design", "roadmap", "motivation", "career switch", "opensource", "tools",
    "figma", "ui", "ai", "aws", "resume", "youtube", "data science"
  ];
  return keywords[Math.floor(Math.random() * keywords.length)];
}

// 💡 Fun Fact Rotator
const facts = [
  "Calligraphy comes from the Greek 'kallos' and 'graphe'.",
  "Arabic calligraphy is a major form of Islamic art.",
  "Japanese Shodō means 'the way of writing'.",
  "Brush pens replaced bamboo and ink in modern calligraphy.",
  "Roman capital letters inspire many modern fonts.",
  "Chinese calligraphy dates back over 4000 years.",
  "Calligraphy boosts mindfulness and patience.",
  "Fur and neon brushes make digital calligraphy vibrant.",
  "In Korea, calligraphy is a spiritual tradition.",
  "Italic script was created during the Renaissance.",
  "Copperplate is still used for certificates today.",
  "You can now do calligraphy on tablets with styluses!",
  "Brush lettering is trending on Instagram and Etsy.",
  "Many logos use hand-drawn calligraphy fonts.",
  "Arabic scripts are often found in mosque decor.",
  "Gothic styles dominated medieval Europe manuscripts.",
  "Calligraphy is considered visual art in Japan.",
  "Script fonts evolved from real calligraphy styles.",
  "Modern calligraphy mixes graffiti, cursive, and typography.",
  "Calligraphy can be therapeutic and meditative."
];

function rotateFacts() {
  const factText = document.getElementById('fact-text');
  let i = 0;
  setInterval(() => {
    factText.textContent = facts[i % facts.length];
    i++;
  }, 10000);
}

rotateFacts();
applyBackground('plain');

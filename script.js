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
- “Switching careers, staying motivated, time management”`);
});

// ✨ Drawing function
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

// 🌈 Background style selector
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

// 🕰️ Time Machine - Store Prompt History
const promptHistory = [];

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleString();
}

// 🧠 Prompt recognizer with expanded responses
function recognizeSketch() {
  const sketchPrompt = generateRandomSketchKeyword();
  const promptMap = {
    "frontend": "Learn HTML, CSS, JS & React for frontend dev.",
    "backend": "Explore Node.js, Express or Django for backend.",
    "fullstack": "Master both frontend and backend. MERN is great.",
    "ai": "Get started with Python, scikit-learn, and real datasets.",
    "cloud": "Learn AWS/GCP, deploy projects, try certifications.",
    "git": "Use GitHub, master commits, branches and pull requests.",
    "resume": "Tailor it to job roles. Use Teal, Zety, or Rezi.",
    "interview": "Practice on LeetCode, InterviewBit, Pramp.",
    "opensource": "Contribute to GitHub projects with 'good first issue'.",
    "ds": "Practice pandas, NumPy, Seaborn, and machine learning.",
    "figma": "Great for UI/UX prototyping — use auto-layout and components.",
    "devops": "Learn CI/CD, Docker, GitHub Actions, and cloud automation."
  };

  const response = promptMap[sketchPrompt] || "Unrecognized sketch! Try drawing text from a real question.";
  document.getElementById('bot-response').innerText = response;

  promptHistory.push({ prompt: response, time: getCurrentTime() });
  updatePromptHistoryUI();
}

// 🧾 Update Time Machine Log
function updatePromptHistoryUI() {
  const list = document.getElementById('history-list');
  list.innerHTML = '';
  promptHistory.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `[${entry.time}] ${entry.prompt}`;
    list.appendChild(li);
  });
}

// 🔠 Simulated keyword from sketch (random for now)
function generateRandomSketchKeyword() {
  const samples = [
    "frontend", "backend", "ai", "git", "interview", "resume", "cloud", "opensource",
    "fullstack", "figma", "ds", "devops"
  ];
  return samples[Math.floor(Math.random() * samples.length)];
}

// ✨ Fun Fact Rotator
const facts = [
  "Calligraphy means 'beautiful writing' in Greek.",
  "Japanese calligraphy is known as Shodō.",
  "Roman capital letters inspired Western calligraphy.",
  "Modern calligraphy is popular on social media.",
  "Arabic calligraphy is both text and art.",
  "Calligraphy promotes mindfulness and concentration.",
  "Copperplate and Gothic scripts remain popular today.",
  "Calligraphy tools evolved from reeds to styluses.",
  "Chinese calligraphy dates back 4000+ years.",
  "Brush lettering is booming on Etsy & Pinterest."
];

function rotateFacts() {
  const el = document.getElementById('fact-text');
  let i = 0;
  setInterval(() => {
    el.textContent = facts[i % facts.length];
    i++;
  }, 10000);
}

rotateFacts();
applyBackground('plain');


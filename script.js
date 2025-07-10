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

// Brush config events
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
- "How can I become a frontend developer?"
- "Tips for cracking SDE internships"
- "Best free coding resources"
- "What are top AI skills to learn?"
- "Which programming languages should I master?"
- "Is open source important?"
- "How do I build a portfolio?"
- "What are best design tools?"
- "Where can I learn DSA?"
- "Which company is best for interns?"
- "How to crack interviews?"
- "How to stay motivated as a developer?"
- "Is ChatGPT useful for coding?"
- "How to switch from non-CS to tech?"
- "Should I learn cloud computing?"
- "Which platform to publish projects?"
- "Best YouTube channels to learn dev?"
- "Frontend vs Backend vs Fullstack?"
- "How do I contribute to open source?"
- "What’s the best way to learn Git?"`);
});

// Drawing function
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
    case 'fur':
      for (let i = 0; i < 20; i++) {
        let offsetX = e.offsetX + Math.random() * 10 - 5;
        let offsetY = e.offsetY + Math.random() * 10 - 5;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      }
      break;
    case 'glow':
      ctx.shadowColor = brushColor;
      ctx.shadowBlur = 15;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
      break;
    case 'neon':
      ctx.shadowColor = '#0ff';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = brushColor;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
      break;
    case 'zigzag':
      ctx.lineTo(e.offsetX + 3, e.offsetY + (Math.random() * 4 - 2));
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
      break;
    case 'dashline':
      ctx.setLineDash([10, 10]);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
      ctx.setLineDash([]);
      break;
    default:
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
  }
}

// Background styles
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
    case 'blueprint':
      bg.style.backgroundColor = '#1e3a5f';
      bg.style.backgroundImage = "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)";
      bg.style.backgroundSize = "20px 20px";
      break;
    case 'chalkboard':
      bg.style.backgroundColor = '#2c2c2c';
      bg.style.backgroundImage = "none";
      break;
    case 'graph':
      bg.style.backgroundImage = "linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)";
      bg.style.backgroundSize = "40px 40px";
      break;
    default:
      bg.style.backgroundColor = '#ffffff';
      bg.style.backgroundImage = '';
  }
}

// Simulated AI response
function recognizeSketch() {
  const prompts = {
    frontend: "Master HTML, CSS, JS & React for frontend dev.",
    internships: "Build projects, practice DSA & network online.",
    resources: "freeCodeCamp, CS50, GFG, and LeetCode are great!",
    AI: "Learn Python, ML/DL frameworks, and real datasets.",
    languages: "Start with Python, then explore JS, Go, or Rust.",
    opensource: "GitHub and Hacktoberfest are good starting points.",
    portfolio: "Host projects on GitHub or a personal website.",
    design: "Try Figma, Canva, and Adobe XD for design skills.",
    DSA: "Master arrays, trees, graphs using LeetCode & GFG.",
    bestcompanies: "Look for startups and Tier 2 product firms.",
    interviews: "Use InterviewBit, Pramp, and mock interviews.",
    motivation: "Build what you love. Follow dev YouTubers!",
    chatgpt: "ChatGPT can help with debugging and learning.",
    switch: "Non-CS? Start with Python, DSA & projects.",
    cloud: "AWS, GCP & Azure are in high demand.",
    publish: "Use Medium, Dev.to, or Hashnode to write blogs.",
    youtube: "Follow WebDevSimplified, Amigoscode, and CodeWithHarry.",
    fullstack: "Frontend + Backend (Node/Express, Django).",
    git: "Use GitKraken or command line; learn branching.",
    roadmap: "Explore roadmap.sh and choose your domain."
  };

  const keys = Object.keys(prompts);
  const response = prompts[keys[Math.floor(Math.random() * keys.length)]];
  setTimeout(() => {
    document.getElementById('bot-response').innerText = response;
  }, 800);
}

// Fun Fact Rotator
const facts = [
  "Calligraphy comes from the Greek 'kallos' and 'graphe'.",
  "Japanese Shodō means 'the way of writing'.",
  "Arabic calligraphy evolved with Islamic art.",
  "Quills were used in medieval European calligraphy.",
  "Copperplate and Spencerian are Western scripts.",
  "Chinese calligraphy dates back 4000 years.",
  "Brush lettering is popular on social media.",
  "Calligraphy boosts mindfulness and focus.",
  "Pointed pen calligraphy revolutionized writing.",
  "Kufic is one of the earliest Arabic scripts.",
  "Italic script originated during the Renaissance.",
  "Korean calligraphy is spiritual and artistic.",
  "Digital calligraphy blends type and hand art.",
  "Calligraphy used to be taught in Chinese schools.",
  "Roman capitals inspired modern Latin scripts.",
  "Chalkboard calligraphy is used in cafes.",
  "Brush pens replaced ink + bamboo brushes.",
  "Neon calligraphy is a digital trend.",
  "Calligraphy is used in wedding invites.",
  "Arabic calligraphy often decorates mosques."
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
applyBackground('plain'); // Set default bg

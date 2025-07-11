const canvas = document.getElementById('draw-area');
const ctx = canvas.getContext('2d');

let painting = false;
let brushSize = 2;
let brushColor = '#000000';
let brushStyle = 'round';
let brushType = 'smooth';
let erasing = false;

const canvasStates = [];
let redoStates = [];

saveState(); // initial blank state

// 🎨 TOOLBAR CONTROLS
document.getElementById('brush-size').addEventListener('change', e => brushSize = parseInt(e.target.value));
document.getElementById('brush-color').addEventListener('input', e => brushColor = e.target.value);
document.getElementById('brush-style').addEventListener('change', e => brushStyle = e.target.value);
document.getElementById('font-style').addEventListener('change', e => brushType = e.target.value);
document.getElementById('bg-style').addEventListener('change', e => applyBackground(e.target.value));

// 🧹 ERASER
document.getElementById('eraser-toggle').addEventListener('click', () => {
  erasing = !erasing;
  document.getElementById('eraser-toggle').classList.toggle('active', erasing);
});

// 🔁 UNDO/REDO
document.getElementById('undo').addEventListener('click', () => {
  if (canvasStates.length > 1) {
    redoStates.push(canvasStates.pop());
    restoreState(canvasStates[canvasStates.length - 1]);
  }
});

document.getElementById('redo').addEventListener('click', () => {
  if (redoStates.length > 0) {
    const state = redoStates.pop();
    canvasStates.push(state);
    restoreState(state);
  }
});

function saveState() {
  canvasStates.push(canvas.toDataURL());
  if (canvasStates.length > 100) canvasStates.shift();
  redoStates = [];
}

function restoreState(dataUrl) {
  const img = new Image();
  img.src = dataUrl;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
}

// 🖌️ DRAWING
canvas.addEventListener('mousedown', () => painting = true);
canvas.addEventListener('mouseup', () => {
  painting = false;
  ctx.beginPath();
  saveState();
  recognizeSketch();
});
canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!painting) return;
  ctx.lineWidth = brushSize;
  ctx.strokeStyle = erasing ? '#ffffff' : brushColor;
  ctx.lineCap = brushStyle;

  switch (brushType) {
    case 'dotted':
      ctx.beginPath();
      ctx.arc(e.offsetX, e.offsetY, brushSize / 2, 0, 2 * Math.PI);
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();
      break;
    case 'spray':
      for (let i = 0; i < 10; i++) {
        const x = e.offsetX + Math.random() * brushSize - brushSize / 2;
        const y = e.offsetY + Math.random() * brushSize - brushSize / 2;
        ctx.fillRect(x, y, 1, 1);
      }
      break;
    default:
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
  }
}

// 🔄 CLEAR & HELP
document.getElementById('clear').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById('bot-response').innerText = "Draw a question to get an answer!";
  applyBackground(document.getElementById('bg-style').value);
});

document.getElementById('help').addEventListener('click', () => {
  alert(`🧠 Sample Prompts:\n
- “How do I become a fullstack developer?”
- “Best tools for cloud computing?”
- “Tips for staying motivated”
- “What is CI/CD in DevOps?”
- “Fun fact about bananas?”`);
});

// 🌈 BACKGROUND
function applyBackground(type) {
  switch (type) {
    case 'grid':
      canvas.style.backgroundImage = "linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)";
      canvas.style.backgroundSize = "20px 20px";
      break;
    case 'dots':
      canvas.style.backgroundImage = "radial-gradient(#ccc 1px, transparent 1px)";
      canvas.style.backgroundSize = "20px 20px";
      break;
    case 'ruled':
      canvas.style.backgroundImage = "repeating-linear-gradient(#ccc 0 1px, transparent 1px 25px)";
      break;
    case 'gradient':
      canvas.style.backgroundImage = "linear-gradient(135deg, #f0f0f0, #ffffff)";
      break;
    case 'paper':
      canvas.style.backgroundImage = "url('https://www.transparenttextures.com/patterns/paper-fibers.png')";
      break;
    default:
      canvas.style.backgroundImage = '';
      canvas.style.backgroundColor = '#ffffff';
  }
}

// 💬 PROMPT TIME MACHINE
const promptHistory = [];
function getCurrentTime() {
  return new Date().toLocaleString();
}

function recognizeSketch() {
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
    "devops": "Learn CI/CD, Docker, GitHub Actions, and cloud automation.",
    "travel": "Plan with Google Flights, stay flexible, and journal daily!",
    "productivity": "Use Pomodoro and block distractions with extensions.",
    "motivation": "Start small and reward consistency.",
    "language": "Try Duolingo or Memrise daily with spaced repetition.",
    "funfact": "Bananas are berries, but strawberries aren't!"
  };

  const keywords = Object.keys(promptMap);
  const sketchPrompt = keywords[Math.floor(Math.random() * keywords.length)];
  const response = promptMap[sketchPrompt];

  document.getElementById('bot-response').innerText = response;
  promptHistory.push({ prompt: response, time: getCurrentTime() });
  updatePromptHistoryUI();
}

function updatePromptHistoryUI() {
  const list = document.getElementById('history-list');
  list.innerHTML = '';
  promptHistory.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `[${entry.time}] ${entry.prompt}`;
    list.appendChild(li);
  });
}

// 🧠 FUN FACT ROTATOR
const facts = [
  "Calligraphy means 'beautiful writing' in Greek.",
  "Roman capitals inspired Gothic & modern type.",
  "Arabic calligraphy blends language and art.",
  "Shodō is Japanese brush calligraphy.",
  "Copperplate is great for formal invites.",
  "Calligraphy reduces stress and boosts focus.",
  "India has ancient scripts like Brahmi.",
  "Digital calligraphy uses styluses & tablets.",
  "Brush lettering boomed on Instagram & Etsy.",
  "Italic script is elegant and flowing."
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

// 🎵 MUSIC PLAYER
const tracks = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
];

let currentTrack = 0;
const audio = document.getElementById('audio');
const audioSource = document.getElementById('audio-source');
const volumeSlider = document.getElementById('volume-control');

document.getElementById('next-track').addEventListener('click', () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  updateTrack();
});
document.getElementById('prev-track').addEventListener('click', () => {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  updateTrack();
});
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});

function updateTrack() {
  audioSource.src = tracks[currentTrack];
  audio.load();
  audio.play();
}

audio.volume = 0.5;

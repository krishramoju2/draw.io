// ======================= GLOBAL INITIALIZATION =========================
let botCounter = 1;

// Called when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  addNewBot(); // Add the first bot
  document.getElementById('add-bot').addEventListener('click', addNewBot);
});

function addNewBot() {
  const botId = `bot-${botCounter++}`;
  const container = document.createElement('div');
  container.className = 'bot-container';
  container.innerHTML = generateBotHTML(botId);
  document.getElementById('bots-area').appendChild(container);
  initializeBotLogic(botId);
}

function generateBotHTML(botId) {
  return `
    <div class="toolbar" id="${botId}-toolbar">
      <select id="${botId}-brush-size">
        <option value="2">2px</option><option value="5">5px</option>
        <option value="10">10px</option><option value="20">20px</option>
      </select>
      <input type="color" id="${botId}-brush-color" value="#000000">
      <select id="${botId}-brush-style">
        <option value="round">Round</option>
        <option value="square">Square</option>
        <option value="butt">Flat</option>
      </select>
      <select id="${botId}-font-style">
        <option value="smooth">Smooth</option>
        <option value="dotted">Dotted</option>
        <option value="spray">Spray</option>
      </select>
      <select id="${botId}-bg-style">
        <option value="plain">Plain</option>
        <option value="grid">Grid</option>
        <option value="dots">Dots</option>
        <option value="ruled">Ruled</option>
        <option value="gradient">Gradient</option>
        <option value="paper">Paper</option>
      </select>
      <button id="${botId}-clear">Clear</button>
      <button id="${botId}-eraser-toggle">Eraser</button>
      <button id="${botId}-undo">Undo</button>
      <button id="${botId}-redo">Redo</button>
      <button id="${botId}-help">Help</button>
    </div>
    <canvas id="${botId}-canvas" width="800" height="400" style="border:2px dashed #fff; margin-top:10px;"></canvas>
    <div class="response"><p id="${botId}-response">Draw something!</p></div>
    <ul id="${botId}-history" class="history-list"></ul>
  `;
}

// ====================== BOT INITIALIZATION =========================
function initializeBotLogic(botId) {
  const canvas = document.getElementById(`${botId}-canvas`);
  const ctx = canvas.getContext('2d');
  let painting = false;
  let brushSize = 2;
  let brushColor = '#000000';
  let brushStyle = 'round';
  let brushType = 'smooth';
  let erasing = false;
  const canvasStates = [];
  let redoStates = [];
  const promptHistory = [];

  saveState();

  // 🎨 TOOLBAR CONTROLS
  document.getElementById(`${botId}-brush-size`).addEventListener('change', e => brushSize = parseInt(e.target.value));
  document.getElementById(`${botId}-brush-color`).addEventListener('input', e => brushColor = e.target.value);
  document.getElementById(`${botId}-brush-style`).addEventListener('change', e => brushStyle = e.target.value);
  document.getElementById(`${botId}-font-style`).addEventListener('change', e => brushType = e.target.value);
  document.getElementById(`${botId}-bg-style`).addEventListener('change', e => applyBackground(canvas, e.target.value));

  // 🧹 ERASER
  document.getElementById(`${botId}-eraser-toggle`).addEventListener('click', () => {
    erasing = !erasing;
    document.getElementById(`${botId}-eraser-toggle`).classList.toggle('active', erasing);
  });

  // 🔁 UNDO/REDO
  document.getElementById(`${botId}-undo`).addEventListener('click', () => {
    if (canvasStates.length > 1) {
      redoStates.push(canvasStates.pop());
      restoreState(canvasStates[canvasStates.length - 1]);
    }
  });
  document.getElementById(`${botId}-redo`).addEventListener('click', () => {
    if (redoStates.length > 0) {
      const state = redoStates.pop();
      canvasStates.push(state);
      restoreState(state);
    }
  });

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

  // 🎯 CLEAR + HELP
  document.getElementById(`${botId}-clear`).addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById(`${botId}-response`).innerText = "Draw a question to get an answer!";
    applyBackground(canvas, document.getElementById(`${botId}-bg-style`).value);
  });

  document.getElementById(`${botId}-help`).addEventListener('click', () => {
    alert(`🧠 Sample Prompts:\n- Fullstack, cloud, interview\n- Travel, motivation, fun facts`);
  });

  // 🧠 RESPONSE GENERATOR
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
    const keys = Object.keys(promptMap);
    const key = keys[Math.floor(Math.random() * keys.length)];
    const response = promptMap[key];

    document.getElementById(`${botId}-response`).innerText = response;
    promptHistory.push(`[${new Date().toLocaleTimeString()}] ${response}`);
    updateHistory();
  }

  function updateHistory() {
    const list = document.getElementById(`${botId}-history`);
    list.innerHTML = '';
    promptHistory.forEach(p => {
      const li = document.createElement('li');
      li.innerText = p;
      list.appendChild(li);
    });
  }

  // 🔄 BACKGROUND + STATE
  function applyBackground(canvas, type) {
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
}

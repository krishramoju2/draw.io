let botCounter = 1;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('add-bot').addEventListener('click', addNewBot);
  addNewBot(); // Add first bot
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
    <div class="toolbar">
      <select id="${botId}-brush-size">
        <option value="2">2px</option><option value="5">5px</option><option value="10">10px</option><option value="20">20px</option>
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
    <canvas id="${botId}-canvas" width="800" height="400" style="border:2px dashed #000; margin:10px 0;"></canvas>
    <div class="response"><strong>Bot Says:</strong> <span id="${botId}-response">Draw to ask something!</span></div>
    <ul id="${botId}-history" class="history-list"></ul>
    <hr/>
  `;
}

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

  // TOOLBAR
  document.getElementById(`${botId}-brush-size`).addEventListener('change', e => brushSize = parseInt(e.target.value));
  document.getElementById(`${botId}-brush-color`).addEventListener('input', e => brushColor = e.target.value);
  document.getElementById(`${botId}-brush-style`).addEventListener('change', e => brushStyle = e.target.value);
  document.getElementById(`${botId}-font-style`).addEventListener('change', e => brushType = e.target.value);
  document.getElementById(`${botId}-bg-style`).addEventListener('change', e => applyBackground(canvas, e.target.value));

  document.getElementById(`${botId}-eraser-toggle`).addEventListener('click', () => {
    erasing = !erasing;
    document.getElementById(`${botId}-eraser-toggle`).classList.toggle('active', erasing);
  });

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

  document.getElementById(`${botId}-clear`).addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById(`${botId}-response`).innerText = "Draw to ask something!";
    applyBackground(canvas, document.getElementById(`${botId}-bg-style`).value);
  });

  document.getElementById(`${botId}-help`).addEventListener('click', () => {
    alert(`🧠 Sample Prompts:\n- fullstack\n- devops\n- motivation\n- cloud\n- git\n- funfact`);
  });

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

    if (brushType === 'dotted') {
      ctx.beginPath();
      ctx.arc(e.offsetX, e.offsetY, brushSize / 2, 0, 2 * Math.PI);
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();
    } else if (brushType === 'spray') {
      for (let i = 0; i < 10; i++) {
        const x = e.offsetX + Math.random() * brushSize - brushSize / 2;
        const y = e.offsetY + Math.random() * brushSize - brushSize / 2;
        ctx.fillRect(x, y, 1, 1);
      }
    } else {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    }
  }

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
    if (canvasStates.length > 50) canvasStates.shift();
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

  function recognizeSketch() {
    const promptMap = {
      "frontend": "Learn HTML, CSS, JS & React for frontend dev.",
      "backend": "Explore Node.js, Express or Django for backend.",
      "fullstack": "Master both frontend and backend. MERN is great.",
      "ai": "Start with Python, scikit-learn, and datasets.",
      "cloud": "Try AWS/GCP & deploy projects.",
      "git": "Master GitHub, commits & pull requests.",
      "resume": "Tailor it to job roles. Try Rezi or Zety.",
      "interview": "Practice on LeetCode, Pramp, InterviewBit.",
      "opensource": "Find GitHub projects with 'good first issue'.",
      "ds": "Learn NumPy, pandas & machine learning.",
      "figma": "Design UI/UX prototypes with auto-layout.",
      "devops": "Understand CI/CD, Docker, GitHub Actions.",
      "travel": "Use Google Flights, stay flexible, journal daily.",
      "productivity": "Try Pomodoro + block distractions.",
      "motivation": "Start small, reward consistency.",
      "language": "Use Duolingo daily & spaced repetition.",
      "funfact": "Bananas are berries, strawberries aren't!"
    };
    const keywords = Object.keys(promptMap);
    const prompt = keywords[Math.floor(Math.random() * keywords.length)];
    const response = promptMap[prompt];

    document.getElementById(`${botId}-response`).innerText = response;
    promptHistory.push(`[${new Date().toLocaleTimeString()}] ${response}`);
    updateHistory();
  }

  function updateHistory() {
    const list = document.getElementById(`${botId}-history`);
    list.innerHTML = '';
    promptHistory.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = entry;
      list.appendChild(li);
    });
  }

  applyBackground(canvas, 'plain');
}

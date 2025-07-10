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
  alert(`🧠 Sample Prompts:
- How to learn backend?
- Tips to crack FAANG
- Best project ideas
- AI skills to learn
- Cloud career roadmap
- How to freelance
- Resume with no experience
- How to learn DSA
- Should I use Next.js or React?
- Tools to become full-stack dev`);
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
      ctx.globalAlpha = 0.4 + Math.random() * 0.5;
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
    case 'pixel':
      ctx.fillStyle = brushColor;
      ctx.fillRect(x, y, brushSize, brushSize);
      break;
    case 'zigzag':
      ctx.lineTo(x + (Math.sin(Date.now() / 10) * 5), y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      break;
    case 'dashline':
      ctx.setLineDash([5, 10]);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.setLineDash([]);
      break;
    case 'charcoal':
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 3; i++) {
        ctx.lineTo(x + Math.random(), y + Math.random());
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.globalAlpha = 1;
      break;
    case 'starburst':
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(i) * 10, y + Math.sin(i) * 10);
        ctx.stroke();
      }
      break;
  }
}

function applyBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  switch (bgStyle) {
    case 'plain':
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      break;
    case 'grid':
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#ddd';
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
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ccc';
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
      for (let y = 30; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      break;
    case 'gradient':
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#fff');
      gradient.addColorStop(1, '#e0f7fa');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      break;
    case 'paper':
      ctx.fillStyle = '#fdf6e3';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      break;
    case 'blueprint':
      ctx.fillStyle = '#0a3d62';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#3dc1d3';
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      break;
    case 'night':
      ctx.fillStyle = '#121212';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      break;
    case 'chalkboard':
      ctx.fillStyle = '#2b2b2b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      break;
    case 'graph':
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#a0a0a0';
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      break;
  }
}

function recognizeSketch() {
  const prompts = {
    "frontend": "Master HTML, CSS, JS and React to get started in frontend dev.",
    "backend": "Learn Node.js, Express, and database tech like MongoDB or SQL.",
    "ai": "Start with Python, then ML libraries like TensorFlow and PyTorch.",
    "freelance": "Use platforms like Upwork and Fiverr. Build a strong portfolio.",
    "resume": "Highlight projects, GitHub, and use action words like 'built' and 'led'.",
    "ds": "Data structures are crucial for interviews—start with arrays, stacks, trees.",
    "leetcode": "Solve 100+ problems, focus on patterns. Practice daily.",
    "open source": "Start with 'good first issue' on GitHub. Write clear PRs.",
    "project ideas": "Make a blog, portfolio site, task manager, or ML-based app.",
    "cloud": "Learn AWS basics—EC2, S3, Lambda. Try deploying your own project.",
    "devops": "Understand Docker, CI/CD, GitHub Actions. Use Netlify/Vercel.",
    "react vs next": "Use Next.js for SSR and SEO. React is better for SPAs.",
    "career switch": "Build projects in your target field. Take certs like Coursera/Google.",
    "fullstack": "Learn both frontend and backend. Try MERN or Django + React stack.",
    "internships": "Apply early, tailor your resume, and reach out via LinkedIn.",
    "faang": "Solve 300+ LeetCode, system design, and refine behavioral interview answers.",
    "ml roadmap": "Start with math, then ML theory, then apply with scikit-learn/TensorFlow.",
    "web3": "Learn Solidity, Ethereum, use MetaMask and deploy smart contracts.",
    "design": "Use Figma, Canva. Practice UI/UX design for better product sense.",
    "soft skills": "Communication, teamwork, and ownership matter as much as tech skills!"
  };

  const keys = Object.keys(prompts);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const response = prompts[randomKey];

  setTimeout(() => {
    document.getElementById('bot-response').innerText = response;
  }, 1000);
}

// Initialize on load
applyBackground();

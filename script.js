const canvas = document.getElementById('draw-area');
const ctx = canvas.getContext('2d');
let painting = false;
let brushSize = 2;

document.getElementById('brush').addEventListener('change', (e) => {
  brushSize = parseInt(e.target.value);
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
  alert(`🧠 Sample Questions I understand:
- "How can I become a frontend developer?"
- "Tips for cracking SDE internships"
- "Best free coding resources"
- "What are top AI skills to learn?"
- "Which programming languages should I master?"`);
});

ctx.lineWidth = brushSize;
ctx.lineCap = 'round';

function draw(e) {
  if (!painting) return;
  ctx.lineWidth = brushSize;
  ctx.strokeStyle = '#000';
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function recognizeSketch() {
  // Simulated recognition using randomness for demo
  const prompts = {
    "frontend": "To become a frontend dev, master HTML, CSS, JS and frameworks like React.",
    "internships": "Build projects, contribute to open source, and network on LinkedIn for SDE roles.",
    "resources": "Free resources include freeCodeCamp, CS50, GeeksforGeeks, and LeetCode.",
    "AI": "Top AI skills: ML, DL, Python, TensorFlow, PyTorch, NLP, and data engineering.",
    "languages": "Top languages: Python, JavaScript, Java, Go, and Rust depending on your goals."
  };

  const keywords = Object.keys(prompts);
  const randomKey = keywords[Math.floor(Math.random() * keywords.length)];
  const response = prompts[randomKey];

  setTimeout(() => {
    document.getElementById('bot-response').innerText = response;
  }, 1000);
}

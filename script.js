// Menu toggle
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
menuBtn.addEventListener("click", () => menu.classList.toggle("hidden"));

// Sparkle effect
const canvas = document.getElementById("sparkle-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Sparkle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.alpha = Math.random();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.fill();
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    this.alpha += (Math.random() - 0.5) * 0.05;
    this.alpha = Math.min(1, Math.max(0.1, this.alpha));
    this.draw();
  }
}

let sparkles = [];
function initSparkles() {
  sparkles = Array.from({ length: 150 }, () => new Sparkle());
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sparkles.forEach(s => s.update());
  requestAnimationFrame(animate);
}
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initSparkles();
});
initSparkles();
animate();

// Typewriter effect
function typeWriter(el, speed = 40) {
  const text = el.textContent;
  el.textContent = "";
  let i = 0;
  (function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i++);
      setTimeout(type, speed);
    }
  })();
}
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".typewriter").forEach((el, idx) => {
    setTimeout(() => typeWriter(el), idx * 300);
  });
});

// Music toggle
const bg = document.getElementById("bg-music");
const btn = document.getElementById("toggle-music");
btn.addEventListener("click", () => {
  bg.paused ? (bg.play(), btn.textContent = "🔊 Music On") 
            : (bg.pause(), btn.textContent = "🔇 Music Off");
});

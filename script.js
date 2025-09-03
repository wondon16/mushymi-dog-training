/* =========================
   Config (set your email!)
========================= */
const BOOKING_EMAIL = "your-email@example.com";     // <-- replace with your real email
const CONTACT_EMAIL  = "your-email@example.com";     // <-- replace with your real email

/* =========== Menu =========== */
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
if (menuBtn && menu) {
  menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    menu.classList.toggle("hidden");
  });
}

/* ===== Sparkle Background ===== */
const canvas = document.getElementById("sparkle-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  function sizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
  sizeCanvas(); addEventListener("resize", sizeCanvas);

  class Sparkle {
    constructor() { this.reset(true); }
    reset(first=false) {
      this.x = first ? Math.random()*canvas.width : (Math.random()<.5?0:canvas.width);
      this.y = Math.random()*canvas.height;
      this.r = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.a = Math.random()*0.9+0.1;
    }
    step() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < -5 || this.x > canvas.width+5 || this.y < -5 || this.y > canvas.height+5) this.reset();
      this.a += (Math.random()-0.5)*0.04; this.a = Math.max(0.1, Math.min(1, this.a));
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${this.a})`; ctx.fill();
    }
  }
  let sparkles = Array.from({length: 160}, ()=>new Sparkle());
  (function animate(){ ctx.clearRect(0,0,canvas.width,canvas.height); sparkles.forEach(s=>s.step()); requestAnimationFrame(animate); })();
}

/* ===== Typewriter (on-view) ===== */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    if (el.classList.contains("typer-done")) return;
    const txt = el.textContent;
    el.textContent = "";
    let i = 0;
    (function tick(){
      if (i < txt.length) { el.textContent += txt.charAt(i++); setTimeout(tick, 24); }
      else el.classList.add("typer-done");
    })();
    io.unobserve(el);
  });
}, { threshold: 0.2 });
document.querySelectorAll(".tw").forEach(el => io.observe(el));

/* ===== Music Toggle ===== */
const bg = document.getElementById("bg-music");
const btn = document.getElementById("toggle-music");
if (bg && btn) {
  btn.addEventListener("click", () => {
    if (bg.paused) { bg.play(); btn.textContent = "🔊 Music On"; btn.setAttribute("aria-pressed", "true"); }
    else { bg.pause(); btn.textContent = "🔇 Music Off"; btn.setAttribute("aria-pressed", "false"); }
  });
}

/* ===== Booking: opens email with prefilled body ===== */
const bookForm = document.getElementById("book-form");
if (bookForm) {
  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (document.getElementById("bf-name")?.value || "").trim();
    const email = (document.getElementById("bf-email")?.value || "").trim();
    const date = document.getElementById("bf-date")?.value || "";
    const time = document.getElementById("bf-time")?.value || "";
    const goals = (document.getElementById("bf-goals")?.value || "").trim();
    const subject = encodeURIComponent("Mushymi Training Booking");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nRequested date/time: ${date} ${time}\nGoals: ${goals}\n\nPlease confirm availability.`
    );
    location.href = `mailto:${BOOKING_EMAIL}?subject=${subject}&body=${body}`;
  });
}

/* ===== Community Blog (local only) ===== */
const postsEl = document.getElementById("posts");
const postForm = document.getElementById("post-form");
function loadPosts() {
  if (!postsEl) return;
  postsEl.innerHTML = "";
  const posts = JSON.parse(localStorage.getItem("mushy_posts") || "[]");
  posts.forEach((p) => {
    const card = document.createElement("div"); card.className = "post";
    if (p.type === "image" && p.url) {
      const img = document.createElement("img"); img.src = p.url; img.alt = "User post image"; card.appendChild(img);
    } else if (p.type === "video" && p.url) {
      const vid = document.createElement("video"); vid.src = p.url; vid.controls = true; card.appendChild(vid);
    }
    if (p.caption) { const cap = document.createElement("p"); cap.textContent = p.caption; card.appendChild(cap); }
    postsEl.appendChild(card);
  });
}
if (postForm) {
  postForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const file = document.getElementById("post-file").files[0];
    const caption = (document.getElementById("post-caption")?.value || "").trim();
    if (!file && !caption) return;
    const save = (url, type) => {
      const posts = JSON.parse(localStorage.getItem("mushy_posts") || "[]");
      posts.unshift({ type, url, caption, ts: Date.now() });
      localStorage.setItem("mushy_posts", JSON.stringify(posts));
      postForm.reset();
      loadPosts();
    };
    if (file) {
      const reader = new FileReader();
      reader.onload = () => save(reader.result, file.type.startsWith("video/") ? "video" : "image");
      reader.readAsDataURL(file);
    } else {
      save("", "image");
    }
  });
  loadPosts();
}

/* ===== Simple Chat (local only) ===== */
const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
function loadChat() {
  if (!chatLog) return;
  chatLog.innerHTML = "";
  const msgs = JSON.parse(localStorage.getItem("mushy_chat") || "[]");
  msgs.slice(-200).forEach(m => {
    const div = document.createElement("div"); div.className = "chat-msg"; div.textContent = m;
    chatLog.appendChild(div);
  });
  chatLog.scrollTop = chatLog.scrollHeight;
}
if (chatForm && chatInput) {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const txt = chatInput.value.trim(); if (!txt) return;
    const msgs = JSON.parse(localStorage.getItem("mushy_chat") || "[]");
    msgs.push(txt); localStorage.setItem("mushy_chat", JSON.stringify(msgs));
    chatInput.value = ""; loadChat();
  });
  loadChat();
}

/* ===== Profile Save (local only) ===== */
const profileForm = document.getElementById("profile-form");
const profileCard = document.getElementById("profile-card");
function renderProfile() {
  if (!profileCard) return;
  const data = JSON.parse(localStorage.getItem("mushy_profile") || "null");
  if (!data) { profileCard.classList.add("hidden"); return; }
  profileCard.classList.remove("hidden");
  profileCard.innerHTML = "";
  const img = document.createElement("img");
  img.src = data.imgData || "images/dog1.jpg"; img.alt = "Dog photo";
  const info = document.createElement("div");
  info.innerHTML = `<h3>${data.name || "Your Dog"}</h3>
    <p><strong>Breed:</strong> ${data.breed || "—"}</p>
    <p><strong>Age:</strong> ${data.age || "—"}</p>`;
  profileCard.appendChild(img); profileCard.appendChild(info);
}
if (profileForm) {
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (document.getElementById("p-name")?.value || "").trim();
    const breed = (document.getElementById("p-breed")?.value || "").trim();
    const age = document.getElementById("p-age")?.value || "";
    const file = document.getElementById("p-photo")?.files[0];

    const save = (imgData) => {
      const data = { name, breed, age, imgData };
      localStorage.setItem("mushy_profile", JSON.stringify(data));
      renderProfile();
    };
    if (file) { const r = new FileReader(); r.onload = () => save(r.result); r.readAsDataURL(file); }
    else save(null);
  });
  renderProfile();
}

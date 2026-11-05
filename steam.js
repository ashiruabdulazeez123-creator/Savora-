/* ==========================================================
   SAVORA – hero steam animation (home page only)

   1. Steam rises from the pot and drifts across the hero.
   2. It gets thicker and thicker until the page is covered in mist.
   3. A handkerchief sweeps across (fast) and wipes the mist away.
   4. After that: gentle steam + bubbling pot, forever.

   Change the numbers in CONFIG to make it slower / faster / thicker.
   ========================================================== */
(() => {
  "use strict";

  const hero = document.getElementById("top");
  const steamCv = document.getElementById("steam-canvas");
  const fogCv = document.getElementById("fog-canvas");
  const pot = document.getElementById("pot");
  const cloth = document.getElementById("cloth");
  if (!hero || !steamCv || !fogCv || !pot || !cloth) return;

  /* ---------- settings you can tweak ---------- */
  const CONFIG = {
    START_DELAY_MS: 350,   // pause before the steam starts
    THICKEN_MS: 4800,      // how long the steam takes to turn into thick mist
    WIPE_MS: 1700,         // how long the handkerchief takes (smaller = faster)
    CLEAR_MS: 700,         // last bit of mist fading away after the wipe
    FOG_MAX: 0.9,          // 0–1, how thick the mist gets (1 = fully white)
    CALM_RATE: 6,        // puffs per second once it is calm
    RES: 0.5,              // canvas resolution (0.5 = half size, soft and fast)
  };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { hero.classList.add("steam-off"); return; }

  const sctx = steamCv.getContext("2d");
  const fctx = fogCv.getContext("2d");
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- soft sprites ---------- */
  function makeSprite(size, stops) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    stops.forEach(([o, col]) => grad.addColorStop(o, col));
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    return c;
  }
  const puff = makeSprite(128, [[0, "rgba(255,252,246,1)"], [0.35, "rgba(255,252,246,.55)"], [1, "rgba(255,252,246,0)"]]);
  const mist = makeSprite(256, [[0, "rgba(228,234,226,1)"], [0.5, "rgba(228,234,226,.6)"], [1, "rgba(228,234,226,0)"]]);
  const brush = makeSprite(128, [[0, "rgba(0,0,0,1)"], [0.55, "rgba(0,0,0,.96)"], [1, "rgba(0,0,0,0)"]]);

  /* ---------- size / layout ---------- */
  let W = 0, H = 0, Hv = 0, S = 1, mask = null, banks = [];
  const mouth = { x: 0, y: 0, w: 0 };

  function layout() {
    const hr = hero.getBoundingClientRect();
    const nW = Math.round(hr.width), nH = Math.round(hr.height);
    if (!nW || !nH) return;
    const changed = nW !== W || nH !== H;
    W = nW; H = nH;
    Hv = Math.min(H, window.innerHeight); // the part of the hero people actually see first
    // on phones the hero is taller than the screen: keep the pot inside the first screen
    const bn = document.querySelector(".bottom-nav");
    const navH = bn && getComputedStyle(bn).display !== "none" ? 84 : 0;
    if (H > window.innerHeight * 1.05) { pot.style.bottom = "auto"; pot.style.top = Math.max(0, Hv - navH - pot.offsetHeight - 8) + "px"; }
    else { pot.style.top = ""; pot.style.bottom = ""; }
    S = clamp(W / 1440, 0.6, 1.15);

    if (changed) {
      for (const cv of [steamCv, fogCv]) { cv.width = Math.round(W * CONFIG.RES); cv.height = Math.round(H * CONFIG.RES); }
      const nm = document.createElement("canvas");
      nm.width = fogCv.width; nm.height = fogCv.height;
      if (mask) nm.getContext("2d").drawImage(mask, 0, 0, nm.width, nm.height); // keep what was already wiped
      mask = nm;
      const R = Math.max(W, Hv);
      banks = Array.from({ length: 28 }, () => ({
        x: rand(0, W), y: rand(0, Hv), r: rand(0.17, 0.3) * R,
        vx: rand(6, 16) * (Math.random() < 0.5 ? -1 : 1), a: rand(0.55, 1), ph: rand(0, 6.28),
      }));
    }
    // where the steam leaves the pot (centre of the pot's open top)
    const pr = pot.getBoundingClientRect();
    mouth.x = pr.left - hr.left + pr.width * 0.5;
    mouth.y = pr.top - hr.top + pr.height * 0.24;
    mouth.w = pr.width * 0.62;
  }

  /* ---------- steam puffs ---------- */
  const parts = [];
  const cur = { rate: 3, op: 0.15, size: 1, speed: 1 }; // current "mood", eases toward the target
  let emit = 0;

  function spawn() {
    if (parts.length > 280) return;
    parts.push({
      x: mouth.x + rand(-0.5, 0.5) * mouth.w,
      y: mouth.y + rand(-4, 4),
      vx: rand(-6, 10) * S,
      vy: -rand(20, 42) * S * cur.speed,
      r: rand(12, 20) * S * cur.size,
      grow: rand(9, 17) * S * cur.size,
      age: 0, life: rand(6, 9.5),
      seed: rand(0, 100), op: cur.op * rand(0.8, 1.15),
    });
  }

  function stepSteam(dt, clock, wipe) {
    // wind that slowly changes direction, so the steam really flows across the page
    const wind = (11 + Math.sin(clock * 0.00035) * 12) * S;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.age += dt;
      if (p.age >= p.life) { parts.splice(i, 1); continue; }
      p.x += (p.vx + wind + Math.sin(p.age * 0.9 + p.seed) * 16 * S) * dt;
      p.y += p.vy * dt;
      p.r += p.grow * dt;
      p.vy *= 1 - 0.05 * dt;
      // the handkerchief sweeps the steam away too
      if (wipe && Math.abs(p.x - wipe.x) < wipe.r && Math.abs(p.y - wipe.y) < wipe.r) p.age = Math.max(p.age, p.life * 0.88);
    }
  }

  function drawSteam() {
    sctx.setTransform(1, 0, 0, 1, 0, 0);
    sctx.clearRect(0, 0, steamCv.width, steamCv.height);
    sctx.setTransform(CONFIG.RES, 0, 0, CONFIG.RES, 0, 0);
    for (const p of parts) {
      const t = p.age / p.life;
      const a = Math.min(t / 0.14, 1) * Math.pow(1 - t, 1.25) * p.op;
      if (a < 0.005) continue;
      sctx.globalAlpha = Math.min(a, 1);
      sctx.drawImage(puff, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
    }
    sctx.globalAlpha = 1;
  }

  /* ---------- bubbles + low vapor rising from the bottom of the page (always on) ---------- */
const bubbles = [];
let bubEmit = 0, vapEmit = 0;

function spawnBubble() {
  if (bubbles.length > 110) return;
  const r = rand(4, 16) * S;
  bubbles.push({
    x: rand(0, W), y: Hv + r + rand(0, 30), r,
    vy: -rand(26, 62) * S * (1.2 - r / (30 * S)), // small bubbles rise a bit faster
    sway: rand(8, 22) * S, freq: rand(0.5, 1.2), ph: rand(0, 6.28), a: rand(0.5, 0.95),
  });
}
function spawnGroundVapor() { // soft wisps that start along the bottom edge
  if (parts.length > 280) return;
  parts.push({
    x: rand(0, W), y: Hv + 20, vx: rand(-4, 8) * S, vy: -rand(16, 30) * S,
    r: rand(26, 44) * S, grow: rand(8, 14) * S, age: 0, life: rand(8, 12), seed: rand(0, 100), op: rand(0.11, 0.2),
  });
}
function stepBubbles(dt, clock) {
  bubEmit += (W / 1440) * 9 * dt; vapEmit += (W / 1440) * 2.4 * dt;
  while (bubEmit >= 1) { bubEmit -= 1; spawnBubble(); }
  while (vapEmit >= 1) { vapEmit -= 1; spawnGroundVapor(); }
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    b.y += b.vy * dt;
    b.cx = b.x + Math.sin(clock * 0.001 * b.freq + b.ph) * b.sway;
    if (b.y < -b.r * 2) bubbles.splice(i, 1);
  }
}
function drawBubbles() {
  for (const b of bubbles) {
    const prog = clamp(1 - b.y / Hv, 0, 1); // 0 at the bottom, 1 at the top
    const a = b.a * Math.min(prog / 0.08, 1) * clamp((1 - prog) / 0.25, 0, 1);
    if (a < 0.01) continue;
    const x = b.cx ?? b.x;
    sctx.globalAlpha = a;
    sctx.beginPath(); sctx.arc(x, b.y, b.r, 0, 6.2832);
    sctx.fillStyle = "rgba(255,244,222,.14)"; sctx.fill();
    sctx.lineWidth = Math.max(1.2, b.r * 0.1); sctx.strokeStyle = "rgba(255,244,222,.8)"; sctx.stroke();
    sctx.beginPath(); sctx.arc(x, b.y, b.r * 0.66, 3.5, 4.5); // little shine
    sctx.strokeStyle = "rgba(255,255,255,.85)"; sctx.stroke();
  }
  sctx.globalAlpha = 1;
}

/* ---------- mist ---------- */
  function drawFog(level, mul, clock) {
    fctx.setTransform(1, 0, 0, 1, 0, 0);
    fctx.clearRect(0, 0, fogCv.width, fogCv.height);
    if (level <= 0.003 || mul <= 0.003) return;
    fctx.setTransform(CONFIG.RES, 0, 0, CONFIG.RES, 0, 0);
    const diag = Math.hypot(W, Hv);
    const reach = level * 1.45; // the mist spreads outwards from the pot
    fctx.globalAlpha = Math.pow(level, 1.6) * 0.5 * CONFIG.FOG_MAX * mul;
    fctx.fillStyle = "rgb(228,234,226)";
    fctx.fillRect(0, 0, W, H);
    for (const b of banks) {
      const span = W + b.r * 2;
      const x = ((((b.x + clock * 0.001 * b.vx) % span) + span) % span) - b.r;
      const y = b.y + Math.sin(clock * 0.0004 + b.ph) * 18 * S;
      const d = Math.hypot(x - mouth.x, y - mouth.y) / diag;
      const a = clamp((reach - d) * 3, 0, 1) * b.a * CONFIG.FOG_MAX * mul;
      if (a < 0.01) continue;
      fctx.globalAlpha = Math.min(a, 1);
      fctx.drawImage(mist, x - b.r, y - b.r, b.r * 2, b.r * 2);
    }
    fctx.globalAlpha = 1;
    // cut out everything the handkerchief has wiped
    fctx.setTransform(1, 0, 0, 1, 0, 0);
    fctx.globalCompositeOperation = "destination-out";
    fctx.drawImage(mask, 0, 0);
    fctx.globalCompositeOperation = "source-over";
  }

  function stamp(x, y, r) {
    const m = mask.getContext("2d");
    m.setTransform(CONFIG.RES, 0, 0, CONFIG.RES, 0, 0);
    m.drawImage(brush, x - r, y - r, r * 2, r * 2);
  }

  /* ---------- handkerchief path (fast S-shaped double sweep) ---------- */
  let pts = [], cw = 240;
  function buildPath() {
    cw = clamp(W * 0.26, 170, 300);
    cloth.style.width = cw + "px";
    pts = [
      [W + cw * 0.7, Hv * 0.30], [W * 0.75, Hv * 0.27], [W * 0.25, Hv * 0.33], [-cw * 0.9, Hv * 0.38],
      [-cw * 1.1, Hv * 0.55], [-cw * 0.9, Hv * 0.68],
      [W * 0.25, Hv * 0.73], [W * 0.75, Hv * 0.69], [W + cw * 0.8, Hv * 0.66],
    ];
  }
  function pathAt(t) { // Catmull-Rom through the points
    const n = pts.length - 1;
    const f = clamp(t, 0, 1) * n, i = Math.min(Math.floor(f), n - 1), u = f - i;
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, n)];
    const c = (k) => 0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u * u + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u * u * u);
    return { x: c(0), y: c(1) };
  }

  /* ---------- the timeline ---------- */
  const { START_DELAY_MS: T0, THICKEN_MS: TH, WIPE_MS: WP, CLEAR_MS: CL } = CONFIG;
  let clock = 0, last = performance.now(), visible = true, prevPos = null;

  function setPhase(name) {
    hero.dataset.steam = name;
    pot.classList.toggle("boil", name === "thicken" || name === "wipe");
  }

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05); // a hidden tab never makes it jump ahead
    last = now;
    clock += dt * 1000;
    requestAnimationFrame(frame);
    if (!W) { layout(); return; }

    // work out where we are in the story
    let phase = "idle", level = 0, mul = 1, wipeBrush = null;
    const tTh = clock - T0, tWp = tTh - TH, tCl = tWp - WP;
    if (tTh < 0) phase = "idle";
    else if (tWp < 0) { phase = "thicken"; level = Math.pow(clamp(tTh / TH, 0, 1), 1.35); }
    else if (tCl < 0) { phase = "wipe"; level = 1; }
    else if (tCl < CL) { phase = "clear"; level = 1; mul = 1 - tCl / CL; }
    else phase = "calm";
    if (hero.dataset.steam !== phase) setPhase(phase);

    // the handkerchief
    if (phase === "wipe") {
      const raw = clamp(tWp / WP, 0, 1);
      const t = lerp(raw, raw * raw * (3 - 2 * raw), 0.45); // a touch of ease in / out
      const pos = pathAt(t);
      const R = Math.max(Hv * 0.34, cw * 0.8);
      if (visible) {
        const from = prevPos || pos, dist = Math.hypot(pos.x - from.x, pos.y - from.y);
        const steps = Math.max(1, Math.ceil(dist / (R * 0.3)));
        for (let k = 1; k <= steps; k++) stamp(lerp(from.x, pos.x, k / steps), lerp(from.y, pos.y, k / steps), R);
      }
      const dir = prevPos ? Math.sign(pos.x - prevPos.x) || 1 : -1;
      prevPos = pos;
      wipeBrush = { x: pos.x, y: pos.y, r: R };
      const flutter = Math.sin(clock * 0.03) * 6;
      cloth.style.transform = `translate3d(${pos.x - cw / 2}px, ${pos.y - cw * 0.42}px, 0) rotate(${dir * 11 + flutter}deg) scaleX(${1 + Math.sin(clock * 0.045) * 0.05})`;
      cloth.classList.add("on");
    } else if (cloth.classList.contains("on")) {
      cloth.classList.remove("on");
    }

    // header text stays readable while the mist is thick
    const hd = document.getElementById("site-header");
    if (hd) hd.classList.toggle("steam-fog", level > 0.3 && mul > 0.4);

    // how the steam behaves in each phase
    let target;
    if (phase === "idle") target = { rate: 3, op: 0.15, size: 1, speed: 1 };
    else if (phase === "thicken") { const p = level; target = { rate: 5 + 30 * p, op: 0.17 + 0.3 * p, size: 1 + 0.8 * p, speed: 1 + 0.5 * p }; }
    else if (phase === "wipe") target = { rate: 34, op: 0.45, size: 1.8, speed: 1.5 };
    else target = { rate: CONFIG.CALM_RATE, op: 0.26, size: 1, speed: 0.8 };
    const k = Math.min(1, dt * (phase === "calm" || phase === "clear" ? 0.9 : 1.6));
    for (const key in cur) cur[key] += (target[key] - cur[key]) * k;

    if (!visible) return; // off-screen: the story carries on, we just don't paint it
    emit += cur.rate * dt;
    while (emit >= 1) { emit -= 1; spawn(); }
    stepSteam(dt, clock, wipeBrush);
    stepBubbles(dt, clock);
    drawSteam();
    drawBubbles();
    drawFog(level, mul, clock);

    if (phase === "calm" && mask) { // all clean: free the memory
      const m = mask.getContext("2d");
      m.setTransform(1, 0, 0, 1, 0, 0);
      m.clearRect(0, 0, mask.width, mask.height);
    }
  }

  /* ---------- go ---------- */
  function boot() {
    layout();
    buildPath();
    // warm-up: a few puffs already floating when the page opens
    for (let i = 0; i < 6; i++) { spawn(); parts[parts.length - 1].age = rand(0, 2); }
    for (let i = 0; i < 35; i++) { spawnBubble(); bubbles[bubbles.length - 1].y = rand(0, Hv); } // bubbles already floating on arrival
    last = performance.now();
    requestAnimationFrame(frame);
  }
  const ro = new ResizeObserver(() => { layout(); buildPath(); });
  ro.observe(hero);
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }, { threshold: 0 }).observe(hero);
  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot, { once: true });
})();

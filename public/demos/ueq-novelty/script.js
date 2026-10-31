/* Geometry & timing — 1600×1200 stage reference */
const STAGE_W = 1600;
const BEFORE = -0.13;
const AFTER = 1.17;
const PX_PER_UNIT = 320;
const BAR_W = 220;
const ZERO_Y = 730;
const LEFT_CX = 520;
const RIGHT_CX = 1080;
const FADE_MS = 500;
const HOLD_MS = 100;
const GROW_MS = 1600;
const FINISH_MS = 600;
const TOTAL_MS = FADE_MS + HOLD_MS + GROW_MS + FINISH_MS;
const EASE = [0.22, 1, 0.36, 1];
const BAR_BEFORE = "#bdbcb5";
const ACCENT = "#2a78d6";

function formatUeq(value) {
  const abs = Math.abs(value).toFixed(2);
  return value < 0 ? `\u2212${abs}` : abs;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(from, to, t) {
  const parse = (hex) => {
    const h = hex.replace("#", "");
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  };
  const [r1, g1, b1] = parse(from);
  const [r2, g2, b2] = parse(to);
  return `rgb(${Math.round(lerp(r1, r2, t))} ${Math.round(lerp(g1, g2, t))} ${Math.round(lerp(b1, b2, t))})`;
}

function easeOut(t) {
  const [p1, p2, p3, p4] = EASE;
  const cx = 3 * p1;
  const bx = 3 * (p3 - p1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p2;
  const by = 3 * (p4 - p2) - cy;
  const ay = 1 - cy - by;
  const sampleX = (u) => ((ax * u + bx) * u + cx) * u;
  const sampleY = (u) => ((ay * u + by) * u + cy) * u;
  const sampleDX = (u) => (3 * ax * u + 2 * bx) * u + cx;
  let x = t;
  for (let i = 0; i < 6; i += 1) {
    const z = sampleX(x) - t;
    if (Math.abs(z) < 1e-5) break;
    const d = sampleDX(x);
    if (Math.abs(d) < 1e-5) break;
    x -= z / d;
  }
  return sampleY(x);
}

function barGeom(cx, value) {
  const h = Math.abs(value) * PX_PER_UNIT;
  const x = cx - BAR_W / 2;
  if (value >= 0) return { x, y: ZERO_Y - h, width: BAR_W, height: h, radiusTop: true };
  return { x, y: ZERO_Y, width: BAR_W, height: h, radiusTop: false };
}

function barPath(g, radius) {
  const r = Math.min(radius, g.width / 2, Math.max(0, g.height));
  if (g.height < 0.5) {
    return `M ${g.x} ${ZERO_Y} H ${g.x + g.width} V ${ZERO_Y + 0.01} H ${g.x} Z`;
  }
  if (g.radiusTop) {
    return `M ${g.x} ${g.y + g.height} L ${g.x} ${g.y + r} Q ${g.x} ${g.y} ${g.x + r} ${g.y} L ${g.x + g.width - r} ${g.y} Q ${g.x + g.width} ${g.y} ${g.x + g.width} ${g.y + r} L ${g.x + g.width} ${g.y + g.height} Z`;
  }
  return `M ${g.x} ${g.y} L ${g.x + g.width} ${g.y} L ${g.x + g.width} ${g.y + g.height - r} Q ${g.x + g.width} ${g.y + g.height} ${g.x + g.width - r} ${g.y + g.height} L ${g.x + r} ${g.y + g.height} Q ${g.x} ${g.y + g.height} ${g.x} ${g.y + g.height - r} Z`;
}

function labelY(value) {
  const h = Math.abs(value) * PX_PER_UNIT;
  return value >= 0 ? ZERO_Y - h - 28 : ZERO_Y + h + 70;
}

const radius = Math.min(14.4, Math.max(4, STAGE_W * 0.009));
let raf = null;
let started = false;

function setFinal($) {
  $.chrome.forEach((n) => n.classList.remove("ueq-hidden"));
  $.leftGroup.forEach((n) => n.classList.remove("ueq-hidden"));
  $.rightName.classList.remove("ueq-hidden");
  $.rightPillBad.classList.add("ueq-hidden");
  $.rightPillGood.classList.remove("ueq-hidden");
  const g = barGeom(RIGHT_CX, AFTER);
  $.rightBar.setAttribute("d", barPath(g, radius));
  $.rightBar.setAttribute("fill", ACCENT);
  $.rightLabel.setAttribute("y", String(labelY(AFTER)));
  $.rightLabel.textContent = formatUeq(AFTER);
}

function playNoveltyChart() {
  const root = document.querySelector("[data-ueq-animated]");
  if (!root) return;
  const $ = {
    chrome: root.querySelectorAll("[data-ueq-chrome]"),
    leftGroup: root.querySelectorAll("[data-ueq-left]"),
    rightBar: root.querySelector("[data-ueq-right-bar]"),
    rightLabel: root.querySelector("[data-ueq-right-label]"),
    rightName: root.querySelector("[data-ueq-right-name]"),
    rightPillBad: root.querySelector("[data-ueq-right-pill-bad]"),
    rightPillGood: root.querySelector("[data-ueq-right-pill-good]"),
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setFinal($);
    return;
  }

  if (raf) cancelAnimationFrame(raf);

  $.chrome.forEach((n) => n.classList.add("ueq-hidden"));
  $.leftGroup.forEach((n) => n.classList.add("ueq-hidden"));
  $.rightName.classList.add("ueq-hidden");
  $.rightPillGood.classList.add("ueq-hidden");
  $.rightPillBad.classList.remove("ueq-hidden");

  const leftG = barGeom(LEFT_CX, BEFORE);
  const startG = barGeom(RIGHT_CX, BEFORE);
  $.rightBar.setAttribute("d", barPath(startG, radius));
  $.rightBar.setAttribute("fill", BAR_BEFORE);
  $.rightLabel.setAttribute("y", String(labelY(BEFORE)));
  $.rightLabel.textContent = formatUeq(BEFORE);

  const leftBar = root.querySelector("[data-ueq-left-bar]");
  const leftLabel = root.querySelector("[data-ueq-left-label]");
  if (leftBar) leftBar.setAttribute("d", barPath(leftG, radius));
  if (leftLabel) {
    leftLabel.setAttribute("y", String(labelY(BEFORE)));
    leftLabel.textContent = formatUeq(BEFORE);
  }

  const t0 = performance.now();
  const tick = (now) => {
    const elapsed = now - t0;
    if (elapsed >= 0) {
      $.chrome.forEach((n) => n.classList.remove("ueq-hidden"));
      $.leftGroup.forEach((n) => n.classList.remove("ueq-hidden"));
    }
    if (elapsed >= FADE_MS + HOLD_MS && elapsed < FADE_MS + HOLD_MS + GROW_MS) {
      const u = (elapsed - FADE_MS - HOLD_MS) / GROW_MS;
      const e = easeOut(Math.min(1, Math.max(0, u)));
      const v = lerp(BEFORE, AFTER, e);
      const g = barGeom(RIGHT_CX, v);
      $.rightBar.setAttribute("d", barPath(g, radius));
      $.rightBar.setAttribute("fill", lerpColor(BAR_BEFORE, ACCENT, e));
      $.rightLabel.setAttribute("y", String(labelY(v)));
      $.rightLabel.textContent = formatUeq(v);
    } else if (elapsed >= FADE_MS + HOLD_MS + GROW_MS) {
      setFinal($);
    }
    if (elapsed < TOTAL_MS) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
      setFinal($);
    }
  };
  raf = requestAnimationFrame(tick);
}

window.playNoveltyChart = playNoveltyChart;

document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-ueq-animated]");
  if (!root) return;

  root.addEventListener("chart:play", () => playNoveltyChart());

  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting && e.intersectionRatio >= 0.5) && !started) {
        started = true;
        playNoveltyChart();
      }
    },
    { threshold: [0, 0.5, 1] },
  );
  io.observe(root);
});

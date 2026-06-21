// ═══════════════════════════════════════
// SETUP
// ═══════════════════════════════════════

const canvas = document.getElementById("canvas-ruleta");
const ctx    = canvas.getContext("2d");
const CX     = canvas.width  / 2;
const CY     = canvas.height / 2;
const RADIUS = CX - 10;

let currentAngle = 0;
let isSpinning   = false;

// ═══════════════════════════════════════
// SEGMENTOS VISUALES — todos iguales
// La probabilidad real vive en getWeightedResult()
// ═══════════════════════════════════════

function buildSegments() {
  const count     = CONFIG.WHEEL_OPTIONS.length;
  const sliceSize = (Math.PI * 2) / count;
  const START     = -Math.PI / 2;

  return CONFIG.WHEEL_OPTIONS.map((option, i) => {
    const startAngle = START + i * sliceSize;
    const endAngle   = START + (i + 1) * sliceSize;
    return { ...option, startAngle, endAngle };
  });
}

const SEGMENTS = buildSegments();

// ═══════════════════════════════════════
// RESULTADO PONDERADO
// ═══════════════════════════════════════

function getWeightedResult() {
  const totalWeight = CONFIG.WHEEL_OPTIONS.reduce((s, o) => s + o.weight, 0);
  const rand        = Math.random() * totalWeight;
  let   cumulative  = 0;
  for (const option of CONFIG.WHEEL_OPTIONS) {
    cumulative += option.weight;
    if (rand <= cumulative) return option.label;
  }
  return CONFIG.WHEEL_OPTIONS[0].label;
}

function getSegmentCenterAngle(label) {
  const seg = SEGMENTS.find(s => s.label === label);
  if (!seg) return 0;
  return (seg.startAngle + seg.endAngle) / 2;
}

// ═══════════════════════════════════════
// PALETA — dos colores alternados + morado para Sorpresa
// ═══════════════════════════════════════

// Color A: dorado oscuro / Color B: casi negro cálido
const SEGMENT_FILLS = [
  { fill: "#2a1f0a", stroke: "rgba(201,168,76,0.55)" },  // A — dorado oscuro
  { fill: "#111118", stroke: "rgba(201,168,76,0.30)" },  // B — negro azulado
];

function getSegmentFill(index, seg) {
  if (seg.special) return { fill: "#1a0a2e", stroke: "rgba(168,85,247,0.70)" };
  if (seg.noCount) return { fill: "#1a1a2a", stroke: "rgba(120,120,160,0.35)" };
  return SEGMENT_FILLS[index % 2];
}

// ═══════════════════════════════════════
// DIBUJO COMPLETO
// ═══════════════════════════════════════

function drawWheel(rotation = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  SEGMENTS.forEach((seg, idx) => {
    const start = seg.startAngle + rotation;
    const end   = seg.endAngle   + rotation;
    const color = getSegmentFill(idx, seg);

    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, RADIUS, start, end);
    ctx.closePath();
    ctx.fillStyle   = color.fill;
    ctx.fill();
    ctx.strokeStyle = color.stroke;
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    drawSegmentLabel(seg, start, end);
  });

  drawDividers(rotation);
  drawCenter();
}

function drawSegmentLabel(seg, start, end) {
  const midAngle   = (start + end) / 2;
  const textRadius = RADIUS * 0.62;
  const tx = CX + Math.cos(midAngle) * textRadius;
  const ty = CY + Math.sin(midAngle) * textRadius;

  ctx.save();
  ctx.translate(tx, ty);
  ctx.rotate(midAngle + Math.PI / 2);

  const fontSize = 13;
  ctx.font         = `600 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";

  if (seg.special) {
    ctx.fillStyle   = "#e0bbff";
    ctx.shadowColor = "rgba(168,85,247,0.7)";
    ctx.shadowBlur  = 10;
  } else if (seg.noCount) {
    ctx.fillStyle   = "#8888aa";
    ctx.shadowBlur  = 0;
  } else {
    ctx.fillStyle   = "#f0d070";
    ctx.shadowColor = "rgba(240,200,80,0.5)";
    ctx.shadowBlur  = 6;
  }

  const words = seg.label.split(" ");
  if (words.length > 1) {
    const mid   = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(" ");
    const line2 = words.slice(mid).join(" ");
    ctx.fillText(line1, 0, -fontSize * 0.65);
    ctx.fillText(line2, 0,  fontSize * 0.65);
  } else {
    ctx.fillText(seg.label, 0, 0);
  }

  ctx.restore();
}

function drawDividers(rotation) {
  const count     = SEGMENTS.length;
  const sliceSize = (Math.PI * 2) / count;
  const START     = -Math.PI / 2;

  for (let i = 0; i < count; i++) {
    const angle = START + i * sliceSize + rotation;
    ctx.beginPath();
    ctx.moveTo(CX + Math.cos(angle) * 18, CY + Math.sin(angle) * 18);
    ctx.lineTo(CX + Math.cos(angle) * RADIUS, CY + Math.sin(angle) * RADIUS);
    ctx.strokeStyle = "rgba(201,168,76,0.25)";
    ctx.lineWidth   = 1;
    ctx.stroke();
  }
}

function drawCenter() {
  const r = 20;

  ctx.save();
  ctx.shadowColor = "rgba(200,160,60,0.4)";
  ctx.shadowBlur  = 14;
  ctx.beginPath();
  ctx.arc(CX, CY, r, 0, Math.PI * 2);
  ctx.fillStyle   = "#1a1408";
  ctx.fill();
  ctx.strokeStyle = "rgba(200,160,60,0.55)";
  ctx.lineWidth   = 1.5;
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle   = "#c9a84c";
  ctx.shadowColor = "rgba(200,160,60,0.7)";
  ctx.shadowBlur  = 10;

  const outerR = 10;
  const innerR = 4;
  const points = 4;

  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle  = (i * Math.PI) / points - Math.PI / 2;
    const radius = i % 2 === 0 ? outerR : innerR;
    const px     = CX + Math.cos(angle) * radius;
    const py     = CY + Math.sin(angle) * radius;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ═══════════════════════════════════════
// EASING — arranca lento, acelera fuerte, frena suave
// ═══════════════════════════════════════

function easeInOutSpin(t) {
  // Fase 1 (0–0.25): aceleración cuártica — lento al inicio
  if (t < 0.25) {
    return 0.5 * Math.pow(t / 0.25, 4) * 0.25;
  }
  // Fase 2 (0.25–0.70): velocidad máxima — casi lineal
  if (t < 0.70) {
    const tNorm = (t - 0.25) / 0.45;
    return 0.125 + tNorm * 0.55;
  }
  // Fase 3 (0.70–1.0): desaceleración cúbica suave con micro-bounce
  const tNorm = (t - 0.70) / 0.30;
  const ease  = 1 - Math.pow(1 - tNorm, 3);
  const bounce = Math.sin(tNorm * Math.PI) * 0.008;
  return 0.675 + ease * 0.325 + bounce;
}

// ═══════════════════════════════════════
// ANIMACIÓN
// ═══════════════════════════════════════

function spinWheel(callback) {
  if (isSpinning) return;
  if (!canSpin())  return;

  isSpinning = true;

  const resultado   = getWeightedResult();
  const centerAngle = getSegmentCenterAngle(resultado);

  const targetRotation = -Math.PI / 2 - centerAngle;
  const extraSpins     = (8 + Math.floor(Math.random() * 5)) * Math.PI * 2;
  let   delta          = ((targetRotation - currentAngle) % (Math.PI * 2));
  if (delta <= 0) delta += Math.PI * 2;
  delta += extraSpins;

  const startAngle  = currentAngle;
  const DURATION_MS = 5500 + Math.random() * 1000;
  let   startTime   = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed  = timestamp - startTime;
    const progress = Math.min(elapsed / DURATION_MS, 1);
    const eased    = easeInOutSpin(progress);

    currentAngle = startAngle + delta * eased;
    drawWheel(currentAngle);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      currentAngle = currentAngle % (Math.PI * 2);
      isSpinning   = false;
      drawWheel(currentAngle);
      callback(resultado);
    }
  }

  requestAnimationFrame(animate);
}

// ═══════════════════════════════════════
// RENDER INICIAL
// ═══════════════════════════════════════

drawWheel(currentAngle);
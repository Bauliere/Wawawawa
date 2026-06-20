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
// La probabilidad real vive en getWeightedResult(),
// NO en el tamaño visual del sector.
// ═══════════════════════════════════════

function buildSegments() {
  const count     = CONFIG.WHEEL_OPTIONS.length;
  const sliceSize = (Math.PI * 2) / count;
  const START     = -Math.PI / 2; // 12 en punto

  return CONFIG.WHEEL_OPTIONS.map((option, i) => {
    const startAngle = START + i * sliceSize;
    const endAngle   = START + (i + 1) * sliceSize;
    return { ...option, startAngle, endAngle };
  });
}

const SEGMENTS = buildSegments();

// ═══════════════════════════════════════
// RESULTADO PONDERADO (independiente del visual)
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

// Ángulo central del segmento visual de un label
function getSegmentCenterAngle(label) {
  const seg = SEGMENTS.find(s => s.label === label);
  if (!seg) return 0;
  return (seg.startAngle + seg.endAngle) / 2;
}

// ═══════════════════════════════════════
// PALETA — plana y opaca
// ═══════════════════════════════════════

const SEGMENT_FILLS = [
  { fill: "#2a2318", stroke: "rgba(180,140,60,0.30)" },
  { fill: "#22201a", stroke: "rgba(180,140,60,0.22)" },
  { fill: "#261f10", stroke: "rgba(180,140,60,0.28)" },
  { fill: "#1e1c14", stroke: "rgba(180,140,60,0.18)" },
];

function getSegmentFill(index, seg) {
  if (seg.special) return { fill: "#1a1030", stroke: "rgba(140,70,220,0.45)" };
  if (seg.noCount) return { fill: "#1c1c24", stroke: "rgba(100,100,130,0.22)" };
  return SEGMENT_FILLS[index % SEGMENT_FILLS.length];
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

    // Sector
    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, RADIUS, start, end);
    ctx.closePath();
    ctx.fillStyle   = color.fill;
    ctx.fill();
    ctx.strokeStyle = color.stroke;
    ctx.lineWidth   = 1;
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

  // Tamaño fijo porque todos los sectores son iguales
  const fontSize = 13;

  ctx.font         = `600 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";

  if (seg.special) {
    ctx.fillStyle   = "#cc99ff";
    ctx.shadowColor = "rgba(168,85,247,0.55)";
    ctx.shadowBlur  = 8;
  } else if (seg.noCount) {
    ctx.fillStyle   = "#66667a";
    ctx.shadowBlur  = 0;
  } else {
    ctx.fillStyle   = "#c8a03c";
    ctx.shadowColor = "rgba(190,150,50,0.35)";
    ctx.shadowBlur  = 4;
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

// Líneas divisorias entre sectores
function drawDividers(rotation) {
  const count     = SEGMENTS.length;
  const sliceSize = (Math.PI * 2) / count;
  const START     = -Math.PI / 2;

  for (let i = 0; i < count; i++) {
    const angle = START + i * sliceSize + rotation;
    ctx.beginPath();
    ctx.moveTo(
      CX + Math.cos(angle) * 18,
      CY + Math.sin(angle) * 18
    );
    ctx.lineTo(
      CX + Math.cos(angle) * RADIUS,
      CY + Math.sin(angle) * RADIUS
    );
    ctx.strokeStyle = "rgba(180,140,60,0.22)";
    ctx.lineWidth   = 1;
    ctx.stroke();
  }
}

function drawCenter() {
  const r = 20;

  ctx.save();
  ctx.shadowColor = "rgba(200,160,60,0.35)";
  ctx.shadowBlur  = 12;

  ctx.beginPath();
  ctx.arc(CX, CY, r, 0, Math.PI * 2);
  ctx.fillStyle   = "#28200e";
  ctx.fill();
  ctx.strokeStyle = "rgba(200,160,60,0.45)";
  ctx.lineWidth   = 1.5;
  ctx.stroke();

  ctx.restore();

  // Rombo central
  ctx.save();
  ctx.fillStyle = "#c9a84c";
  ctx.beginPath();
  ctx.moveTo(CX,      CY - 10);
  ctx.lineTo(CX + 8,  CY);
  ctx.lineTo(CX,      CY + 10);
  ctx.lineTo(CX - 8,  CY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#28200e";
  ctx.beginPath();
  ctx.moveTo(CX,      CY - 5);
  ctx.lineTo(CX + 4,  CY);
  ctx.lineTo(CX,      CY + 5);
  ctx.lineTo(CX - 4,  CY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ═══════════════════════════════════════
// EASING
// ═══════════════════════════════════════

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutWithBounce(t) {
  if (t < 0.88) return easeOutCubic(t / 0.88);
  const over = (t - 0.88) / 0.12;
  return 1 + Math.sin(over * Math.PI) * 0.012;
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

  // El puntero apunta a -π/2 (arriba)
  // Queremos que centerAngle del resultado quede ahí
  // rotation_final = -π/2 - centerAngle
  const targetRotation = -Math.PI / 2 - centerAngle;

  const extraSpins = (7 + Math.floor(Math.random() * 4)) * Math.PI * 2;
  let   delta      = ((targetRotation - currentAngle) % (Math.PI * 2));
  if (delta <= 0) delta += Math.PI * 2;
  delta += extraSpins;

  const startAngle  = currentAngle;
  const DURATION_MS = 4800 + Math.random() * 1000;
  let   startTime   = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed  = timestamp - startTime;
    const progress = Math.min(elapsed / DURATION_MS, 1);
    const eased    = easeOutWithBounce(progress);

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
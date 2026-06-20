// ═══════════════════════════════════════
// SETUP DEL CANVAS
// ═══════════════════════════════════════

const canvas  = document.getElementById("canvas-ruleta");
const ctx     = canvas.getContext("2d");
const CX      = canvas.width  / 2;
const CY      = canvas.height / 2;
const RADIUS  = CX - 8;

// Ángulo actual de rotación (en radianes), persiste entre giros
let currentAngle = 0;
let isSpinning   = false;

// ═══════════════════════════════════════
// CÁLCULO DE PESOS
// ═══════════════════════════════════════

// Convierte los pesos de WHEEL_OPTIONS en ángulos acumulados
function buildSegments() {
  const totalWeight = CONFIG.WHEEL_OPTIONS.reduce((s, o) => s + o.weight, 0);
  let accumulated = 0;

  return CONFIG.WHEEL_OPTIONS.map(option => {
    const startAngle = (accumulated / totalWeight) * (Math.PI * 2);
    accumulated += option.weight;
    const endAngle = (accumulated / totalWeight) * (Math.PI * 2);
    return { ...option, startAngle, endAngle };
  });
}

const SEGMENTS = buildSegments();

// ═══════════════════════════════════════
// RESULTADO PONDERADO
// ═══════════════════════════════════════

function getWeightedResult() {
  const totalWeight = CONFIG.WHEEL_OPTIONS.reduce((s, o) => s + o.weight, 0);
  const rand = Math.random() * totalWeight;
  let cumulative = 0;

  for (const option of CONFIG.WHEEL_OPTIONS) {
    cumulative += option.weight;
    if (rand <= cumulative) return option.label;
  }

  return CONFIG.WHEEL_OPTIONS[0].label;
}

// Dado un resultado, devuelve el ángulo central del segmento en la ruleta
function getSegmentCenterAngle(label) {
  const seg = SEGMENTS.find(s => s.label === label);
  if (!seg) return 0;
  return (seg.startAngle + seg.endAngle) / 2;
}

// ═══════════════════════════════════════
// DIBUJO DE LA RULETA
// ═══════════════════════════════════════

function drawWheel(rotation = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sombra exterior
  ctx.save();
  ctx.shadowColor = "rgba(201, 168, 76, 0.25)";
  ctx.shadowBlur  = 24;

  SEGMENTS.forEach(seg => {
    const start = seg.startAngle + rotation;
    const end   = seg.endAngle   + rotation;

    // ── Sector ──
    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, RADIUS, start, end);
    ctx.closePath();

    // Gradiente radial por sector
    const midAngle = (start + end) / 2;
    const gx = CX + Math.cos(midAngle) * RADIUS * 0.5;
    const gy = CY + Math.sin(midAngle) * RADIUS * 0.5;
    const grad = ctx.createRadialGradient(gx, gy, 0, CX, CY, RADIUS);

    if (seg.special) {
      // Sorpresa: morado
      grad.addColorStop(0, "#9f4ff5");
      grad.addColorStop(1, "#4a1080");
    } else if (seg.noCount) {
      // Otro intento: gris oscuro
      grad.addColorStop(0, "#444444");
      grad.addColorStop(1, "#222222");
    } else {
      // Opciones normales: variantes doradas/oscuras alternadas
      const isEven = SEGMENTS.indexOf(seg) % 2 === 0;
      if (isEven) {
        grad.addColorStop(0, "#2a2000");
        grad.addColorStop(1, "#1a1400");
      } else {
        grad.addColorStop(0, "#1e1800");
        grad.addColorStop(1, "#100e00");
      }
    }

    ctx.fillStyle = grad;
    ctx.fill();

    // ── Borde del sector ──
    ctx.strokeStyle = seg.special
      ? "rgba(168, 85, 247, 0.6)"
      : "rgba(201, 168, 76, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // ── Texto del sector ──
    drawSegmentLabel(seg, start, end);
  });

  ctx.restore();

  // Aro exterior dorado
  drawRim(rotation);

  // Centro
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

  // Tamaño de fuente adaptativo según longitud del label
  const arcLength = (end - start) * RADIUS;
  const fontSize  = Math.min(14, Math.max(9, arcLength / (seg.label.length * 0.75)));

  ctx.font        = `700 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
  ctx.textAlign   = "center";
  ctx.textBaseline= "middle";

  if (seg.special) {
    // Sorpresa: texto blanco con glow morado
    ctx.shadowColor = "#a855f7";
    ctx.shadowBlur  = 10;
    ctx.fillStyle   = "#ffffff";
  } else if (seg.noCount) {
    ctx.fillStyle   = "#888888";
    ctx.shadowBlur  = 0;
  } else {
    ctx.shadowColor = "rgba(201, 168, 76, 0.8)";
    ctx.shadowBlur  = 6;
    ctx.fillStyle   = "#f0c040";
  }

  // Texto largo: partir en dos líneas si es necesario
  const words = seg.label.split(" ");
  if (words.length > 1 && seg.label.length > 8) {
    const mid = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(" ");
    const line2 = words.slice(mid).join(" ");
    ctx.fillText(line1, 0, -fontSize * 0.6);
    ctx.fillText(line2, 0,  fontSize * 0.6);
  } else {
    ctx.fillText(seg.label, 0, 0);
  }

  ctx.restore();
}

function drawRim(rotation) {
  // Marcas del aro exterior
  ctx.save();
  const rimRadius = RADIUS + 4;

  SEGMENTS.forEach(seg => {
    const angle = seg.startAngle + rotation;
    ctx.beginPath();
    ctx.moveTo(
      CX + Math.cos(angle) * (RADIUS - 2),
      CY + Math.sin(angle) * (RADIUS - 2)
    );
    ctx.lineTo(
      CX + Math.cos(angle) * (rimRadius + 2),
      CY + Math.sin(angle) * (rimRadius + 2)
    );
    ctx.strokeStyle = seg.special
      ? "rgba(168,85,247,0.7)"
      : "rgba(201,168,76,0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  ctx.restore();
}

function drawCenter() {
  // Círculo central
  const centerRadius = 22;

  // Sombra
  ctx.save();
  ctx.shadowColor = "rgba(201,168,76,0.5)";
  ctx.shadowBlur  = 16;

  // Relleno
  const centerGrad = ctx.createRadialGradient(CX, CY, 0, CX, CY, centerRadius);
  centerGrad.addColorStop(0, "#ffe066");
  centerGrad.addColorStop(1, "#a07830");
  ctx.beginPath();
  ctx.arc(CX, CY, centerRadius, 0, Math.PI * 2);
  ctx.fillStyle = centerGrad;
  ctx.fill();

  // Borde
  ctx.strokeStyle = "rgba(255,224,102,0.6)";
  ctx.lineWidth   = 2;
  ctx.stroke();

  // Emoji central
  ctx.font      = "16px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowBlur = 0;
  ctx.fillText("🎰", CX, CY);

  ctx.restore();
}

// ═══════════════════════════════════════
// ANIMACIÓN DE GIRO
// ═══════════════════════════════════════

// Easing: ease-out cúbico
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Easing con rebote suave al final
function easeOutBounce(t) {
  if (t < 0.85) {
    return easeOut(t / 0.85);
  }
  const overshoot = (t - 0.85) / 0.15;
  return 1 + Math.sin(overshoot * Math.PI) * 0.015;
}

/**
 * Anima la ruleta y llama a callback(resultado) al terminar.
 * Llamada desde app.js: spinWheel(onSpinComplete)
 */
function spinWheel(callback) {
  if (isSpinning) return;
  if (!canSpin())  return;

  isSpinning = true;

  // Determinar resultado ANTES de animar (para calcular ángulo de parada)
  const resultado   = getWeightedResult();
  const targetCenter = getSegmentCenterAngle(resultado);

  // Vueltas completas: entre 6 y 10 para sensación de emoción
  const extraSpins  = (6 + Math.floor(Math.random() * 4)) * Math.PI * 2;

  // El puntero está en la parte superior (−π/2).
  // Queremos que targetCenter quede apuntando al puntero al terminar.
  // Ajustamos para que la parada sea exacta.
  const pointerAngle = -Math.PI / 2;
  const targetFinal  = pointerAngle - targetCenter;

  // Diferencia desde ángulo actual, siempre avanzando
  let delta = (targetFinal - currentAngle) % (Math.PI * 2);
  if (delta <= 0) delta += Math.PI * 2;
  delta += extraSpins;

  const totalAngle = delta;
  const startAngle = currentAngle;

  const DURATION_MS = 4500 + Math.random() * 1000; // 4.5–5.5s
  let   startTime   = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed  = timestamp - startTime;
    const progress = Math.min(elapsed / DURATION_MS, 1);
    const easedProgress = easeOutBounce(progress);

    currentAngle = startAngle + totalAngle * easedProgress;
    drawWheel(currentAngle);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Normalizar ángulo final para evitar acumulación infinita
      currentAngle = currentAngle % (Math.PI * 2);
      isSpinning   = false;
      drawWheel(currentAngle);

      // Llamar al callback con el resultado
      callback(resultado);
    }
  }

  requestAnimationFrame(animate);
}

// ═══════════════════════════════════════
// DIBUJO INICIAL
// ═══════════════════════════════════════

drawWheel(currentAngle);
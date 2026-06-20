// Patitas de gato SVG — 15 variantes con detalles distintos
const STAMP_ICONS = [
  // 1
  `<svg viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="15" rx="5" ry="4" fill="currentColor"/>
    <ellipse cx="8"  cy="10" rx="2"   ry="2.5" fill="currentColor"/>
    <ellipse cx="16" cy="10" rx="2"   ry="2.5" fill="currentColor"/>
    <ellipse cx="5"  cy="13" rx="1.5" ry="2"   fill="currentColor"/>
    <ellipse cx="19" cy="13" rx="1.5" ry="2"   fill="currentColor"/>
  </svg>`,
  // 2 — con detalles de almohadillas
  `<svg viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="15.5" rx="5.2" ry="4.2" fill="currentColor"/>
    <ellipse cx="8"  cy="10"   rx="2.1" ry="2.6" fill="currentColor"/>
    <ellipse cx="16" cy="10"   rx="2.1" ry="2.6" fill="currentColor"/>
    <ellipse cx="5"  cy="13.5" rx="1.6" ry="2.1" fill="currentColor"/>
    <ellipse cx="19" cy="13.5" rx="1.6" ry="2.1" fill="currentColor"/>
    <ellipse cx="12" cy="16"   rx="1.8" ry="1.2" fill="currentColor" opacity="0.4"/>
    <ellipse cx="10" cy="14.5" rx="1"   ry="0.8" fill="currentColor" opacity="0.4"/>
    <ellipse cx="14" cy="14.5" rx="1"   ry="0.8" fill="currentColor" opacity="0.4"/>
  </svg>`,
  // 3
  `<svg viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="15" rx="5" ry="4" fill="currentColor"/>
    <ellipse cx="7.5"  cy="9.5"  rx="2"   ry="2.5" fill="currentColor"/>
    <ellipse cx="16.5" cy="9.5"  rx="2"   ry="2.5" fill="currentColor"/>
    <ellipse cx="4.5"  cy="12.5" rx="1.4" ry="1.9" fill="currentColor"/>
    <ellipse cx="19.5" cy="12.5" rx="1.4" ry="1.9" fill="currentColor"/>
    <circle  cx="12"   cy="15.5" r="1" fill="currentColor" opacity="0.35"/>
  </svg>`,
  // 4
  `<svg viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="15.5" rx="5.5" ry="4.5" fill="currentColor"/>
    <ellipse cx="8"  cy="10"   rx="2.2" ry="2.8" fill="currentColor"/>
    <ellipse cx="16" cy="10"   rx="2.2" ry="2.8" fill="currentColor"/>
    <ellipse cx="5"  cy="13.5" rx="1.6" ry="2.2" fill="currentColor"/>
    <ellipse cx="19" cy="13.5" rx="1.6" ry="2.2" fill="currentColor"/>
  </svg>`,
  // 5
  `<svg viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="15" rx="4.8" ry="3.8" fill="currentColor"/>
    <ellipse cx="8"  cy="9.5" rx="1.9" ry="2.4" fill="currentColor"/>
    <ellipse cx="16" cy="9.5" rx="1.9" ry="2.4" fill="currentColor"/>
    <ellipse cx="5"  cy="12.5" rx="1.4" ry="1.8" fill="currentColor"/>
    <ellipse cx="19" cy="12.5" rx="1.4" ry="1.8" fill="currentColor"/>
    <ellipse cx="12" cy="15.8" rx="2.5" ry="1.5" fill="currentColor" opacity="0.3"/>
  </svg>`,
  // 6 — ligeramente rotada
  `<svg viewBox="0 0 24 24" fill="none">
    <g transform="rotate(-8 12 12)">
      <ellipse cx="12" cy="15" rx="5" ry="4" fill="currentColor"/>
      <ellipse cx="8"  cy="10" rx="2"   ry="2.5" fill="currentColor"/>
      <ellipse cx="16" cy="10" rx="2"   ry="2.5" fill="currentColor"/>
      <ellipse cx="5"  cy="13" rx="1.5" ry="2"   fill="currentColor"/>
      <ellipse cx="19" cy="13" rx="1.5" ry="2"   fill="currentColor"/>
    </g>
  </svg>`,
  // 7
  `<svg viewBox="0 0 24 24" fill="none">
    <g transform="rotate(8 12 12)">
      <ellipse cx="12" cy="15" rx="5" ry="4" fill="currentColor"/>
      <ellipse cx="8"  cy="10" rx="2"   ry="2.5" fill="currentColor"/>
      <ellipse cx="16" cy="10" rx="2"   ry="2.5" fill="currentColor"/>
      <ellipse cx="5"  cy="13" rx="1.5" ry="2"   fill="currentColor"/>
      <ellipse cx="19" cy="13" rx="1.5" ry="2"   fill="currentColor"/>
    </g>
  </svg>`,
  // 8 — con contorno
  `<svg viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="15" rx="5" ry="4" fill="currentColor" stroke="currentColor" stroke-width="0.5" opacity="0.6"/>
    <ellipse cx="8"  cy="10" rx="2"   ry="2.5" fill="currentColor"/>
    <ellipse cx="16" cy="10" rx="2"   ry="2.5" fill="currentColor"/>
    <ellipse cx="5"  cy="13" rx="1.5" ry="2"   fill="currentColor"/>
    <ellipse cx="19" cy="13" rx="1.5" ry="2"   fill="currentColor"/>
    <ellipse cx="12" cy="16" rx="1.5" ry="1"   fill="currentColor" opacity="0.35"/>
    <ellipse cx="10.2" cy="14.5" rx="0.9" ry="0.7" fill="currentColor" opacity="0.35"/>
    <ellipse cx="13.8" cy="14.5" rx="0.9" ry="0.7" fill="currentColor" opacity="0.35"/>
  </svg>`,
  // 9 — más pequeña
  `<svg viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="15.5" rx="4.5" ry="3.5" fill="currentColor"/>
    <ellipse cx="8.5"  cy="10.5" rx="1.8" ry="2.2" fill="currentColor"/>
    <ellipse cx="15.5" cy="10.5" rx="1.8" ry="2.2" fill="currentColor"/>
    <ellipse cx="5.5"  cy="13.5" rx="1.3" ry="1.8" fill="currentColor"/>
    <ellipse cx="18.5" cy="13.5" rx="1.3" ry="1.8" fill="currentColor"/>
  </svg>`,
  // 10 — más grande
  `<svg viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="15" rx="5.5" ry="4.5" fill="currentColor"/>
    <ellipse cx="7.5"  cy="9.5"  rx="2.3" ry="2.9" fill="currentColor"/>
    <ellipse cx="16.5" cy="9.5"  rx="2.3" ry="2.9" fill="currentColor"/>
    <ellipse cx="4.5"  cy="13"   rx="1.7" ry="2.3" fill="currentColor"/>
    <ellipse cx="19.5" cy="13"   rx="1.7" ry="2.3" fill="currentColor"/>
  </svg>`,
  // 11
  `<svg viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="15" rx="5" ry="4" fill="currentColor"/>
    <ellipse cx="8"  cy="10" rx="2"   ry="2.5" fill="currentColor"/>
    <ellipse cx="16" cy="10" rx="2"   ry="2.5" fill="currentColor"/>
    <ellipse cx="5"  cy="13" rx="1.5" ry="2"   fill="currentColor"/>
    <ellipse cx="19" cy="13" rx="1.5" ry="2"   fill="currentColor"/>
    <circle cx="12" cy="15" r="2.5" fill="currentColor" opacity="0.25"/>
  </svg>`,
  // 12
  `<svg viewBox="0 0 24 24" fill="none">
    <ellipse cx="12"   cy="16"   rx="5.2" ry="4" fill="currentColor"/>
    <ellipse cx="8"    cy="10.5" rx="2"   ry="2.6" fill="currentColor"/>
    <ellipse cx="16"   cy="10.5" rx="2"   ry="2.6" fill="currentColor"/>
    <ellipse cx="4.8"  cy="14"   rx="1.5" ry="2"   fill="currentColor"/>
    <ellipse cx="19.2" cy="14"   rx="1.5" ry="2"   fill="currentColor"/>
    <ellipse cx="12"   cy="16.5" rx="3"   ry="1.8" fill="currentColor" opacity="0.3"/>
  </svg>`,
  // 13
  `<svg viewBox="0 0 24 24" fill="none">
    <g transform="rotate(-5 12 12)">
      <ellipse cx="12" cy="15.5" rx="5.2" ry="4.2" fill="currentColor"/>
      <ellipse cx="8"  cy="10"   rx="2.1" ry="2.6" fill="currentColor"/>
      <ellipse cx="16" cy="10"   rx="2.1" ry="2.6" fill="currentColor"/>
      <ellipse cx="5"  cy="13.5" rx="1.6" ry="2.1" fill="currentColor"/>
      <ellipse cx="19" cy="13.5" rx="1.6" ry="2.1" fill="currentColor"/>
    </g>
  </svg>`,
  // 14
  `<svg viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="14.5" rx="5.5" ry="4.5" fill="currentColor"/>
    <ellipse cx="7.5"  cy="9"   rx="2.2" ry="2.8" fill="currentColor"/>
    <ellipse cx="16.5" cy="9"   rx="2.2" ry="2.8" fill="currentColor"/>
    <ellipse cx="4.5"  cy="12.5" rx="1.6" ry="2.2" fill="currentColor"/>
    <ellipse cx="19.5" cy="12.5" rx="1.6" ry="2.2" fill="currentColor"/>
    <ellipse cx="12"   cy="15.2" rx="2"   ry="1.3" fill="currentColor" opacity="0.35"/>
    <ellipse cx="10"   cy="14"   rx="1.1" ry="0.9" fill="currentColor" opacity="0.35"/>
    <ellipse cx="14"   cy="14"   rx="1.1" ry="0.9" fill="currentColor" opacity="0.35"/>
  </svg>`,
  // 15 — especial (más grande + doble almohadilla)
  `<svg viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="15" rx="5.8" ry="4.8" fill="currentColor"/>
    <ellipse cx="7.5"  cy="9.5"  rx="2.4" ry="3"   fill="currentColor"/>
    <ellipse cx="16.5" cy="9.5"  rx="2.4" ry="3"   fill="currentColor"/>
    <ellipse cx="4"    cy="13"   rx="1.8" ry="2.4" fill="currentColor"/>
    <ellipse cx="20"   cy="13"   rx="1.8" ry="2.4" fill="currentColor"/>
    <ellipse cx="12"   cy="16"   rx="2.2" ry="1.5" fill="currentColor" opacity="0.4"/>
    <ellipse cx="9.8"  cy="14.5" rx="1.2" ry="1"   fill="currentColor" opacity="0.4"/>
    <ellipse cx="14.2" cy="14.5" rx="1.2" ry="1"   fill="currentColor" opacity="0.4"/>
    <circle  cx="12"   cy="10"   r="1.2" fill="currentColor" opacity="0.25"/>
  </svg>`
];

const EMPTY_ICON = `<svg viewBox="0 0 24 24" fill="none">
  <ellipse cx="12" cy="15" rx="5" ry="4"
    stroke="rgba(255,255,255,0.12)" stroke-width="1.2" stroke-dasharray="2 2" fill="none"/>
  <ellipse cx="8"  cy="10" rx="2"   ry="2.5"
    stroke="rgba(255,255,255,0.12)" stroke-width="1.2" stroke-dasharray="2 2" fill="none"/>
  <ellipse cx="16" cy="10" rx="2"   ry="2.5"
    stroke="rgba(255,255,255,0.12)" stroke-width="1.2" stroke-dasharray="2 2" fill="none"/>
  <ellipse cx="5"  cy="13" rx="1.5" ry="2"
    stroke="rgba(255,255,255,0.12)" stroke-width="1.2" stroke-dasharray="2 2" fill="none"/>
  <ellipse cx="19" cy="13" rx="1.5" ry="2"
    stroke="rgba(255,255,255,0.12)" stroke-width="1.2" stroke-dasharray="2 2" fill="none"/>
</svg>`;

const NEXT_ICON = `<svg viewBox="0 0 24 24" fill="none">
  <ellipse cx="12" cy="15" rx="5" ry="4"
    stroke="rgba(255,255,255,0.28)" stroke-width="1.4" fill="none"/>
  <ellipse cx="8"  cy="10" rx="2"   ry="2.5"
    stroke="rgba(255,255,255,0.28)" stroke-width="1.4" fill="none"/>
  <ellipse cx="16" cy="10" rx="2"   ry="2.5"
    stroke="rgba(255,255,255,0.28)" stroke-width="1.4" fill="none"/>
  <ellipse cx="5"  cy="13" rx="1.5" ry="2"
    stroke="rgba(255,255,255,0.28)" stroke-width="1.4" fill="none"/>
  <ellipse cx="19" cy="13" rx="1.5" ry="2"
    stroke="rgba(255,255,255,0.28)" stroke-width="1.4" fill="none"/>
</svg>`;

// ═══════════════════════════════════════
// RENDER
// ═══════════════════════════════════════

function renderStamps() {
  const grid      = document.getElementById("sellos-grid");
  const countEl   = document.getElementById("sellos-count");
  const btnSellar = document.getElementById("btn-sellar-hoy");
  const inputMsg  = document.getElementById("input-sello-mensaje");
  const msgGroup  = document.getElementById("sello-mensaje-group");
  const bonusMsg  = document.getElementById("sellos-bonus-msg");
  const errorEl   = document.getElementById("sellos-error");

  const stampsEnCiclo = appState.stampsEnCiclo;
  const sellosHoy     = appState.sellosHoy;

  countEl.textContent = stampsEnCiclo;
  grid.innerHTML      = "";

  for (let i = 0; i < CONFIG.STAMPS_PER_CYCLE; i++) {
    const item = document.createElement("div");
    item.classList.add("sello-item");

    if (i < stampsEnCiclo) {
      const isGold = i % 2 === 0;
      item.classList.add(isGold ? "filled-gold" : "filled-purple");
      item.innerHTML   = STAMP_ICONS[i];
      item.style.color = isGold ? "#c9a84c" : "#a855f7";
      item.title       = `Sello ${i + 1} de 15`;
    } else if (i === stampsEnCiclo && !sellosHoy) {
      item.classList.add("empty", "next");
      item.innerHTML = NEXT_ICON;
      item.title     = "Siguiente sello disponible";
    } else {
      item.classList.add("empty");
      item.innerHTML = EMPTY_ICON;
      item.title     = `Sello ${i + 1} de 15`;
    }

    grid.appendChild(item);
  }

  // Mostrar/ocultar input de mensaje y botón según si ya selló hoy
  if (sellosHoy) {
    msgGroup.classList.add("hidden");
    btnSellar.disabled = true;
    const span = btnSellar.querySelector("span");
    if (span) span.textContent = "Ya sellaste hoy";
  } else {
    msgGroup.classList.remove("hidden");
    // Botón solo se activa si hay mensaje escrito
    const mensajeActual = inputMsg ? inputMsg.value.trim() : "";
    btnSellar.disabled = mensajeActual.length === 0;
    const span = btnSellar.querySelector("span");
    if (span) span.textContent = "Sellar hoy";
  }

  if (stampsEnCiclo < CONFIG.STAMPS_PER_CYCLE) {
    bonusMsg.classList.add("hidden");
  }

  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
  }
}

function animateNewStamp() {
  const items = document.querySelectorAll(
    "#sellos-grid .sello-item.filled-gold, #sellos-grid .sello-item.filled-purple"
  );
  if (!items.length) return;
  const last = items[items.length - 1];
  last.style.animation = "none";
  last.offsetHeight;
  last.style.animation = "stampAppear 0.5s ease forwards";
}

function renderStampsWithAnimation() {
  renderStamps();
  animateNewStamp();
}
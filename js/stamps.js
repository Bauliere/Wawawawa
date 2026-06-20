// ═══════════════════════════════════════
// RENDER DE LA CUADRÍCULA DE SELLOS
// ═══════════════════════════════════════

// SVG inline para los iconos de sello — paleta black-gold
const STAMP_ICONS = [
  // 1 - Estrella
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      fill="#c9a84c" stroke="#ffe066" stroke-width="1"/>
  </svg>`,
  // 2 - Diamante
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,2 22,9 12,22 2,9"
      fill="#c9a84c" stroke="#ffe066" stroke-width="1"/>
    <polygon points="12,5 19,9 12,19 5,9"
      fill="#a07830" stroke="none"/>
  </svg>`,
  // 3 - Corona
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 18 L5 8 L9 13 L12 4 L15 13 L19 8 L22 18 Z"
      fill="#c9a84c" stroke="#ffe066" stroke-width="1" stroke-linejoin="round"/>
    <rect x="2" y="18" width="20" height="2.5" rx="1"
      fill="#ffe066"/>
  </svg>`,
  // 4 - Rayo
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="13,2 4,13 11,13 11,22 20,11 13,11"
      fill="#c9a84c" stroke="#ffe066" stroke-width="1" stroke-linejoin="round"/>
  </svg>`,
  // 5 - Trébol / flor
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8"  r="4" fill="#c9a84c"/>
    <circle cx="8"  cy="14" r="4" fill="#c9a84c"/>
    <circle cx="16" cy="14" r="4" fill="#c9a84c"/>
    <rect x="11" y="14" width="2" height="6" rx="1" fill="#ffe066"/>
  </svg>`,
  // 6 - Escudo
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2 L20 6 L20 13 C20 17.4 16.4 21.2 12 22 C7.6 21.2 4 17.4 4 13 L4 6 Z"
      fill="#c9a84c" stroke="#ffe066" stroke-width="1"/>
    <path d="M12 5 L17 8 L17 13 C17 16 14.8 18.5 12 19.3 C9.2 18.5 7 16 7 13 L7 8 Z"
      fill="#a07830"/>
  </svg>`,
  // 7 - Corazón
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21 C12 21 3 14 3 8.5 C3 5.42 5.42 3 8.5 3 C10.24 3 11.91 3.81 13 5.08 C14.09 3.81 15.76 3 17.5 3 C20.58 3 23 5.42 23 8.5 C23 14 12 21 12 21 Z"
      fill="#c9a84c" stroke="#ffe066" stroke-width="1"/>
  </svg>`,
  // 8 - Círculo con check
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#c9a84c" stroke="#ffe066" stroke-width="1"/>
    <path d="M7 12 L10.5 15.5 L17 9"
      stroke="#0a0800" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  // 9 - Luna
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12.79 A9 9 0 1 1 11.21 3 A7 7 0 0 0 21 12.79 Z"
      fill="#c9a84c" stroke="#ffe066" stroke-width="1"/>
  </svg>`,
  // 10 - Hexágono
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,2 21,7 21,17 12,22 3,17 3,7"
      fill="#c9a84c" stroke="#ffe066" stroke-width="1"/>
    <polygon points="12,5 18,8.5 18,15.5 12,19 6,15.5 6,8.5"
      fill="#a07830"/>
  </svg>`,
  // 11 - Flecha arriba (progreso)
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3 L20 14 H15 V21 H9 V14 H4 Z"
      fill="#c9a84c" stroke="#ffe066" stroke-width="1" stroke-linejoin="round"/>
  </svg>`,
  // 12 - Ojo (misterio)
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 12 C1 12 5 5 12 5 C19 5 23 12 23 12 C23 12 19 19 12 19 C5 19 1 12 1 12 Z"
      fill="#c9a84c" stroke="#ffe066" stroke-width="1"/>
    <circle cx="12" cy="12" r="3.5" fill="#0a0800"/>
    <circle cx="13" cy="11" r="1.2" fill="#ffe066"/>
  </svg>`,
  // 13 - Llama
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2 C12 2 16 7 16 11 C16 11 14 10 13 8 C13 8 14 14 10 17 C10 17 10 14 8 13 C6 15 7 18 9 20 C6 19 4 16 4 13 C4 9 8 5 12 2 Z"
      fill="#c9a84c" stroke="#ffe066" stroke-width="0.8"/>
    <path d="M12 14 C12 14 14 16 12 19 C10 16 12 14 12 14 Z"
      fill="#ffe066"/>
  </svg>`,
  // 14 - Trofeo
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2 H16 V10 C16 14 13 16 12 16 C11 16 8 14 8 10 Z"
      fill="#c9a84c" stroke="#ffe066" stroke-width="1"/>
    <path d="M5 3 H8 C8 3 6 7 6 10 C5 9 3 7 3 5 C3 3.9 3.9 3 5 3 Z"
      fill="#a07830" stroke="#ffe066" stroke-width="0.8"/>
    <path d="M16 3 H19 C20.1 3 21 3.9 21 5 C21 7 19 9 18 10 C18 7 16 3 16 3 Z"
      fill="#a07830" stroke="#ffe066" stroke-width="0.8"/>
    <rect x="10" y="16" width="4" height="3" fill="#c9a84c"/>
    <rect x="7"  y="19" width="10" height="2" rx="1" fill="#ffe066"/>
  </svg>`,
  // 15 - Infinito / bonus (el especial)
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12 C10 9 6 7 4 9 C2 11 2 13 4 15 C6 17 10 15 12 12 Z"
      fill="#ffe066" stroke="#c9a84c" stroke-width="1"/>
    <path d="M12 12 C14 9 18 7 20 9 C22 11 22 13 20 15 C18 17 14 15 12 12 Z"
      fill="#ffe066" stroke="#c9a84c" stroke-width="1"/>
    <circle cx="12" cy="12" r="2" fill="#c9a84c"/>
  </svg>`
];

// Icono SVG para slot vacío
const EMPTY_ICON = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9" stroke="rgba(201,168,76,0.25)" stroke-width="1.5" stroke-dasharray="3 3"/>
</svg>`;

// Icono SVG para slot "siguiente"
const NEXT_ICON = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9" stroke="#c9a84c" stroke-width="1.5"/>
  <line x1="12" y1="7" x2="12" y2="17" stroke="#c9a84c" stroke-width="2" stroke-linecap="round"/>
  <line x1="7"  y1="12" x2="17" y2="12" stroke="#c9a84c" stroke-width="2" stroke-linecap="round"/>
</svg>`;

// ═══════════════════════════════════════
// RENDER PRINCIPAL
// ═══════════════════════════════════════

function renderStamps() {
  const grid     = document.getElementById("sellos-grid");
  const countEl  = document.getElementById("sellos-count");
  const btnSellar= document.getElementById("btn-sellar-hoy");
  const bonusMsg = document.getElementById("sellos-bonus-msg");
  const errorEl  = document.getElementById("sellos-error");

  const stampsEnCiclo = appState.stampsEnCiclo;
  const sellosHoy     = appState.sellosHoy;

  countEl.textContent = stampsEnCiclo;
  grid.innerHTML      = "";

  for (let i = 0; i < CONFIG.STAMPS_PER_CYCLE; i++) {
    const item = document.createElement("div");
    item.classList.add("sello-item");

    if (i < stampsEnCiclo) {
      item.classList.add("filled");
      item.innerHTML = STAMP_ICONS[i];
      item.title     = `Sello ${i + 1} de 15`;
    } else if (i === stampsEnCiclo) {
      item.classList.add("empty", "next");
      item.innerHTML = NEXT_ICON;
      item.title     = "¡El siguiente sello es tuyo!";
    } else {
      item.classList.add("empty");
      item.innerHTML = EMPTY_ICON;
      item.title     = `Sello ${i + 1} de 15`;
    }

    grid.appendChild(item);
  }

  // Estado del botón sellar
  btnSellar.disabled    = sellosHoy;
  btnSellar.textContent = sellosHoy ? "Ya sellaste hoy" : "Sellar hoy";

  // Ocultar bonus si no aplica
  if (stampsEnCiclo < CONFIG.STAMPS_PER_CYCLE) {
    bonusMsg.classList.add("hidden");
  }

  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
  }
}

// ═══════════════════════════════════════
// ANIMACIÓN AL GANAR SELLO NUEVO
// ═══════════════════════════════════════

function animateNewStamp() {
  const grid  = document.getElementById("sellos-grid");
  const items = grid.querySelectorAll(".sello-item.filled");
  if (items.length === 0) return;

  const last = items[items.length - 1];
  last.style.animation = "none";
  last.offsetHeight;
  last.style.animation = "stampAppear 0.5s ease forwards";
}

function renderStampsWithAnimation() {
  renderStamps();
  animateNewStamp();
}
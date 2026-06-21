// Íconos SVG únicos — 15 variantes
const STAMP_ICONS = [
  // 1 — Estrella
  `<svg viewBox="0 0 24 24" fill="none">
    <polygon points="12,2 14.7,9.1 22,9.6 16.3,14.3 18.2,21.5 12,17.4 5.8,21.5 7.7,14.3 2,9.6 9.3,9.1"
             fill="currentColor"/>
    <polygon points="12,2 14.7,9.1 12,9.8" fill="currentColor" opacity="0.5"/>
  </svg>`,
  // 2 — Corazón
  `<svg viewBox="0 0 24 24" fill="none">
    <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z"
          fill="currentColor"/>
    <ellipse cx="7.6" cy="7.4" rx="2.1" ry="1.3" fill="currentColor" opacity="0.5" transform="rotate(-35 7.6 7.4)"/>
  </svg>`,
  // 3 — Corona clásica
  `<svg viewBox="0 0 24 24" fill="none">
    <polygon points="4,18 6,7 9,12 12,4 15,12 18,7 20,18" fill="currentColor"/>
    <rect x="4" y="18" width="16" height="3" rx="1.5" fill="currentColor"/>
    <circle cx="6" cy="7" r="1.6" fill="currentColor"/>
    <circle cx="12" cy="4" r="1.8" fill="currentColor"/>
    <circle cx="18" cy="7" r="1.6" fill="currentColor"/>
    <polygon points="9,12 12,4 15,12" fill="currentColor" opacity="0.5"/>
  </svg>`,
  // 4 — Diamante facetado
  `<svg viewBox="0 0 24 24" fill="none">
    <polygon points="12,2 21,9 12,22 3,9" fill="currentColor"/>
    <polygon points="12,2 21,9 12,9.6" fill="currentColor" opacity="0.55"/>
    <polygon points="3,9 12,9.6 12,2" fill="currentColor" opacity="0.3"/>
  </svg>`,
  // 5 — Destello / sparkle
  `<svg viewBox="0 0 24 24" fill="none">
    <polygon points="12,1 15,9 23,12 15,15 12,23 9,15 1,12 9,9" fill="currentColor"/>
    <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.5"/>
  </svg>`,
  // 6 — Luna creciente
  `<svg viewBox="0 0 24 24" fill="none">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill="currentColor"/>
    <circle cx="17.5" cy="5.5" r="1.2" fill="currentColor" opacity="0.6"/>
  </svg>`,
  // 7 — Sol
  `<svg viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="4.2" fill="currentColor"/>
    <line x1="12" y1="2"  x2="12" y2="5"  stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="2"  y1="12" x2="5"  y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="4.22"  y1="4.22"  x2="6.34"  y2="6.34"  stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="4.22"  y1="19.78" x2="6.34"  y2="17.66" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"  stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  // 8 — Flor
  `<svg viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
    <ellipse cx="12" cy="5.5" rx="2.2" ry="3.5" fill="currentColor" opacity="0.85"/>
    <ellipse cx="12" cy="18.5" rx="2.2" ry="3.5" fill="currentColor" opacity="0.85"/>
    <ellipse cx="5.5" cy="12" rx="3.5" ry="2.2" fill="currentColor" opacity="0.85"/>
    <ellipse cx="18.5" cy="12" rx="3.5" ry="2.2" fill="currentColor" opacity="0.85"/>
    <ellipse cx="7.3" cy="7.3" rx="2.2" ry="3.5" fill="currentColor" opacity="0.7" transform="rotate(-45 7.3 7.3)"/>
    <ellipse cx="16.7" cy="16.7" rx="2.2" ry="3.5" fill="currentColor" opacity="0.7" transform="rotate(-45 16.7 16.7)"/>
    <ellipse cx="16.7" cy="7.3" rx="2.2" ry="3.5" fill="currentColor" opacity="0.7" transform="rotate(45 16.7 7.3)"/>
    <ellipse cx="7.3" cy="16.7" rx="2.2" ry="3.5" fill="currentColor" opacity="0.7" transform="rotate(45 7.3 16.7)"/>
  </svg>`,
  // 9 — Rayo
  `<svg viewBox="0 0 24 24" fill="none">
    <polygon points="13,1 4,14 11,14 10,23 20,10 13,10" fill="currentColor"/>
    <polygon points="13,1 11,9 13,10" fill="currentColor" opacity="0.5"/>
  </svg>`,
  // 10 — Trofeo
  `<svg viewBox="0 0 24 24" fill="none">
    <path d="M7 3H17V9C17 12.31 14.76 15 12 15C9.24 15 7 12.31 7 9V3Z" fill="currentColor"/>
    <path d="M7 4C5.5 4 4 5 4 6.5C4 8.3 5.5 9.5 7.2 9.8" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M17 4C18.5 4 20 5 20 6.5C20 8.3 18.5 9.5 16.8 9.8" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <rect x="10.8" y="15" width="2.4" height="4" fill="currentColor"/>
    <rect x="8" y="19" width="8" height="2.2" rx="1.1" fill="currentColor"/>
    <polygon points="12,5 12.8,7.2 15,7.2 13.3,8.5 13.9,10.7 12,9.4 10.1,10.7 10.7,8.5 9,7.2 11.2,7.2"
             fill="currentColor" opacity="0.45"/>
  </svg>`,
  // 11 — Escudo
  `<svg viewBox="0 0 24 24" fill="none">
    <path d="M12 2L20 5V11C20 16 16.5 20.5 12 22C7.5 20.5 4 16 4 11V5L12 2Z" fill="currentColor"/>
    <polygon points="12,8 13.2,11 16.5,11 13.8,13 14.8,16.2 12,14.2 9.2,16.2 10.2,13 7.5,11 10.8,11"
             fill="currentColor" opacity="0.55"/>
  </svg>`,
  // 12 — Medalla
  `<svg viewBox="0 0 24 24" fill="none">
    <path d="M9 12L5 22L12 19L19 22L15 12Z" fill="currentColor" opacity="0.8"/>
    <circle cx="12" cy="9" r="7" fill="currentColor"/>
    <circle cx="12" cy="9" r="3.2" fill="currentColor" opacity="0.45"/>
  </svg>`,
  // 13 — Trébol
  `<svg viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="8" r="4.3" fill="currentColor"/>
    <circle cx="16" cy="8" r="4.3" fill="currentColor"/>
    <circle cx="8" cy="16" r="4.3" fill="currentColor"/>
    <circle cx="16" cy="16" r="4.3" fill="currentColor"/>
    <circle cx="12" cy="12" r="1.8" fill="currentColor" opacity="0.55"/>
    <path d="M13 18C13 20 15 21.5 17.5 23" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
  </svg>`,
  // 14 — Regalo
  `<svg viewBox="0 0 24 24" fill="none">
    <rect x="4" y="10" width="16" height="11" rx="1" fill="currentColor"/>
    <rect x="3" y="7" width="18" height="4" rx="1" fill="currentColor" opacity="0.85"/>
    <rect x="11" y="7" width="2" height="14" fill="currentColor" opacity="0.4"/>
    <path d="M12 7C12 7 9 7 8 5.5C7.2 4.3 8 2.5 9.5 2.5C11.3 2.5 12 5 12 7Z" fill="currentColor"/>
    <path d="M12 7C12 7 15 7 16 5.5C16.8 4.3 16 2.5 14.5 2.5C12.7 2.5 12 5 12 7Z" fill="currentColor"/>
  </svg>`,
  // 15 — Corona con joya
  `<svg viewBox="0 0 24 24" fill="none">
    <polygon points="4,18 7,9 10,14 12,9 14,14 17,9 20,18" fill="currentColor"/>
    <rect x="4" y="18" width="16" height="3" rx="1.5" fill="currentColor"/>
    <circle cx="7" cy="9" r="1.4" fill="currentColor"/>
    <circle cx="17" cy="9" r="1.4" fill="currentColor"/>
    <polygon points="9.5,15.5 12,11 14.5,15.5 12,17.5" fill="currentColor" opacity="0.7"/>
  </svg>`
];

const EMPTY_ICON = `<svg viewBox="0 0 24 24" fill="none">
  <polygon points="12,3 14.5,9 21,9 16,13.5 18,20 12,16 6,20 8,13.5 3,9 9.5,9"
           stroke="rgba(255,255,255,0.12)" stroke-width="1.2" stroke-dasharray="2 2" fill="none"/>
</svg>`;

const NEXT_ICON = `<svg viewBox="0 0 24 24" fill="none">
  <polygon points="12,3 14.5,9 21,9 16,13.5 18,20 12,16 6,20 8,13.5 3,9 9.5,9"
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

    // Estado inicial: botón deshabilitado hasta que haya texto
    const mensajeActual = inputMsg ? inputMsg.value.trim() : "";
    btnSellar.disabled = mensajeActual.length === 0;
    const span = btnSellar.querySelector("span");
    if (span) span.textContent = "Sellar hoy";

    // ✅ CORRECCIÓN: listener en tiempo real para habilitar/deshabilitar botón
    if (inputMsg) {
      // Clonar el nodo para limpiar listeners anteriores y evitar duplicados
      const nuevoInput = inputMsg.cloneNode(true);
      inputMsg.parentNode.replaceChild(nuevoInput, inputMsg);
      nuevoInput.addEventListener("input", () => {
        btnSellar.disabled = nuevoInput.value.trim().length === 0;
      });
    }
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
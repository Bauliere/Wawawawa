const STAMP_ICONS = [
  // 1 estrella
  `<svg viewBox="0 0 24 24" fill="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="currentColor"/></svg>`,
  // 2 diamante
  `<svg viewBox="0 0 24 24" fill="none"><polygon points="12,2 22,9 12,22 2,9" fill="currentColor" opacity="0.9"/><polygon points="12,5 19,9 12,19 5,9" fill="currentColor" opacity="0.5"/></svg>`,
  // 3 corona
  `<svg viewBox="0 0 24 24" fill="none"><path d="M2 18L5 8l4 5 3-9 3 9 4-5 3 10Z" fill="currentColor"/><rect x="2" y="18" width="20" height="2.5" rx="1" fill="currentColor" opacity="0.7"/></svg>`,
  // 4 rayo
  `<svg viewBox="0 0 24 24" fill="none"><polygon points="13,2 4,13 11,13 11,22 20,11 13,11" fill="currentColor"/></svg>`,
  // 5 escudo
  `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2L20 6v7c0 4.4-3.6 8.2-8 9-4.4-.8-8-4.6-8-9V6Z" fill="currentColor" opacity="0.9"/><path d="M12 5l5 2.5v5c0 3-2.2 5.5-5 6.3-2.8-.8-5-3.3-5-6.3V7.5Z" fill="currentColor" opacity="0.4"/></svg>`,
  // 6 corazón
  `<svg viewBox="0 0 24 24" fill="none"><path d="M12 21S3 14 3 8.5C3 5.42 5.42 3 8.5 3c1.74 0 3.41.81 4.5 2.08C14.09 3.81 15.76 3 17.5 3 20.58 3 23 5.42 23 8.5 23 14 12 21 12 21Z" fill="currentColor"/></svg>`,
  // 7 hexágono
  `<svg viewBox="0 0 24 24" fill="none"><polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="currentColor" opacity="0.9"/><polygon points="12,5 18,8.5 18,15.5 12,19 6,15.5 6,8.5" fill="currentColor" opacity="0.4"/></svg>`,
  // 8 check circle
  `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.85"/><path d="M7 12l3.5 3.5L17 9" stroke="#0c0c0e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  // 9 luna
  `<svg viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill="currentColor"/></svg>`,
  // 10 trofeo
  `<svg viewBox="0 0 24 24" fill="none"><path d="M8 2h8v8c0 4-2.7 6-4 6s-4-2-4-6Z" fill="currentColor"/><path d="M5 3H8c0 0-2 4-2 7C4 9 2 7 2 5a2 2 0 0 1 3 0Z" fill="currentColor" opacity="0.6"/><path d="M16 3h3a2 2 0 0 1 2 2c0 2-2 4-3 5 0-3-2-7-2-7Z" fill="currentColor" opacity="0.6"/><rect x="10" y="16" width="4" height="3" fill="currentColor" opacity="0.7"/><rect x="7" y="19" width="10" height="2" rx="1" fill="currentColor"/></svg>`,
  // 11 flecha arriba
  `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3L20 14h-5v7H9v-7H4Z" fill="currentColor"/></svg>`,
  // 12 ojo
  `<svg viewBox="0 0 24 24" fill="none"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12Z" fill="currentColor" opacity="0.85"/><circle cx="12" cy="12" r="3.5" fill="#0c0c0e"/><circle cx="13" cy="11" r="1.2" fill="currentColor" opacity="0.5"/></svg>`,
  // 13 llama
  `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2c0 0 4 5 4 9 0 0-2-1-3-3 0 0 1 6-3 9 0 0 0-3-2-4-2 2-1 5 1 7-3-1-5-4-5-7 0-4 4-8 8-11Z" fill="currentColor"/><path d="M12 14c0 0 2 2 0 5-2-3 0-5 0-5Z" fill="currentColor" opacity="0.5"/></svg>`,
  // 14 infinito
  `<svg viewBox="0 0 24 24" fill="none"><path d="M12 12C10 9 6 7 4 9 2 11 2 13 4 15 6 17 10 15 12 12Z" fill="currentColor"/><path d="M12 12C14 9 18 7 20 9 22 11 22 13 20 15 18 17 14 15 12 12Z" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.5"/></svg>`,
  // 15 corona especial
  `<svg viewBox="0 0 24 24" fill="none"><polygon points="12,1 15.5,8 23,9 17.5,14 19,21 12,17.5 5,21 6.5,14 1,9 8.5,8" fill="currentColor"/><circle cx="12" cy="12" r="3" fill="#0c0c0e"/><circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.6"/></svg>`
];

const EMPTY_ICON = `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" stroke-dasharray="3 3"/></svg>`;
const NEXT_ICON  = `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.30)" stroke-width="1.5"/><line x1="12" y1="7" x2="12" y2="17" stroke="rgba(255,255,255,0.30)" stroke-width="2" stroke-linecap="round"/><line x1="7" y1="12" x2="17" y2="12" stroke="rgba(255,255,255,0.30)" stroke-width="2" stroke-linecap="round"/></svg>`;

// ═══════════════════════════════════════
// RENDER
// ═══════════════════════════════════════

function renderStamps() {
  const grid      = document.getElementById("sellos-grid");
  const countEl   = document.getElementById("sellos-count");
  const btnSellar = document.getElementById("btn-sellar-hoy");
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
      // Alternar dorado (par) y morado (impar)
      const isGold = i % 2 === 0;
      item.classList.add(isGold ? "filled-gold" : "filled-purple");
      item.innerHTML  = STAMP_ICONS[i];

      // Color del SVG según tipo
      item.style.color = isGold ? "#c9a84c" : "#a855f7";
      item.title       = `Sello ${i + 1} de 15`;

    } else if (i === stampsEnCiclo) {
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

  // Botón sellar
  const btnText = btnSellar.querySelector("span") || btnSellar;
  btnSellar.disabled = sellosHoy;
  if (btnSellar.querySelector("span")) {
    btnSellar.querySelector("span").textContent = sellosHoy
      ? "Ya sellaste hoy"
      : "Sellar hoy";
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
  const items = document.querySelectorAll("#sellos-grid .sello-item.filled-gold, #sellos-grid .sello-item.filled-purple");
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
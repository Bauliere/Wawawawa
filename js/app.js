// ═══════════════════════════════════════
// REFERENCIAS AL DOM
// ═══════════════════════════════════════

const screens = {
  login:        document.getElementById("screen-login"),
  ruleta:       document.getElementById("screen-ruleta"),
  agenda:       document.getElementById("screen-agenda"),
  confirmacion: document.getElementById("screen-confirmacion"),
  sellos:       document.getElementById("screen-sellos")
};

const ui = {
  // Login
  inputNombre:          document.getElementById("input-nombre"),
  btnEntrar:            document.getElementById("btn-entrar"),
  loginError:           document.getElementById("login-error"),

  // Ruleta
  saludoNombre:         document.getElementById("saludo-nombre"),
  spinsRestantes:       document.getElementById("spins-restantes"),
  btnGirar:             document.getElementById("btn-girar"),
  btnVerSellos:         document.getElementById("btn-ver-sellos"),

  // Modal resultado
  modalResultado:       document.getElementById("modal-resultado"),
  modalCardResultado:   document.getElementById("modal-card-resultado"),
  resultadoNormal:      document.getElementById("resultado-normal"),
  resultadoSorpresa:    document.getElementById("resultado-sorpresa"),
  resultadoTexto:       document.getElementById("resultado-texto"),
  resultadoDesc:        document.getElementById("resultado-descripcion"),
  btnAgendar:           document.getElementById("btn-agendar"),
  btnOtroIntento:       document.getElementById("btn-otro-intento"),
  btnAgendarSorpresa:   document.getElementById("btn-agendar-sorpresa"),

  // Agenda
  btnBackAgenda:        document.getElementById("btn-back-agenda"),
  agendaResultadoBadge: document.getElementById("agenda-resultado-badge"),
  agendaError:          document.getElementById("agenda-error"),
  btnConfirmarReserva:  document.getElementById("btn-confirmar-reserva"),

  // Confirmación
  confResultado:        document.getElementById("conf-resultado"),
  confFecha:            document.getElementById("conf-fecha"),
  confHora:             document.getElementById("conf-hora"),
  btnVerSelloConf:      document.getElementById("btn-ver-sellos-conf"),
  btnInicioConf:        document.getElementById("btn-inicio-conf"),

  // Sellos
  btnBackSellos:        document.getElementById("btn-back-sellos"),
  sellosCount:          document.getElementById("sellos-count"),
  sellosGrid:           document.getElementById("sellos-grid"),
  bonusMsg:             document.getElementById("sellos-bonus-msg"),
  btnSellarHoy:         document.getElementById("btn-sellar-hoy"),
  sellosError:          document.getElementById("sellos-error")
};

// ═══════════════════════════════════════
// NAVEGACIÓN
// ═══════════════════════════════════════

function navigateTo(screenName) {
  Object.values(screens).forEach(s => {
    s.classList.add("hidden");
    s.classList.remove("active");
  });

  const target = screens[screenName];
  if (!target) return;

  target.classList.remove("hidden");
  target.classList.add("active");
  setState("pantallaActual", screenName);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ═══════════════════════════════════════
// HELPERS UI
// ═══════════════════════════════════════

function showError(el, msg) {
  el.textContent = msg;
  el.classList.remove("hidden");
}

function clearError(el) {
  el.textContent = "";
  el.classList.add("hidden");
}

function setLoading(btn, loading) {
  const text   = btn.querySelector(".btn-text");
  const loader = btn.querySelector(".btn-loader");
  btn.disabled = loading;
  if (text)   text.classList.toggle("hidden", loading);
  if (loader) loader.classList.toggle("hidden", !loading);
}

function updateSpinsUI() {
  const n = appState.spinsRestantes;
  ui.spinsRestantes.textContent = n;
  ui.btnGirar.disabled = n <= 0;

  const label = document.querySelector(".spins-label");
  if (label) label.textContent = n === 1
    ? " intento restante"
    : " intentos restantes";
}

// ═══════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════

function onNombreInput() {
  const val = ui.inputNombre.value.trim();
  clearError(ui.loginError);
  const norm = CONFIG.normalizeName(val);
  ui.btnEntrar.disabled = !CONFIG.ALLOWED_NAMES_NORM.includes(norm);
}

async function onEntrar() {
  const nombreRaw = ui.inputNombre.value.trim();
  clearError(ui.loginError);
  setLoading(ui.btnEntrar, true);

  try {
    const data = await apiGetProgress(nombreRaw);

    if (!data.permitido) {
      showError(ui.loginError, "Ese nombre no está en la lista. ¿Segura que escribiste bien?");
      return;
    }

    setUserFromProgress(data);
    ui.saludoNombre.innerHTML = `Hola, <span>${data.nombre}</span>`;
    updateSpinsUI();
    navigateTo("ruleta");

  } catch (err) {
    showError(ui.loginError, "No se pudo conectar. Intenta de nuevo.");
    console.error("[Login]", err);
  } finally {
    setLoading(ui.btnEntrar, false);
  }
}

// ═══════════════════════════════════════
// RULETA → MODAL RESULTADO
// ═══════════════════════════════════════

function onSpinComplete(resultado) {
  setSpinResult(resultado);
  showModalResultado(resultado);

  apiRegisterSpin(resultado)
    .then(res => {
      updateSpinsRestantes(res.spinsRestantes);
      updateSpinsUI();
    })
    .catch(err => console.error("[RegisterSpin]", err));
}

function showModalResultado(resultado) {
  const esSorpresa    = resultado === "Sorpresa";
  const esOtroIntento = CONFIG.NO_COUNT_RESULTS.includes(resultado);

  ui.modalCardResultado.classList.remove("is-sorpresa");
  ui.resultadoNormal.classList.remove("hidden");
  ui.resultadoSorpresa.classList.add("hidden");
  ui.btnAgendar.classList.add("hidden");
  ui.btnOtroIntento.classList.add("hidden");

  if (esSorpresa) {
    ui.resultadoNormal.classList.add("hidden");
    ui.resultadoSorpresa.classList.remove("hidden");
    ui.modalCardResultado.classList.add("is-sorpresa");
    spawnSorpresaStars();
  } else {
    ui.resultadoTexto.textContent = resultado;

    if (esOtroIntento) {
      ui.resultadoDesc.textContent = "Aún no se rinde el destino... ¡inténtalo de nuevo!";
      ui.btnOtroIntento.classList.remove("hidden");
    } else {
      ui.resultadoDesc.textContent = "¡Genial! Ahora elige cuándo.";
      ui.btnAgendar.classList.remove("hidden");
    }
  }

  ui.modalResultado.classList.remove("hidden");
}

function closeModalResultado() {
  ui.modalResultado.classList.add("hidden");
  ui.modalCardResultado.classList.remove("is-sorpresa");
  const starsEl = document.querySelector(".sorpresa-stars");
  if (starsEl) starsEl.innerHTML = "";
}

function spawnSorpresaStars() {
  const container = document.querySelector(".sorpresa-stars");
  if (!container) return;
  container.innerHTML = "";

  // Partículas SVG en lugar de emojis
  const shapes = [
    `<svg viewBox="0 0 10 10"><polygon points="5,0 6.5,3.5 10,3.5 7,6 8,10 5,7.5 2,10 3,6 0,3.5 3.5,3.5" fill="#a855f7"/></svg>`,
    `<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="#7c3aed"/></svg>`,
    `<svg viewBox="0 0 10 10"><rect x="2" y="2" width="6" height="6" rx="1" fill="#c084fc" transform="rotate(45 5 5)"/></svg>`
  ];

  for (let i = 0; i < 14; i++) {
    const star = document.createElement("span");
    star.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
    star.style.cssText = `
      position: absolute;
      width: ${16 + Math.random() * 14}px;
      height: ${16 + Math.random() * 14}px;
      left: ${Math.random() * 90}%;
      top: ${20 + Math.random() * 70}%;
      animation: starFloat ${1.5 + Math.random() * 2}s ease-out
                 ${Math.random() * 1}s forwards;
      pointer-events: none;
    `;
    container.appendChild(star);
  }
}

// ═══════════════════════════════════════
// AGENDA
// ═══════════════════════════════════════

function openAgenda() {
  closeModalResultado();

  if (!hasValidResult()) {
    navigateTo("ruleta");
    return;
  }

  ui.agendaResultadoBadge.innerHTML =
    `Plan: <strong>${appState.resultado}</strong>`;

  initCalendar();
  initHoraSelector();
  navigateTo("agenda");
}

// ═══════════════════════════════════════
// CONFIRMACIÓN
// ═══════════════════════════════════════

async function onConfirmarReserva() {
  const fechaISO   = getState("fechaISO");
  const fechaTexto = getState("fechaTexto");
  const horaTexto  = getState("horaTexto");

  if (!fechaISO || !horaTexto) {
    showError(ui.agendaError, "Elige una fecha y una hora.");
    return;
  }

  clearError(ui.agendaError);
  setLoading(ui.btnConfirmarReserva, true);

  try {
    await apiSaveBooking({ fechaISO, fechaTexto, horaTexto });
    setBooking(fechaISO, fechaTexto, horaTexto);

    ui.confResultado.textContent = appState.resultado;
    ui.confFecha.textContent     = fechaTexto;
    ui.confHora.textContent      = horaTexto + " (tentativa)";

    navigateTo("confirmacion");
  } catch (err) {
    showError(ui.agendaError, "No se pudo guardar la reserva. Intenta de nuevo.");
    console.error("[SaveBooking]", err);
  } finally {
    setLoading(ui.btnConfirmarReserva, false);
  }
}

// ═══════════════════════════════════════
// SELLOS
// ═══════════════════════════════════════

function openSellos(origen) {
  renderStamps();
  ui.btnBackSellos.dataset.origen = origen || "ruleta";
  navigateTo("sellos");
}

async function onSellarHoy() {
  clearError(ui.sellosError);
  setLoading(ui.btnSellarHoy, true);

  try {
    const data = await apiSaveStamp();

    if (!data.ok) {
      if (data.razon === "ya_sellado") {
        showError(ui.sellosError, "Ya sellaste hoy. ¡Vuelve mañana!");
      } else {
        showError(ui.sellosError, data.razon || "No se pudo sellar.");
      }
      return;
    }

    updateStamps(
      data.stampsEnCiclo,
      data.totalStamps ?? appState.totalStamps + 1
    );

    if (data.bonusSpinEarned) {
      ui.bonusMsg.classList.remove("hidden");
      updateSpinsRestantes(appState.spinsRestantes + 1);
      updateSpinsUI();
    }

    // ← Corrección aplicada: usa animación
    renderStampsWithAnimation();

  } catch (err) {
    showError(ui.sellosError, "Error de conexión. Intenta de nuevo.");
    console.error("[SaveStamp]", err);
  } finally {
    setLoading(ui.btnSellarHoy, false);
  }
}

// ═══════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════

function initEventListeners() {
  // Login
  ui.inputNombre.addEventListener("input", onNombreInput);
  ui.inputNombre.addEventListener("keydown", e => {
    if (e.key === "Enter" && !ui.btnEntrar.disabled) onEntrar();
  });
  ui.btnEntrar.addEventListener("click", onEntrar);

  // Ruleta
  ui.btnGirar.addEventListener("click", () => {
    if (!canSpin()) return;
    spinWheel(onSpinComplete);
  });
  ui.btnVerSellos.addEventListener("click", () => openSellos("ruleta"));

  // Modal resultado
  ui.btnAgendar.addEventListener("click", openAgenda);
  ui.btnAgendarSorpresa.addEventListener("click", openAgenda);
  ui.btnOtroIntento.addEventListener("click", () => {
    closeModalResultado();
  });

  ui.modalResultado.addEventListener("click", e => {
    if (
      e.target === ui.modalResultado &&
      CONFIG.NO_COUNT_RESULTS.includes(appState.resultado)
    ) {
      closeModalResultado();
    }
  });

  // Agenda
  ui.btnBackAgenda.addEventListener("click", () => {
    clearError(ui.agendaError);
    navigateTo("ruleta");
  });
  ui.btnConfirmarReserva.addEventListener("click", onConfirmarReserva);

  // Confirmación
  ui.btnVerSelloConf.addEventListener("click", () => openSellos("confirmacion"));
  ui.btnInicioConf.addEventListener("click", () => {
    resetSession();
    ui.inputNombre.value = "";
    clearError(ui.loginError);
    navigateTo("login");
  });

  // Sellos
  ui.btnBackSellos.addEventListener("click", () => {
    const origen = ui.btnBackSellos.dataset.origen || "ruleta";
    navigateTo(origen === "confirmacion" ? "confirmacion" : "ruleta");
  });
  ui.btnSellarHoy.addEventListener("click", onSellarHoy);
}

// ═══════════════════════════════════════
// INICIALIZACIÓN
// ═══════════════════════════════════════

function init() {
  navigateTo("login");
  initEventListeners();
  ui.btnEntrar.disabled = true;

  if (isTestMode()) {
    console.info("[Salidas Random] Modo pruebas ACTIVO");
  }
}

document.addEventListener("DOMContentLoaded", init);
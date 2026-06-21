// ═══════════════════════════════════════
// PARTÍCULAS DE FONDO
// ═══════════════════════════════════════

(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  const ctx    = canvas.getContext("2d");
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((W * H) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x:     Math.random() * W,
        y:     Math.random() * H,
        r:     0.6 + Math.random() * 1.4,
        color: pickParticleColor(),
        vx:    (Math.random() - 0.5) * 0.25,
        vy:    -0.1 - Math.random() * 0.3,
        alpha: 0.15 + Math.random() * 0.35
      });
    }
  }

  function pickParticleColor() {
    const r = Math.random();
    if (r < 0.15) return "#c9a84c";
    if (r < 0.22) return "#7c3aed";
    return "#ffffff";
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle   = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -5)    { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < -5)    { p.x = W + 5; }
      if (p.x > W + 5) { p.x = -5; }
    });
    requestAnimationFrame(drawParticles);
  }

  resize();
  createParticles();
  drawParticles();
  window.addEventListener("resize", () => { resize(); createParticles(); });
})();

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
  inputNombre:          document.getElementById("input-nombre"),
  btnEntrar:            document.getElementById("btn-entrar"),
  loginError:           document.getElementById("login-error"),
  saludoNombre:         document.getElementById("saludo-nombre"),
  spinsRestantes:       document.getElementById("spins-restantes"),
  btnGirar:             document.getElementById("btn-girar"),
  btnVerSellos:         document.getElementById("btn-ver-sellos"),
  modalResultado:       document.getElementById("modal-resultado"),
  modalCardResultado:   document.getElementById("modal-card-resultado"),
  resultadoNormal:      document.getElementById("resultado-normal"),
  resultadoSorpresa:    document.getElementById("resultado-sorpresa"),
  resultadoTexto:       document.getElementById("resultado-texto"),
  resultadoDesc:        document.getElementById("resultado-descripcion"),
  btnAgendar:           document.getElementById("btn-agendar"),
  btnOtroIntento:       document.getElementById("btn-otro-intento"),
  btnAgendarSorpresa:   document.getElementById("btn-agendar-sorpresa"),
  btnBackAgenda:        document.getElementById("btn-back-agenda"),
  agendaResultadoBadge: document.getElementById("agenda-resultado-badge"),
  agendaError:          document.getElementById("agenda-error"),
  btnConfirmarReserva:  document.getElementById("btn-confirmar-reserva"),
  confResultado:        document.getElementById("conf-resultado"),
  confFecha:            document.getElementById("conf-fecha"),
  confHora:             document.getElementById("conf-hora"),
  btnVerSelloConf:      document.getElementById("btn-ver-sellos-conf"),
  btnInicioConf:        document.getElementById("btn-inicio-conf"),
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
  ui.btnGirar.disabled = n <= 0 && !isTestMode();
  const label = document.querySelector(".spins-label");
  if (label) label.textContent = n === 1 ? " intento restante" : " intentos restantes";
}

// ═══════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════

function onNombreInput() {
  const val  = ui.inputNombre.value.trim();
  const norm = CONFIG.normalizeName(val);

  if (val.length === 0) {
    clearError(ui.loginError);
    ui.btnEntrar.disabled = true;
    return;
  }

  if (CONFIG.ALLOWED_NAMES_NORM.includes(norm)) {
    clearError(ui.loginError);
    ui.btnEntrar.disabled = false;
  } else {
    showError(ui.loginError, "Hey! esto no es para ti");
    ui.btnEntrar.disabled = true;
  }
}

async function onEntrar() {
  const nombreRaw = ui.inputNombre.value.trim();
  clearError(ui.loginError);
  setLoading(ui.btnEntrar, true);

  try {
    const data = await apiGetProgress(nombreRaw);

    if (!data.permitido) {
      showError(ui.loginError, "Hey! esto no es para ti");
      return;
    }

    const spins = parseInt(data.spinsRestantes, 10);
    data.spinsRestantes = isNaN(spins) || spins < 0 ? CONFIG.BASE_SPINS : spins;

    const stampsEnCiclo = parseInt(data.stampsEnCiclo, 10);
    data.stampsEnCiclo = isNaN(stampsEnCiclo) || stampsEnCiclo < 0 ? 0 : stampsEnCiclo;

    const totalStamps = parseInt(data.totalStamps, 10);
    data.totalStamps = isNaN(totalStamps) || totalStamps < 0 ? 0 : totalStamps;

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
// RULETA
// ═══════════════════════════════════════

function onSpinComplete(resultado) {
  setSpinResult(resultado);
  showModalResultado(resultado);

  const esOtroIntento = CONFIG.NO_COUNT_RESULTS.includes(resultado);

  apiRegisterSpin(resultado)
    .then(res => {
      const spinsDelBackend = parseInt(res.spinsRestantes, 10);
      if (esOtroIntento) {
        // "Otro intento" no consume spin — restaurar a lo que había o al menos 1
        const actuales = appState.spinsRestantes;
        updateSpinsRestantes(actuales > 0 ? actuales : 1);
      } else {
        updateSpinsRestantes(isNaN(spinsDelBackend) ? 0 : spinsDelBackend);
      }
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
    spawnSorpresaParticles();
  } else {
    ui.resultadoTexto.textContent = resultado;
    if (esOtroIntento) {
      ui.resultadoDesc.textContent = "El destino no se rinde... intenta de nuevo.";
      ui.btnOtroIntento.classList.remove("hidden");
    } else {
      ui.resultadoDesc.textContent = "Elige cuándo lo hacemos.";
      ui.btnAgendar.classList.remove("hidden");
    }
  }

  ui.modalResultado.classList.remove("hidden");
}

function closeModalResultado() {
  ui.modalResultado.classList.add("hidden");
  ui.modalCardResultado.classList.remove("is-sorpresa");
  const p = document.querySelector(".sorpresa-particles");
  if (p) p.innerHTML = "";
}

function spawnSorpresaParticles() {
  const container = document.querySelector(".sorpresa-particles");
  if (!container) return;
  container.innerHTML = "";

  const svgs = [
    `<svg viewBox="0 0 10 10"><polygon points="5,0 6.2,3.8 10,3.8 7,6 8,10 5,7.5 2,10 3,6 0,3.8 3.8,3.8" fill="#a855f7"/></svg>`,
    `<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="#7c3aed"/></svg>`,
    `<svg viewBox="0 0 10 10"><rect x="2" y="2" width="6" height="6" rx="1" fill="#c084fc" transform="rotate(45 5 5)"/></svg>`
  ];

  for (let i = 0; i < 14; i++) {
    const el = document.createElement("span");
    el.innerHTML = svgs[Math.floor(Math.random() * svgs.length)];
    el.style.cssText = `
      position: absolute;
      width: ${14 + Math.random() * 12}px;
      height: ${14 + Math.random() * 12}px;
      left: ${Math.random() * 90}%;
      top: ${20 + Math.random() * 70}%;
      animation: particleFloat ${1.5 + Math.random() * 2}s ease-out ${Math.random()}s forwards;
      pointer-events: none;
    `;
    container.appendChild(el);
  }
}

// ═══════════════════════════════════════
// AGENDA
// ═══════════════════════════════════════

function openAgenda() {
  closeModalResultado();
  if (!hasValidResult()) { navigateTo("ruleta"); return; }
  ui.agendaResultadoBadge.innerHTML = `Plan: <strong>${appState.resultado}</strong>`;
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
    showError(ui.agendaError, "No se pudo guardar. Intenta de nuevo.");
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

  if (appState.sellosHoy && !isTestMode()) {
    showError(ui.sellosError, "Ya sellaste hoy. Vuelve mañana.");
    renderStamps();
    return;
  }

  const inputMsg = document.getElementById("input-sello-mensaje");
  const mensaje  = inputMsg ? inputMsg.value.trim() : "";

  if (!mensaje) {
    showError(ui.sellosError, "Escribe algo bonito antes de sellar.");
    if (inputMsg) inputMsg.focus();
    return;
  }

  setLoading(ui.btnSellarHoy, true);

  try {
    const data = await apiSaveStamp(mensaje);

    if (!data.ok) {
      if (data.razon === "ya_sellado") {
        setState("sellosHoy", true);
        showError(ui.sellosError, "Ya sellaste hoy. Vuelve mañana.");
        renderStamps();
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
  ui.inputNombre.addEventListener("input", onNombreInput);
  ui.inputNombre.addEventListener("keydown", e => {
    if (e.key === "Enter" && !ui.btnEntrar.disabled) onEntrar();
  });
  ui.btnEntrar.addEventListener("click", onEntrar);

  ui.btnGirar.addEventListener("click", () => {
    if (!canSpin()) return;
    spinWheel(onSpinComplete);
  });
  ui.btnVerSellos.addEventListener("click", () => openSellos("ruleta"));

  ui.btnAgendar.addEventListener("click", openAgenda);
  ui.btnAgendarSorpresa.addEventListener("click", openAgenda);
  ui.btnOtroIntento.addEventListener("click", closeModalResultado);

  ui.modalResultado.addEventListener("click", e => {
    if (
      e.target === ui.modalResultado &&
      CONFIG.NO_COUNT_RESULTS.includes(appState.resultado)
    ) closeModalResultado();
  });

  ui.btnBackAgenda.addEventListener("click", () => {
    clearError(ui.agendaError);
    navigateTo("ruleta");
  });
  ui.btnConfirmarReserva.addEventListener("click", onConfirmarReserva);

  ui.btnVerSelloConf.addEventListener("click", () => openSellos("confirmacion"));
  ui.btnInicioConf.addEventListener("click", () => {
    resetSession();
    ui.inputNombre.value = "";
    clearError(ui.loginError);
    navigateTo("login");
  });

  ui.btnBackSellos.addEventListener("click", () => {
    navigateTo(
      ui.btnBackSellos.dataset.origen === "confirmacion"
        ? "confirmacion"
        : "ruleta"
    );
  });
  ui.btnSellarHoy.addEventListener("click", onSellarHoy);
}

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════

function init() {
  navigateTo("login");
  initEventListeners();
  ui.btnEntrar.disabled = true;
  if (isTestMode()) console.info("[SR] Modo pruebas ACTIVO");
}

document.addEventListener("DOMContentLoaded", init);
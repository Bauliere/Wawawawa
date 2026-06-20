// ═══════════════════════════════════════
// ESTADO GLOBAL
// ═══════════════════════════════════════

const appState = {
  // Usuario
  nombreNorm:     "",
  nombre:         "",

  // Ruleta
  resultado:      "",
  spinsRestantes: 0,
  testMode:       false,

  // Agenda
  fechaISO:       "",
  fechaTexto:     "",
  horaTexto:      "",

  // Sellos
  sellosHoy:      false,
  stampsEnCiclo:  0,
  totalStamps:    0,
  ultimoSello:    "",

  // Navegación
  pantallaActual: "login"
};

// ═══════════════════════════════════════
// GETTERS / SETTERS GENÉRICOS
// ═══════════════════════════════════════

function getState(key) {
  return appState[key];
}

function setState(key, value) {
  appState[key] = value;
}

// ═══════════════════════════════════════
// SETTERS SEMÁNTICOS
// ═══════════════════════════════════════

function setUserFromProgress(data) {
  appState.nombreNorm    = data.nombreNorm    || "";
  appState.nombre        = data.nombre        || "";
  appState.spinsRestantes= Number(data.spinsRestantes) || 0;
  appState.sellosHoy     = !!data.sellosHoy;
  appState.stampsEnCiclo = Number(data.stampsEnCiclo)  || 0;
  appState.totalStamps   = Number(data.totalStamps)    || 0;
  appState.ultimoSello   = data.ultimoSello   || "";
}

function setSpinResult(resultado) {
  appState.resultado = resultado;
}

function updateSpinsRestantes(n) {
  appState.spinsRestantes = Number(n) || 0;
}

function updateStamps(stampsEnCiclo, totalStamps) {
  appState.stampsEnCiclo = Number(stampsEnCiclo) || 0;
  appState.totalStamps   = Number(totalStamps)   || 0;
  appState.sellosHoy     = true; // marcar como sellado hoy
}

function setBooking(fechaISO, fechaTexto, horaTexto) {
  appState.fechaISO   = fechaISO;
  appState.fechaTexto = fechaTexto;
  appState.horaTexto  = horaTexto;
}

function resetSession() {
  appState.nombreNorm    = "";
  appState.nombre        = "";
  appState.resultado     = "";
  appState.spinsRestantes= 0;
  appState.fechaISO      = "";
  appState.fechaTexto    = "";
  appState.horaTexto     = "";
  appState.sellosHoy     = false;
  appState.stampsEnCiclo = 0;
  appState.totalStamps   = 0;
  appState.ultimoSello   = "";
  appState.pantallaActual= "login";
  // testMode NO se resetea — persiste durante toda la sesión
}

// ═══════════════════════════════════════
// HELPERS DE LÓGICA
// ═══════════════════════════════════════

function canSpin() {
  // En modo pruebas siempre se puede girar
  if (appState.testMode) return true;
  return appState.spinsRestantes > 0;
}

function hasValidResult() {
  return (
    appState.resultado &&
    appState.resultado !== "" &&
    !CONFIG.NO_COUNT_RESULTS.includes(appState.resultado)
  );
}

function isTestMode() {
  return appState.testMode === true;
}

// ═══════════════════════════════════════
// INICIALIZAR testMode desde URL
// Se ejecuta una sola vez al cargar la página
// ═══════════════════════════════════════

(function initTestMode() {
  if (!CONFIG.TEST_MODE_ENABLED) {
    appState.testMode = false;
    return;
  }
  const params = new URLSearchParams(window.location.search);
  appState.testMode = params.has(CONFIG.TEST_MODE_PARAM);

  if (appState.testMode) {
    console.info(
      "%c[Salidas Random] MODO PRUEBAS ACTIVO",
      "background:#7c3aed;color:#fff;padding:4px 8px;border-radius:4px;font-weight:bold"
    );
  }
})();
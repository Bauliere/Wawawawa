const appState = {
  // Datos del usuario
  nombreNorm: null,
  nombre: null,

  // Progreso de spins
  spinsRestantes: 0,

  // Resultado actual de la ruleta
  resultado: null,

  // Reserva
  fechaISO: null,
  fechaTexto: null,
  horaTexto: null,

  // Sellos
  sellosHoy: false,
  stampsEnCiclo: 0,
  totalStamps: 0,
  ultimoSello: null,

  // Navegación
  pantallaActual: "login",

  // Modo pruebas (se activa si URL tiene ?test=1 y TEST_MODE_ENABLED es true)
  testMode: false
};

// --- Getters ---
function getState(key) {
  return appState[key];
}

function isTestMode() {
  return appState.testMode;
}

function hasValidResult() {
  return (
    appState.resultado !== null &&
    !CONFIG.INVALID_BOOKING_RESULTS.includes(appState.resultado)
  );
}

function canSpin() {
  return appState.spinsRestantes > 0;
}

// --- Setters ---
function setState(key, value) {
  appState[key] = value;
}

function setUserFromProgress(data) {
  appState.nombre         = data.nombre;
  appState.nombreNorm     = data.nombreNorm;
  appState.spinsRestantes = data.spinsRestantes;
  appState.sellosHoy      = data.sellosHoy;
  appState.stampsEnCiclo  = data.stampsEnCiclo;
  appState.totalStamps    = data.totalStamps;
  appState.ultimoSello    = data.ultimoSello;
}

function setSpinResult(resultado) {
  appState.resultado = resultado;
}

function setBooking(fechaISO, fechaTexto, horaTexto) {
  appState.fechaISO   = fechaISO;
  appState.fechaTexto = fechaTexto;
  appState.horaTexto  = horaTexto;
}

function updateSpinsRestantes(n) {
  appState.spinsRestantes = n;
}

function updateStamps(stampsEnCiclo, totalStamps) {
  appState.stampsEnCiclo = stampsEnCiclo;
  appState.totalStamps   = totalStamps;
  appState.sellosHoy     = true;
}

function resetSession() {
  appState.nombreNorm     = null;
  appState.nombre         = null;
  appState.spinsRestantes = 0;
  appState.resultado      = null;
  appState.fechaISO       = null;
  appState.fechaTexto     = null;
  appState.horaTexto      = null;
  appState.sellosHoy      = false;
  appState.stampsEnCiclo  = 0;
  appState.totalStamps    = 0;
  appState.ultimoSello    = null;
  appState.pantallaActual = "login";
}

// Detectar modo pruebas al cargar
(function initTestMode() {
  if (!CONFIG.TEST_MODE_ENABLED) {
    appState.testMode = false;
    return;
  }
  const params = new URLSearchParams(window.location.search);
  appState.testMode = params.has(CONFIG.TEST_MODE_PARAM);
})();
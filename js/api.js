// ═══════════════════════════════════════
// UTILIDADES INTERNAS
// ═══════════════════════════════════════

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 800;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    if (retries > 0) {
      await sleep(RETRY_DELAY_MS);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

// Apps Script no acepta Content-Type application/json en doPost con CORS simple,
// se envía como texto plano y se parsea en el backend.
function buildPostOptions(body) {
  return {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body)
  };
}

// ═══════════════════════════════════════
// ENDPOINTS
// ═══════════════════════════════════════

/**
 * Login: trae todo el estado del usuario de un solo golpe.
 * GET ?action=getProgress&nombre=xxx&testMode=true/false
 *
 * Respuesta esperada:
 * {
 *   permitido: true/false,
 *   nombreNorm, nombre,
 *   spinsRestantes, sellosHoy,
 *   stampsEnCiclo, totalStamps, ultimoSello
 * }
 */
async function apiGetProgress(nombreRaw) {
  const nombreNorm = CONFIG.normalizeName(nombreRaw);
  const testMode   = isTestMode();

  const url = new URL(CONFIG.API_URL);
  url.searchParams.set("action",   "getProgress");
  url.searchParams.set("nombre",   nombreNorm);
  url.searchParams.set("testMode", testMode ? "true" : "false");

  const data = await fetchWithRetry(url.toString());

  if (typeof data.permitido === "undefined") {
    throw new Error("Respuesta inválida del servidor");
  }

  return data;
}

/**
 * Registrar resultado de un giro.
 * POST { action, nombreNorm, resultado, contaParaLimite, testMode }
 *
 * Respuesta esperada:
 * { ok: true, spinsRestantes: N }
 */
async function apiRegisterSpin(resultado) {
  const contaParaLimite = !CONFIG.NO_COUNT_RESULTS.includes(resultado);

  const body = {
    action:          "registerSpin",
    nombreNorm:      appState.nombreNorm,
    nombre:          appState.nombre,
    resultado,
    contaParaLimite,
    testMode:        isTestMode()
  };

  const data = await fetchWithRetry(
    CONFIG.API_URL,
    buildPostOptions(body)
  );

  if (!data.ok) {
    throw new Error(data.error || "Error al registrar el giro");
  }

  return data; // { ok, spinsRestantes }
}

/**
 * Guardar reserva.
 * POST { action, nombreNorm, nombre, resultado, fechaISO, fecha, hora }
 *
 * Respuesta esperada:
 * { ok: true, bookingId: "xxx" }
 */
async function apiSaveBooking({ fechaISO, fechaTexto, horaTexto }) {
  const body = {
    action:    "saveBooking",
    nombreNorm: appState.nombreNorm,
    nombre:     appState.nombre,
    resultado:  appState.resultado,
    fechaISO,
    fecha:      fechaTexto,
    hora:       horaTexto,
    testMode:   isTestMode()
  };

  const data = await fetchWithRetry(
    CONFIG.API_URL,
    buildPostOptions(body)
  );

  if (!data.ok) {
    throw new Error(data.error || "Error al guardar la reserva");
  }

  return data; // { ok, bookingId }
}

/**
 * Sellar el día de hoy.
 * POST { action, nombreNorm, nombre, testMode }
 *
 * Respuesta esperada:
 * {
 *   ok: true/false,
 *   razon?: "ya_sellado" | "no_permitido",
 *   stampsEnCiclo, mensajeSello,
 *   bonusSpinEarned?: true
 * }
 */
async function apiSaveStamp() {
  const body = {
    action:     "saveStamp",
    nombreNorm:  appState.nombreNorm,
    nombre:      appState.nombre,
    testMode:    isTestMode()
  };

  const data = await fetchWithRetry(
    CONFIG.API_URL,
    buildPostOptions(body)
  );

  // ok:false no es un error de red, es una respuesta válida (ej: ya selló hoy)
  return data;
}
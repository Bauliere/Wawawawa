// ═══════════════════════════════════════
// CONFIGURACIÓN DE RED
// ═══════════════════════════════════════

const MAX_RETRIES = 2;
const RETRY_DELAY = 800; // ms

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════
// FETCH BASE CON REINTENTOS
// ═══════════════════════════════════════

async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (retries > 0) {
      await sleep(RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

// ═══════════════════════════════════════
// GET PROGRESS (login)
// ═══════════════════════════════════════

async function apiGetProgress(nombreRaw) {
  const nombreNorm = CONFIG.normalizeName(nombreRaw);
  const testMode   = appState.testMode;

  const url = `${CONFIG.API_URL}?action=getProgress&nombre=${encodeURIComponent(nombreNorm)}&testMode=${testMode}`;
  return fetchWithRetry(url);
}

// ═══════════════════════════════════════
// REGISTER SPIN
// ═══════════════════════════════════════

async function apiRegisterSpin(resultado) {
  const esOtroIntento    = CONFIG.NO_COUNT_RESULTS.includes(resultado);
  const contaParaLimite  = !esOtroIntento;
  const testMode         = appState.testMode;

  return fetchWithRetry(CONFIG.API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      action:          "registerSpin",
      nombreNorm:      appState.nombreNorm,
      resultado,
      contaParaLimite,
      testMode         // ← siempre enviado
    })
  });
}

// ═══════════════════════════════════════
// SAVE BOOKING
// ═══════════════════════════════════════

async function apiSaveBooking({ fechaISO, fechaTexto, horaTexto }) {
  const testMode = appState.testMode;

  return fetchWithRetry(CONFIG.API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      action:     "saveBooking",
      nombreNorm: appState.nombreNorm,
      resultado:  appState.resultado,
      fechaISO,
      fecha:      fechaTexto,
      hora:       horaTexto,
      testMode
    })
  });
}

// ═══════════════════════════════════════
// SAVE STAMP
// ═══════════════════════════════════════

async function apiSaveStamp() {
  const testMode = appState.testMode;

  return fetchWithRetry(CONFIG.API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      action:     "saveStamp",
      nombreNorm: appState.nombreNorm,
      testMode    // ← siempre enviado
    })
  });
}
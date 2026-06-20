// ═══════════════════════════════════════
// FETCH CON RETRY
// ═══════════════════════════════════════

async function fetchWithRetry(url, options = {}, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      const json = await res.json();
      return json;
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

// ═══════════════════════════════════════
// API CALLS
// ═══════════════════════════════════════

async function apiGetProgress(nombreRaw) {
  const nombreNorm = CONFIG.normalizeName(nombreRaw);
  const testMode   = isTestMode();
  const url = `${CONFIG.API_URL}?action=getProgress&nombre=${encodeURIComponent(nombreNorm)}&testMode=${testMode}`;
  return fetchWithRetry(url);
}

async function apiRegisterSpin(resultado) {
  const testMode = isTestMode();
  return fetchWithRetry(CONFIG.API_URL, {
    method:  "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      action:          "registerSpin",
      nombreNorm:      appState.nombreNorm,
      resultado,
      contaParaLimite: !CONFIG.NO_COUNT_RESULTS.includes(resultado),
      testMode
    })
  });
}

async function apiSaveBooking({ fechaISO, fechaTexto, horaTexto }) {
  const testMode = isTestMode();
  return fetchWithRetry(CONFIG.API_URL, {
    method:  "POST",
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

async function apiSaveStamp(mensaje = "") {
  const testMode = isTestMode();
  return fetchWithRetry(CONFIG.API_URL, {
    method:  "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      action:     "saveStamp",
      nombreNorm: appState.nombreNorm,
      mensaje,
      testMode
    })
  });
}
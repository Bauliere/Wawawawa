async function apiSaveStamp(mensaje = "") {
  const testMode = appState.testMode;

  return fetchWithRetry(CONFIG.API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      action:     "saveStamp",
      nombreNorm: appState.nombreNorm,
      mensaje,
      testMode
    })
  });
}
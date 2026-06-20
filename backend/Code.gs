// ═══════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════

const SPREADSHEET_ID   = "1mS8dCGd5C-JW--JPLne89BKnp7zC_up1Os5wUEunxBY";
const ALLOWED_NAMES    = ["mar", "maria", "guadalupe", "maria bonita"];
const BASE_SPINS       = 1;
const STAMPS_PER_CYCLE = 15;

const SHEET = {
  users:    "Users",
  spins:    "Spins",
  bookings: "Bookings",
  stamps:   "Stamps"
};

// ═══════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════

function jsonResponse(obj) {
  const output = ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

function getSheet(name) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name);
}

function normalizeName(raw) {
  if (!raw) return "";
  return raw.toString().trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function serverDateISO() {
  const now = new Date();
  const y   = now.getFullYear();
  const m   = String(now.getMonth() + 1).padStart(2, "0");
  const d   = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isAllowed(nombreNorm) {
  return ALLOWED_NAMES.includes(nombreNorm);
}

// ═══════════════════════════════════════
// ROUTER
// ═══════════════════════════════════════

function doGet(e) {
  try {
    const action     = e.parameter.action || "";
    const nombreNorm = normalizeName(e.parameter.nombre || "");
    const testMode   = e.parameter.testMode === "true";

    if (action === "getProgress") {
      return jsonResponse(getProgress(nombreNorm, testMode));
    }
    return jsonResponse({ ok: false, error: "Acción no reconocida" });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function doPost(e) {
  try {
    // Parseo robusto: acepta tanto postData.contents como parámetros de form
    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        // Si falla el parse intenta leer como parámetros
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    const action     = data.action     || "";
    const nombreNorm = normalizeName(data.nombreNorm || "");
    const testMode   = data.testMode   === true || data.testMode === "true";

    if (!isAllowed(nombreNorm)) {
      return jsonResponse({ ok: false, error: "Nombre no permitido" });
    }

    if (action === "registerSpin")  return jsonResponse(registerSpin(data, nombreNorm, testMode));
    if (action === "saveBooking")   return jsonResponse(saveBooking(data, nombreNorm, testMode));
    if (action === "saveStamp")     return jsonResponse(saveStamp(data, nombreNorm, testMode));

    return jsonResponse({ ok: false, error: "Acción no reconocida" });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ═══════════════════════════════════════
// COLUMNAS USERS (1-indexed)
// ═══════════════════════════════════════

const U = {
  nombreNorm:     1,
  nombre:         2,
  spinsUsados:    3,
  spinsBonus:     4,
  spinsRestantes: 5,
  stampsEnCiclo:  6,
  totalStamps:    7,
  ultimoSello:    8,
  updatedAt:      9
};

function findUserRow(sheet, nombreNorm) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  const data = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (let i = 0; i < data.length; i++) {
    if (normalizeName(String(data[i][0])) === nombreNorm) {
      return i + 2; // +2 porque empezamos desde fila 2 (fila 1 es cabecera)
    }
  }
  return null;
}

function getUserData(sheet, row) {
  const vals = sheet.getRange(row, 1, 1, 9).getValues()[0];
  return {
    nombreNorm:     String(vals[0] || ""),
    nombre:         String(vals[1] || ""),
    spinsUsados:    Number(vals[2]) || 0,
    spinsBonus:     Number(vals[3]) || 0,
    spinsRestantes: Number(vals[4]) || 0,
    stampsEnCiclo:  Number(vals[5]) || 0,
    totalStamps:    Number(vals[6]) || 0,
    ultimoSello:    String(vals[7] || ""),
    updatedAt:      String(vals[8] || "")
  };
}

function createUser(sheet, nombreNorm, nombreDisplay) {
  const now = new Date().toISOString();
  sheet.appendRow([
    nombreNorm, nombreDisplay,
    0, 0, BASE_SPINS, 0, 0, "", now
  ]);
  return sheet.getLastRow();
}

function setUserCell(sheet, row, col, value) {
  sheet.getRange(row, col).setValue(value);
}

// ═══════════════════════════════════════
// getProgress
// ═══════════════════════════════════════

function getProgress(nombreNorm, testMode) {
  if (!isAllowed(nombreNorm)) return { permitido: false };

  const sheet = getSheet(SHEET.users);
  let   row   = findUserRow(sheet, nombreNorm);

  if (!row) {
    const display = nombreNorm.charAt(0).toUpperCase() + nombreNorm.slice(1);
    row = createUser(sheet, nombreNorm, display);
  }

  const user      = getUserData(sheet, row);
  const hoy       = serverDateISO();
  const sellosHoy = user.ultimoSello === hoy;

  let spinsRestantes = user.spinsRestantes;
  if (testMode && spinsRestantes < 1) spinsRestantes = 1;

  return {
    permitido: true,
    nombreNorm:     user.nombreNorm,
    nombre:         user.nombre,
    spinsRestantes,
    sellosHoy,
    stampsEnCiclo:  user.stampsEnCiclo,
    totalStamps:    user.totalStamps,
    ultimoSello:    user.ultimoSello
  };
}

// ═══════════════════════════════════════
// registerSpin
// ═══════════════════════════════════════

function registerSpin(data, nombreNorm, testMode) {
  const resultado       = String(data.resultado || "");
  const contaParaLimite = data.contaParaLimite !== false &&
                          data.contaParaLimite !== "false";

  const usersSheet = getSheet(SHEET.users);
  const spinsSheet = getSheet(SHEET.spins);

  const row = findUserRow(usersSheet, nombreNorm);
  if (!row) return { ok: false, error: "Usuario no encontrado" };

  const user = getUserData(usersSheet, row);

  if (!testMode && contaParaLimite && user.spinsRestantes <= 0) {
    return { ok: false, error: "Sin intentos disponibles" };
  }

  const now = new Date();
  const hoy = serverDateISO();

  // Escribir en Spins
  spinsSheet.appendRow([
    now.toISOString(), hoy, nombreNorm, user.nombre,
    resultado, contaParaLimite, testMode
  ]);

  let spinsRestantes = user.spinsRestantes;

  if (contaParaLimite && !testMode) {
    spinsRestantes = Math.max(0, user.spinsRestantes - 1);
    setUserCell(usersSheet, row, U.spinsUsados,    user.spinsUsados + 1);
    setUserCell(usersSheet, row, U.spinsRestantes, spinsRestantes);
    setUserCell(usersSheet, row, U.updatedAt,      now.toISOString());
  }

  return { ok: true, spinsRestantes };
}

// ═══════════════════════════════════════
// saveBooking
// ═══════════════════════════════════════

function saveBooking(data, nombreNorm, testMode) {
  const bookingsSheet = getSheet(SHEET.bookings);
  const usersSheet    = getSheet(SHEET.users);

  const row = findUserRow(usersSheet, nombreNorm);
  if (!row) return { ok: false, error: "Usuario no encontrado" };

  const user      = getUserData(usersSheet, row);
  const now       = new Date();
  const hoy       = serverDateISO();
  const bookingId = `${hoy}-${nombreNorm}-${Date.now()}`;

  bookingsSheet.appendRow([
    now.toISOString(), hoy, nombreNorm, user.nombre,
    String(data.resultado || ""),
    String(data.fechaISO  || ""),
    String(data.fecha     || ""),
    String(data.hora      || ""),
    bookingId,
    testMode
  ]);

  return { ok: true, bookingId };
}

// ═══════════════════════════════════════
// saveStamp — con límite diario real
// ═══════════════════════════════════════

function saveStamp(data, nombreNorm, testMode) {
  const usersSheet  = getSheet(SHEET.users);
  const stampsSheet = getSheet(SHEET.stamps);

  const row = findUserRow(usersSheet, nombreNorm);
  if (!row) return { ok: false, error: "Usuario no encontrado" };

  const user = getUserData(usersSheet, row);
  const hoy  = serverDateISO();
  const now  = new Date();

  // Validación de fecha del servidor (no del cliente)
  if (!testMode && user.ultimoSello === hoy) {
    return { ok: false, razon: "ya_sellado" };
  }

  let stampsEnCiclo   = user.stampsEnCiclo + 1;
  let bonusSpinEarned = false;
  const cicloActual   = Math.floor(user.totalStamps / STAMPS_PER_CYCLE) + 1;
  const numeroEnCiclo = stampsEnCiclo;

  if (stampsEnCiclo >= STAMPS_PER_CYCLE) {
    bonusSpinEarned = true;
    stampsEnCiclo   = 0;
  }

  const totalStamps  = user.totalStamps + 1;
  const mensajeSello = buildMensajeSello(numeroEnCiclo, bonusSpinEarned);

  stampsSheet.appendRow([
    now.toISOString(), hoy, nombreNorm, user.nombre,
    mensajeSello, cicloActual, numeroEnCiclo
  ]);

  // Actualizar Users — escribir ultimoSello con fecha exacta del servidor
  setUserCell(usersSheet, row, U.stampsEnCiclo,  stampsEnCiclo);
  setUserCell(usersSheet, row, U.totalStamps,    totalStamps);
  setUserCell(usersSheet, row, U.ultimoSello,    hoy);
  setUserCell(usersSheet, row, U.updatedAt,      now.toISOString());

  if (bonusSpinEarned) {
    setUserCell(usersSheet, row, U.spinsBonus,     user.spinsBonus + 1);
    setUserCell(usersSheet, row, U.spinsRestantes, user.spinsRestantes + 1);
  }

  return { ok: true, stampsEnCiclo, totalStamps, mensajeSello, bonusSpinEarned };
}

// ═══════════════════════════════════════
// MENSAJES DE SELLO
// ═══════════════════════════════════════

function buildMensajeSello(numero, esBono) {
  if (esBono) return "Completaste 15 sellos. Ganaste un intento extra.";
  const mensajes = [
    "Primer sello. El viaje comienza.",
    "Dos sellos, dos recuerdos.",
    "Ya van tres. Qué bonito ritmo.",
    "Cuatro sellos sellados con cariño.",
    "Cinco. A mitad del camino.",
    "Seis. La constancia tiene su encanto.",
    "Siete sellos, siete momentos únicos.",
    "Ocho. Ya casi se nota el patrón.",
    "Nueve sellos. El destino conspira.",
    "Diez. La colección va tomando forma.",
    "Once sellos. Falta poco.",
    "Doce. Qué bonita racha.",
    "Trece sellos. La suerte está de tu lado.",
    "Catorce. Un paso más y el bonus es tuyo.",
    "¡QUINCE! Bonus desbloqueado."
  ];
  return mensajes[Math.min(numero - 1, mensajes.length - 1)] || `Sello ${numero}.`;
}

function getUserData(sheet, row) {
  const vals = sheet.getRange(row, 1, 1, 9).getValues()[0];

  // Normalizar ultimoSello: Sheets puede devolver Date object
  let ultimoSello = vals[7];
  if (ultimoSello instanceof Date) {
    const y = ultimoSello.getFullYear();
    const m = String(ultimoSello.getMonth() + 1).padStart(2, "0");
    const d = String(ultimoSello.getDate()).padStart(2, "0");
    ultimoSello = `${y}-${m}-${d}`;
  } else {
    ultimoSello = String(ultimoSello || "").substring(0, 10);
  }

  return {
    nombreNorm:     String(vals[0] || ""),
    nombre:         String(vals[1] || ""),
    spinsUsados:    Number(vals[2]) || 0,
    spinsBonus:     Number(vals[3]) || 0,
    spinsRestantes: Number(vals[4]) || 0,
    stampsEnCiclo:  Number(vals[5]) || 0,
    totalStamps:    Number(vals[6]) || 0,
    ultimoSello,
    updatedAt:      String(vals[8] || "")
  };
}

function saveStamp(data, nombreNorm, testMode) {
  const usersSheet  = getSheet(SHEET.users);
  const stampsSheet = getSheet(SHEET.stamps);

  const row = findUserRow(usersSheet, nombreNorm);
  if (!row) return { ok: false, error: "Usuario no encontrado" };

  const user    = getUserData(usersSheet, row);
  const hoy     = serverDateISO();
  const now     = new Date();
  const mensaje = String(data.mensaje || "").trim();

  if (!testMode && user.ultimoSello === hoy) {
    return { ok: false, razon: "ya_sellado" };
  }

  let stampsEnCiclo   = user.stampsEnCiclo + 1;
  let bonusSpinEarned = false;
  const cicloActual   = Math.floor(user.totalStamps / STAMPS_PER_CYCLE) + 1;
  const numeroEnCiclo = stampsEnCiclo;

  if (stampsEnCiclo >= STAMPS_PER_CYCLE) {
    bonusSpinEarned = true;
    stampsEnCiclo   = 0;
  }

  const totalStamps  = user.totalStamps + 1;
  const mensajeSello = mensaje || buildMensajeSello(numeroEnCiclo, bonusSpinEarned);

  stampsSheet.appendRow([
    now.toISOString(), hoy, nombreNorm, user.nombre,
    mensajeSello, cicloActual, numeroEnCiclo
  ]);

  // Guardar ultimoSello como texto puro para evitar que Sheets lo convierta a Date
  setUserCell(usersSheet, row, U.stampsEnCiclo, stampsEnCiclo);
  setUserCell(usersSheet, row, U.totalStamps,   totalStamps);
  setUserCell(usersSheet, row, U.updatedAt,     now.toISOString());

  // Forzar texto plano en ultimoSello
  const cellSello = usersSheet.getRange(row, U.ultimoSello);
  cellSello.setNumberFormat("@");
  cellSello.setValue(hoy);

  if (bonusSpinEarned) {
    setUserCell(usersSheet, row, U.spinsBonus,     user.spinsBonus + 1);
    setUserCell(usersSheet, row, U.spinsRestantes, user.spinsRestantes + 1);
  }

  return { ok: true, stampsEnCiclo, totalStamps, mensajeSello, bonusSpinEarned };
}

// ═══════════════════════════════════════
// SETUP (ejecutar UNA vez manualmente)
// ═══════════════════════════════════════

function setupSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const config = {
    Users:    ["nombreNorm","nombre","spinsUsados","spinsBonus","spinsRestantes","stampsEnCiclo","totalStamps","ultimoSello","updatedAt"],
    Spins:    ["timestamp","serverDate","nombreNorm","nombre","resultado","contaParaLimite","modoTest"],
    Bookings: ["timestamp","serverDate","nombreNorm","nombre","resultado","fechaISO","fecha","hora","bookingId","modoTest"],
    Stamps:   ["timestamp","serverDate","nombreNorm","nombre","mensajeSello","ciclo","numeroEnCiclo"]
  };

  Object.entries(config).forEach(([name, headers]) => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight("bold")
        .setBackground("#1a1400")
        .setFontColor("#f0c040");
    }
  });

  Logger.log("Hojas configuradas.");
}
const CONFIG = {

  ALLOWED_NAMES: [
    "mar", "maría", "maria", "guadalupe", "maría bonita"
  ],

  // Normalización: todo a minúsculas sin acentos
  normalizeName(name) {
    return name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  },

  // Nombres normalizados para validación rápida en frontend
  ALLOWED_NAMES_NORM: [
    "mar", "maria", "guadalupe", "maria bonita"
  ],

  WHEEL_OPTIONS: [
    { label: "Sushi",         weight: 50,   color: "#c9a84c" },
    { label: "Cine",          weight: 14.5, color: "#f0c040" },
    { label: "Tacos",         weight: 10,   color: "#ffe066" },
    { label: "Elige tú",      weight: 5,    color: "#d4af37" },
    { label: "Otro intento",  weight: 20,   color: "#555555", noCount: true },
    { label: "Sorpresa",      weight: 0.5,  color: "#7c3aed", special: true }
  ],

  // "Otro intento" nunca cuenta como spin ni se puede agendar
  NO_COUNT_RESULTS: ["Otro intento"],
  INVALID_BOOKING_RESULTS: ["Otro intento"],

  API_URL: "https://script.google.com/macros/s/AKfycbyUjR1phsG233CCG8hmUvMLt9Glq2MepL6_anqvHHe3cUsgY3JG9lqQUAbI0dPzhJc/exec",

  // Fechas del calendario
  MIN_SELECTABLE_DATE: "2026-07-08",
  MAX_SELECTABLE_DATE: "2027-12-31",

  // Horas: solo referencial, es tentativa
  AVAILABLE_HOURS: [
    "10:00", "11:00", "12:00", "13:00", "14:00",
    "15:00", "16:00", "17:00", "18:00", "19:00",
    "20:00", "21:00", "22:00"
  ],
  HOURS_DISCLAIMER: "La hora es tentativa y puede ajustarse.",

  // Sellos: 15 en total (no necesariamente seguidos) = 1 spin extra
  STAMPS_PER_CYCLE: 15,

  // Modo pruebas: activo por URL param ?test=1
  // Para DESACTIVARLO en producción, cambiar a false
  TEST_MODE_ENABLED: false,
  TEST_MODE_PARAM: "test",

  // Spins base que tiene un usuario nuevo
  BASE_SPINS: 1,

  LOCAL_STORAGE_KEYS: {
    session: "sr_session"
  }
};
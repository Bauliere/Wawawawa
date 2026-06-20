// ═══════════════════════════════════════
// ESTADO INTERNO DEL CALENDARIO
// ═══════════════════════════════════════

let calYear  = 0;
let calMonth = 0; // 0–11

const MIN_DATE = new Date(CONFIG.MIN_SELECTABLE_DATE + "T00:00:00");
const MAX_DATE = new Date(CONFIG.MAX_SELECTABLE_DATE + "T00:00:00");

// ═══════════════════════════════════════
// INICIALIZACIÓN
// ═══════════════════════════════════════

function initCalendar() {
  // Arrancar en el mes de MIN_DATE
  calYear  = MIN_DATE.getFullYear();
  calMonth = MIN_DATE.getMonth();

  // Limpiar selección previa
  setState("fechaISO",   null);
  setState("fechaTexto", null);
  checkConfirmButton();

  renderCalendar();
  attachCalNavListeners();
}

function initHoraSelector() {
  const select = document.getElementById("select-hora");
  select.innerHTML = `<option value="">-- Elige una hora --</option>`;

  CONFIG.AVAILABLE_HOURS.forEach(hora => {
    const opt = document.createElement("option");
    opt.value       = hora;
    opt.textContent = hora;
    select.appendChild(opt);
  });

  select.value = "";
  setState("horaTexto", null);

  select.addEventListener("change", () => {
    setState("horaTexto", select.value || null);
    checkConfirmButton();
  });
}

// ═══════════════════════════════════════
// RENDER DEL CALENDARIO
// ═══════════════════════════════════════

function renderCalendar() {
  const grid      = document.getElementById("calendar-grid");
  const monthLabel= document.getElementById("cal-month-label");
  const btnPrev   = document.getElementById("cal-prev");
  const btnNext   = document.getElementById("cal-next");

  // Encabezado con mes y año
  const label = new Date(calYear, calMonth, 1)
    .toLocaleDateString("es-MX", { month: "long", year: "numeric" });
  monthLabel.textContent = label.charAt(0).toUpperCase() + label.slice(1);

  // Deshabilitar navegación fuera del rango permitido
  const prevMonth = new Date(calYear, calMonth - 1, 1);
  const nextMonth = new Date(calYear, calMonth + 1, 1);
  const minMonth  = new Date(MIN_DATE.getFullYear(), MIN_DATE.getMonth(), 1);
  const maxMonth  = new Date(MAX_DATE.getFullYear(), MAX_DATE.getMonth(), 1);

  btnPrev.disabled = prevMonth < minMonth;
  btnNext.disabled = nextMonth > maxMonth;

  // Construir cuadrícula
  grid.innerHTML = "";

  const firstDay   = new Date(calYear, calMonth, 1).getDay(); // 0=Dom
  const daysInMonth= new Date(calYear, calMonth + 1, 0).getDate();

  // Celdas vacías antes del primer día
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("cal-day", "empty");
    grid.appendChild(empty);
  }

  // Días del mes
  for (let d = 1; d <= daysInMonth; d++) {
    const cell    = document.createElement("div");
    const dateISO = toISO(calYear, calMonth, d);
    const dateObj = new Date(calYear, calMonth, d);

    cell.classList.add("cal-day");
    cell.textContent    = d;
    cell.dataset.iso    = dateISO;
    cell.dataset.texto  = dateObj.toLocaleDateString("es-MX", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });

    const isDisabled = dateObj < MIN_DATE || dateObj > MAX_DATE;
    const isSelected = dateISO === getState("fechaISO");

    if (isDisabled) {
      cell.classList.add("disabled");
    } else {
      if (isSelected) cell.classList.add("selected");
      cell.addEventListener("click", onDayClick);
    }

    grid.appendChild(cell);
  }
}

// ═══════════════════════════════════════
// INTERACCIÓN CON EL CALENDARIO
// ═══════════════════════════════════════

function onDayClick(e) {
  const cell     = e.currentTarget;
  const iso      = cell.dataset.iso;
  const textoRaw = cell.dataset.texto;

  // Capitalizar texto de la fecha
  const texto = textoRaw.charAt(0).toUpperCase() + textoRaw.slice(1);

  // Quitar selección previa
  document.querySelectorAll(".cal-day.selected")
    .forEach(el => el.classList.remove("selected"));

  cell.classList.add("selected");

  setState("fechaISO",   iso);
  setState("fechaTexto", texto);

  checkConfirmButton();
}

function attachCalNavListeners() {
  document.getElementById("cal-prev").addEventListener("click", () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCalendar();
  });

  document.getElementById("cal-next").addEventListener("click", () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    renderCalendar();
  });
}

// ═══════════════════════════════════════
// VALIDACIÓN Y BOTÓN CONFIRMAR
// ═══════════════════════════════════════

function checkConfirmButton() {
  const btn    = document.getElementById("btn-confirmar-reserva");
  const fecha  = getState("fechaISO");
  const hora   = getState("horaTexto");

  // Solo habilitar si hay fecha, hora Y resultado válido en appState
  btn.disabled = !(fecha && hora && hasValidResult());
}

// ═══════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════

function toISO(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}
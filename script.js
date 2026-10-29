/* SakuQ MVP — pencatatan uang saku berbasis browser, tanpa backend. */
(() => {
  "use strict";

  const STORAGE_KEY = "sakuq_data_v1";
  const INCOME_CATEGORIES = ["Uang saku", "Uang tambahan", "Hadiah", "Lainnya"];
  const EXPENSE_CATEGORIES = [
    "Makanan & minuman",
    "Transportasi",
    "Kebutuhan sekolah",
    "Hiburan & sosial",
    "Belanja pribadi",
    "Lainnya"
  ];
  const BUDGET_DEFAULTS = {
    "Makanan & minuman": 300000,
    "Transportasi": 200000,
    "Kebutuhan sekolah": 150000,
    "Hiburan & sosial": 100000,
    "Belanja pribadi": 100000,
    "Lainnya": 100000
  };
  const CATEGORY_EMOJIS = {
    "Makanan & minuman": "🍱",
    "Transportasi": "🚌",
    "Kebutuhan sekolah": "📚",
    "Hiburan & sosial": "🎮",
    "Belanja pribadi": "🛍️",
    "Lainnya": "🧾"
  };
  const PAGE_TITLES = {
    dashboard: "Dashboard",
    transactions: "Transaksi",
    budgets: "Anggaran",
    goals: "Target tabungan",
    reports: "Laporan & tips"
  };

  const ICONS = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    receipt: '<path d="M5 3.5h14v17l-3-1.8-4 1.8-4-1.8-3 1.8z"/><path d="M8 8h8M8 12h8M8 16h4"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    wallet: '<rect x="3" y="5" width="18" height="15" rx="2.5"/><path d="M3 9h15a3 3 0 0 1 3 3v2H16a2 2 0 0 1 0-4h5"/><path d="M16 12h.01"/>',
    'arrow-down-left': '<path d="M17 7 7 17M7 8v9h9"/>',
    'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
    'trending-up': '<path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
    piggy: '<path d="M19 9.5a7.5 7.5 0 0 0-13.7-2H3v5h2.2a7.5 7.5 0 0 0 10.7 4.2L19 19v-4.2a7.4 7.4 0 0 0 1-3.8V9.5Z"/><path d="M8 5V3h4M17 9h.01M7 17v3M14 17v3"/>',
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    lightbulb: '<path d="M9 18h6M10 22h4M8.5 14.5a6 6 0 1 1 7 0c-.8.6-1.3 1.3-1.5 2.5h-4c-.2-1.2-.7-1.9-1.5-2.5Z"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
    x: '<path d="m6 6 12 12M18 6 6 18"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7h.01"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8z"/>',
    sparkles: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    'list-checks': '<path d="m3 6 2 2 3-3M11 7h10M3 15l2 2 3-3M11 16h10"/>',
    scale: '<path d="m12 3 8 4-8 4-8-4zM12 11v10M7 21h10M5 7 2 14h6L5 7ZM19 7l-3 7h6l-3-7Z"/>',
    'calendar-check': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18m4 5 2 2 4-4"/>',
    'shield-check': '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 10v6M14 10v6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    'circle-check': '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>'
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const today = getTodayISO();

  let state = loadState();
  let toastTimer;

  function getTodayISO() {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
  }

  function makeId(prefix = "item") {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return `${prefix}_${window.crypto.randomUUID()}`;
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  function defaultState() {
    return {
      transactions: [],
      goals: [],
      budgets: { ...BUDGET_DEFAULTS }
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const safeTransactions = Array.isArray(parsed.transactions)
        ? parsed.transactions.filter((item) => item && ["income", "expense", "saving"].includes(item.type) && Number.isFinite(Number(item.amount)) && Number(item.amount) > 0 && typeof item.date === "string").map((item) => ({
            id: String(item.id || makeId("tx")),
            type: item.type,
            amount: Math.round(Number(item.amount)),
            category: String(item.category || (item.type === "saving" ? "Setoran tabungan" : "Lainnya")),
            date: item.date,
            note: String(item.note || ""),
            goalId: item.goalId ? String(item.goalId) : ""
          }))
        : [];
      const safeGoals = Array.isArray(parsed.goals)
        ? parsed.goals.filter((goal) => goal && typeof goal.name === "string" && Number(goal.targetAmount) > 0).map((goal) => ({
            id: String(goal.id || makeId("goal")),
            name: goal.name.slice(0, 50),
            targetAmount: Math.round(Number(goal.targetAmount)),
            targetDate: typeof goal.targetDate === "string" ? goal.targetDate : "",
            createdAt: typeof goal.createdAt === "string" ? goal.createdAt : today
          }))
        : [];
      const safeBudgets = { ...BUDGET_DEFAULTS };
      if (parsed.budgets && typeof parsed.budgets === "object") {
        Object.keys(BUDGET_DEFAULTS).forEach((category) => {
          const amount = Number(parsed.budgets[category]);
          if (Number.isFinite(amount) && amount >= 0) safeBudgets[category] = Math.round(amount);
        });
      }
      return { transactions: safeTransactions, goals: safeGoals, budgets: safeBudgets };
    } catch (error) {
      console.warn("SakuQ: data lokal tidak bisa dibaca; memulai dengan data kosong.", error);
      return defaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      showToast("Penyimpanan gagal", "Browser tidak dapat menyimpan data. Coba hapus data yang tidak diperlukan atau gunakan browser lain.", true);
      console.error("SakuQ: gagal menyimpan data.", error);
      return false;
    }
  }

  function icon(name, size = 18) {
    const markup = ICONS[name] || ICONS.info;
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${markup}</svg>`;
  }

  function paintIcons(root = document) {
    $$('[data-icon]', root).forEach((element) => {
      const name = element.dataset.icon;
      element.innerHTML = icon(name);
    });
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[character]));
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency", currency: "IDR", maximumFractionDigits: 0
    }).format(Number(value) || 0).replace(/\s/g, "");
  }

  function formatCompactCurrency(value) {
    const amount = Math.abs(Number(value) || 0);
    if (amount >= 1000000) return `Rp${(amount / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
    if (amount >= 1000) return `Rp${Math.round(amount / 1000).toLocaleString("id-ID")} rb`;
    return formatCurrency(amount);
  }

  function formatDate(dateString, options = {}) {
    if (!dateString) return "—";
    const parsed = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return "—";
    return new Intl.DateTimeFormat("id-ID", options.dayOnly ? { day: "numeric", month: "short", year: "numeric" } : { day: "numeric", month: "long", year: "numeric" }).format(parsed);
  }

  function formatCurrentDate() {
    return new Intl.DateTimeFormat("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(new Date());
  }

  function currentMonthKey() {
    return today.slice(0, 7);
  }

  function monthKeyOf(dateString) {
    return String(dateString || "").slice(0, 7);
  }

  function formatMonthLabel(monthKey) {
    const [year, month] = String(monthKey || currentMonthKey()).split("-").map(Number);
    if (!year || !month) return "Bulan ini";
    return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1));
  }

  function txSum(type, monthKey = null) {
    return state.transactions.reduce((sum, item) => {
      if (item.type !== type) return sum;
      if (monthKey && monthKeyOf(item.date) !== monthKey) return sum;
      return sum + item.amount;
    }, 0);
  }

  function availableBalance() {
    return txSum("income") - txSum("expense") - txSum("saving");
  }

  function totalSavings() {
    return txSum("saving");
  }

  function currentMonthExpenseByCategory(category) {
    return state.transactions.reduce((sum, item) => sum + (item.type === "expense" && monthKeyOf(item.date) === currentMonthKey() && item.category === category ? item.amount : 0), 0);
  }

  function getGoalSaved(goalId) {
    return state.transactions.reduce((sum, item) => sum + (item.type === "saving" && item.goalId === goalId ? item.amount : 0), 0);
  }

  function getGoalById(goalId) {
    return state.goals.find((goal) => goal.id === goalId);
  }

  function getActivityTitle(transaction) {
    if (transaction.type === "saving") {
      const goal = getGoalById(transaction.goalId);
      return goal ? `Setoran: ${goal.name}` : "Setoran tabungan";
    }
    return transaction.note.trim() || transaction.category;
  }

  function getActivitySubtitle(transaction) {
    if (transaction.type === "saving") return "Alokasi tabungan";
    return transaction.category;
  }

  function getActivityIconType(type) {
    return type === "income" ? "arrow-down-left" : type === "saving" ? "piggy" : "arrow-up-right";
  }

  function getTypeLabel(type) {
    return type === "income" ? "Pemasukan" : type === "saving" ? "Tabungan" : "Pengeluaran";
  }

  function displaySignedAmount(transaction) {
    const prefix = transaction.type === "income" ? "+" : transaction.type === "saving" ? "−" : "−";
    return `${prefix}${formatCurrency(transaction.amount)}`;
  }

  function sortedTransactions(list = state.transactions) {
    return [...list].sort((a, b) => b.date.localeCompare(a.date) || String(b.id).localeCompare(String(a.id)));
  }

  function showToast(title, message, isError = false) {
    const region = $("#toast-region");
    if (!region) return;
    const toast = document.createElement("div");
    toast.className = `toast${isError ? " error" : ""}`;
    toast.innerHTML = `<span class="toast-icon">${icon(isError ? "info" : "check", 14)}</span><div><strong>${escapeHTML(title)}</strong><p>${escapeHTML(message)}</p></div>`;
    region.appendChild(toast);
    window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(6px)";
      window.setTimeout(() => toast.remove(), 220);
    }, 3200);
  }

  function openDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "open");
  }

  function closeDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  function showFieldError(id, message) {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = message;
    element.hidden = false;
  }

  function clearFieldError(id) {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = "";
    element.hidden = true;
  }

  function renderAll() {
    renderDashboard();
    renderTransactions();
    renderBudgets();
    renderGoals();
    renderReports();
    $("#transaction-count").textContent = String(state.transactions.length);
    paintIcons(document);
  }

  function renderDashboard() {
    const balance = availableBalance();
    const incomeMonth = txSum("income", currentMonthKey());
    const expenseMonth = txSum("expense", currentMonthKey());
    $("#current-date").textContent = formatCurrentDate();
    $("#dashboard-period").textContent = formatMonthLabel(currentMonthKey());
    $("#available-balance").textContent = formatCurrency(balance);
    $("#available-balance").classList.toggle("is-negative", balance < 0);
    $("#balance-caption").textContent = balance < 0 ? "Pengeluaran dan tabungan melebihi pemasukan tercatat" : "Pemasukan dikurangi pengeluaran dan tabungan";
    $("#monthly-income").textContent = formatCurrency(incomeMonth);
    $("#monthly-expenses").textContent = formatCurrency(expenseMonth);
    $("#expense-caption").textContent = expenseMonth > 0 ? `${state.transactions.filter((item) => item.type === "expense" && monthKeyOf(item.date) === currentMonthKey()).length} transaksi pengeluaran` : "Belum ada pengeluaran bulan ini";
    $("#total-savings").textContent = formatCurrency(totalSavings());
    $("#savings-caption").textContent = `${state.goals.length} target tabungan dibuat`;

    const budgetList = $("#dashboard-budget-list");
    budgetList.innerHTML = EXPENSE_CATEGORIES.map((category, index) => {
      const budget = Number(state.budgets[category]) || 0;
      const spent = currentMonthExpenseByCategory(category);
      const ratio = budget > 0 ? spent / budget * 100 : 0;
      const fill = Math.min(100, ratio);
      const isOver = budget > 0 && spent > budget;
      const bottomLeft = budget > 0 ? `${formatCurrency(spent)} dari ${formatCurrency(budget)}` : `${formatCurrency(spent)} terpakai`;
      const bottomRight = budget > 0 ? (isOver ? "Melebihi batas" : `${Math.round(ratio)}% digunakan`) : "Belum diatur";
      return `<div class="budget-row">
        <div class="budget-row-head"><span class="budget-row-title"><i class="category-dot dot-${index % 6}"></i>${escapeHTML(category)}</span><span class="budget-row-value">${budget > 0 ? formatCurrency(budget) : "Tanpa batas"}</span></div>
        <div class="progress-track"><div class="progress-fill fill-${index % 6}${isOver ? " is-over" : ""}" style="width:${fill}%"></div></div>
        <div class="budget-row-foot"><span>${bottomLeft}</span><span class="${isOver ? "over-budget" : ""}">${bottomRight}</span></div>
      </div>`;
    }).join("");

    const goalsContainer = $("#dashboard-goals-list");
    const goals = [...state.goals].sort((a, b) => {
      const aDone = getGoalSaved(a.id) >= a.targetAmount;
      const bDone = getGoalSaved(b.id) >= b.targetAmount;
      return Number(aDone) - Number(bDone);
    }).slice(0, 3);
    if (!goals.length) {
      goalsContainer.innerHTML = `<div class="goal-mini-empty"><div class="empty-icon">${icon("target")}</div><p>Belum ada target. Tentukan satu tujuan agar kamu punya arah menabung.</p><button class="button button-secondary" type="button" data-action="add-goal"><span data-icon="plus"></span> Buat target</button></div>`;
    } else {
      goalsContainer.innerHTML = goals.map((goal) => {
        const saved = getGoalSaved(goal.id);
        const percent = Math.min(100, Math.round(saved / goal.targetAmount * 100));
        return `<div class="goal-mini"><div class="goal-emoji">${goalEmoji(goal.name)}</div><div class="goal-mini-content"><div class="goal-mini-heading"><strong>${escapeHTML(goal.name)}</strong><span class="goal-percent">${percent}%</span></div><div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div><div class="goal-mini-meta"><span>${formatCurrency(saved)} terkumpul</span><strong>${formatCurrency(goal.targetAmount)}</strong></div></div></div>`;
      }).join("");
    }

    const recent = sortedTransactions().slice(0, 5);
    const recentContainer = $("#recent-transactions");
    if (!recent.length) {
      recentContainer.innerHTML = `<div class="empty-inline">Belum ada aktivitas. Catat uang saku atau pengeluaran pertamamu.</div>`;
    } else {
      recentContainer.innerHTML = recent.map((transaction) => `<div class="recent-item">
        <span class="activity-symbol ${transaction.type}">${icon(getActivityIconType(transaction.type), 17)}</span>
        <div class="activity-copy"><strong>${escapeHTML(getActivityTitle(transaction))}</strong><small>${escapeHTML(formatDate(transaction.date, { dayOnly: true }))} · ${escapeHTML(getActivitySubtitle(transaction))}</small></div>
        <div class="activity-amount ${transaction.type}">${displaySignedAmount(transaction)}</div>
      </div>`).join("");
    }
    $("#demo-callout").hidden = state.transactions.length > 0 || state.goals.length > 0;
  }

  function renderTransactions() {
    const currentIncome = txSum("income", currentMonthKey());
    const currentExpenses = txSum("expense", currentMonthKey());
    const currentSavings = txSum("saving", currentMonthKey());
    $("#transaction-stats").innerHTML = `
      <div class="transaction-stat income"><span>Pemasukan bulan ini</span><strong>${formatCurrency(currentIncome)}</strong></div>
      <div class="transaction-stat expense"><span>Pengeluaran bulan ini</span><strong>${formatCurrency(currentExpenses)}</strong></div>
      <div class="transaction-stat"><span>Setoran tabungan bulan ini</span><strong>${formatCurrency(currentSavings)}</strong></div>`;

    const searchTerm = ($("#transaction-search")?.value || "").trim().toLocaleLowerCase("id-ID");
    const typeFilter = $("#transaction-filter")?.value || "all";
    const visible = sortedTransactions().filter((transaction) => {
      if (typeFilter !== "all" && transaction.type !== typeFilter) return false;
      const goal = transaction.type === "saving" ? getGoalById(transaction.goalId) : null;
      const haystack = [transaction.note, transaction.category, getActivityTitle(transaction), goal?.name, getTypeLabel(transaction.type), transaction.date].filter(Boolean).join(" ").toLocaleLowerCase("id-ID");
      return !searchTerm || haystack.includes(searchTerm);
    });
    $("#transaction-results-label").textContent = `${visible.length} catatan ditampilkan`;
    $("#transactions-empty").hidden = visible.length > 0;
    $(".table-scroll").hidden = visible.length === 0;
    const tbody = $("#transactions-tbody");
    tbody.innerHTML = visible.map((transaction) => {
      const title = getActivityTitle(transaction);
      const category = transaction.type === "saving" ? (getGoalById(transaction.goalId)?.name || "Tabungan umum") : transaction.category;
      const editButton = transaction.type !== "saving" ? `<button class="row-action" type="button" data-action="edit-transaction" data-id="${escapeHTML(transaction.id)}" aria-label="Edit ${escapeHTML(title)}" title="Edit">${icon("edit", 14)}</button>` : "";
      return `<tr>
        <td>${escapeHTML(formatDate(transaction.date, { dayOnly: true }))}</td>
        <td><div class="transaction-detail"><span class="activity-symbol ${transaction.type}">${icon(getActivityIconType(transaction.type), 16)}</span><div><strong>${escapeHTML(title)}</strong><small>${transaction.type === "saving" ? "Setoran yang dialokasikan" : escapeHTML(transaction.note ? transaction.category : "Catatan transaksi")}</small></div></div></td>
        <td><span class="type-pill ${transaction.type}">${escapeHTML(getTypeLabel(transaction.type))}</span><div class="category-subtext">${escapeHTML(category)}</div></td>
        <td><span class="table-amount ${transaction.type}">${displaySignedAmount(transaction)}</span></td>
        <td><div class="row-actions">${editButton}<button class="row-action delete" type="button" data-action="delete-transaction" data-id="${escapeHTML(transaction.id)}" aria-label="Hapus ${escapeHTML(title)}" title="Hapus">${icon("trash", 14)}</button></div></td>
      </tr>`;
    }).join("");
  }

  function renderBudgets() {
    const totalBudget = Object.values(state.budgets).reduce((sum, amount) => sum + (Number(amount) || 0), 0);
    const totalSpent = txSum("expense", currentMonthKey());
    const remaining = totalBudget - totalSpent;
    $("#budget-summary-banner").innerHTML = `<div class="budget-summary-copy"><p class="eyebrow">RINGKASAN ANGGARAN · ${escapeHTML(formatMonthLabel(currentMonthKey()).toLocaleUpperCase("id-ID"))}</p><h2>${remaining >= 0 ? "Rencana yang jelas, pikiran lebih tenang." : "Pengeluaranmu melewati rencana."}</h2><p>${remaining >= 0 ? "Bandingkan pengeluaranmu dengan batas yang sudah ditentukan." : "Lihat kembali kategori pengeluaran dan sesuaikan rencana bila diperlukan."}</p></div><div class="budget-summary-numbers"><div><span>Total batas anggaran</span><strong>${formatCurrency(totalBudget)}</strong></div><div><span>Pengeluaran tercatat</span><strong>${formatCurrency(totalSpent)}</strong></div><div><span>${remaining >= 0 ? "Sisa anggaran" : "Lebih dari anggaran"}</span><strong class="${remaining < 0 ? "negative-text" : ""}">${formatCurrency(Math.abs(remaining))}</strong></div></div>`;
    $("#budget-editor-list").innerHTML = EXPENSE_CATEGORIES.map((category, index) => `<div class="budget-editor-row"><div class="budget-editor-label"><i class="category-dot dot-${index % 6}"></i><div><strong>${escapeHTML(category)}</strong><small>Terpakai bulan ini: ${formatCurrency(currentMonthExpenseByCategory(category))}</small></div></div><label class="budget-input-wrap"><span>Rp</span><input class="budget-input" type="number" inputmode="numeric" min="0" step="1000" data-budget-category="${escapeHTML(category)}" value="${Number(state.budgets[category]) || 0}" aria-label="Batas anggaran ${escapeHTML(category)}"></label></div>`).join("");
  }

  function goalEmoji(name) {
    const text = String(name || "").toLowerCase();
    if (/sekolah|buku|belajar|alat tulis|kursus/.test(text)) return "📚";
    if (/sepeda|transport|helm/.test(text)) return "🚲";
    if (/laptop|komputer|gawai|hp|ponsel|tablet/.test(text)) return "💻";
    if (/liburan|jalan|wisata/.test(text)) return "🧳";
    if (/sepatu|baju|tas|pakaian/.test(text)) return "🎒";
    return "🎯";
  }

  function renderGoals() {
    const totalGoalTarget = state.goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalGoalSaved = state.goals.reduce((sum, goal) => sum + getGoalSaved(goal.id), 0);
    const completed = state.goals.filter((goal) => getGoalSaved(goal.id) >= goal.targetAmount).length;
    $("#goal-summary-strip").innerHTML = `
      <div class="goal-summary-item"><span>${icon("target", 18)}</span><div><small>Total target</small><strong>${formatCurrency(totalGoalTarget)}</strong></div></div>
      <div class="goal-summary-item"><span>${icon("piggy", 18)}</span><div><small>Sudah terkumpul di target</small><strong>${formatCurrency(totalGoalSaved)}</strong></div></div>
      <div class="goal-summary-item"><span>${icon("circle-check", 18)}</span><div><small>Target tercapai</small><strong>${completed} dari ${state.goals.length}</strong></div></div>`;

    const container = $("#goals-grid");
    if (!state.goals.length) {
      container.innerHTML = `<div class="goals-empty"><div class="empty-icon">${icon("target", 22)}</div><h2>Belum ada target tabungan</h2><p>Tentukan tujuan sederhana terlebih dahulu. Misalnya membeli perlengkapan sekolah atau menyiapkan biaya kegiatan.</p><button class="button button-primary" type="button" data-action="add-goal"><span data-icon="plus"></span> Buat target pertamamu</button></div>`;
      return;
    }
    container.innerHTML = state.goals.map((goal) => {
      const saved = getGoalSaved(goal.id);
      const remaining = Math.max(0, goal.targetAmount - saved);
      const percent = Math.min(100, Math.round(saved / goal.targetAmount * 100));
      const done = saved >= goal.targetAmount;
      const overdue = Boolean(goal.targetDate && goal.targetDate < today && !done);
      let deadline = "Tidak ditentukan";
      if (goal.targetDate) deadline = overdue ? `Lewat · ${formatDate(goal.targetDate, { dayOnly: true })}` : formatDate(goal.targetDate, { dayOnly: true });
      return `<article class="goal-card">
        <div class="goal-card-top"><div class="goal-card-emoji">${goalEmoji(goal.name)}</div><div class="goal-card-title"><h2>${escapeHTML(goal.name)}</h2><p>Dibuat ${escapeHTML(formatDate(goal.createdAt, { dayOnly: true }))}</p></div><span class="goal-status ${done ? "complete" : ""}">${done ? "Tercapai" : overdue ? "Lewat target" : "Berjalan"}</span></div>
        <div class="goal-card-progress"><div class="goal-progress-heading"><strong>${formatCurrency(saved)}</strong><span>${percent}%</span></div><div class="progress-track"><div class="progress-fill ${done ? "fill-1" : ""}" style="width:${percent}%"></div></div><div class="goal-card-numbers"><span>Target: <strong>${formatCurrency(goal.targetAmount)}</strong></span><span>Sisa: <strong>${formatCurrency(remaining)}</strong></span></div></div>
        <div class="goal-card-footer"><div class="goal-deadline">TANGGAL TARGET<strong>${escapeHTML(deadline)}</strong></div><button class="button ${done ? "button-secondary" : "button-primary"}" type="button" data-action="add-saving" data-id="${escapeHTML(goal.id)}" ${done ? "disabled" : ""}>${done ? icon("check", 14) : icon("piggy", 14)} ${done ? "Target tercapai" : "Tambah tabungan"}</button></div>
      </article>`;
    }).join("");
  }

  function reportData(monthKey) {
    const income = txSum("income", monthKey);
    const expenses = txSum("expense", monthKey);
    const savings = txSum("saving", monthKey);
    const categoryTotals = EXPENSE_CATEGORIES.map((category, index) => ({ category, index, amount: state.transactions.reduce((sum, item) => sum + (item.type === "expense" && monthKeyOf(item.date) === monthKey && item.category === category ? item.amount : 0), 0) })).sort((a, b) => b.amount - a.amount);
    return { income, expenses, savings, net: income - expenses - savings, categoryTotals };
  }

  function renderReports() {
    const monthInput = $("#report-month");
    if (!monthInput.value) monthInput.value = currentMonthKey();
    const monthKey = monthInput.value || currentMonthKey();
    const report = reportData(monthKey);
    const summaryItems = [
      { label: "Pemasukan", amount: report.income, icon: "arrow-down-left", note: "Uang masuk pada periode ini" },
      { label: "Pengeluaran", amount: report.expenses, icon: "arrow-up-right", note: "Transaksi belanja tercatat" },
      { label: "Alokasi tabungan", amount: report.savings, icon: "piggy", note: "Setoran ke target tabungan" },
      { label: "Sisa arus uang", amount: report.net, icon: "wallet", note: "Pemasukan dikurangi pengeluaran dan tabungan" }
    ];
    $("#report-summary-grid").innerHTML = summaryItems.map((item, index) => `<article class="report-stat"><div class="report-stat-top"><span>${item.label}</span><span class="report-stat-icon">${icon(item.icon, 16)}</span></div><strong class="${index === 3 && item.amount < 0 ? "negative-text" : ""}">${formatCurrency(item.amount)}</strong><small>${item.note}</small></article>`).join("");
    $("#report-chart-caption").textContent = `Rincian pengeluaran pada ${formatMonthLabel(monthKey)}.`;
    const nonZero = report.categoryTotals.filter((item) => item.amount > 0);
    const maxAmount = Math.max(1, ...nonZero.map((item) => item.amount));
    $("#report-chart").innerHTML = nonZero.length ? nonZero.map((item) => `<div class="report-bar-row"><div class="report-bar-label"><i class="category-dot dot-${item.index % 6}"></i><span>${escapeHTML(item.category)}</span></div><div class="report-bar-track"><div class="report-bar-fill fill-${item.index % 6}" style="width:${Math.max(2, item.amount / maxAmount * 100)}%"></div></div><span class="report-bar-amount">${formatCompactCurrency(item.amount)}</span></div>`).join("") : `<div class="report-empty">Belum ada pengeluaran pada ${escapeHTML(formatMonthLabel(monthKey))}. Catatan transaksi akan muncul di sini.</div>`;

    const largest = nonZero[0];
    const budgetOver = EXPENSE_CATEGORIES.filter((category) => (Number(state.budgets[category]) || 0) > 0 && report.categoryTotals.find((item) => item.category === category)?.amount > Number(state.budgets[category]));
    const insights = [];
    if (largest) insights.push({ title: "Kategori pengeluaran terbesar", body: `${largest.category} menjadi pengeluaran terbesar dengan total ${formatCurrency(largest.amount)}.` });
    else insights.push({ title: "Mulai dari satu catatan", body: "Catat pemasukan dan pengeluaran agar kamu bisa melihat pola penggunaan uang." });
    if (budgetOver.length) insights.push({ title: "Periksa batas anggaran", body: `Pengeluaran melebihi rencana pada ${budgetOver.join(", ")}. Pertimbangkan penyesuaian yang realistis.` });
    else insights.push({ title: "Cek anggaranmu", body: "Bandingkan pengeluaran dengan batas anggaran untuk melihat apakah rencanamu masih sesuai." });
    if (report.net < 0) insights.push({ title: "Arus uang sedang minus", body: "Pada periode ini, pengeluaran dan alokasi tabungan lebih besar dari pemasukan tercatat. Periksa kembali catatan dan prioritasmu." });
    else if (report.income > 0) insights.push({ title: "Jaga keseimbangan", body: `Sisa arus uang pada periode ini adalah ${formatCurrency(report.net)}. Pastikan kebutuhan penting tetap menjadi prioritas.` });
    else insights.push({ title: "Tambahkan pemasukan", body: "Catat uang saku yang diterima agar ringkasan periode ini lebih lengkap." });
    $("#report-insights").innerHTML = insights.slice(0, 3).map((item) => `<div class="insight-item"><span class="insight-bullet">${icon("sparkles", 13)}</span><div><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(item.body)}</p></div></div>`).join("");
  }

  function updateTransactionCategories(type, selected = "") {
    const options = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    $("#transaction-category").innerHTML = options.map((category) => `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`).join("");
    if (options.includes(selected)) $("#transaction-category").value = selected;
  }

  function openTransactionModal(type = "income", transactionId = "") {
    const transaction = transactionId ? state.transactions.find((item) => item.id === transactionId) : null;
    if (transaction && transaction.type === "saving") {
      showToast("Setoran tabungan", "Setoran dikelola dari halaman target tabungan. Hapus catatannya dari riwayat jika memang perlu.", true);
      return;
    }
    $("#transaction-form").reset();
    clearFieldError("transaction-error");
    $("#transaction-id").value = transaction?.id || "";
    $("#transaction-type").value = transaction?.type || (type === "expense" ? "expense" : "income");
    updateTransactionCategories($("#transaction-type").value, transaction?.category || "");
    $("#transaction-amount").value = transaction?.amount ?? "";
    $("#transaction-date").value = transaction?.date || today;
    $("#transaction-date").max = today;
    $("#transaction-note").value = transaction?.note || "";
    $("#transaction-dialog-title").textContent = transaction ? "Edit transaksi" : "Tambah transaksi";
    openDialog("transaction-dialog");
    window.setTimeout(() => $("#transaction-amount").focus(), 60);
  }

  function openGoalModal() {
    $("#goal-form").reset();
    clearFieldError("goal-error");
    $("#goal-target-date").min = today;
    openDialog("goal-dialog");
    window.setTimeout(() => $("#goal-name").focus(), 60);
  }

  function openSavingModal(goalId) {
    const goal = getGoalById(goalId);
    if (!goal) return;
    const saved = getGoalSaved(goalId);
    const remaining = Math.max(0, goal.targetAmount - saved);
    const balance = availableBalance();
    $("#saving-form").reset();
    clearFieldError("saving-error");
    $("#saving-goal-id").value = goalId;
    $("#saving-goal-subtitle").textContent = `Setoran untuk target “${goal.name}”.`;
    $("#saving-balance-note").innerHTML = `Uang tersedia saat ini: <strong>${formatCurrency(balance)}</strong><br>Sisa target: <strong>${formatCurrency(remaining)}</strong>. Setoran akan mengurangi uang tersedia di SakuQ.`;
    $("#saving-amount").max = String(Math.max(0, Math.min(balance, remaining)));
    $("#saving-amount").value = "";
    $("#saving-amount").placeholder = balance > 0 && remaining > 0 ? `Maksimal ${formatCurrency(Math.min(balance, remaining)).replace("Rp", "")}` : "Tidak ada nominal yang bisa disetor";
    $("#saving-amount").disabled = balance <= 0 || remaining <= 0;
    $("#saving-date").value = today;
    $("#saving-date").max = today;
    if (balance <= 0) showFieldError("saving-error", "Sisa uang tersedia tidak mencukupi. Catat pemasukan atau periksa kembali transaksi sebelum menambah tabungan.");
    else if (remaining <= 0) showFieldError("saving-error", "Target ini sudah tercapai.");
    openDialog("saving-dialog");
    window.setTimeout(() => { if (!$("#saving-amount").disabled) $("#saving-amount").focus(); }, 60);
  }

  function handleTransactionSubmit(event) {
    event.preventDefault();
    clearFieldError("transaction-error");
    const id = $("#transaction-id").value;
    const type = $("#transaction-type").value;
    const amount = Number($("#transaction-amount").value);
    const category = $("#transaction-category").value;
    const date = $("#transaction-date").value;
    const note = $("#transaction-note").value.trim();
    if (!Number.isSafeInteger(amount) || amount <= 0) return showFieldError("transaction-error", "Masukkan nominal rupiah berupa bilangan bulat yang lebih besar dari 0.");
    if (!date || date > today) return showFieldError("transaction-error", "Tanggal transaksi harus hari ini atau tanggal sebelumnya.");
    const existing = id ? state.transactions.find((item) => item.id === id) : null;
    const record = { id: existing?.id || makeId("tx"), type, amount, category, date, note, goalId: "" };
    if (existing) state.transactions = state.transactions.map((item) => item.id === id ? record : item);
    else state.transactions.push(record);
    saveState();
    closeDialog("transaction-dialog");
    renderAll();
    showToast(existing ? "Transaksi diperbarui" : "Transaksi tersimpan", "Ringkasan keuanganmu sudah diperbarui.");
  }

  function handleGoalSubmit(event) {
    event.preventDefault();
    clearFieldError("goal-error");
    const name = $("#goal-name").value.trim();
    const targetAmount = Number($("#goal-target-amount").value);
    const targetDate = $("#goal-target-date").value;
    if (!name) return showFieldError("goal-error", "Masukkan nama target agar mudah dikenali.");
    if (!Number.isSafeInteger(targetAmount) || targetAmount <= 0) return showFieldError("goal-error", "Masukkan target rupiah berupa bilangan bulat yang lebih besar dari 0.");
    if (targetDate && targetDate < today) return showFieldError("goal-error", "Tanggal target tidak boleh berada di masa lalu.");
    state.goals.push({ id: makeId("goal"), name: name.slice(0, 50), targetAmount, targetDate, createdAt: today });
    saveState();
    closeDialog("goal-dialog");
    renderAll();
    showToast("Target berhasil dibuat", `Target “${name}” siap kamu capai secara bertahap.`);
  }

  function handleSavingSubmit(event) {
    event.preventDefault();
    clearFieldError("saving-error");
    const goalId = $("#saving-goal-id").value;
    const goal = getGoalById(goalId);
    const amount = Number($("#saving-amount").value);
    const date = $("#saving-date").value;
    if (!goal) return showFieldError("saving-error", "Target ini tidak ditemukan. Tutup dialog dan pilih target yang masih tersedia.");
    if (!Number.isSafeInteger(amount) || amount <= 0) return showFieldError("saving-error", "Masukkan nominal rupiah berupa bilangan bulat yang lebih besar dari 0.");
    if (!date || date > today) return showFieldError("saving-error", "Tanggal setoran harus hari ini atau tanggal sebelumnya.");
    const balance = availableBalance();
    const remaining = Math.max(0, goal.targetAmount - getGoalSaved(goalId));
    if (amount > balance) return showFieldError("saving-error", `Nominal melebihi uang tersedia (${formatCurrency(balance)}).`);
    if (amount > remaining) return showFieldError("saving-error", `Nominal melebihi sisa target (${formatCurrency(remaining)}).`);
    state.transactions.push({ id: makeId("tx"), type: "saving", amount, category: "Setoran tabungan", date, note: `Setoran untuk ${goal.name}`, goalId });
    saveState();
    closeDialog("saving-dialog");
    renderAll();
    showToast("Setoran berhasil dicatat", `Progres target “${goal.name}” sudah diperbarui.`);
  }

  function handleBudgetSubmit(event) {
    event.preventDefault();
    const nextBudgets = { ...state.budgets };
    for (const category of EXPENSE_CATEGORIES) {
      const input = $(`[data-budget-category="${CSS.escape(category)}"]`);
      if (!input) continue;
      const amount = Number(input.value);
      if (!Number.isSafeInteger(amount) || amount < 0) {
        showToast("Anggaran tidak valid", `Masukkan nominal yang valid untuk kategori ${category}.`, true);
        input.focus();
        return;
      }
      nextBudgets[category] = amount;
    }
    state.budgets = nextBudgets;
    saveState();
    renderAll();
    showToast("Anggaran tersimpan", "Batas anggaran baru sudah diterapkan.");
  }

  function deleteTransaction(transactionId) {
    const transaction = state.transactions.find((item) => item.id === transactionId);
    if (!transaction) return;
    const message = transaction.type === "saving"
      ? "Hapus catatan setoran ini? Progres target tabungan dan sisa uang tersedia akan ikut berubah."
      : "Hapus transaksi ini? Ringkasan, anggaran, dan laporan akan ikut diperbarui.";
    if (!window.confirm(message)) return;
    state.transactions = state.transactions.filter((item) => item.id !== transactionId);
    saveState();
    renderAll();
    showToast("Catatan dihapus", "Perhitungan keuangan sudah diperbarui.");
  }

  function loadDemoData() {
    if (state.transactions.length || state.goals.length) {
      showToast("Data sudah tersedia", "Data contoh hanya bisa dimuat saat catatan masih kosong.", true);
      return;
    }
    if (!window.confirm("Muat data ilustrasi SakuQ? Data contoh bisa dihapus melalui tombol Reset semua data.")) return;
    const dateAgo = (daysAgo) => {
      const now = new Date();
      const day = Math.max(1, now.getDate() - daysAgo);
      const chosen = new Date(now.getFullYear(), now.getMonth(), day);
      const offset = chosen.getTimezoneOffset();
      return new Date(chosen.getTime() - offset * 60000).toISOString().slice(0, 10);
    };
    const goalId = makeId("goal");
    state.goals.push({ id: goalId, name: "Perlengkapan sekolah", targetAmount: 300000, targetDate: addDaysISO(today, 60), createdAt: dateAgo(5) });
    state.transactions.push(
      { id: makeId("tx"), type: "income", amount: 150000, category: "Uang saku", date: dateAgo(5), note: "Uang saku mingguan", goalId: "" },
      { id: makeId("tx"), type: "expense", amount: 25000, category: "Makanan & minuman", date: dateAgo(4), note: "Makan siang", goalId: "" },
      { id: makeId("tx"), type: "expense", amount: 12000, category: "Transportasi", date: dateAgo(3), note: "Ongkos perjalanan", goalId: "" },
      { id: makeId("tx"), type: "expense", amount: 18000, category: "Kebutuhan sekolah", date: dateAgo(2), note: "Fotokopi materi", goalId: "" },
      { id: makeId("tx"), type: "saving", amount: 20000, category: "Setoran tabungan", date: dateAgo(1), note: "Setoran untuk Perlengkapan sekolah", goalId }
    );
    saveState();
    renderAll();
    showToast("Data contoh dimuat", "Kamu bisa menjelajahi fitur SakuQ menggunakan angka ilustrasi.");
  }

  function addDaysISO(dateString, days) {
    const base = new Date(`${dateString}T00:00:00`);
    base.setDate(base.getDate() + days);
    const offset = base.getTimezoneOffset();
    return new Date(base.getTime() - offset * 60000).toISOString().slice(0, 10);
  }

  function resetAllData() {
    const confirmed = window.confirm("Reset semua data SakuQ di browser ini? Catatan transaksi, target tabungan, dan setoran akan dihapus. Tindakan ini tidak bisa dibatalkan.");
    if (!confirmed) return;
    state = defaultState();
    saveState();
    $("#transaction-search").value = "";
    $("#transaction-filter").value = "all";
    renderAll();
    showPage("dashboard");
    showToast("Data direset", "SakuQ kembali ke keadaan awal.");
  }

  function showPage(pageName) {
    if (!PAGE_TITLES[pageName]) return;
    $$('[data-page-panel]').forEach((panel) => {
      const active = panel.dataset.pagePanel === pageName;
      panel.hidden = !active;
      panel.classList.toggle("active", active);
    });
    $$(".nav-item[data-page]").forEach((button) => button.classList.toggle("active", button.dataset.page === pageName));
    $("#topbar-title").textContent = PAGE_TITLES[pageName];
    closeSidebar();
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  function openSidebar() {
    $("#sidebar").classList.add("open");
    $("#sidebar-backdrop").classList.add("show");
    $("#menu-toggle").setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    $("#sidebar").classList.remove("open");
    $("#sidebar-backdrop").classList.remove("show");
    $("#menu-toggle").setAttribute("aria-expanded", "false");
  }

  function handleActions(event) {
    const pageButton = event.target.closest("[data-page]");
    if (pageButton) {
      showPage(pageButton.dataset.page);
      return;
    }
    const pageLink = event.target.closest("[data-page-link]");
    if (pageLink) {
      event.preventDefault();
      showPage(pageLink.dataset.pageLink);
      return;
    }
    const closeButton = event.target.closest("[data-close-dialog]");
    if (closeButton) {
      closeDialog(closeButton.dataset.closeDialog);
      return;
    }
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;
    const { action, id, type } = actionButton.dataset;
    if (action === "add-transaction") openTransactionModal(type || "income");
    else if (action === "edit-transaction") openTransactionModal("income", id);
    else if (action === "delete-transaction") deleteTransaction(id);
    else if (action === "add-goal") openGoalModal();
    else if (action === "add-saving") openSavingModal(id);
    else if (action === "load-demo") loadDemoData();
  }

  function init() {
    paintIcons(document);
    $("#transaction-date").max = today;
    $("#saving-date").max = today;
    $("#goal-target-date").min = today;
    $("#current-date").textContent = formatCurrentDate();
    $("#report-month").value = currentMonthKey();

    document.addEventListener("click", handleActions);
    $("#transaction-type").addEventListener("change", (event) => updateTransactionCategories(event.target.value));
    $("#transaction-form").addEventListener("submit", handleTransactionSubmit);
    $("#goal-form").addEventListener("submit", handleGoalSubmit);
    $("#saving-form").addEventListener("submit", handleSavingSubmit);
    $("#budget-form").addEventListener("submit", handleBudgetSubmit);
    $("#transaction-search").addEventListener("input", renderTransactions);
    $("#transaction-filter").addEventListener("change", renderTransactions);
    $("#report-month").addEventListener("change", renderReports);
    $("#reset-data").addEventListener("click", resetAllData);
    $("#menu-toggle").addEventListener("click", () => $("#sidebar").classList.contains("open") ? closeSidebar() : openSidebar());
    $("#sidebar-backdrop").addEventListener("click", closeSidebar);
    $$(".app-dialog").forEach((dialog) => dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog(dialog.id);
    }));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeSidebar();
    });
    renderAll();
  }

  document.addEventListener("DOMContentLoaded", init, { once: true });
})();

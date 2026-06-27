/* =====================================================================
   Jefferson Horta — Simulador de Consórcio (captação de lead)
   Fluxo: 1) tipo + valor do crédito  2) parcela que cabe no bolso
          3) dados → envia tudo pelo WhatsApp do consultor.
   Sem cálculo de taxa/prazo: o consultor define o prazo ideal para a
   parcela informada e negocia a administradora.
===================================================================== */

const WHATS_NUMBER = "5527998503271";

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

/* ---------- Ícones SVG da marca (stroke = currentColor) ---------- */
const I = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const ICONS = {
  imovel: I('<path d="M3 11.4 12 4l9 7.4"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
  automovel: I('<path d="M5 11l1.6-4.4A2 2 0 0 1 8.5 5h7a2 2 0 0 1 1.9 1.6L19 11"/><path d="M3 16v-3.2A1.8 1.8 0 0 1 4.8 11h14.4A1.8 1.8 0 0 1 21 12.8V16a1 1 0 0 1-1 1h-1"/><path d="M5 17H4a1 1 0 0 1-1-1"/><circle cx="7.5" cy="17" r="1.6"/><circle cx="16.5" cy="17" r="1.6"/>'),
  servicos: I('<path d="M14.6 6.3a3.6 3.6 0 0 0-4.7 4.3l-5.5 5.5a1.6 1.6 0 0 0 2.2 2.2l5.5-5.5a3.6 3.6 0 0 0 4.3-4.7l-2.4 2.4-1.9-1.9z"/>'),
  investimento: I('<path d="M4 5v15h16"/><path d="M7 15l3.2-3.4 3 2.2L20 7"/><path d="M16 7h4v4"/>'),
  reformas: I('<rect x="3" y="3.5" width="12" height="5.5" rx="1.3"/><path d="M15 6.2h3a1.5 1.5 0 0 1 1.5 1.5v1.6a1.5 1.5 0 0 1-1.5 1.5h-6"/><path d="M10 9v3.4a1.2 1.2 0 0 1-1.2 1.2A1.2 1.2 0 0 0 7.6 14.8V20"/><rect x="5.6" y="20" width="4" height="1.6" rx=".5"/>'),
};
const BICONS = {
  juros: I('<circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/><path d="M6 18 18 6"/>'),
  compra: I('<path d="M3 6h2l2 11h10l2-8H7"/><circle cx="9" cy="20" r="1.4"/><circle cx="16" cy="20" r="1.4"/>'),
  flex: I('<path d="M12 3v18"/><path d="M7 6h10"/><path d="M7 6 4 13h6z"/><path d="M17 6l-3 7h6z"/><path d="M9 21h6"/>'),
  valoriza: I('<path d="M4 5v15h16"/><path d="M7 16l3.5-4 3 2.5L20 8"/><path d="M16 8h4v4"/>'),
};

/* ---------- Tipos de consórcio (somente faixa de crédito) ---------- */
const TIPOS = {
  imovel:       { label: "Imóveis",      min: 100000, max: 2000000, step: 10000, defaultCredit: 350000 },
  automovel:    { label: "Veículos",     min: 40000,  max: 500000,  step: 5000,  defaultCredit: 70000 },
  servicos:     { label: "Serviços",     min: 15000,  max: 150000,  step: 5000,  defaultCredit: 30000 },
  investimento: { label: "Investimento", min: 100000, max: 2000000, step: 10000, defaultCredit: 500000 },
  reformas:     { label: "Reformas",     min: 20000,  max: 300000,  step: 5000,  defaultCredit: 80000 },
};

/* ---------- Parcela (quanto o cliente pode pagar por mês) ---------- */
const PARCELA_MIN = 400;
const PARCELA_MAX = 5000;
const PARCELA_SUGESTOES = [500, 800, 1000, 1500, 2000, 3000];

/* ---------- Estado ---------- */
const state = {
  step: 1,
  tipo: "imovel",
  credito: TIPOS.imovel.defaultCredit,
  parcela: 1000,
  lance: 0,
};
const TOTAL_STEPS = 3;
const STEP_LABELS = { 1: "Crédito", 2: "Parcela", 3: "Seus dados" };

/* ---------- Helpers ---------- */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/* ---------- Render: passo 1 (tipo + valor do crédito) ---------- */
function renderTipos() {
  const grid = $("#typeGrid");
  grid.innerHTML = Object.entries(TIPOS).map(([key, t]) => `
    <button class="option ${key === state.tipo ? "selected" : ""}" data-tipo="${key}">
      <span class="ic">${ICONS[key]}</span> ${t.label}
    </button>`).join("");

  $$("#typeGrid .option").forEach((el) => {
    el.addEventListener("click", () => {
      state.tipo = el.dataset.tipo;
      state.credito = TIPOS[state.tipo].defaultCredit;
      renderTipos();
      setupCreditRange();
    });
  });
}

function setupCreditRange() {
  const t = TIPOS[state.tipo];
  const r = $("#creditRange");
  r.min = t.min; r.max = t.max; r.step = t.step; r.value = state.credito;
  $("#creditMin").textContent = BRL.format(t.min);
  $("#creditMax").textContent = BRL.format(t.max);
  updateCreditUI();
}

function updateCreditUI() {
  const t = TIPOS[state.tipo];
  $("#creditValue").textContent = BRL.format(state.credito);
  const pct = ((state.credito - t.min) / (t.max - t.min)) * 100;
  $("#creditRange").style.setProperty("--p", pct + "%");
}

/* ---------- Render: passo 2 (parcela que cabe no bolso) ---------- */
function setupParcela() {
  const r = $("#parcelaRange");
  r.min = PARCELA_MIN; r.max = PARCELA_MAX; r.step = 50; r.value = state.parcela;
  $("#parcelaMin").textContent = BRL.format(PARCELA_MIN);
  $("#parcelaMax").textContent = BRL.format(PARCELA_MAX) + "+";

  $("#parcelaChips").innerHTML = PARCELA_SUGESTOES.map((v) => `
    <button class="chip ${v === state.parcela ? "selected" : ""}" data-parcela="${v}">${BRL.format(v)}</button>`).join("");
  $$("#parcelaChips .chip").forEach((el) => el.addEventListener("click", () => {
    state.parcela = +el.dataset.parcela;
    $("#parcelaRange").value = state.parcela;
    updateParcelaUI();
  }));

  updateParcelaUI();
}

function updateParcelaUI() {
  $("#parcelaValue").textContent = BRL.format(state.parcela) + (state.parcela >= PARCELA_MAX ? "+" : "");
  const pct = ((state.parcela - PARCELA_MIN) / (PARCELA_MAX - PARCELA_MIN)) * 100;
  $("#parcelaRange").style.setProperty("--p", pct + "%");
  // destaca o chip correspondente (se houver)
  $$("#parcelaChips .chip").forEach((c) => c.classList.toggle("selected", +c.dataset.parcela === state.parcela));
}

function renderParcela() {
  const t = TIPOS[state.tipo];
  $("#ctx2").textContent = `${t.label} • Crédito de ${BRL.format(state.credito)}`;
  setupParcela();
}

/* ---------- Navegação do wizard ---------- */
function goToStep(n) {
  state.step = Math.max(1, Math.min(TOTAL_STEPS, n));
  $$(".sim-step").forEach((el) => el.classList.toggle("is-active", +el.dataset.step === state.step));
  $("#progressFill").style.width = (state.step / TOTAL_STEPS) * 100 + "%";
  $("#stepLabel").textContent = `Passo ${state.step} de ${TOTAL_STEPS} — ${STEP_LABELS[state.step]}`;

  if (state.step === 2) renderParcela();

  // rola suavemente o card pro topo em telas pequenas
  if (window.innerWidth < 980) {
    $("#wizard").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ---------- Montagem da mensagem WhatsApp ---------- */
function montarMensagem() {
  const t = TIPOS[state.tipo];
  const nome = ($("#leadName").value || "").trim();
  const fone = ($("#leadPhone").value || "").trim();
  const obj = $("#leadObjetivo").value;
  const parcelaTxt = BRL.format(state.parcela) + (state.parcela >= PARCELA_MAX ? " ou mais" : "");
  const querLance = obj.toLowerCase().includes("lance");

  const linhas = [
    `Olá Jefferson! Fiz uma simulação no seu site e quero conversar.`,
    ``,
    `*MEU PEDIDO DE CONSÓRCIO*`,
    `• Nome: ${nome || "(não informado)"}`,
    fone ? `• WhatsApp: ${fone}` : null,
    `• Objetivo: ${obj}`,
    ``,
    `• Tipo: ${t.label}`,
    `• Crédito (carta): ${BRL.format(state.credito)}`,
    `• Parcela que posso pagar: ${parcelaTxt} por mês`,
    querLance && state.lance > 0 ? `• Lance que posso dar: ${BRL.format(state.lance)}` : null,
    ``,
    `Pode me passar o prazo ideal e as condições pra essa parcela?`,
  ].filter(Boolean);

  return linhas.join("\n");
}

function enviarWhatsApp() {
  const nome = ($("#leadName").value || "").trim();
  if (!nome) {
    $("#leadName").focus();
    $("#leadName").style.borderColor = "#e23b3b";
    $("#leadName").placeholder = "Por favor, informe seu nome";
    return;
  }
  const msg = encodeURIComponent(montarMensagem());
  const url = `https://wa.me/${WHATS_NUMBER}?text=${msg}`;
  window.open(url, "_blank");
}

/* ---------- Bind geral ---------- */
function init() {
  renderTipos();
  setupCreditRange();

  $("#creditRange").addEventListener("input", (e) => {
    state.credito = +e.target.value;
    updateCreditUI();
  });

  $("#parcelaRange").addEventListener("input", (e) => {
    state.parcela = +e.target.value;
    updateParcelaUI();
  });

  $$("[data-next]").forEach((b) => b.addEventListener("click", () => {
    if (state.step === TOTAL_STEPS) { enviarWhatsApp(); return; }
    goToStep(state.step + 1);
  }));
  $$("[data-prev]").forEach((b) => b.addEventListener("click", () => goToStep(state.step - 1)));
  $("#sendWhats").addEventListener("click", enviarWhatsApp);

  // recupera borda do nome ao digitar
  $("#leadName").addEventListener("input", (e) => { e.target.style.borderColor = ""; });

  // mostra o campo de lance só quando o objetivo for "Lance imediato"
  const toggleLance = () => {
    const querLance = $("#leadObjetivo").value.toLowerCase().includes("lance");
    $("#lanceField").hidden = !querLance;
  };
  $("#leadObjetivo").addEventListener("change", toggleLance);
  toggleLance();

  // máscara de moeda no valor do lance
  $("#leadLance").addEventListener("input", (e) => {
    const digitos = e.target.value.replace(/\D/g, "");
    state.lance = digitos ? parseInt(digitos, 10) : 0;
    e.target.value = state.lance > 0 ? BRL.format(state.lance) : "";
  });

  // hero whatsapp simples
  $("#heroWhats").addEventListener("click", (e) => {
    e.preventDefault();
    const msg = encodeURIComponent("Olá Jefferson! Vim pelo seu site e quero saber mais sobre consórcios.");
    window.open(`https://wa.me/${WHATS_NUMBER}?text=${msg}`, "_blank");
  });

  // menu mobile
  const nav = $("#mainNav"), toggle = $("#navToggle");
  toggle.addEventListener("click", () => { nav.classList.toggle("open"); toggle.classList.toggle("open"); });
  $$("#mainNav a").forEach((a) => a.addEventListener("click", () => { nav.classList.remove("open"); toggle.classList.remove("open"); }));

  // injeta ícones de benefícios
  $$("[data-bicon]").forEach((el) => { el.innerHTML = BICONS[el.dataset.bicon] || ""; });

  // ano no footer
  $("#year").textContent = new Date().getFullYear();

  // reveal on scroll
  const els = [".benefit-card", ".about-copy", ".about-photo", ".strategy-copy", ".strategy-photo", ".faq-item", ".sim-intro"];
  const targets = [];
  els.forEach((s) => $$(s).forEach((el) => { el.classList.add("reveal"); targets.push(el); }));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  targets.forEach((el) => io.observe(el));
}

document.addEventListener("DOMContentLoaded", init);

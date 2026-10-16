/* =========================================================
   Ateliê Regina Feitosa — scripts
   Sem dependências externas.
   ========================================================= */

/* ---------- Configuração: altere aqui se o número ou o perfil mudarem ---------- */
const CONFIG = {
  whatsapp: "5579998106561", // 55 (Brasil) + 79 (DDD) + número
  instagram: "https://www.instagram.com/atelie_reginafeitosa/",
  mensagens: {
    geral: "Olá! Conheci o Ateliê Regina Feitosa pelo site e gostaria de informações para fazer um pedido.",
    encomenda: "Olá! Conheci o Ateliê Regina Feitosa pelo site e gostaria de fazer uma encomenda sob medida.",
    ideia: "Olá! Conheci o Ateliê Regina Feitosa pelo site e tenho uma ideia de peça que gostaria que vocês criassem para mim.",
    sugestao: "Olá! Conheci o Ateliê Regina Feitosa pelo site e gostaria de uma sugestão para escolher a peça ideal.",
    peca: (nome, preco) =>
      `Olá! Conheci a peça "${nome}"${preco ? ` (${preco})` : ""} pelo site e gostaria de consultar disponibilidade e informações para realizar um pedido.`,
  },
};

/* ---------- Preços (vêm do arquivo precos.js) ---------- */
function precoDe(nome) {
  const bruto = String((window.PRECOS || {})[nome] || "").trim();
  if (!bruto) return "";
  // Aceita "450", "450,00", "1.250,90" ou o valor já escrito com R$
  if (/^[\d.,\s]+$/.test(bruto)) {
    const numero = Number(bruto.replace(/\s/g, "").replace(/\./g, "").replace(",", "."));
    if (!Number.isNaN(numero)) {
      return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }
  }
  return bruto;
}

const linkWhatsApp = (texto) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

document.documentElement.classList.add("js");

/* ---------- Links de WhatsApp com mensagem automática ---------- */
document.querySelectorAll("[data-wa]").forEach((link) => {
  const tipo = link.dataset.wa;
  if (tipo === "peca") {
    const peca = link.closest(".peca");
    const preco = precoDe(peca.dataset.nome);
    link.href = linkWhatsApp(CONFIG.mensagens.peca(peca.dataset.nome, preco));
    if (preco) {
      const p = document.createElement("p");
      p.className = "peca__preco";
      p.textContent = preco;
      peca.querySelector(".peca__nome").after(p);
    }
    link.setAttribute("aria-label", `Consultar disponibilidade de ${peca.dataset.nome} pelo WhatsApp`);
  } else {
    link.href = linkWhatsApp(CONFIG.mensagens[tipo] || CONFIG.mensagens.geral);
  }
});

/* ---------- Ano do rodapé ---------- */
const ano = document.getElementById("ano");
if (ano) ano.textContent = new Date().getFullYear();

/* ---------- Menu mobile ---------- */
const topo = document.getElementById("topo");
const botaoMenu = document.querySelector(".menu__botao");

function alternarMenu(abrir) {
  const aberto = typeof abrir === "boolean" ? abrir : !topo.classList.contains("aberto");
  topo.classList.toggle("aberto", aberto);
  botaoMenu.setAttribute("aria-expanded", String(aberto));
  botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  botaoMenu.querySelector("use").setAttribute("href", aberto ? "#i-x" : "#i-menu");
  document.body.style.overflow = aberto ? "hidden" : "";
}

botaoMenu.addEventListener("click", () => alternarMenu());
document.querySelectorAll(".menu a").forEach((a) => a.addEventListener("click", () => alternarMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && topo.classList.contains("aberto")) alternarMenu(false);
});
window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => {
  if (e.matches) alternarMenu(false);
});

/* ---------- Coleção: filtros por categoria ---------- */
const pecas = [...document.querySelectorAll(".peca")];
const filtros = document.querySelector(".filtros");

function organizarGrade() {
  // Desloca a peça do meio de cada linha (efeito editorial), só entre as visíveis
  const colunas = getComputedStyle(document.querySelector(".colecao__grade"))
    .gridTemplateColumns.split(" ").length;
  pecas.filter((p) => !p.hidden).forEach((p, i) => {
    p.classList.toggle("deslocada", colunas === 3 ? i % 3 === 1 : colunas === 2 ? i % 2 === 1 : false);
  });
}

const categorias = [...new Set(pecas.map((p) => p.dataset.categoria).filter(Boolean))];
if (categorias.length > 1) {
  ["Todas", ...categorias].forEach((cat, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = cat;
    b.setAttribute("aria-pressed", String(i === 0));
    b.addEventListener("click", () => {
      filtros.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      pecas.forEach((p) => (p.hidden = cat !== "Todas" && p.dataset.categoria !== cat));
      organizarGrade();
    });
    filtros.appendChild(b);
  });
  filtros.hidden = false;
}

organizarGrade();
window.addEventListener("resize", organizarGrade);

/* ---------- Revelação suave das peças ao rolar ---------- */
if ("IntersectionObserver" in window) {
  const obs = new IntersectionObserver(
    (entradas) => entradas.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("visivel"); obs.unobserve(en.target); }
    }),
    { threshold: 0.12 }
  );
  pecas.forEach((p) => obs.observe(p));
} else {
  pecas.forEach((p) => p.classList.add("visivel"));
}

/* ---------- Vitrine: visualização ampliada ---------- */
const vitrine = document.querySelector(".vitrine");
const vImg = vitrine.querySelector(".vitrine__img");
const vCat = vitrine.querySelector(".vitrine__categoria");
const vNome = vitrine.querySelector(".vitrine__nome");
const vDet = vitrine.querySelector(".vitrine__detalhes");
const vPreco = vitrine.querySelector(".vitrine__preco");
const vWa = vitrine.querySelector(".vitrine__wa");
const vCont = vitrine.querySelector(".vitrine__contador");
const vAnt = vitrine.querySelector(".vitrine__seta--ant");
const vProx = vitrine.querySelector(".vitrine__seta--prox");
let lista = [];
let atual = 0;

function mostrar(indice) {
  atual = (indice + lista.length) % lista.length;
  const peca = lista[atual];
  const foto = peca.querySelector(".moldura img");
  const d = peca.dataset;

  const trocar = () => {
    vImg.src = foto.getAttribute("src");
    vImg.alt = foto.alt;
    vImg.setAttribute("width", foto.getAttribute("width"));
    vImg.setAttribute("height", foto.getAttribute("height"));
    vImg.classList.remove("trocando");
  };
  if (vitrine.open && vImg.src) { vImg.classList.add("trocando"); setTimeout(trocar, 200); } else trocar();

  vCat.textContent = d.categoria || "";
  vNome.textContent = d.nome;
  const preco = precoDe(d.nome);
  vPreco.textContent = preco;
  vPreco.hidden = !preco;

  // Só exibe informações que foram cadastradas na peça — nada é inventado
  vDet.innerHTML = "";
  if (d.descricao) {
    const p = document.createElement("p"); p.textContent = d.descricao; vDet.appendChild(p);
  }
  const extras = [["Cores", d.cores], ["Tamanhos", d.tamanhos]].filter(([, v]) => v);
  if (extras.length) {
    const dl = document.createElement("dl");
    extras.forEach(([k, v]) => {
      const dt = document.createElement("dt"); dt.textContent = k;
      const dd = document.createElement("dd"); dd.textContent = v;
      dl.append(dt, dd);
    });
    vDet.appendChild(dl);
  }

  vWa.href = linkWhatsApp(CONFIG.mensagens.peca(d.nome, preco));
  vCont.textContent = lista.length > 1 ? `${atual + 1} de ${lista.length}` : "";
  vAnt.hidden = vProx.hidden = lista.length < 2;
}

function abrirVitrine(peca) {
  lista = pecas.filter((p) => !p.hidden);
  mostrar(lista.indexOf(peca));
  if (typeof vitrine.showModal === "function") vitrine.showModal();
  else vitrine.setAttribute("open", "");
  document.body.style.overflow = "hidden";
}

function fecharVitrine() {
  if (typeof vitrine.close === "function") vitrine.close();
  else { vitrine.removeAttribute("open"); vitrine.dispatchEvent(new Event("close")); }
}

pecas.forEach((p) => p.querySelector(".peca__abrir").addEventListener("click", () => abrirVitrine(p)));
vitrine.querySelector(".vitrine__fechar").addEventListener("click", fecharVitrine);
vitrine.addEventListener("close", () => {
  document.body.style.overflow = "";
  const origem = lista[atual];
  if (origem) origem.querySelector(".peca__abrir").focus({ preventScroll: true });
});
vAnt.addEventListener("click", () => mostrar(atual - 1));
vProx.addEventListener("click", () => mostrar(atual + 1));

vitrine.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") mostrar(atual - 1);
  if (e.key === "ArrowRight") mostrar(atual + 1);
});

// Gesto de deslizar no celular
let toqueX = null;
vitrine.addEventListener("touchstart", (e) => { toqueX = e.touches[0].clientX; }, { passive: true });
vitrine.addEventListener("touchend", (e) => {
  if (toqueX === null || lista.length < 2) return;
  const dx = e.changedTouches[0].clientX - toqueX;
  if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
  toqueX = null;
});

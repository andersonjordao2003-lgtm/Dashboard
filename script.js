const CLIENT_ID = "1473101255999226084";
const REDIRECT_URI = "https://dashboard-amber-six-97.vercel.app";

const API = "https://discord.com/api";

let accessToken = null;
let currentUser = null;
let currentMember = null;
let vipData = null;

function app() {
  return document.getElementById("app");
}

function login() {
  const redirect = encodeURIComponent(REDIRECT_URI);

  window.location.href =
    `${API}/oauth2/authorize?client_id=${CLIENT_ID}` +
    `&redirect_uri=${redirect}` +
    `&response_type=token&scope=identify`;
}

function getToken() {
  const hash = window.location.hash;

  if (hash) {
    const params = new URLSearchParams(hash.substring(1));
    return params.get("access_token");
  }

  return localStorage.getItem("access_token");
}

function logout() {
  localStorage.clear();
  window.location.hash = "";
  renderLogin();
}

function shell(content) {
  app().innerHTML = `
    <header class="header">
      <div class="brand">
        <div class="brand-icon">BLW</div>
        <div>
          <h1>BLW</h1>
          <span>Dashboard Oficial</span>
        </div>
      </div>

      <button class="menu" onclick="renderMenu()">☰</button>
    </header>

    ${content}

    <div class="footer">BLW Dashboard • Painel oficial do bot</div>
  `;
}

function avatarUrl(user) {
  if (!user.avatar) {
    return "https://cdn.discordapp.com/embed/avatars/0.png";
  }

  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
}

async function apiGet(path) {
  const res = await fetch(path, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return await res.json();
}

async function apiPost(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(body)
  });

  return await res.json();
}

function renderLogin() {
  shell(`
    <section class="hero">
      <div class="orb blue"></div>
      <div class="orb red"></div>

      <div class="logo-big">BLW</div>

      <h2>BLW</h2>
      <p>Faça login com Discord para acessar rankings, anúncios e seu painel VIP.</p>

      <button onclick="login()">🎮 Login com Discord</button>
    </section>

    <section class="card">
      <div class="grid">
        <div class="feature">
          <strong>💰 Coins</strong>
          <p>Veja o ranking do servidor.</p>
        </div>

        <div class="feature">
          <strong>⏱ Horas</strong>
          <p>Ranking preparado.</p>
        </div>

        <div class="feature">
          <strong>📢 Anúncios</strong>
          <p>Invasões, jogatinas e eventos.</p>
        </div>

        <div class="feature">
          <strong>👑 VIP</strong>
          <p>Configure seu painel.</p>
        </div>
      </div>
    </section>
  `);
}

async function loadMe() {
  const data = await apiGet("/api/me");

  currentUser = data.user;
  currentMember = data.member;
  vipData = data.vip;
}

function renderHome() {
  const name = currentUser.global_name || currentUser.username;
  const vipActive = vipData && vipData.active;

  shell(`
    <section class="hero">
      <div class="orb blue"></div>
      <div class="orb red"></div>

      <img class="avatar" src="${avatarUrl(currentUser)}" />

      <span class="badge">${vipActive ? "VIP" : "FREE"}</span>

      <h2>Bem-vindo, ${name}</h2>
      <p>Gerencie rankings, anúncios e recursos VIP pelo site.</p>

      <div class="status-box">
        <div class="status-row">
          <span>Discord ID</span>
          <strong>${currentUser.id}</strong>
        </div>

        <div class="status-row">
          <span>Usuário</span>
          <strong>${currentUser.username}</strong>
        </div>

        <div class="status-row">
          <span>Status VIP</span>
          <strong class="${vipActive ? "vip-on" : "vip-free"}">
            ${vipActive ? "✓ Ativo" : "✕ Inativo"}
          </strong>
        </div>

        <div class="status-row">
          <span>Dias restantes</span>
          <strong>${vipData?.days_left ?? "—"}</strong>
        </div>
      </div>

      <button onclick="renderVipPanel()">👑 Meu Painel VIP</button>
      <button onclick="renderAnnouncementPanel()">📢 Anunciar</button>

      <div class="grid">
        <button onclick="renderCoinsRanking()">💰 Ranking Coins</button>
        <button onclick="renderHoursRanking()">⏱ Ranking Horas</button>
      </div>

      <button class="secondary" onclick="logout()">Sair</button>
    </section>
  `);
}

async function renderCoinsRanking() {
  shell(`
    <section class="card">
      <h2>💰 Ranking de Coins</h2>
      <p>Atualizado periodicamente pelo bot.</p>

      <div id="coinsRanking">
        <p>Carregando ranking...</p>
      </div>

      <button class="secondary" onclick="renderHome()">Voltar</button>
    </section>
  `);

  const data = await apiGet("/api/coins-ranking");

  const box = document.getElementById("coinsRanking");

  if (!data.items || data.items.length === 0) {
    box.innerHTML = `<p class="muted">Ranking ainda não configurado.</p>`;
    return;
  }

  box.innerHTML = data.items.map((u, i) => `
    <div class="status-row">
      <span>#${i + 1} ${u.name || u.user_id}</span>
      <strong>${u.coins} coins</strong>
    </div>
  `).join("");
}

function renderHoursRanking() {
  shell(`
    <section class="card">
      <h2>⏱ Ranking de Horas</h2>
      <p>Essa área está preparada para integração futura.</p>

      <div class="status-box">
        <div class="status-row">
          <span>Status</span>
          <strong>Em breve</strong>
        </div>
      </div>

      <button class="secondary" onclick="renderHome()">Voltar</button>
    </section>
  `);
}

function renderAnnouncementPanel() {
  shell(`
    <section class="card">
      <h2>📢 Anunciar</h2>
      <p>Crie um anúncio de invasão, jogatina ou evento. O bot enviará no canal configurado.</p>

      <select id="announceType">
        <option value="invasao">Invasão</option>
        <option value="jogatina">Jogatina</option>
        <option value="evento">Evento</option>
      </select>

      <textarea id="announceText" placeholder="Descrição do anúncio. Pode usar emojis e menções."></textarea>

      <input id="announceLink" placeholder="Link opcional">

      <button onclick="sendAnnouncement()">Enviar anúncio</button>

      <p id="announceStatus"></p>

      <button class="secondary" onclick="renderHome()">Voltar</button>
    </section>
  `);
}

async function sendAnnouncement() {
  const status = document.getElementById("announceStatus");

  const type = document.getElementById("announceType").value;
  const text = document.getElementById("announceText").value;
  const link = document.getElementById("announceLink").value;

  if (!text.trim()) {
    status.className = "vip-free";
    status.innerText = "Escreva a descrição do anúncio.";
    return;
  }

  status.className = "";
  status.innerText = "Enviando...";

  const data = await apiPost("/api/announce", {
    type,
    text,
    link
  });

  status.className = data.ok ? "vip-on" : "vip-free";
  status.innerText = data.ok ? "Anúncio enviado com sucesso!" : data.error;
}

function renderVipPanel() {
  if (!vipData?.active) {
    shell(`
      <section class="hero">
        <div class="orb blue"></div>
        <div class="orb red"></div>

        <h2>Acesso VIP</h2>
        <p>Você não possui VIP ativo no momento.</p>

        <button class="secondary" onclick="renderHome()">Voltar</button>
      </section>
    `);
    return;
  }

  shell(`
    <section class="card">
      <h2>👑 Meu Painel VIP</h2>
      <p>Configure sua call, tag, membros e First Lady.</p>

      <div class="status-box">
        <div class="status-row">
          <span>Dias restantes</span>
          <strong>${vipData.days_left}</strong>
        </div>

        <div class="status-row">
          <span>Limite atual da call</span>
          <strong>${vipData.slots}</strong>
        </div>
      </div>

      <h3>🎙️ Call VIP</h3>
      <input id="callName" placeholder="Nome da call" value="${vipData.voice_name || ""}">
      <input id="callLimit" type="number" placeholder="Limite de pessoas" value="${vipData.slots || 2}">
      <button onclick="saveCall()">Salvar call</button>

      <h3>🏷️ Tag VIP</h3>
      <input id="tagName" placeholder="Nome da tag" value="${vipData.role_name || ""}">
      <input id="tagColor" placeholder="Cor HEX, exemplo: #ff0000">
      <button onclick="saveTag()">Salvar tag</button>

      <h3>👥 Membros</h3>
      <input id="memberId" placeholder="ID do usuário">
      <div class="grid">
        <button onclick="addVipMember()">Adicionar</button>
        <button onclick="removeVipMember()">Remover</button>
      </div>

      <h3>💍 First Lady</h3>
      <input id="firstLadyId" placeholder="ID da First Lady">
      <button onclick="setFirstLady()">Definir First Lady</button>

      <p id="vipStatus"></p>

      <button class="secondary" onclick="renderHome()">Voltar</button>
    </section>
  `);
}

async function saveCall() {
  const data = await apiPost("/api/vip", {
    action: "update_call",
    name: document.getElementById("callName").value,
    limit: document.getElementById("callLimit").value
  });

  showVipStatus(data);
}

async function saveTag() {
  const data = await apiPost("/api/vip", {
    action: "update_tag",
    name: document.getElementById("tagName").value,
    color: document.getElementById("tagColor").value
  });

  showVipStatus(data);
}

async function addVipMember() {
  const data = await apiPost("/api/vip", {
    action: "add_member",
    target_id: document.getElementById("memberId").value
  });

  showVipStatus(data);
}

async function removeVipMember() {
  const data = await apiPost("/api/vip", {
    action: "remove_member",
    target_id: document.getElementById("memberId").value
  });

  showVipStatus(data);
}

async function setFirstLady() {
  const data = await apiPost("/api/vip", {
    action: "set_first_lady",
    target_id: document.getElementById("firstLadyId").value
  });

  showVipStatus(data);
}

function showVipStatus(data) {
  const el = document.getElementById("vipStatus");
  el.className = data.ok ? "vip-on" : "vip-free";
  el.innerText = data.ok ? "Alteração salva com sucesso!" : data.error;
}

function renderMenu() {
  shell(`
    <section class="card">
      <h2>Menu</h2>

      <button onclick="renderHome()">🏠 Início</button>
      <button onclick="renderVipPanel()">👑 Meu VIP</button>
      <button onclick="renderAnnouncementPanel()">📢 Anunciar</button>
      <button onclick="renderCoinsRanking()">💰 Ranking Coins</button>
      <button onclick="renderHoursRanking()">⏱ Ranking Horas</button>
    </section>
  `);
}

async function start() {
  accessToken = getToken();

  if (!accessToken) {
    renderLogin();
    return;
  }

  localStorage.setItem("access_token", accessToken);
  window.history.replaceState({}, document.title, "/");

  try {
    await loadMe();
    renderHome();
  } catch {
    renderLogin();
  }
}

start();

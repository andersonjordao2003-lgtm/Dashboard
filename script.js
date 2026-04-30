const CLIENT_ID = "1473101255999226084";
const REDIRECT_URI = "https://dashboard-amber-six-97.vercel.app";

const RANKING_COINS_LINK = "https://discord.com/channels/1439301605349396613/1489057061697355908";
const RANKING_HORAS_LINK = "https://discord.com/channels/1439301605349396613/1495601632954810448";
const ANUNCIOS_LINK = "https://discord.com/channels/1439301605349396613/1440725374555390144";
const VIP_LINK = "https://discord.com/channels/1439301605349396613/1470042426411323535";
const DISCORD_OFICIAL_LINK = "https://discord.gg/FYk5Evqg8y";

const API = "https://discord.com/api";

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
  if (!hash) return null;

  const params = new URLSearchParams(hash.substring(1));
  return params.get("access_token");
}

function logout() {
  window.location.hash = "";
  localStorage.removeItem("blw_user");
  renderLogin();
}

async function getUser(token) {
  const res = await fetch(`${API}/users/@me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return await res.json();
}

function avatarUrl(user) {
  if (!user.avatar) {
    return "https://cdn.discordapp.com/embed/avatars/0.png";
  }

  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
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

    <div class="footer">BLW Dashboard • Sistema oficial</div>
  `;
}

function renderLogin() {
  shell(`
    <section class="hero">
      <div class="orb blue"></div>
      <div class="orb red"></div>

      <div class="logo-big">BLW</div>

      <h2>BLW</h2>
      <p>Faça login com sua conta Discord para acessar o painel da comunidade.</p>

      <button onclick="login()">🎮 Login com Discord</button>
    </section>

    <section class="card">
      <div class="grid">
        <div class="feature">
          <strong>🏆 Rankings</strong>
          <p>Coins e horas.</p>
        </div>

        <div class="feature">
          <strong>💎 VIP</strong>
          <p>Status e benefícios.</p>
        </div>

        <div class="feature">
          <strong>📢 Anúncios</strong>
          <p>Eventos e invasões.</p>
        </div>

        <div class="feature">
          <strong>👤 Perfil</strong>
          <p>Sua conta Discord.</p>
        </div>
      </div>
    </section>
  `);
}

function renderDashboard(user) {
  const name = user.global_name || user.username;

  shell(`
    <section class="hero">
      <div class="orb blue"></div>
      <div class="orb red"></div>

      <img class="avatar" src="${avatarUrl(user)}" />

      <span class="badge">FREE</span>

      <h2>Bem-vindo, ${name}</h2>
      <p>Gerencie sua conta, rankings, anúncios e benefícios VIP.</p>

      <div class="status-box">
        <div class="status-row">
          <span>Discord ID</span>
          <strong>${user.id}</strong>
        </div>

        <div class="status-row">
          <span>Username</span>
          <strong>${user.username}</strong>
        </div>

        <div class="status-row">
          <span>Status VIP</span>
          <strong class="vip-free">✕ Inativo</strong>
        </div>
      </div>

      <div class="grid">
        <button onclick="openLink(RANKING_COINS_LINK)">💰 Coins</button>
        <button onclick="openLink(RANKING_HORAS_LINK)">⏱ Horas</button>
      </div>

      <button onclick="renderVip()">💎 Acesso VIP</button>
      <button onclick="renderAnnouncements()">📢 Anúncios</button>
      <button class="secondary" onclick="logout()">Sair</button>
    </section>

    <section class="card">
      <h2>Sobre a BLW</h2>
      <p>Confira recursos disponíveis, benefícios VIP, ranking e canais oficiais da comunidade.</p>
      <button onclick="openLink(DISCORD_OFICIAL_LINK)">Discord Oficial</button>
    </section>
  `);
}

function renderMenu() {
  shell(`
    <section class="card">
      <h2>Menu</h2>

      <button onclick="home()">🏠 Início</button>
      <button onclick="openLink(RANKING_COINS_LINK)">💰 Ranking Coins</button>
      <button onclick="openLink(RANKING_HORAS_LINK)">⏱ Ranking Horas</button>
      <button onclick="renderVip()">💎 VIP</button>
      <button onclick="renderAnnouncements()">📢 Anúncios</button>
      <button onclick="openLink(DISCORD_OFICIAL_LINK)">🎮 Discord Oficial</button>
    </section>
  `);
}

function renderVip() {
  shell(`
    <section class="hero">
      <div class="orb blue"></div>
      <div class="orb red"></div>

      <h2>VIP Necessário</h2>
      <p>Desbloqueie todos os recursos premium da BLW.</p>

      <div class="status-box">
        <div class="status-row">
          <span>Rich Presence Personalizado</span>
          <strong>✓</strong>
        </div>

        <div class="status-row">
          <span>Call Farm Automático</span>
          <strong>✓</strong>
        </div>

        <div class="status-row">
          <span>Configurações Avançadas</span>
          <strong>✓</strong>
        </div>

        <div class="status-row">
          <span>Suporte Prioritário</span>
          <strong>✓</strong>
        </div>
      </div>

      <button onclick="openLink(VIP_LINK)">👑 Obter Acesso VIP</button>
      <button onclick="openLink(DISCORD_OFICIAL_LINK)">🎮 Discord Oficial</button>
      <button class="secondary" onclick="home()">Voltar</button>
    </section>
  `);
}

function renderAnnouncements() {
  shell(`
    <section class="card">
      <h2>📢 Anúncios</h2>
      <p>Acesse o canal oficial de anúncios, invasões, jogatinas e eventos.</p>

      <button onclick="openLink(ANUNCIOS_LINK)">Abrir canal de anúncios</button>
      <button class="secondary" onclick="home()">Voltar</button>
    </section>
  `);
}

function openLink(link) {
  if (!link || link.includes("COLE_")) {
    alert("Esse link ainda precisa ser configurado no script.js");
    return;
  }

  window.location.href = link;
}

async function home() {
  const saved = localStorage.getItem("blw_user");

  if (saved) {
    renderDashboard(JSON.parse(saved));
    return;
  }

  const token = getToken();

  if (!token) {
    renderLogin();
    return;
  }

  try {
    const user = await getUser(token);

    if (!user.id) {
      renderLogin();
      return;
    }

    localStorage.setItem("blw_user", JSON.stringify(user));
    window.history.replaceState({}, document.title, "/");

    renderDashboard(user);
  } catch {
    renderLogin();
  }
}

home();

const CLIENT_ID = "1473101255999226084";
const REDIRECT_URI = "https://dashboard-amber-six-97.vercel.app";

function login() {
  const redirect = encodeURIComponent(REDIRECT_URI);
  window.location.href =
    `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${redirect}&scope=identify`;
}

window.onload = async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) return;

  try {
    const res = await fetch(`/api/auth?code=${code}`);
    const user = await res.json();

    if (user.error || !user.id) {
      document.body.innerHTML = `
        <main class="page">
          <section class="hero">
            <h2>Erro no login</h2>
            <p>${user.error || "Não foi possível carregar sua conta Discord."}</p>
            <button class="login-btn" onclick="window.location.href='/'">Voltar</button>
          </section>
        </main>
      `;
      return;
    }

    const avatar = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;

    document.body.innerHTML = `
      <main class="page">
        <header class="topbar">
          <div class="brand">
            <div class="logo">B</div>
            <div>
              <h1>BLW Dashboard</h1>
              <span>Conta conectada</span>
            </div>
          </div>
        </header>

        <section class="hero">
          <div class="orb orb-blue"></div>
          <div class="orb orb-red"></div>

          <div class="avatar-card">
            <img src="${avatar}" />
          </div>

          <h2>Bem-vindo, ${user.global_name || user.username}</h2>
          <p>ID Discord: ${user.id}</p>

          <button class="login-btn" onclick="window.location.href='/'">
            Sair
          </button>
        </section>

        <section class="cards">
          <div class="card">
            <strong>🏆 Ranking</strong>
            <p>Próxima etapa: conectar com o bot.</p>
          </div>
          <div class="card">
            <strong>📢 Anúncios</strong>
            <p>Próxima etapa: comandos pelo site.</p>
          </div>
        </section>
      </main>
    `;
  } catch (err) {
    document.body.innerHTML = `
      <main class="page">
        <section class="hero">
          <h2>Erro</h2>
          <p>Falha ao conectar com a API.</p>
        </section>
      </main>
    `;
  }
};

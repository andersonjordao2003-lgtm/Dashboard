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

  const app = document.getElementById("app");

  app.innerHTML = `
    <section class="hero">
      <h1>Carregando...</h1>
      <p>Buscando sua conta Discord.</p>
    </section>
  `;

  try {
    const res = await fetch(`/api/auth?code=${encodeURIComponent(code)}`);
    const data = await res.json();

    if (!res.ok || !data.id) {
      app.innerHTML = `
        <section class="hero">
          <h1>Erro no login</h1>
          <p>${data.error || "Não foi possível carregar sua conta."}</p>
          <button onclick="window.location.href='/'">Voltar</button>
        </section>
      `;
      return;
    }

    const avatar = data.avatar
      ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
      : "https://cdn.discordapp.com/embed/avatars/0.png";

    app.innerHTML = `
      <section class="hero">
        <img class="avatar" src="${avatar}" />
        <h1>Bem-vindo, ${data.global_name || data.username}</h1>
        <p>ID Discord: ${data.id}</p>

        <button onclick="window.location.href='/'">Sair</button>
      </section>
    `;
  } catch (err) {
    app.innerHTML = `
      <section class="hero">
        <h1>Erro interno</h1>
        <p>Falha ao conectar com a API.</p>
        <button onclick="window.location.href='/'">Voltar</button>
      </section>
    `;
  }
};

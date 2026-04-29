const CLIENT_ID = "1473101255999226084";
const REDIRECT_URI = "https://dashboard-amber-six-97.vercel.app";

function login() {
  const redirect = encodeURIComponent(REDIRECT_URI);

  window.location.href =
    `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${redirect}&scope=identify`;
}

function showError(title, message, details = null) {
  const app = document.getElementById("app");

  app.innerHTML = `
    <section class="hero">
      <h1>${title}</h1>
      <p>${message}</p>

      ${
        details
          ? `<pre style="
              white-space: pre-wrap;
              text-align: left;
              font-size: 12px;
              background: rgba(0,0,0,.35);
              padding: 14px;
              border-radius: 14px;
              margin-top: 18px;
              color: #fca5a5;
              overflow:auto;
            ">${details}</pre>`
          : ""
      }

      <button onclick="window.location.href='/'">Voltar</button>
    </section>
  `;
}

window.onload = async () => {
  const app = document.getElementById("app");
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) return;

  app.innerHTML = `
    <section class="hero">
      <h1>Carregando...</h1>
      <p>Conectando com sua conta Discord.</p>
    </section>
  `;

  try {
    const res = await fetch(`/api/auth?code=${encodeURIComponent(code)}`);
    const data = await res.json();

    if (!res.ok) {
      showError(
        "Erro no login",
        data.error || "Erro ao autenticar com Discord.",
        JSON.stringify(data.details || data, null, 2)
      );
      return;
    }

    if (!data.id) {
      showError(
        "Erro no login",
        "A API respondeu, mas não retornou os dados do usuário.",
        JSON.stringify(data, null, 2)
      );
      return;
    }

    const avatar = data.avatar
      ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
      : "https://cdn.discordapp.com/embed/avatars/0.png";

    const name = data.global_name || data.username || "Usuário";

    app.innerHTML = `
      <section class="hero">
        <div class="orb blue"></div>
        <div class="orb red"></div>

        <img class="avatar" src="${avatar}" alt="Avatar Discord" />

        <h1>Bem-vindo, ${name}</h1>
        <p>ID Discord: ${data.id}</p>

        <button onclick="window.location.href='/'">Sair</button>
      </section>
    `;
  } catch (err) {
    showError(
      "Erro interno",
      "Falha ao conectar com a API do site.",
      String(err)
    );
  }
};

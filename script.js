const CLIENT_ID = "1473101255999226084";
const REDIRECT_URI = "https://dashboard-amber-six-97.vercel.app/";

function login() {
  const redirect = encodeURIComponent(REDIRECT_URI);

  window.location.href =
    `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${redirect}&scope=identify`;
}

window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (code) {
    document.body.innerHTML = `
      <main class="page">
        <section class="hero success">
          <div class="orb orb-blue"></div>
          <div class="orb orb-red"></div>

          <div class="avatar-card">
            <img src="https://cdn.discordapp.com/embed/avatars/0.png" />
          </div>

          <h2>Login realizado!</h2>
          <p>Você voltou do Discord corretamente. A próxima etapa é conectar o backend para carregar ranking, perfil e comandos reais.</p>

          <button class="login-btn" onclick="window.location.href='/'">
            Voltar ao painel
          </button>
        </section>
      </main>
    `;
  }
};

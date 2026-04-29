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

  if (code) {
    const res = await fetch(`/api/auth?code=${code}`);
    const user = await res.json();

    document.body.innerHTML = `
      <h1>Bem-vindo ${user.username}</h1>
      <img src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png" width="100"/>
    `;
  }
};

const CLIENT_ID = "1473101255999226084";
const REDIRECT_URI = "https://SEU-SITE.vercel.app";
const API = "https://discord.com/api";

function layout(content){
  document.getElementById("app").innerHTML = content;
}

function login(){
  window.location.href =
    `${API}/oauth2/authorize?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=token&scope=identify`;
}

function getToken(){
  const hash = window.location.hash;
  if(!hash) return null;

  const params = new URLSearchParams(hash.substring(1));
  return params.get("access_token");
}

async function fetchUser(token){
  const res = await fetch(`${API}/users/@me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

function home(){
  const token = getToken();
  if(!token) return loginScreen();

  fetchUser(token).then(user=>{
    layout(`
      <div class="card">
        <img class="avatar"
          src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png" />

        <h2>Bem-vindo, ${user.username}</h2>

        <button onclick="ranking('coins')">💰 Ranking Coins</button>
        <button onclick="ranking('hours')">⏱ Ranking Horas</button>
        <button onclick="anuncios()">📢 Anúncios</button>
        <button onclick="vip()">💎 VIP</button>
        <button class="secondary" onclick="logout()">Sair</button>
      </div>
    `);
  }).catch(()=>{
    error();
  });
}

function ranking(type){
  const link = "COLE_AQUI_LINK_DO_CANAL";

  layout(`
    <div class="card">
      <h2>${type === "hours" ? "⏱ Ranking Horas" : "💰 Ranking Coins"}</h2>
      <p>Ranking atualizado no Discord.</p>

      <button onclick="window.location.href='${link}'">
        Abrir ranking
      </button>

      <button class="secondary" onclick="home()">Voltar</button>
    </div>
  `);
}

function anuncios(){
  layout(`
    <div class="card">
      <h2>📢 Anúncios</h2>
      <p>Confira os anúncios no servidor Discord.</p>

      <button onclick="window.location.href='COLE_LINK_ANUNCIOS'">
        Abrir canal
      </button>

      <button class="secondary" onclick="home()">Voltar</button>
    </div>
  `);
}

function vip(){
  layout(`
    <div class="card">
      <h2>💎 VIP</h2>
      <p>Para comprar VIP, fale com a staff.</p>

      <button onclick="window.location.href='COLE_LINK_LOJA'">
        Comprar VIP
      </button>

      <button class="secondary" onclick="home()">Voltar</button>
    </div>
  `);
}

function logout(){
  window.location.hash = "";
  loginScreen();
}

function loginScreen(){
  layout(`
    <div class="card">
      <h2>Dashboard BLW</h2>
      <button onclick="login()">Login com Discord</button>
    </div>
  `);
}

function error(){
  layout(`
    <div class="card">
      <h2>Erro no login</h2>
      <button onclick="login()">Tentar novamente</button>
    </div>
  `);
}

home();

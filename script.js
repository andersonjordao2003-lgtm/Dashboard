const CLIENT_ID = "1473101255999226084";
const REDIRECT_URI = "https://dashboard-amber-six-97.vercel.app";

let currentUser = null;
let currentMember = null;

function app(){
  return document.getElementById("app");
}

function login(){
  const redirect = encodeURIComponent(REDIRECT_URI);
  window.location.href =
    `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${redirect}&scope=identify`;
}

function logout(){
  localStorage.clear();
  window.location.href = "/";
}

function layout(content){
  app().innerHTML = `
    <div class="top">
      <div class="brand">
        <div class="logo">BLW</div>
        <div>
          <b>BLW Dashboard</b>
          <div class="muted">Painel oficial</div>
        </div>
      </div>
      <button style="width:54px" onclick="home()">☰</button>
    </div>
    ${content}
  `;
}

function loginScreen(){
  layout(`
    <div class="card center">
      <div class="logo" style="margin:auto;width:110px;height:110px;border-radius:50%;font-size:28px">BLW</div>
      <h1>Dashboard BLW</h1>
      <p>Entre com Discord para acessar ranking, anúncios e painel VIP.</p>
      <button onclick="login()">Login com Discord</button>
    </div>
  `);
}

function home(){
  if(!currentUser) return loginScreen();

  const name = currentUser.global_name || currentUser.username;
  const avatar = currentUser.avatar
    ? `https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.avatar}.png`
    : "https://cdn.discordapp.com/embed/avatars/0.png";

  layout(`
    <div class="card center">
      <img class="avatar" src="${avatar}">
      <h2>${name}</h2>
      <p>ID: ${currentUser.id}</p>
      <p>Status: <b>${currentMember?.isStaff ? "Staff" : "Membro"}</b></p>

      <div class="grid">
        <button onclick="ranking('hours')">🏆 Horas</button>
        <button onclick="ranking('coins')">💰 Coins</button>
      </div>

      <button onclick="announcePanel()">📢 Anunciar</button>
      <button onclick="vipPanel()">👑 Painel VIP</button>
      <button class="secondary" onclick="logout()">Sair</button>
    </div>
  `);
}

async function ranking(type){
  layout(`
    <div class="card">
      <h2>${type === "hours" ? "🏆 Ranking de Horas" : "💰 Ranking de Coins"}</h2>
      <div id="ranking"><p>Carregando...</p></div>
      <button class="secondary" onclick="home()">Voltar</button>
    </div>
  `);

  const res = await fetch(`/api/ranking?type=${type}`);
  const data = await res.json();

  if(!data.items || !data.items.length){
    document.getElementById("ranking").innerHTML =
      `<p class="muted">Ranking vazio ou bridge do bot ainda não configurada.</p>`;
    return;
  }

  document.getElementById("ranking").innerHTML = data.items.map((u,i)=>`
    <div class="row">
      <div class="rank">${i+1}</div>
      <div style="flex:1">
        <b>${u.name || u.user_id}</b>
        <div class="muted">${u.user_id}</div>
      </div>
      <b>${type === "hours" ? `${u.hours}h` : `${u.coins} coins`}</b>
    </div>
  `).join("");
}

function announcePanel(){
  layout(`
    <div class="card">
      <h2>📢 Anunciar</h2>
      <select id="tipo">
        <option>Invasão</option>
        <option>Jogatina</option>
        <option>Evento</option>
      </select>
      <textarea id="mensagem" placeholder="Texto do anúncio"></textarea>
      <input id="link" placeholder="Link opcional">
      <button onclick="sendAnnouncement()">Enviar</button>
      <p id="status"></p>
      <button class="secondary" onclick="home()">Voltar</button>
    </div>
  `);
}

async function sendAnnouncement(){
  const status = document.getElementById("status");
  status.innerText = "Enviando...";

  const res = await fetch("/api/announce",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      user_id:currentUser.id,
      tipo:document.getElementById("tipo").value,
      mensagem:document.getElementById("mensagem").value,
      link:document.getElementById("link").value
    })
  });

  const data = await res.json();
  status.className = data.ok ? "ok" : "err";
  status.innerText = data.ok ? "Anúncio enviado!" : data.error;
}

function vipPanel(){
  layout(`
    <div class="card">
      <h2>👑 Painel VIP</h2>
      <p class="muted">Área staff para configurar VIP por cargo.</p>

      <input id="vipUser" placeholder="ID do usuário">
      <select id="vipAction">
        <option value="grant">Adicionar VIP</option>
        <option value="remove">Remover VIP</option>
      </select>

      <button onclick="sendVip()">Salvar VIP</button>
      <p id="vipStatus"></p>

      <button class="secondary" onclick="home()">Voltar</button>
    </div>
  `);
}

async function sendVip(){
  const status = document.getElementById("vipStatus");
  status.innerText = "Processando...";

  const res = await fetch("/api/vip",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      staff_id:currentUser.id,
      target_id:document.getElementById("vipUser").value,
      action:document.getElementById("vipAction").value
    })
  });

  const data = await res.json();
  status.className = data.ok ? "ok" : "err";
  status.innerText = data.ok ? "VIP atualizado!" : data.error;
}

async function finishLogin(code){
  layout(`<div class="card center"><h2>Carregando...</h2><p>Conectando Discord.</p></div>`);

  const res = await fetch(`/api/auth?code=${encodeURIComponent(code)}`);
  const data = await res.json();

  if(!res.ok || !data.user){
    layout(`<div class="card"><h2>Erro no login</h2><pre>${JSON.stringify(data,null,2)}</pre></div>`);
    return;
  }

  currentUser = data.user;
  currentMember = data.member;

  localStorage.setItem("user",JSON.stringify(currentUser));
  localStorage.setItem("member",JSON.stringify(currentMember));

  window.history.replaceState({},document.title,"/");
  home();
}

window.onload = ()=>{
  const code = new URLSearchParams(window.location.search).get("code");

  if(code) return finishLogin(code);

  const savedUser = localStorage.getItem("user");
  const savedMember = localStorage.getItem("member");

  if(savedUser){
    currentUser = JSON.parse(savedUser);
    currentMember = JSON.parse(savedMember || "{}");
    return home();
  }

  loginScreen();
};

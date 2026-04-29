export default async function handler(req,res){
  try{
    const { code } = req.query;

    const params = new URLSearchParams();
    params.append("client_id",process.env.CLIENT_ID);
    params.append("client_secret",process.env.CLIENT_SECRET);
    params.append("grant_type","authorization_code");
    params.append("code",code);
    params.append("redirect_uri",process.env.REDIRECT_URI);

    const tokenRes = await fetch("https://discord.com/api/oauth2/token",{
      method:"POST",
      headers:{ "Content-Type":"application/x-www-form-urlencoded" },
      body:params
    });

    const token = await tokenRes.json();

    if(!tokenRes.ok){
      return res.status(400).json({error:"Erro OAuth",details:token});
    }

    const userRes = await fetch("https://discord.com/api/users/@me",{
      headers:{Authorization:`Bearer ${token.access_token}`}
    });

    const user = await userRes.json();

    let member = { inGuild:false, isStaff:false, roles:[] };

    if(process.env.BOT_TOKEN && process.env.GUILD_ID){
      const mRes = await fetch(`https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${user.id}`,{
        headers:{Authorization:`Bot ${process.env.BOT_TOKEN}`}
      });

      if(mRes.ok){
        const m = await mRes.json();
        const staffRoles = (process.env.STAFF_ROLE_IDS || "").split(",").map(x=>x.trim());
        member = {
          inGuild:true,
          roles:m.roles || [],
          isStaff:(m.roles || []).some(r=>staffRoles.includes(r))
        };
      }
    }

    res.json({
      user:{
        id:user.id,
        username:user.username,
        global_name:user.global_name,
        avatar:user.avatar
      },
      member
    });
  }catch(e){
    res.status(500).json({error:"Erro interno",details:String(e)});
  }
}

export default async function handler(req,res){
  if(req.method !== "POST"){
    return res.status(405).json({error:"Método inválido"});
  }

  try{
    const { user_id,tipo,mensagem,link } = req.body;

    const memberRes = await fetch(`https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${user_id}`,{
      headers:{Authorization:`Bot ${process.env.BOT_TOKEN}`}
    });

    const member = await memberRes.json();

    if(!memberRes.ok){
      return res.status(403).json({error:"Você não está no servidor."});
    }

    const staffRoles = (process.env.STAFF_ROLE_IDS || "").split(",").map(x=>x.trim());
    const isStaff = (member.roles || []).some(r=>staffRoles.includes(r));

    if(!isStaff){
      return res.status(403).json({error:"Sem permissão de staff."});
    }

    const embed = {
      title:`📢 ${tipo}`,
      description:mensagem,
      color:tipo === "Invasão" ? 0xdc2626 : 0x2563eb,
      fields:link ? [{name:"Link",value:link}] : [],
      footer:{text:`Enviado pelo dashboard • ${user_id}`},
      timestamp:new Date().toISOString()
    };

    const send = await fetch(`https://discord.com/api/channels/${process.env.ANNOUNCE_CHANNEL_ID}/messages`,{
      method:"POST",
      headers:{
        Authorization:`Bot ${process.env.BOT_TOKEN}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({embeds:[embed]})
    });

    if(!send.ok){
      const err = await send.json();
      return res.status(400).json({error:"Erro ao enviar.",details:err});
    }

    res.json({ok:true});
  }catch(e){
    res.status(500).json({error:"Erro interno",details:String(e)});
  }
}

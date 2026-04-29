export default async function handler(req,res){
  if(req.method !== "POST"){
    return res.status(405).json({error:"Método inválido"});
  }

  try{
    const { staff_id,target_id,action } = req.body;

    const staffRes = await fetch(`https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${staff_id}`,{
      headers:{Authorization:`Bot ${process.env.BOT_TOKEN}`}
    });

    const staff = await staffRes.json();
    const staffRoles = (process.env.STAFF_ROLE_IDS || "").split(",").map(x=>x.trim());
    const isStaff = (staff.roles || []).some(r=>staffRoles.includes(r));

    if(!isStaff){
      return res.status(403).json({error:"Sem permissão de staff."});
    }

    const url = `https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${target_id}/roles/${process.env.VIP_ROLE_ID}`;

    const response = await fetch(url,{
      method:action === "grant" ? "PUT" : "DELETE",
      headers:{Authorization:`Bot ${process.env.BOT_TOKEN}`}
    });

    if(!response.ok){
      const err = await response.text();
      return res.status(400).json({error:"Erro ao atualizar VIP.",details:err});
    }

    res.json({ok:true});
  }catch(e){
    res.status(500).json({error:"Erro interno",details:String(e)});
  }
}

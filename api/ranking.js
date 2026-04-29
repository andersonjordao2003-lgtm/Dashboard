export default async function handler(req,res){
  try{
    const type = req.query.type === "coins" ? "coins" : "hours";

    const msgRes = await fetch(
      `https://discord.com/api/channels/${process.env.RANKING_DATA_CHANNEL_ID}/messages/${process.env.RANKING_DATA_MESSAGE_ID}`,
      {
        headers:{Authorization:`Bot ${process.env.BOT_TOKEN}`}
      }
    );

    if(!msgRes.ok){
      return res.status(200).json({items:[]});
    }

    const msg = await msgRes.json();
    const data = JSON.parse(msg.content);

    res.json({items:data[type] || []});
  }catch(e){
    res.status(200).json({items:[]});
  }
}

export default async function handler(req, res) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ error: "Sem token" });

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const user = await userRes.json();

    const memberRes = await fetch(
      `https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${user.id}`,
      {
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`
        }
      }
    );

    const member = await memberRes.json();

    const isVip = member.roles?.includes(process.env.VIP_ROLE_ID);

    return res.json({
      user,
      member,
      vip: {
        active: isVip,
        days_left: isVip ? 30 : 0, // depois você pode integrar real
        slots: 5,
        role_name: "VIP",
        voice_name: "Sala VIP"
      }
    });

  } catch (e) {
    res.status(500).json({ error: "Erro interno" });
  }
}

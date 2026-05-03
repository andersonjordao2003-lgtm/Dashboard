export default async function handler(req, res) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ error: "Sem token" });

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const user = await userRes.json();

    // 🔥 aqui você consulta seu banco (exemplo simples fake)
    const vipDatabase = {
      "123456789": {
        role_name: "VIP João",
        slots: 5,
        voice_name: "Call do João",
        expires_at: "2026-05-30"
      }
    };

    const vip = vipDatabase[user.id];

    return res.json({
      user,
      vip: vip
        ? {
            active: true,
            days_left: 30,
            slots: vip.slots,
            role_name: vip.role_name,
            voice_name: vip.voice_name
          }
        : {
            active: false
          }
    });

  } catch {
    res.status(500).json({ error: "Erro interno" });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método inválido" });
  }

  try {
    const { type, text, link } = req.body;

    let channelId;

    if (type === "evento") channelId = process.env.ANNOUNCE_CHANNEL_EVENTO;
    if (type === "invasao") channelId = process.env.ANNOUNCE_CHANNEL_INVASAO;
    if (type === "jogatina") channelId = process.env.ANNOUNCE_CHANNEL_JOGATINA;

    if (!channelId) {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    const embed = {
      title: `📢 ${type.toUpperCase()}`,
      description: text,
      color: type === "invasao" ? 0xff0000 : 0x2563eb,
      fields: link ? [{ name: "Link", value: link }] : [],
      timestamp: new Date()
    };

    const send = await fetch(
      `https://discord.com/api/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ embeds: [embed] })
      }
    );

    if (!send.ok) {
      return res.status(400).json({ error: "Erro ao enviar anúncio" });
    }

    res.json({ ok: true });

  } catch {
    res.status(500).json({ error: "Erro interno" });
  }
}

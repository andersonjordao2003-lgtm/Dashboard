export default async function handler(req, res) {
  try {
    const msgRes = await fetch(
      `https://discord.com/api/channels/${process.env.COINS_DATA_CHANNEL_ID}/messages/${process.env.COINS_DATA_MESSAGE_ID}`,
      {
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`
        }
      }
    );

    if (!msgRes.ok) {
      return res.json({ items: [] });
    }

    const msg = await msgRes.json();

    let data = [];

    try {
      data = JSON.parse(msg.content);
    } catch {
      data = [];
    }

    res.json({ items: data });

  } catch {
    res.json({ items: [] });
  }
}

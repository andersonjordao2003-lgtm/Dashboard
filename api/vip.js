export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método inválido" });
  }

  try {
    const { action, target_id, name, limit, color } = req.body;

    // ⚠️ aqui você pode evoluir depois
    // por enquanto só simula sucesso

    return res.json({
      ok: true,
      message: `Ação ${action} executada`
    });

  } catch {
    res.status(500).json({ error: "Erro interno" });
  }
}

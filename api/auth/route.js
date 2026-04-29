export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return Response.json({ error: "Sem code" }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", process.env.REDIRECT_URI);

    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return Response.json({ error: "Token error", details: tokenData }, { status: 400 });
    }

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });

    const user = await userRes.json();

    if (!userRes.ok) {
      return Response.json({ error: "User error", details: user }, { status: 400 });
    }

    return Response.json(user);

  } catch (err) {
    return Response.json({ error: "Erro interno", details: String(err) }, { status: 500 });
  }
}

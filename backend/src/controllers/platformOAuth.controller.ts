import type { Request, Response } from "express";
import { PlatformToken } from "../models/platformToken.model.js";

// ─── Meta ────────────────────────────────────────────────────────────────────

export const metaOAuthRedirect = (_req: Request, res: Response): void => {
  const clientId = process.env.META_CLIENT_ID;
  const redirectUri = process.env.META_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    res.status(500).json({ error: "Meta OAuth env vars not configured." });
    return;
  }

  const url = new URL("https://www.facebook.com/v19.0/dialog/oauth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "ads_read");
  url.searchParams.set("response_type", "code");

  res.redirect(url.toString());
};

export const metaOAuthCallback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { code, error } = req.query;

  if (error || !code) {
    res.status(400).send(`OAuth error: ${error ?? "no code returned"}`);
    return;
  }

  const clientId = process.env.META_CLIENT_ID;
  const clientSecret = process.env.META_CLIENT_SECRET;
  const redirectUri = process.env.META_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    res.status(500).json({ error: "Meta OAuth env vars not configured." });
    return;
  }

  try {
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: String(code),
    });

    const response = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?${params.toString()}`,
    );
    const data = (await response.json()) as {
      access_token?: string;
      expires_in?: number;
      error?: { message: string };
    };

    if (!response.ok || !data.access_token) {
      res
        .status(500)
        .send(`<pre>Meta token error: ${JSON.stringify(data)}</pre>`);
      return;
    }

    const accessToken = data.access_token;
    const expiresAt = data.expires_in
      ? new Date(Date.now() + data.expires_in * 1000)
      : undefined;

    await PlatformToken.findOneAndUpdate(
      { platform: "meta" },
      { accessToken, expiresAt },
      { upsert: true, new: true },
    );

    res.send(`
      <html><body style="font-family:sans-serif;padding:2rem">
        <h2>Meta connected successfully</h2>
        <p>Access token saved to the database.</p>
        ${expiresAt ? `<p>Expires: <strong>${expiresAt.toISOString()}</strong></p>` : ""}
        <p>You can close this tab.</p>
      </body></html>
    `);
  } catch (err) {
    res.status(500).send(`<pre>Unexpected error: ${String(err)}</pre>`);
  }
};

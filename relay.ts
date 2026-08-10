export const config = {
  runtime: "edge",
};

const TARGET_ORIGIN = "https://yellow-worm-231407.hostingersite.com";

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Buang prefix "/api/relay" dari path, sisanya diteruskan apa adanya
  // Contoh: /api/relay/api/booth/relay -> /api/booth/relay
  const forwardPath = url.pathname.replace(/^\/api\/relay/, "") || "/";
  const targetUrl = TARGET_ORIGIN + forwardPath + url.search;

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.set(
    "User-Agent",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SelfieStationRelay/1.0"
  );

  const init: RequestInit = {
    method: req.method,
    headers,
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body;
    // @ts-ignore - diperlukan Edge Runtime saat body berupa stream
    init.duplex = "half";
  }

  try {
    const response = await fetch(targetUrl, init);
    // Salin response apa adanya (status, headers, body) balik ke PC outlet
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Relay fetch failed", detail: String(err) }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}

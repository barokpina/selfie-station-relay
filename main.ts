Deno.serve(async (req) => {
  const url = new URL(req.url);
  const targetUrl = "https://yellow-worm-231407.hostingersite.com" + url.pathname + url.search;

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SelfieStationRelay/1.0");

  const init: RequestInit = { method: req.method, headers };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body;
  }

  return fetch(targetUrl, init);
});

export default async function handler(req, res) {
  const { id, tag = "notion" } = req.query;
  const api_secret = process.env.GA_API_SECRET;

  if (!id || !api_secret) {
    console.error("❌ Missing GA ID or API secret");
    return res.status(400).json({ error: "Missing id or API secret" });
  }

  // Generate realistic GA client ID (two-part number)
  const client_id = `${Math.floor(Math.random() * 1e10)}.${Math.floor(Math.random() * 1e10)}`;

  const payload = {
    client_id,
    events: [
      {
        name: "page_view",
        params: {
          page_title: tag,
          page_location: `https://notion.so/${encodeURIComponent(tag)}`
        }
      }
    ]
  };

  const endpoint = `https://www.google-analytics.com/mp/collect?measurement_id=${id}&api_secret=${api_secret}`;

  await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "User-Agent": req.headers['user-agent'] || "Mozilla/5.0 (Notion Tracker)"
  },
  body: JSON.stringify(payload)
});

  // Return transparent GIF
  const gif = Buffer.from("R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", "base64");
  res.setHeader("Content-Type", "image/gif");
  res.setHeader("Content-Length", gif.length);
  res.setHeader("Cache-Control", "no-store");
  res.status(200).end(gif);
}

export default async function handler(req, res) {
  const { id, tag = "notion" } = req.query;
  const api_secret = process.env.GA_API_SECRET;

  if (!id || !api_secret) {
    return res.status(400).json({ error: "Missing id or API secret" });
  }

  const client_id = "notion-" + tag + "-" + Date.now();

  try {
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${id}&api_secret=${api_secret}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id,
        events: [{
          name: "page_view",
          params: {
            page_title: tag,
            page_location: `https://notion.so/${encodeURIComponent(tag)}`
          }
        }]
      })
    });
  } catch (e) {
    console.error("GA4 error:", e);
  }

  // Return 1x1 GIF
  const gif = Buffer.from("R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", "base64");
  res.setHeader("Content-Type", "image/gif");
  res.setHeader("Content-Length", gif.length);
  res.setHeader("Cache-Control", "no-store");
  res.status(200).end(gif);
}

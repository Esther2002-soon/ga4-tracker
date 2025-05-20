export default async function handler(req, res) {
  const { id, tag } = req.query;

  const api_secret = process.env.GA_API_SECRET;
  const measurement_id = id;
  const client_id = "notion-" + tag + "-" + Date.now();

  if (!measurement_id || !api_secret || !tag) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
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
      })
    });
  } catch (e) {
    console.error("Failed to track:", e);
  }

  // Return 1x1 transparent GIF
  const img = Buffer.from("R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", "base64");
  res.setHeader("Content-Type", "image/gif");
  res.setHeader("Content-Length", img.length);
  res.setHeader("Cache-Control", "no-store");
  res.status(200).end(img);
}

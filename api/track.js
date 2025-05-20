export default async function handler(req, res) {
  const { id, tag = "notion" } = req.query;
  const api_secret = process.env.GA_API_SECRET;

  if (!id || !api_secret) {
    console.error("❌ Missing GA ID or API secret");
    return res.status(400).json({ error: "Missing id or API secret" });
  }

  const client_id = "notion-" + Date.now(); // Can be randomized for anonymity
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

  try {
    const gaRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!gaRes.ok) {
      console.error("❌ GA4 collect failed:", await gaRes.text());
    } else {
      console.log("✅ Page view sent to GA4 for:", tag);
    }
  } catch (e) {
    console.error("❌ GA4 tracking error:", e);
  }

  // Return transparent GIF
  const gif = Buffer.from("R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", "base64");
  res.setHeader("Content-Type", "image/gif");
  res.setHeader("Content-Length", gif.length);
  res.setHeader("Cache-Control", "no-store");
  res.status(200).end(gif);
}

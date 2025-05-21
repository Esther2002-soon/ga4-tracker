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
          page_title: decodeURIComponent(tag),
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

    const text = await gaRes.text();

    if (!gaRes.ok) {
      console.error("❌ GA4 Error:", text);
    } else {
      console.log("✅ GA4 page_view sent for:", tag);
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

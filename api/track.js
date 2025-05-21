export default async function handler(req, res) {
  const { id, tag } = req.query;
  const api_secret = process.env.GA_API_SECRET;

  const client_id = `${Math.floor(Math.random() * 1e10)}.${Math.floor(Math.random() * 1e10)}`;

  await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${id}&api_secret=${api_secret}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id,
      events: [
        {
          name: "page_view",
          params: {
            page_title: tag || "notion",
            page_location: "https://notion.so/" + encodeURIComponent(tag || "notion")
          }
        }
      ]
    })
  });

  const gif = Buffer.from("R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", "base64");
  res.setHeader("Content-Type", "image/gif");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Length", gif.length);
  res.status(200).end(gif);
}

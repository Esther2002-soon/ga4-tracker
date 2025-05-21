export default async function handler(req, res) {
  const { id, tag = "notion" } = req.query;

  if (!id) {
    return res.status(400).send("Missing GA4 Measurement ID");
  }

  const decodedTag = decodeURIComponent(tag);
  const client_id = `${Math.floor(Math.random() * 1e10)}.${Math.floor(Math.random() * 1e10)}`;

  const gaPayload = {
    client_id,
    events: [
      {
        name: "page_view",
        params: {
          page_title: decodedTag,
          page_location: "https://notion.so/" + encodeURIComponent(decodedTag)
        }
      }
    ]
  };

  try {
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${id}&api_secret=${process.env.GA_API_SECRET}`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(gaPayload)
    });
  } catch (e) {
    console.error("GA4 tracking error:", e);
  }

  const html = `
    <!DOCTYPE html>
    <html lang="zh-Hant">
    <head>
      <meta charset="UTF-8">
      <title>${decodedTag}</title>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          background: transparent;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 10px;
          color: #aaa;
        }
      </style>
    </head>
    <body>
    </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.status(200).send(html);
}

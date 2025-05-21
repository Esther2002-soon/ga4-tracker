export default async function handler(req, res) {
  const { id, tag = "notion" } = req.query;

  if (!id) {
    return res.status(400).send("Missing GA4 Measurement ID (?id=...)");
  }

  const decodedTag = decodeURIComponent(tag);

  const html = `
    <!DOCTYPE html>
    <html lang="zh-Hant">
    <head>
      <meta charset="UTF-8">
      <title>${decodedTag}</title>
      <script>
        const ga4id = "${id}";
        const tag = "${decodedTag}";
        document.title = tag;

        const gtagScript = document.createElement("script");
        gtagScript.async = true;
        gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=" + ga4id;
        document.head.appendChild(gtagScript);

        gtagScript.onload = () => {
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', ga4id, {
            page_title: tag,
            page_path: '/' + encodeURIComponent(tag)
          });
        };
      </script>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          background: transparent;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    </html>
  `;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}

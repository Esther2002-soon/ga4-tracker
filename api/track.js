export default async function handler(req, res) {
  const { id, tag = "notion" } = req.query;

  if (!id) {
    res.status(400).send("Missing GA4 Measurement ID");
    return;
  }

  const decodedTag = decodeURIComponent(tag);

  const html = \`
    <!DOCTYPE html>
    <html lang="zh-Hant">
    <head>
      <meta charset="UTF-8">
      <title>\${decodedTag}</title>
      <script>
        const ga4id = "\${id}";
        const tag = "\${decodedTag}";

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

          console.log("✅ Sent GA4 view:", tag);
        };
      </script>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          background: transparent;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      📊 正在追蹤：\${decodedTag}
    </body>
    </html>
  \`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}

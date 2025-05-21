<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <title>Tracking…</title>
  <script>
    // Parse GA4 ID and tag
    const url = new URL(window.location.href);
    const ga4id = url.searchParams.get('id');
    const tag = url.searchParams.get('tag') || 'notion';

    // Set page title to Chinese tag (visible in GA)
    document.title = tag;

    // Dynamically insert GA4 script
    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=" + ga4id;
    document.head.appendChild(gtagScript);

    // When script loads, send the pageview
    gtagScript.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', ga4id, {
        page_title: tag,
        page_path: '/' + encodeURIComponent(tag)
      });

      console.log("✅ GA4 view sent:", tag);
    };
  </script>
  <style>
    body {
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #bbb;
      height: 100vh;
      margin: 0;
    }
  </style>
</head>
<body>
  正在追蹤頁面瀏覽...
</body>
</html>

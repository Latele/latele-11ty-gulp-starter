module.exports = {
  // サイト名
  title: "新規でサイトを作るやつ",
  // トップページのみ付与される簡易的な説明文
  catch: " - サイトの簡易的な説明文",
  // meta description
  description: "11tyとGulp（Sass）で始めるスターターセット",
  // URL（最後の / は含めない）
  url: "https://example.com",
  // 文字コード
  charset: "utf-8",
  // 言語
  lang: "ja",
  locale: "ja_JP",
  // ビューポートの指定
  viewport: "width=device-width, initial-scale=1",
  // パンくずリストのトップページの文言
  breadcrumbHomeText: "トップページ",
  // faviconのパス
  faviconPath: "/assets/img/favicon.ico",
  // Google AnalyticsのUA設定（gtag.jsは _includes/footer_script.njk）
  gtagUA: "UA-xxxxxxxx-x",
  // トップページ用 og:type
  ogType_top: "website",
  // トップページ以外の og:type
  ogType: "article",
  // og:image
  ogImage: "/assets/img/blog/share/ogp.jpg",
  // Twitter Card
  twitterCard: "summary",
  // Twitter Site（空の場合出力しない） 例：@ユーザー名
  twitterSite: ""
};

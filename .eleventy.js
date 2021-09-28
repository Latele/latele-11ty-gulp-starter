const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const prettier = require('prettier')
const dayjs = require('dayjs')
dayjs.locale('ja')


module.exports = function(eleventyConfig) {

  // グロナビとかのリンクを作るのに良さそうなプラグイン
  eleventyConfig.addPlugin(pluginNavigation);
  // RSSフィード用だけど sitemap.xml 作るのにも使ってるプラグイン
  eleventyConfig.addPlugin(pluginRss);

  // JSと画像をoutput（_site）にコピー
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/img");

  // favicon.ico をコピー
  // eleventyConfig.addPassthroughCopy("src/favicon.ico");

  // 自動リロードがうまく動かないのでSassファイルをコピーして対応
  eleventyConfig.addPassthroughCopy({"src/assets/sass": "assets/css/_reload"});

  // Markdownの設定とかカスタマイズ
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  // ブラウザシンクの設定
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, bs) {

        bs.addMiddleware("*", (req, res) => {
          const content_404 = fs.readFileSync('_site/404.html');
          // Add 404 http status code in request header.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    },
    open: 'external',
    notify: false,
    https: true
  });

  // 日付をいい感じに変換してくれるプラグイン
  eleventyConfig.addFilter("formatDate", (date,format) => {
    return dayjs(date).format(format)
  });

  // HTMLをきれいに整形
  eleventyConfig.addTransform('prettier', (content, outputPath) => {
    if (outputPath.endsWith('.html')) {
      return prettier.format(content, {
        printWidth: 160,
        parser: 'html'
      })
    }
    return content
  })

  return {
    // 出力設定
    dir: {
      input: 'src',
      output: '_site'
    },
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    passthroughFileCopy: true
  };

};

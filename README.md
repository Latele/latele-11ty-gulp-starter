### 新規でコーディングするのに使えそうなやつ
Eleventy(11ty) + Gulp + Sass な感じでコーディングを開始するのに良さげなやつです。  
テンプレートには、11tyのドキュメントに例が一番多いNunjucksを採用しています。わりと素のHTMLなので初めて触るのにとっつきやすい感じ。

### はじめかた
最初だけやるやつ
- `npm install`

開発する際はこれ
- `npm start` or `npm run dev`

ビルドする場合
- `npm run build`

### 開発
`npm start` or `npm run dev` で開始したら、 `src` ディレクトリにあるファイルをごにょごにょして開発する。  
`src/_data/site.js` にサイトの共通設定とか入ってる。

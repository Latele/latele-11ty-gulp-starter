// ---------------------------------------------------------------
// パッケージ読み込み
// ---------------------------------------------------------------
import gulp from 'gulp'
const { src, dest, watch, series, parallel, lastRun } = gulp // gulp 本体
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
const sass = gulpSass(dartSass) // さすさす
import sassGlob from 'gulp-sass-glob-use-forward' // Sassのimportを一括で
import postcss from 'gulp-postcss' // PostCSS使うためのやつ
import autoprefixer from 'autoprefixer'  // プレフィックスを自動でやってくれるやつ
import cssnano from 'cssnano' // CSS圧縮
import mqpacker from 'mqpacker' // メディアクエリをキレイに
import plumber from 'gulp-plumber' // エラーで止めない
import notify from 'gulp-notify' // エラー通知
import { deleteAsync } from 'del' // 不要ファイル削除
import browserSync from 'browser-sync' // ブラウザシンク
import htmlbeautify from 'gulp-html-beautify' // HTML整形
import terser from 'gulp-terser' // JS圧縮
import fs from 'fs'


// ---------------------------------------------------------------
// パス
// ---------------------------------------------------------------

const paths = {
  src: 'src', // 開発用
  dist: '_site', // 書き出し用
  style: {
    src: 'src/assets/sass', // 開発用のSass
    dist: '_site/assets/css', // 書き出し用のCSS
  },
  js: {
    src: 'src/assets/js', // 開発用のJS
    dist: '_site/assets/js', // 書き出し用のJS
  },
  img: {
    src: 'src/assets/img',
    dist: '_site/assets/img'
  }
};



// ---------------------------------------------------------------
// Sass
// ---------------------------------------------------------------

const sass2css = () => {
  return src(paths.style.src + '/**/*.scss', { sourcemaps: true })
  .pipe(
    plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
  )
  .pipe(sassGlob())
  .pipe(sass({
    outputStyle: 'expanded'
  }))
  .pipe(postcss([
    autoprefixer(),
    mqpacker()
  ]))
  .pipe(dest(paths.style.dist, { sourcemaps: true }))
  .pipe(browserSync.stream())
}



// ---------------------------------------------------------------
// CSS minify
// ---------------------------------------------------------------

const minify = () => {
  return src(paths.style.dist + '/*.css')
  .pipe(postcss([
    cssnano()
  ]))
  .pipe(dest(paths.style.dist))
}


// ---------------------------------------------------------------
// JS minify
// ---------------------------------------------------------------

const minifyJS = () => {
  return src(paths.js.dist + '/*.js')
  .pipe(terser())
  .pipe(dest(paths.js.dist))
}


// ---------------------------------------------------------------
// HTML 整形
// ---------------------------------------------------------------

const htmlprettier = () => {
  return src(paths.dist + '/**/*.html')
  .pipe(
    htmlbeautify({
      "indent_size": 2,
      "indent_char": " ",
      "max_preserve_newlines": 0,
      "preserve_newlines": false,
      "extra_liners": [],
    })
  )
  .pipe(dest(paths.dist))
}


// ---------------------------------------------------------------
// ブラウザシンク
// ---------------------------------------------------------------
const localserver = done => {
  browserSync.init({
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
    server: {
      baseDir: paths.dist
    },
    // startPath: 'index.html',
    port: 8080,
    open: 'external',
    notify: false,
    https: true,
  });
  done();
}


// ---------------------------------------------------------------
// オートリロード
// ---------------------------------------------------------------

const liveReload = done => {
  browserSync.reload()
  done()
}


// ---------------------------------------------------------------
// Copy
// ---------------------------------------------------------------

const copyJS = () => {
  return src([paths.js.src + '/**/*'])
  .pipe(dest(paths.js.dist))
  .pipe(browserSync.stream())
}
const copyImage = () => {
  return src([paths.img.src + '/**/*'])
  .pipe(dest(paths.img.dist))
  .pipe(browserSync.stream())
}
const copyPublic = () => {
  return src(['public/**/*'])
  .pipe(dest(paths.dist))
  .pipe(browserSync.stream())
}


// ---------------------------------------------------------------
// del
// ---------------------------------------------------------------

// dist（_site）のファイル全部削除
const clean_all = () => {
  return deleteAsync(paths.dist + "/**/*");
}


// ---------------------------------------------------------------
// ファイル監視
// ---------------------------------------------------------------

const watchFiles = () => {
  watch([paths.style.src + "/**/*.{css,scss}"], sass2css)
  watch([paths.js.src + '/**/*.js'], copyJS)
  watch([paths.img.src + '/**/*'], copyImage)
  watch(['public/**/*'], copyPublic)
  watch([paths.dist + '/**/*.{html,htm,shtml,xml,php,inc}'], liveReload)
}


// ---------------------------------------------------------------
// 実行
// ---------------------------------------------------------------

export const cleanAll = clean_all

export default series(localserver, watchFiles)

export const build = series(
  sass2css,
  copyJS,
  parallel(copyImage, copyPublic, minify, minifyJS),
  htmlprettier
)


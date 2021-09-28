// ---------------------------------------------------------------
// パッケージ読み込み
// ---------------------------------------------------------------
const { src, dest, watch, series, parallel } = require('gulp') // gulp 本体
const sass = require('gulp-sass')(require('sass')) // さすさす
const sassGlob = require('gulp-sass-glob-use-forward') // Sassのimportを一括で
const postcss = require('gulp-postcss') // PostCSS使うためのやつ
const autoprefixer = require('autoprefixer')  // プレフィックスを自動でやってくれるやつ
const cssnano = require('cssnano') // CSS圧縮
const mqpacker = require('mqpacker') // メディアクエリをキレイに
const plumber = require('gulp-plumber') // エラーで止めない
const notify = require('gulp-notify') // エラー通知
const del = require('del') // 不要ファイル削除



// ---------------------------------------------------------------
// パス
// ---------------------------------------------------------------

const paths = {
  src: 'src', // 開発用
  dist: '_site', // 書き出し用
  style: {
    src: 'src/assets/sass', // 開発用のSass
    dist: '_site/assets/css' // 書き出し用のCSS
  }
}



// ---------------------------------------------------------------
// Sass
// ---------------------------------------------------------------

const css = () => {
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
// del
// ---------------------------------------------------------------

// dist（_site）のファイル全部削除
const cleanAll = () => {
  return del(paths.dist + "/**/*")
}

// 自動リロード用のSassファイルを削除
const cleanCss = () => {
  return del(paths.style.dist + "/_reload")
}



// ---------------------------------------------------------------
// 実行
// ---------------------------------------------------------------

exports.css = css
exports.minify = minify
exports.cleanAll = cleanAll
exports.cleanCss = cleanCss

exports.default = series(css)
exports.build = series(css, minify)

exports.watch = () => watch(paths.style.src + "/**/*.scss", css)

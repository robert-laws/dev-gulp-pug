var gulp = require('gulp')

var path = require('path')
var gutil = require('gulp-util')
var sass = require('gulp-sass')
var minifyCSS = require('gulp-minify-css')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var sourcemaps = require('gulp-sourcemaps')
var babel = require('gulp-babel')
var pug = require('gulp-pug')
var data = require('gulp-data')

var browserSync = require('browser-sync').create()

gulp.task('sass', function() {
  return gulp.src(['./src/css/*.css', './src/sass/**/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('scripts', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('pug', function() {
  return gulp.src('./src/pug/**/*.pug')
    .pipe(data(function(file) {
      return require('./src/data/data.json')
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('images', function() {
  gulp.src('./src/img/*')
    .pipe(gulp.dest('./dist/img'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
})

gulp.task('watch', ['browserSync', 'build'], function() {
  gulp.watch('./src/pug/**/*.pug', ['pug'])
  gulp.watch('./src/sass/**/*.scss', ['sass'])
  gulp.watch('./src/js/**/*.js', ['scripts'])
  gulp.watch('./src/img/*', ['images'])
})

gulp.task('build', ['pug', 'sass', 'scripts', 'images'])

gulp.task('default', ['watch'])
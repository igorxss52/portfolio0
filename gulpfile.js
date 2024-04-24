const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

// Путь к исходным и готовым файлам
const paths = {
  sassStyles: {
    src: "src/sass/**/*.scss",
    dest: "dist/css/",
  },
  cssStyles: {
    src: "src/css/**/*.css",
    dest: "dist/css/",
  },
  scripts: {
    src: "src/js/**/*.js",
    dest: "dist/scripts/",
  },
  html: {
    src: "src/*.html",
    dest: "dist/",
  },
  images: {
    src: "src/img/**/*",
    dest: "dist/img/",
  },
  icons: {
    src: "src/icons/**/*",
    dest: "dist/icons/",
  },
};

// Задача для компиляции SCSS в CSS
function compileSass() {
  return gulp
    .src(paths.sassStyles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.sassStyles.dest))
    .pipe(browserSync.stream());
}

// Задача для минификации CSS
function minifyCss() {
  return gulp
    .src(paths.cssStyles.src)
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.cssStyles.dest))
    .pipe(browserSync.stream());
}

// Задача для минификации JavaScript
function minifyJs() {
  return gulp
    .src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// Задача для копирования HTML файлов
function html() {
  return gulp
    .src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// Задача для копирования изображений
function images() {
  return gulp
    .src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream());
}

// Задача для копирования иконок
function icons() {
  return gulp
    .src(paths.icons.src)
    .pipe(gulp.dest(paths.icons.dest))
    .pipe(browserSync.stream());
}

// Задача слежения за изменениями файлов
function watch() {
  browserSync.init({
    server: {
      baseDir: "./dist/",
    },
  });
  gulp.watch(paths.sassStyles.src, compileSass);
  gulp.watch(paths.cssStyles.src, minifyCss);
  gulp.watch(paths.scripts.src, minifyJs);
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.icons.src, icons);
}

// Определяем задачи по умолчанию
gulp.task(
  "default",
  gulp.parallel(compileSass, minifyJs, html, images, watch, minifyCss, icons)
);

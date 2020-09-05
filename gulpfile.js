const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const watch = require("gulp-watch");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const gcmq = require("gulp-group-css-media-queries");
const sassGlob = require("gulp-sass-glob");
const del = require("del");

// Таск для компиляции SCSS в CSS
gulp.task("scss", function (callback) {
  return gulp
    .src("./src/scss/main.scss")
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: "Styles",
            sound: false,
            message: err.message,
          };
        }),
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(
      sass({
        indentType: "tab",
        indentWidth: 1,
        outputStyle: "expanded",
      })
    )
    .pipe(gcmq())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 4 versions"],
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./build/css/"))
    .pipe(browserSync.stream());
  callback();
});

gulp.task("copy:html", function (callback) {
  return gulp.src("./src/index.html").pipe(gulp.dest("./build/"));
  callback();
});

// Копирование Изображений
gulp.task("copy:img", function (callback) {
  return gulp.src("./src/img/**/*.*").pipe(gulp.dest("./build/img/"));
  callback();
});

// Копирование Скриптов
gulp.task("copy:js", function (callback) {
  return gulp.src("./src/js/**/*.*").pipe(gulp.dest("./build/js/"));
  callback();
});

// Слежение за HTML и CSS и обновление браузера
gulp.task("watch", function () {
  watch(["./build/index.html", "./build/js/**/*.*", "./build/img/**/*.*"], gulp.parallel(browserSync.reload));

  // Запуск слежения и компиляции SCSS с задержкой
  watch("./src/scss/**/*.scss", function () {
    setTimeout(gulp.parallel("scss"), 500);
  });

  // Следим за картинками и скриптами, и копируем их в build
  watch("./src/index.html", gulp.parallel("copy:html"));
  watch("./src/img/**/*.*", gulp.parallel("copy:img"));
  watch("./src/js/**/*.*", gulp.parallel("copy:js"));
});

// Задача для старта сервера из папки app
gulp.task("server", function () {
  browserSync.init({
    server: {
      baseDir: "./build/",
    },
  });
});

gulp.task("clean:build", function () {
  return del("./build");
});

gulp.task("clean:docs", function () {
  return del("./docs");
});

gulp.task("copy:docs", function (callback) {
  return gulp.src("./build/**/*.*").pipe(gulp.dest("./docs/"));
  callback();
});

gulp.task("docs", gulp.series("clean:docs", "copy:docs"));

// Дефолтный таск (задача по умолчанию)
// Запускаем одновременно задачи server и watch
gulp.task("default", gulp.series(gulp.parallel("clean:build"), gulp.parallel("scss", "copy:html", "copy:img", "copy:js"), gulp.parallel("server", "watch")));

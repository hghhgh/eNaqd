var gulp = require('gulp');
var sass = require('gulp-sass');

var requireDir = require('require-dir');
requireDir('./gulp-tasks');
var paths = {
    sass: ['./scss/*.scss']
};

gulp.task('default', ['sass', 'templatecache']);

gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
});

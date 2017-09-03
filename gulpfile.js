var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');

gulp.task('default', function() {
    var tsResult = gulp.src('ts/**/*.ts')
        .pipe(ts({
            declaration: true
        }));

    return merge([
        tsResult.dts.pipe(gulp.dest('definitions')),
        tsResult.js.pipe(gulp.dest('js'))
    ]);
});

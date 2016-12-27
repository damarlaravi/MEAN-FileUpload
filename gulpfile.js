var gulp = require('gulp'),
    server = require('gulp-develop-server'),
    jshint = require('gulp-jshint'),
    _paths = ['server/**/*.js', 'client/js/*.js'];


gulp.task('lint', function () {
    return gulp.src(_paths)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// run server
gulp.task('server:start', function () {
    server.listen({path: './server/app.js'});
});

// restart server if app.js changed
gulp.task('server:restart', function () {
    gulp.watch([_paths], server.restart);
});

gulp.task('default', ['lint', 'server:start', 'server:restart']);
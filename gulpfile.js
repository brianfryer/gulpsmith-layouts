var assign = require('lodash.assign');
var del = require('del');
var gulp = require('gulp');
var gulpsmith = require('gulpsmith');
var handlebars = require('handlebars');
var layouts = require('metalsmith-layouts');
var inPlace = require('metalsmith-in-place');
var plugins = require('gulp-load-plugins')({ scope: ['devDependencies'] });

gulp.task('build:layout', function() {
    return gulp.src('source/pages/layout.hbs')
        .pipe(plugins.frontMatter()
            .on('data', function(file) {
                assign(file, file.frontMatter);
                delete file.frontMatter;
            })
        )
        .pipe(gulpsmith()
            .use(layouts({
                engine: 'handlebars',
                default: 'default.hbs',
                directory: 'source/layouts/',
                partials: 'source/partials/',
                pattern: '**/*.hbs',
                rename: true
            }))
        )
        .pipe(gulp.dest('dist/'));
});

gulp.task('build:in-place', function() {
    return gulp.src('source/pages/in-place.hbs')
        .pipe(plugins.frontMatter()
            .on('data', function(file) {
                assign(file, file.frontMatter);
                delete file.frontMatter;
            })
        )
        .pipe(gulpsmith()
            .use(inPlace({
                engine: 'handlebars',
                partials: 'source/partials/',
                pattern: '**/*.hbs',
                rename: true
            }))
        )
        .pipe(gulp.dest('dist/'));
});

gulp.task('build:styles', function() {
    return gulp.src('source/assets/styles/main.scss')
        .pipe(plugins.sass())
        .pipe(gulp.dest('dist/'));
});

// Remove pre-existing content from output and test folders
gulp.task('clean:dist', function() {
    del.sync(['dist/']);
});

// Compile files
gulp.task('compile', [
    'clean:dist',
    'build:styles',
    'build:in-place'
]);

// Compile files when something changes and start the webserver
gulp.task('watch', ['compile'], function() {
    gulp.watch('source/**/*.scss', ['build:styles']);
    gulp.watch('source/pages/layout.hbs',   ['build:layout']);
    gulp.watch('source/pages/in-place.hbs', ['build:in-place']);
});

// localhost
gulp.task('webserver', ['watch'], function() {
    return gulp.src('dist/')
        .pipe(plugins.webserver({
            livereload: true,
            port: 1111,
            open: true
        }));
});

// (default)
gulp.task('default', ['webserver']);

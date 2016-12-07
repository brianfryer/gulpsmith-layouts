var assign = require('lodash.assign');
var del = require('del');
var gulp = require('gulp');
var gulpsmith = require('gulpsmith');
var layouts = require('metalsmith-layouts');
var plugins = require('gulp-load-plugins')({ scope: ['devDependencies'] });

gulp.task('build:pages', function() {
    return gulp.src('source/pages/**/*.hbs')
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
    'build:pages'
]);

// Compile files when something changes and start the webserver
gulp.task('watch', ['compile'], function() {
    gulp.watch('source/**/*.scss', ['build:styles']);
    gulp.watch('source/**/*.hbs',  ['build:pages']);
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

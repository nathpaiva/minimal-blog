var gulp        = require('gulp');
var browserSync = require('browser-sync');
var stylus      = require('gulp-stylus');
var prefixer    = require('autoprefixer-stylus');
var plumber     = require('gulp-plumber');
var rupture     = require('rupture');
var koutoSwiss  = require('kouto-swiss');
var cp          = require('child_process');

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['stylus', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('stylus', function () {
    return gulp.src('src/styl/main.styl')
		.pipe(plumber())
        .pipe(stylus({
			use:[koutoSwiss(), prefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }), rupture()],
			compress: true,
            onError: browserSync.notify
        }))
        .pipe(gulp.dest('_site/assets/css/'))
		.pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('src/styl/*.styl', ['stylus']);
    gulp.watch(['*.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);

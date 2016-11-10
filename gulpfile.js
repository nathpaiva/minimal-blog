var env         = require('minimist')(process.argv.slice(2)),
	gulp        = require('gulp'),
	plumber     = require('gulp-plumber'),
	browserSync = require('browser-sync'),
	stylus      = require('gulp-stylus'),
	rupture     = require('rupture'),
	koutoSwiss  = require('kouto-swiss'),
	prefixer    = require('autoprefixer-stylus'),
	imagemin    = require('gulp-imagemin'),
	cp          = require('child_process');

/**
 * Stylus task
 */
gulp.task('stylus', function(){
		gulp.src('src/styl/main.styl')
		.pipe(plumber())
		.pipe(stylus({
			use:[koutoSwiss(), prefixer(), rupture()],
			compress: true
		}))
		.pipe(gulp.dest('_site/assets/css/'))
		.pipe(browserSync.reload({stream:true}))
		.pipe(gulp.dest('assets/css'));
});

/**
 * Imagemin Task
 */
// gulp.task('imagemin', function() {
// 	return gulp.src('src/img/**/*.{jpg,png,gif}')
// 		.pipe(plumber())
// 		.pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
// 		.pipe(gulp.dest('assets/img/'));
// });

gulp.task('watch', function () {
	gulp.watch('src/styl/**/*.styl', ['stylus']);
	gulp.watch(['index.html', '_includes/*.html', '_layouts/*.html', '_posts/*']);
});

gulp.task('default', ['stylus', 'watch']);

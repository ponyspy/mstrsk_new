var gulp = require('gulp'),
		gulpif = require('gulp-if'),
		nodemon = require('gulp-nodemon'),
		mocha = require('gulp-mocha'),
		autoprefixer = require('gulp-autoprefixer'),
		uglify = require('gulp-uglify'),
		stylus = require('gulp-stylus'),
		jshint = require('gulp-jshint');

var runSequence = require('run-sequence'),
		del = require('del');

var shouldMinify = false;

var paths = {
	stylus: {
		src: ['public/src/styl/*.styl'],
		dest: 'public/build/css'
	},
	scripts: {
		src: ['public/src/js/*.js'],
		dest: 'public/build/js'
	},
	nodemon: {
		ignore: ['public/*']
	}
}


gulp.task('nodemon', function() {
	return nodemon({
		script: 'app.js',
		env: { 'NODE_ENV': shouldMinify ? 'production' : 'development' },
		ext: 'js',
		ignore: paths.nodemon.ignore
	});
});


gulp.task('clean', function() {
	return del(['public/build/*', '!public/build/libs']);
});


gulp.task('stylus', function() {
	return gulp.src(paths.stylus.src)
						 .pipe(stylus({
							compress: shouldMinify
						 }))
						 .pipe(autoprefixer({
							browsers: ['last 2 versions'],
							cascade: !shouldMinify
						 }))
						 .pipe(gulp.dest(paths.stylus.dest));
});


gulp.task('scripts', function() {
	return gulp.src(paths.scripts.src)
						 .pipe(jshint())
						 .pipe(gulpif(!shouldMinify, jshint.reporter('jshint-stylish')))
						 .pipe(gulpif(shouldMinify, uglify()))
						 .pipe(gulp.dest(paths.scripts.dest));
});


gulp.task('watch', function() {
	var logger = function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	}

	gulp.watch(paths.scripts.src, ['scripts']).on('change', logger);
	gulp.watch(paths.stylus.src, ['stylus']).on('change', logger);
});


gulp.task('mocha', function () {
	return gulp.src('test/*.js', {read: false})
						 .pipe(mocha({reporter: 'nyan'}));
});


gulp.task('production', function () {
	shouldMinify = true;
});


// Run Tasks


gulp.task('default', function(callback) {
	runSequence('clean', 'scripts', 'stylus', callback);
});

gulp.task('build', function(callback) {
	runSequence('production', 'clean', 'scripts', 'stylus', callback);
});

gulp.task('dev', function(callback) {
	runSequence(['watch', 'nodemon'],  callback);
});

gulp.task('run', function(callback) {
	runSequence(['production', 'watch', 'nodemon'],  callback);
});

gulp.task('test', ['mocha']);
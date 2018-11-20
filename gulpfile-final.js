/*jslint node: true */
"use strict";

var	minifyCSS			= false,
  gulp				  = require('gulp'),
	clean				  = require('gulp-clean'),
	plumber				= require('gulp-plumber'),
	rename				= require('gulp-rename'),
	safeMkdir			= require('safe-mkdir').mkdirSync,
	jsConcat			= require('gulp-concat'),
	jsHint				= require('gulp-jshint'),
	jsUglify			= require('gulp-uglify'),
	sourcemap			= require('gulp-sourcemaps'),
	stylish				= require('jshint-stylish'),
	sass				  = require('gulp-sass'),
	autoprefixer	= require('gulp-autoprefixer'),
	imagemin			= require('gulp-imagemin'),
	browserSync = require("browser-sync").create();


var assetsDistPath		= './',
	assetsDistPathCss	= assetsDistPath+'css/',
	assetsDistPathImg	= assetsDistPath+'images/',
	assetsDistPathJs	= assetsDistPath+'js/',
	assetsSrcPath		= './assets/src/',
	assetsSrcPathImg	= assetsSrcPath+'images/',
	assetsSrcPathScss	= assetsSrcPath+'scss/',
	assetsSrcPathJs		= assetsSrcPath+'js/',
	paths = {
	    js: [assetsSrcPathJs+'vendor/*.js', assetsSrcPathJs+'active-modules/*.js']
	};


// CSS Tasks #1

gulp.task('sass', ['sass:clean'], function() {
    safeMkdir(assetsDistPathCss);
    gulp.src(assetsSrcPathScss+'**/*.scss')
        .pipe(sourcemap.init())
        .pipe(plumber())
				.pipe(sass()
					.on('error', function (err) {
						sass.logError.bind(this)(err);
					})
				)
				.pipe(autoprefixer())
        .pipe(sourcemap.write())
        .pipe(gulp.dest(assetsDistPathCss));
});

gulp.task('sass-minify', function() {
	if (minifyCSS) {
		safeMkdir(assetsDistPathCss);
		gulp.src(assetsSrcPathScss+'**/*.scss')
	        .pipe(plumber())
	        .pipe(sass({
	            outputStyle: 'compressed'
	        }).on('error', sass.logError))
			.pipe(rename(function (path) {
				path.extname = '.min.css';
			}))
	        .pipe(gulp.dest(assetsDistPathCss));
	}
});


// Javascript Tasks #2

gulp.task('js:lint', function() {
    gulp.src([assetsSrcPathJs+'active-modules/*.js'])
        .pipe(plumber())
        .pipe(jsHint())
				.pipe(jsHint.reporter(stylish))
        .pipe(jsHint.reporter('fail')).on('error', function (err) {
					gulp.src([assetsSrcPathJs+'active-modules/*.js'])
					.pipe(plumber())
					.pipe(jsHint());
				});
});

gulp.task('js:build', ['js:clean', 'js:lint'], function() {
    safeMkdir(assetsDistPathJs);
    gulp.src(paths.js)
        .pipe(jsConcat('main.js'))
        .pipe(gulp.dest(assetsDistPathJs))
		.pipe(rename('main.min.js'))
		.pipe(jsUglify().on('error', function() {}))
		.pipe(gulp.dest(assetsDistPathJs));
});


// Image Tasks

var imgCompress = function() {
		safeMkdir(assetsDistPathImg);
    gulp.src([
	        assetsSrcPathImg+'**/*.jpg',
	        assetsSrcPathImg+'**/*.jpeg',
	        assetsSrcPathImg+'**/*.gif',
	        assetsSrcPathImg+'**/*.png'
	    ])
        .pipe(imagemin())
        .pipe(gulp.dest(assetsDistPathImg));
};

gulp.task('img:build', ['img:clean'], function() {
    imgCompress();
});

// Cleanup Tasks

gulp.task('js:clean', function() {
    return gulp.src(assetsDistPathJs, {read:false})
        .pipe(clean());
});

gulp.task('sass:clean', function() {
    return gulp.src(assetsDistPathCss, {read:false})
        .pipe(clean());
});

gulp.task('img:clean', function() {
    return gulp.src(assetsDistPathImg, {read:false})
        .pipe(clean());
});


// grouped clean tasks

gulp.task('clean', ['sass:clean', 'js:clean', 'img:clean']);


// Build Tasks

gulp.task('watch', function() {
    gulp.watch('**/*.scss', {cwd: assetsSrcPathScss}, ['sass', 'sass-minify']).on('change', browserSync.reload);
    gulp.watch('**/*.js', {cwd: assetsSrcPathJs}, ['js:build']).on('change', browserSync.reload);
    gulp.watch('**.*', {cwd: assetsSrcPathImg}, ['img:build']);
});

gulp.task('serve', function() {

    browserSync.init({
        server: "./"
    });
});

gulp.task('default', ['sass', 'sass-minify', 'js:build', 'img:build', 'watch', 'serve']);

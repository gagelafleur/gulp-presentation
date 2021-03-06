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

});

gulp.task('sass-minify', function() {

});


// Javascript Tasks #2

gulp.task('js:lint', function() {

});

gulp.task('js:build', ['js:clean', 'js:lint'], function() {
    safeMkdir(assetsDistPathJs);

});


// Image Tasks

var imgCompress = function() {
		safeMkdir(assetsDistPathImg);

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
    gulp.watch('**/*.scss', {cwd: assetsSrcPathScss}, ['sass', 'sass-minify']);//.on('change', browserSync.reload);
    gulp.watch('**/*.js', {cwd: assetsSrcPathJs}, ['js:build']);//.on('change', browserSync.reload);
    gulp.watch('**.*', {cwd: assetsSrcPathImg}, ['img:build']);
});

gulp.task('serve', function() {

});

gulp.task('default', ['sass', 'sass-minify', 'js:build', 'img:build', 'watch', 'serve']);

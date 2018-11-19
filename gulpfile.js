/*jslint node: true */
"use strict";

var	minifyCSS			= false,
	clean				  = require('gulp-clean'),
	jsConcat			= require('gulp-concat'),
	jsHint				= require('gulp-jshint'),
	jsUglify			= require('gulp-uglify'),
	gulp				  = require('gulp'),
	imagemin			= require('gulp-imagemin'),
	plumber				= require('gulp-plumber'),
	rename				= require('gulp-rename'),
	safeMkdir			= require('safe-mkdir').mkdirSync,
	sass				  = require('gulp-sass'),
	sourcemap			= require('gulp-sourcemaps'),
	stylish				= require('jshint-stylish'),
	map					  = require('map-stream'),
	autoprefixer	= require('gulp-autoprefixer'),
	assetsDistPath		= './',
	assetsDistPathCss	= assetsDistPath+'css/',
	assetsDistPathFonts	= assetsDistPath+'fonts/',
	assetsDistPathImg	= assetsDistPath+'images/',
	assetsDistPathJs	= assetsDistPath+'js/',
	assetsSrcPath		= './assets/src/',
	assetsSrcPathImg	= assetsSrcPath+'images/',
	assetsSrcPathFonts	= assetsSrcPath+'fonts/',
	assetsSrcPathScss	= assetsSrcPath+'scss/',
	assetsSrcPathJs		= assetsSrcPath+'js/',
	paths = {
	    js: [assetsSrcPathJs+'vendor/*.js', assetsSrcPathJs+'active-modules/*.js', assetsSrcPathJs+'page-specific/*.js']
	},
	//MY_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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',
	os = require('os');
	/*slack = require('gulp-slack')({
    	url: MY_SLACK_WEBHOOK_URL,
    	channel: '#base-theme-gulp'
	})*/

// jshint reporter that logs to slack
/*var slackReporter = function(file, cb) {
	return map(function (file, cb) {
		if (file.jshint.success) {
			return cb(null, file);
		}

		var errorMsg="";
		//console.log('JSHINT fail in', file.path);
		errorMsg += 'JSHINT fail in ' + file.path + '\n';
		file.jshint.results.forEach(function (result) {
			if (!result.error) {
				return;
			}

			const err = result.error;
			//console.log(`  line ${err.line}, col ${err.character}, code ${err.code}, ${err.reason}`);
			errorMsg += `  line ${err.line}, col ${err.character}, code ${err.code}, ${err.reason}` + '\n';
		});

		sendSlackMessage(errorMsg);
		//cb(null, file);
	});
};*/


function sendSlackMessage(errorMessage) {
	/*if (process.cwd().includes('w-uwd8base')) {
		slack(errorMessage);
	}*/
}

// CSS Tasks

gulp.task('sass', ['sass:clean'], function() {
    safeMkdir(assetsDistPathCss);
    gulp.src(assetsSrcPathScss+'**/*.scss')
        .pipe(sourcemap.init())
        .pipe(plumber())
		.pipe(sass()
			.on('error', function (err) {
				sass.logError.bind(this)(err);
				sendSlackMessage(err.messageFormatted);
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


// Javascript Tasks

gulp.task('js:lint', function() {
    gulp.src([assetsSrcPathJs+'active-modules/*.js'])
        .pipe(plumber())
        .pipe(jsHint())
		.pipe(jsHint.reporter(stylish))
        .pipe(jsHint.reporter('fail')).on('error', function (err) {
			gulp.src([assetsSrcPathJs+'active-modules/*.js'])
			.pipe(plumber())
			.pipe(jsHint())
			.pipe(slackReporter());
		});
});

gulp.task('js:build', ['js:clean', 'js:lint'], function() {
    safeMkdir(assetsDistPathJs);
    gulp.src(paths.js)
        .pipe(sourcemap.init())
        .pipe(jsConcat('main.js'))
        .pipe(sourcemap.write())
        .pipe(gulp.dest(assetsDistPathJs))
		.pipe(rename('main.min.js'))
		.pipe(jsUglify().on('error', function() {}))
		.pipe(gulp.dest(assetsDistPathJs));
});


// Image Tasks

var imgCompress = function() {
    gulp.src([
	        assetsSrcPathImg+'**/*.jpg',
	        assetsSrcPathImg+'**/*.jpeg',
	        assetsSrcPathImg+'**/*.gif',
	        assetsSrcPathImg+'**/*.png'
	    ])
        .pipe(imagemin())
        .pipe(gulp.dest(assetsDistPathImg));
};

gulp.task('img:compress', imgCompress);

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




// grouped Tasks

gulp.task('clean', ['sass:clean', 'js:clean', 'img:clean']);


// Build Tasks

gulp.task('watch', function() {
    gulp.watch('**/*.scss', {cwd: assetsSrcPathScss}, ['sass', 'sass-minify']);
    gulp.watch('**/*.js', {cwd: assetsSrcPathJs}, ['js:build']);
    gulp.watch('**.*', {cwd: assetsSrcPathImg}, ['img:build']);
	  sendSlackMessage("gulp started by "+os.userInfo().username+" at "+process.cwd());
});

gulp.task('default', ['sass', 'sass-minify', 'js:build', 'img:build', 'watch']);


process.on("SIGINT", function(){
    //sendSlackMessage("gulp ended by "+os.userInfo().username+" at "+process.cwd()+" (SIGINT)");
    //setInterval(function(){process.exit();}, 1000);
});

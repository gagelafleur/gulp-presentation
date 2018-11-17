/*jslint node: true */
"use strict";

var	clean				  = require('gulp-clean'),
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
  	autoprefixer	= require('gulp-autoprefixer');

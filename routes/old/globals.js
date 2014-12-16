var async = require('async');

var Age = require('../../models/main.js').Age;
var Object = require('../../models/main.js').Object;
var Subject = require('../../models/main.js').Subject;
var Architect = require('../../models/main.js').Architect;

exports.locale = function(req, res) {
	res.cookie('locale', req.params.locale);
	res.redirect('back');
}

exports.search = function(req, res) {
	var search = req.body.search;

	Architect.find({ $text: { $search: search } }, { score : { $meta: 'textScore' } }).sort({ score : { $meta : 'textScore' } }).select('name _id').exec(function(err, architects) {
		Object.find({ $text: { $search: search } }, { score : { $meta: 'textScore' } }).sort({ score : { $meta : 'textScore' } }).select('title _id').exec(function(err, objects) {
			Subject.find({ $text: { $search: search } }, { score : { $meta: 'textScore' } }).sort({ score : { $meta : 'textScore' } }).select('title _id').exec(function(err, subjects) {
				res.send({architects: architects, objects: objects, subjects: subjects});
			});
		});
	});
}
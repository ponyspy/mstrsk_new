var async = require('async');

var Architect = require('../models/main.js').Architect;
var Object = require('../models/main.js').Object;


exports.index = function(req, res) {
	Architect.find().exec(function(err, architects) {
		var arch_result = [];

		async.forEach(architects, function(architect, callback) {
			var last_name = architect.i18n.name.get('ru').split(' ')[0] || 'None';
			var sort_letter = last_name.charAt(0).toUpperCase();

			arch_result.filter(function(alphabet) { return alphabet.letter == sort_letter })[0]
				? arch_result.forEach(function(a_res) { a_res.letter == sort_letter ? a_res.objects.push(architect) : false })
				: arch_result.push({
					'letter': sort_letter,
					'objects': [architect]
				});

			callback();
		}, function() {
			arch_result.sort(function(a, b) {
				if (a.letter < b.letter) return -1;
				if (a.letter > b.letter) return 1;
				return 0;
			});
			res.render('architects', {alphabet: arch_result});
		});
	});
}

exports.architect = function(req, res) {
	var id = req.params.id;
	Architect.findById(id).exec(function(err, architect) {
		Object.find().where('architects').equals(architect._id).exec(function(err, objects) {
			res.render('architects/architect.jade', {architect: architect, objects: objects});
		});
	});
}
var Age = require('../models/main.js').Age;

exports.index = function(req, res) {
	Age.find().where('parent').exists(false).sort('meta.interval.start meta.interval.end').exec(function(err, ages) {
		res.render('main', {ages: ages});
	});
}


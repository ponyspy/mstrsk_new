var Food = require('../../models/main.js').Food;

exports.index = function(req, res) {
	Food.find().exec(function(err, foods) {
		res.render('main', {foods: foods});
	});
}

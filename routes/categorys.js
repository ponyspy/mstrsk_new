var Category = require('../models/main.js').Category;
var Object = require('../models/main.js').Object;


exports.index = function(req, res) {
	Category.find().exec(function(err, categorys) {
		res.render('categorys', {categorys: categorys});
	});
}

exports.category = function(req, res) {
	var id = req.params.id;
	Category.findById(id).exec(function(err, category) {
		Object.find().where('categorys').equals(category._id).exec(function(err, objects) {
			res.render('categorys/category.jade', {category: category, objects: objects});
		});
	});
}
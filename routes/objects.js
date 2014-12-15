var Object = require('../models/main.js').Object;
var Project = require('../models/main.js').Project;


exports.object = function(req, res) {
	var id = req.params.id;
	Object.findById(id).populate('subjects categorys architects ages.main').exec(function(err, object) {
		Project.find().where('objects').equals(object._id).exec(function(err, projects) {
			res.render('objects/object.jade', {object: object, projects: projects});
		});
	});
}
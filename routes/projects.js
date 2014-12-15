var Project = require('../models/main.js').Project;


exports.index = function(req, res) {
	var id = req.params.id;
	Project.find().exec(function(err, projects) {
		res.render('projects', {projects: projects});
	});
}

exports.project = function(req, res) {
	var id = req.params.id;
	Project.findById(id).populate('objects').exec(function(err, project) {
		res.render('projects/project.jade', {project: project});
	});
}
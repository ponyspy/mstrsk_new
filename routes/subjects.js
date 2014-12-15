var Subject = require('../models/main.js').Subject;


exports.index = function(req, res) {
	Subject.find().exec(function(err, subjects) {
		res.render('subjects', {subjects: subjects});
	});
}

exports.subject = function(req, res) {
	var id = req.params.id;
	Subject.findById(id).exec(function(err, subject) {
		res.render('subjects/subject.jade', {subject: subject});
	});
}
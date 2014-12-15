var should = require('should');
var mongoose = require('mongoose');
var models = require('../models/main.js');

var User = models.User;

describe('models', function () {

	it('should be have Models', function () {
		models.should.be.have.property('User');
		models.should.be.have.property('Age');
		models.should.be.have.property('Object');
		models.should.be.have.property('Subject');
		models.should.be.have.property('Architect');
		models.should.be.have.property('Category');
		models.should.be.have.property('Project');
	});

	it('should be have #find', function (done) {
		User.should.be.have.property('find');

		var id = mongoose.Types.ObjectId();
		User.findById(id, function (err, user) {
			if (err) return done(err);
			should.not.exist(user);
			done();
		});
	});

});
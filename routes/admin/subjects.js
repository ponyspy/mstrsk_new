var gm = require('gm').subClass({ imageMagick: true });
var path = require('path');
var async = require('async');
var del = require('del');
var mkdirp = require('mkdirp');
var fs = require('fs');
var appDir = path.dirname(require.main.filename);

var Object = require('../../models/main.js').Object;
var Subject = require('../../models/main.js').Subject;

// ------------------------
// *** Handlers Block ***
// ------------------------


var set_date = function(year) {
	return new Date(Date.UTC(year, 0, 1));
}


// ------------------------
// *** Admin Subjects Block ***
// ------------------------


exports.list = function(req, res) {
	var id = req.params.object_id;
	var sizes = [];

	Object.findById(id).populate('subjects').exec(function(err, object) {
		async.forEachSeries(object.subjects, function(subject, callback) {
			gm(appDir + '/public' + subject.image.original).size({bufferStream: true}, function(err, size) {
				size
					? sizes.push({width: size.width, height: size.height})
					: sizes.push({width: null, height: null});
				callback();
			});
		}, function() {
			res.render('auth/subjects', {object: object, sizes: sizes});
		});
	});
}


// ------------------------
// *** Add Subjects Block ***
// ------------------------


exports.add = function(req, res) {
	res.render('auth/subjects/add.jade');
}

exports.add_form = function(req, res) {
	var post = req.body;
	var files = req.files;
	var subject = new Subject();

	subject.title =[{
		lg: 'ru',
		value: post.ru.title
	}];
	subject.description = [{
		lg: 'ru',
		value: post.ru.description
	}];

	subject.meta.inventory = post.inventory;
	subject.meta.interval.start = set_date(post.interval.start);
	subject.meta.interval.end = set_date(post.interval.end);

	var public_folder = appDir + '/public';
	var subject_folder = '/images/subjects/' + subject._id;

  if (!files.image) {
    return (function () {
			subject.save(function(err, subject) {
				Object.findById(req.params.object_id).exec(function(err, object) {
					object.subjects.push(subject._id);
					object.save(function(err, object) {
						res.redirect('/auth/objects/' + req.params.object_id + '/subjects');
					});
				});
			});
    })();
  }

	mkdirp.sync(public_folder + subject_folder);

	gm(files.image.path).write(public_folder + subject_folder + '/original.jpg', function() {
		gm(files.image.path).resize(350, false).write(public_folder + subject_folder + '/thumb.jpg', function() {
			subject.image.original = subject_folder + '/original.jpg';
			subject.image.thumb = subject_folder + '/thumb.jpg';

			subject.save(function(err, subject) {
				Object.findById(req.params.object_id).exec(function(err, object) {
					object.subjects.push(subject._id);
					object.save(function(err, object) {
						res.redirect('/auth/objects/' + req.params.object_id + '/subjects');
					});
				});
			});
		});
	});
}


// ------------------------
// *** Edit Subjects Block ***
// ------------------------


exports.edit = function(req, res) {
	var id = req.params.subject_id;

	Subject.findById(id).exec(function(err, subject) {
		res.render('auth/subjects/edit.jade', {subject: subject});
	});
}

exports.edit_form = function(req, res) {
	var post = req.body;
	var files = req.files;
	var id = req.params.subject_id;

	Subject.findById(id).exec(function(err, subject) {

    subject.i18n.title.set(post.ru.title, 'ru');
    subject.i18n.description.set(post.ru.description, 'ru');

    subject.meta.inventory = post.inventory;
		subject.meta.interval.start = set_date(post.interval.start);
		subject.meta.interval.end = set_date(post.interval.end);

		var public_folder = appDir + '/public';
		var subject_folder = '/images/subjects/' + subject._id;

    if (!files.image) {
      return (function () {
				subject.save(function(err, subject) {
					res.redirect('/auth/objects/' + req.params.object_id + '/subjects');
				});
      })();
    }

    mkdirp.sync(public_folder + subject_folder);

		gm(files.image.path).write(public_folder + subject_folder + '/original.jpg', function() {
			gm(files.image.path).resize(350, false).write(public_folder + subject_folder + '/thumb.jpg', function() {
				subject.image.original = subject_folder + '/original.jpg';
				subject.image.thumb = subject_folder + '/thumb.jpg';

				subject.save(function(err, subject) {
					res.redirect('/auth/objects/' + req.params.object_id + '/subjects');
				});
			});
		});
	});
}


// ------------------------
// *** Generate tiles Block ***
// ------------------------


exports.tiles_gen = function(req, res) {
	var subject_id = req.body.subject_id;

	Subject.findById(subject_id).exec(function(err, subject) {
		var zoom = [{ size: '100%', level: '4' }, { size: '50%', level: '3' }, { size: '25%', level: '2' }, { size: '12.5%', level: '1' }];
		var public_folder = appDir + '/public';
		var subject_folder = '/images/subjects/' + subject._id;

		del(public_folder + subject_folder + '/tiles', function() {
			async.forEach(zoom, function(item, callback) {
				var level_folder = public_folder + subject_folder + '/tiles/' + item.level;

				mkdirp(level_folder, function() {
					gm()
						.in(public_folder + subject_folder + '/original.jpg')
						.in('-resize', item.size)
						.write(level_folder + '/original.mpc', function(err) {
							gm()
								.in(level_folder + '/original.mpc')
								.in('-crop', '256x256')
								.in('-set', 'filename:tile')
								.in('%[fx:page.y/256]_%[fx:page.x/256]')
								.write(level_folder + '/image_tile_%[filename:tile].jpg', function(err) {
									del([level_folder + '/original.mpc', level_folder + '/original.cache'], function() {
										callback();
									});
								});
						});
					});
				}, function() {
					subject.image.tiles = subject_folder + '/tiles';
					subject.save(function(err, subject) {
						res.send('ok')
					});
				});
		});
	});
}

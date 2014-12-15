var fs = require('fs');
var path = require('path');
var gm = require('gm').subClass({ imageMagick: true });
var async = require('async');
var appDir = path.dirname(require.main.filename);


var Architect = require('../../models/main.js').Architect;


// ------------------------
// *** Handlers Block ***
// ------------------------


var set_date = function(year) {
  return new Date(Date.UTC(year, 0, 1));
}


// ------------------------
// *** Admin Architects Block ***
// ------------------------


exports.list = function(req, res) {
  Architect.find().exec(function(err, architects) {
    res.render('auth/architects/', {architects: architects});
  });
}


// ------------------------
// *** Add Architects Block ***
// ------------------------


exports.add = function(req, res) {
  res.render('auth/architects/add.jade');
}

exports.add_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var architect = new Architect();

  architect.name =[{
  	lg: 'ru',
  	value: post.ru.name
  }];
  architect.description = [{
  	lg: 'ru',
  	value: post.ru.description
  }];

  architect.meta.interval.start = set_date(post.interval.start);
  architect.meta.interval.end = set_date(post.interval.end);

  if (files.photo) {
    fs.mkdir(appDir + '/public/images/architects/' + architect._id, function() {
      var newPath = appDir + '/public/images/architects/' + architect._id + '/photo.jpg';
      gm(files.photo.path).resize(600, false).quality(80).write(newPath, function() {
        architect.photo = '/images/architects/' + architect._id + '/photo.jpg';
        fs.unlink(files.photo.path);
        architect.save(function(err, architect) {
          res.redirect('/auth/architects');
        });
      });
    });
  }
  else {
    architect.save(function(err, architect) {
      res.redirect('/auth/architects');
    });
  }
}


// ------------------------
// *** Edit Architects Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;

  Architect.findById(id).exec(function(err, architect) {
    res.render('auth/architects/edit.jade', {architect: architect});
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var id = req.params.id;

  Architect.findById(id).exec(function(err, architect) {

    architect.i18n.name.set(post.ru.name, 'ru');
    architect.i18n.description.set(post.ru.description, 'ru');

    architect.meta.interval.start = set_date(post.interval.start);
    architect.meta.interval.end = set_date(post.interval.end);

    if (files.photo) {
      fs.mkdir(appDir + '/public/images/architects/' + architect._id, function() {
        var newPath = appDir + '/public/images/architects/' + architect._id + '/photo.jpg';
        gm(files.photo.path).resize(600, false).quality(80).write(newPath, function() {
          architect.photo = '/images/architects/' + architect._id + '/photo.jpg';
          fs.unlink(files.photo.path);
          architect.save(function(err, architect) {
            res.redirect('/auth/architects');
          });
        });
      });
    }
    else {
      architect.save(function(err, architect) {
        res.redirect('/auth/architects');
      });
    }
  });
}
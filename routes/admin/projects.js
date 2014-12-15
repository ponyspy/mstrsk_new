var fs = require('fs');
var path = require('path');
var gm = require('gm').subClass({ imageMagick: true });
var async = require('async');
var appDir = path.dirname(require.main.filename);


var Project = require('../../models/main.js').Project;
var Object = require('../../models/main.js').Object;


// ------------------------
// *** Admin Projects Block ***
// ------------------------


exports.list = function(req, res) {
  Project.find().exec(function(err, projects) {
    res.render('auth/projects/', {projects: projects});
  });
}


// ------------------------
// *** Add Projects Block ***
// ------------------------


exports.add = function(req, res) {
  Object.find().exec(function(err, objects) {
    res.render('auth/projects/add.jade', {objects: objects});
  });
}

exports.add_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var project = new Project();

  project.title =[{
  	lg: 'ru',
  	value: post.ru.title
  }];
  project.description = [{
  	lg: 'ru',
  	value: post.ru.description
  }];

  project.objects = post.objects != '' ? post.objects : []

  var model_name = new Date();
  model_name = model_name.getTime();
  project.model = '/files/models/' + model_name + '.unity3d';


  if (files.photo) {
    fs.mkdir(appDir + '/public/images/projects/' + project._id, function() {
      var newPath = appDir + '/public/images/projects/' + project._id + '/photo.jpg';
      gm(files.photo.path).resize(1280, false).quality(100).write(newPath, function() {
        project.photo = '/images/projects/' + project._id + '/photo.jpg';
        fs.unlink(files.photo.path);
        project.save(function(err, project) {
          res.redirect('/auth/projects');
        });
      });
    });
  }
  else {
    project.save(function(err, project) {
      res.redirect('/auth/projects');
    });
  }
}


// ------------------------
// *** Edit Projects Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;
  Object.find().exec(function(err, objects) {
    Project.findById(id).exec(function(err, project) {
      res.render('auth/projects/edit.jade', {project: project, objects: objects});
    });
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var id = req.params.id;

  Project.findById(id).exec(function(err, project) {

    project.i18n.title.set(post.ru.title, 'ru');
    project.i18n.description.set(post.ru.description, 'ru');

    project.objects = post.objects != '' ? post.objects : []

    if (files.photo) {
      fs.mkdir(appDir + '/public/images/projects/' + project._id, function() {
        var newPath = appDir + '/public/images/projects/' + project._id + '/photo.jpg';
        gm(files.photo.path).resize(1280, false).quality(100).write(newPath, function() {
          project.photo = '/images/projects/' + project._id + '/photo.jpg';
          fs.unlink(files.photo.path);
          project.save(function(err, project) {
            res.redirect('/auth/projects');
          });
        });
      });
    }
    else {
      project.save(function(err, architect) {
        res.redirect('/auth/projects');
      });
    }
  });
}
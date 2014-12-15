var fs = require('fs');
var path = require('path');
var gm = require('gm').subClass({ imageMagick: true });
var async = require('async');
var appDir = path.dirname(require.main.filename);


var Category = require('../../models/main.js').Category;


// ------------------------
// *** Admin Categorys Block ***
// ------------------------


exports.list = function(req, res) {
  Category.find().exec(function(err, categorys) {
    res.render('auth/categorys/', {categorys: categorys});
  });
}


// ------------------------
// *** Add Categorys Block ***
// ------------------------


exports.add = function(req, res) {
  res.render('auth/categorys/add.jade');
}

exports.add_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var category = new Category();

  category.title =[{
  	lg: 'ru',
  	value: post.ru.title
  }];
  category.description = [{
  	lg: 'ru',
  	value: post.ru.description
  }];

  if (files.photo) {
    fs.mkdir(appDir + '/public/images/categorys/' + category._id, function() {
      var newPath = appDir + '/public/images/categorys/' + category._id + '/photo.jpg';
      gm(files.photo.path).resize(600, false).quality(80).write(newPath, function() {
        category.photo = '/images/categorys/' + category._id + '/photo.jpg';
        fs.unlink(files.photo.path);
        category.save(function(err, era) {
          res.redirect('/auth/categorys');
        });
      });
    });
  }
  else {
    category.save(function(err, category) {
      res.redirect('/auth/categorys');
    });
  }
}


// ------------------------
// *** Edit Categorys Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;

  Category.findById(id).exec(function(err, category) {
    res.render('auth/categorys/edit.jade', {category: category});
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var id = req.params.id;

  Category.findById(id).exec(function(err, category) {

    category.i18n.title.set(post.ru.title, 'ru');
    category.i18n.description.set(post.ru.description, 'ru');

    if (files.photo) {
      fs.mkdir(appDir + '/public/images/categorys/' + category._id, function() {
        var newPath = appDir + '/public/images/categorys/' + category._id + '/photo.jpg';
        gm(files.photo.path).resize(600, false).quality(80).write(newPath, function() {
          category.photo = '/images/categorys/' + category._id + '/photo.jpg';
          fs.unlink(files.photo.path);
          category.save(function(err, era) {
            res.redirect('/auth/categorys');
          });
        });
      });
    }
    else {
      category.save(function(err, category) {
        res.redirect('/auth/categorys');
      });
    }
  });
}
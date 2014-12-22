var Event = require('../../models/main.js').Event;


// ------------------------
// *** Admin Events Block ***
// ------------------------


exports.list = function(req, res) {
  Event.find().exec(function(err, events) {
    res.render('auth/events/', {events: events});
  });
}


// ------------------------
// *** Add Events Block ***
// ------------------------


exports.add = function(req, res) {
  res.render('auth/events/add.jade');
}

exports.add_form = function(req, res) {
  var post = req.body;
  var schedule = [];
  var sh = post.schedule;
  var event = new Event();

  sh.date.forEach(function(el, index) {
    var date = new Date(Date.UTC(sh.year[index], sh.month[index], sh.date[index], sh.hours[index], sh.minutes[index]));
    schedule.push({date: date, premiere: sh.premiere[index] || false});
  });

  event.title = [{
    lg: 'ru',
    value: post.ru.title
  }];
  event.description = [{
    lg: 'ru',
    value: post.ru.description
  }];

  event.hall = post.ru.hall;
  event.price = post.price;
  event.age = post.age;
  event.category = post.category;
  event.schedule = schedule;

  event.save(function(err, event) {
    res.redirect('back');
  });
}


// ------------------------
// *** Edit Events Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;

  Event.findById(id).exec(function(err, event) {
    res.render('auth/events/edit.jade', {event: event});
  });
}


exports.edit_form = function(req, res) {
  var id = req.params.id;
  var post = req.body;
  var schedule = [];
  var sh = post.schedule;

  sh.date.forEach(function(el, index) {
    var date = new Date(Date.UTC(sh.year[index], sh.month[index], sh.date[index], sh.hours[index], sh.minutes[index]));
    schedule.push({date: date, premiere: sh.premiere[index] || false});
  });

  Event.findById(id).exec(function(err, event) {
    object.i18n.title.set(post.ru.title, 'ru');
    object.i18n.description.set(post.ru.description, 'ru');

    event.hall = post.ru.hall;
    event.price = post.price;
    event.age = post.age;
    event.category = post.category;
    event.schedule = schedule;

    event.save(function(err, event) {
      res.redirect('back');
    });
  });
}


// ------------------------
// *** Remove Events Block ***
// ------------------------


exports.remove = function(req, res) {
  var id = req.body.id;
  Event.findByIdAndRemove(id, function() {
    // deleteFolderRecursive(__dirname + '/public/images/events/' + id);
    res.send('ok');
  });
}
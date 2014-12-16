var User = require('../../models/main.js').User;
var Object = require('../../models/main.js').Object;
var Subject = require('../../models/main.js').Subject;
var Architect = require('../../models/main.js').Architect;
var Category = require('../../models/main.js').Category;
var Age = require('../../models/main.js').Age;


// ------------------------
// *** API check auth Block ***
// ------------------------


exports.check = function(req, res, next) {
  var params = req.query;

  if (params.location == 'auth') next();
  else if (params.token == Math.floor(req.session.secret / req.session.salt)) next();
  else res.json({status: 'error', code: 26, description: 'Bad token'});
}


// ------------------------
// *** API v1 Block ***
// ------------------------


exports.v1 = function(req, res) {
  var params = req.query;

  switch(params.location) {
    case 'auth':
      User.findById(params.id).exec(function(err, user) {
        if (!user) res.json({status: 'error', code: 101, description: 'Param ID not found'});

        else if (user && user.api == true) {
          switch (params.session) {
            case 'init':
              var key = new Date();
              var min = 1, max = 300;
              var salt = min - 0.5 + Math.random()*(max-min+1);

              req.session.salt = Math.round(salt);
              req.session.secret = key.getTime();
              res.json({status: 'ok', location: params.location, session: req.session});
            break;
            case 'status':
              res.json({status: 'ok', location: params.location, session: req.session.secret ? req.session : null});
            break;
            case 'destroy':
              req.session.destroy();
              req.session = null;
              res.json({status: 'ok', location: params.location, session: null});
            break;
            default:
              res.json({status: 'error', code: 102,  description: 'Param SESSION not found'});
          }
        }

        else res.json({status: 'error', code: 103, description: 'Permission denied'});
      });
    break;
    case 'objects':
      var query = params.id ? {'_id': params.id} : {};
      var exclude = params.select ? params.select.replace(/\,/g,' ') : '-__v -_id';
      var populated = params.populate ? params.populate.replace(/\,/g,' ') : '';
      var Query;

      if (params.interval) {
        var interval = {
          start: new Date(Date.UTC(+params.interval.split(',')[0], 0, 1)),
          end: new Date(Date.UTC(+params.interval.split(',')[1], 0, 1))
        };
        Query = Object.find().select(exclude).populate(populated).sort(params.sort).where('meta.interval.start').gte(interval.start).where('meta.interval.end').lte(interval.end).skip(params.skip).limit(params.limit || 10)
      }
      else {
        Query = Object.find(query).select(exclude).populate(populated).sort(params.sort).skip(params.skip).limit(params.limit || 10)
      }

      Query.exec(function(err, objects) {
        if (!objects) return res.json({status: 'error', code: 24, description: 'Incorrect id'});
        res.json({status: 'ok', location: params.location, result: objects});
      });
    break;
    case 'subjects':
      var query = params.id ? {'_id': params.id} : {};
      var exclude = params.select ? params.select.replace(/\,/g,' ') : '-__v -_id';
      Subject.find(query).select(exclude).sort(params.sort).skip(params.skip).limit(params.limit || 10).exec(function(err, subjects) {
        if (!subjects) return res.json({status: 'error', code: 24, description: 'Incorrect id'});
        res.json({status: 'ok', location: params.location, result: subjects});
      });
    break;
    case 'architects':
      var query = params.id ? {'_id': params.id} : {};
      var exclude = params.select ? params.select.replace(/\,/g,' ') : '-__v -_id';
      Architect.find(query).select(exclude).sort(params.sort).skip(params.skip).limit(params.limit || 10).exec(function(err, architects) {
        if (!architects) return res.json({status: 'error', code: 24, description: 'Incorrect id'});
        res.json({status: 'ok', location: params.location, result: architects});
      });
    break;
    case 'categorys':
      var query = params.id ? {'_id': params.id} : {};
      var exclude = params.select ? params.select.replace(/\,/g,' ') : '-__v -_id';
      Category.find(query).select(exclude).sort(params.sort).skip(params.skip).limit(params.limit || 10).exec(function(err, categorys) {
        if (!categorys) return res.json({status: 'error', code: 24, description: 'Incorrect id'});
        res.json({status: 'ok', location: params.location, result: categorys});
      });
    break;
    case 'ages':
      var query = params.id ? {'_id': params.id} : {};
      var exclude = params.select ? params.select.replace(/\,/g,' ') : '-__v -_id';
      var Query = params.tree == 'true'
        ? Age.find().where('parent').exists(false).populate('sub').select(exclude).sort(params.sort).skip(params.skip).limit(params.limit || 10)
        : Age.find(query).select(exclude).sort(params.sort).skip(params.skip).limit(params.limit || 10)

      Query.exec(function(err, ages) {
        if (!ages) return res.json({status: 'error', code: 24, description: 'Incorrect id'});
        res.json({status: 'ok', location: params.location, result: ages});
      });
    break;
    default:
      res.json({status: 'error', code: 23, description: 'Wrong location'})
  }


  // var properties = req.params.path.split('&');
  // var params = splitParams(properties);

  // if (params.location == 'events') {
  //   var query = params.id ? {'_id': params.id} : {}
  //   var exclude = params.fields ? params.fields.replace(/\,/g,' ') : '-__v -meta.columns.one -meta.columns.two -en -date -members._id';
  //   var populated = params.populate == 'true' ? 'members.m_id' : '';

  //   Event.find(query, exclude).populate(populated).sort(params.sort).skip(params.skip).limit(params.limit || 10).exec(function(err, events) {
  //     res.send(events);
  //   });
  // }

  // else if (params.location == 'schedule') {
  //   var exclude = params.fields ? params.fields.replace(/\,/g,' ') : '-__v -events.banner';
  //   var populated = params.populate == 'true' ? 'events.event' : '';
  //   var def = new Date();

  //   var start = params.start ? new Date(+params.start) : new Date();
  //   var end = params.end ? new Date(+params.end) : new Date(def.setFullYear(def.getFullYear(), (def.getMonth()+1), 0));

  //   var Query = params.id ?
  //     Schedule.findById(params.id, exclude).populate(populated) :
  //     Schedule.find({}, exclude).populate(populated).sort(params.sort).where('date').gte(start).lte(end);

  //   Query.exec(function(err, schedule) {
  //     res.send(schedule);
  //   });
  // }

  // else res.send({ error: { status: 'Wrong Location'} });
}

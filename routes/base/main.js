var Event = require('../../models/main.js').Event;

exports.index = function(req, res) {
	Event.find().exec(function(err, events) {
		res.render('main', {events: events});
	});
}


var Event = require('../../models/main.js').Event;

exports.event = function(req, res) {
	var id = req.params.id;

	Event.findById(id).exec(function(err, event) {
		res.render('events/event.jade', {event: event});
	});
}
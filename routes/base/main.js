var Event = require('../../models/main.js').Event;

exports.index = function(req, res) {
  var start = new Date(Date.UTC(2010, 0, 1));
  var end = new Date(Date.UTC(2018, 11, 30));

	Event.aggregate()
	.unwind('schedule')
  .match({
    'schedule.date': {
      $gte: start,
      $lte: end
    }
  })
  .group({
    '_id': {
      year: { $year: '$schedule.date' },
      month: { $month: '$schedule.date' },
      date: { $dayOfMonth: '$schedule.date' },
      // day: { $dayOfWeek: '$schedule.date' }
    },
    'events': {
      $push: {
      	_id: '$_id',
        title: '$title',
        hall: '$hall',
        price: "$price",
        age: '$age',
        premiere: '$schedule.premiere',
        time: {
          hours: { $hour: '$schedule.date' },
          minutes: { $minute: '$schedule.date' }
        }
      }
    }
  })
  .sort({'_id.year': -1, '_id.month': -1, '_id.date': 1})
  .group({
  	'_id': {
  		year: '$_id.year',
  		month: '$_id.month'
  	},
  	'dates': {
  		$push: {
  			date: '$_id.date',
  			events: '$events'
  		}
  	},
  	'count_dates': { $sum: 1 }
  })
  .exec(function(err, schedule) {
    res.render('main', {schedule: schedule});
    // res.json(schedule)
  });
}


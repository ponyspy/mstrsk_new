var mongoose = require('mongoose'),
		mongooseLocale = require('mongoose-locale'),
		mongooseBcrypt = require('mongoose-bcrypt'),
			Schema = mongoose.Schema;

var userSchema = new Schema({
	login: {type: String, required: true},
	password: {type: String, required: true},
	api: {type: Boolean, default: true},
	email: {type: String, required: true},
	status: {type: String, default: 'User'},
	date: {type: Date, default: Date.now},
});

var foodSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	price: Number,
	category: String,
	image: {
		main: String,
		thumb: String
	},
	date: {type: Date, default: Date.now}
});

var eventSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	category: String,
	age: Number,
	price: Number,
	hall: String,
	schedule: [{
		date: Date,
		premiere: Boolean
	}],
	images: [{
		description: { type: String, trim: true, locale: true },
		original: String,
		thumb: String
	}],
	date: {type: Date, default: Date.now}
});

var requestSchema = new Schema({
	meta: {
		name: String,
		phone: String,
		email: String
	},
	title: {
		value: { type: String, trim: true },
		approve: {type: Boolean, default: false},
		comment: { type: String, trim: true }
	},
	description: {
		value: { type: String, trim: true },
		approve: {type: Boolean, default: false},
		comment: { type: String, trim: true }
	},
	category: String,
	age: Number,
	price: Number,
	hall: String,
	type: String,
	schedule: [{
		date: Date,
		premiere: Boolean
	}],
	images: [{
		description: { type: String, trim: true, locale: true },
		original: String,
		thumb: String
	}],
	date: {type: Date, default: Date.now}
});


// ------------------------
// *** Plugins Block ***
// ------------------------


userSchema.plugin(mongooseBcrypt, { fields: ['password'] });

foodSchema.plugin(mongooseLocale);
eventSchema.plugin(mongooseLocale);


// ------------------------
// *** Index Block ***
// ------------------------


foodSchema.index({'title.value': 'text', 'description.value': 'text'}, {language_override:'lg', default_language: 'ru'});
eventSchema.index({'title.value': 'text', 'description.value': 'text'}, {language_override:'lg', default_language: 'ru'});

foodSchema.set('autoIndex', true);
eventSchema.set('autoIndex', true);


// ------------------------
// *** Exports Block ***
// ------------------------


module.exports.User = mongoose.model('User', userSchema);
module.exports.Food = mongoose.model('Food', foodSchema);
module.exports.Event = mongoose.model('Event', eventSchema);
module.exports.Request = mongoose.model('Request', requestSchema);
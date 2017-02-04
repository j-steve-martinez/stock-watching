'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
		provider: String,
		username: String,
		id: String,
		uid : String,
		data : {
			id: String,
			displayName: String,
			username: String
		}
});

module.exports = mongoose.model('User', User);

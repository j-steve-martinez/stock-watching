'use strict';

var Users = require('../models/users.js');
var Poll = require('../models/polls.js');

function ClickHandler () {
	this.getAllPolls = function(req, res){
		Poll.find().exec((err, data) => {
			if (err) throw err;
			res.json(data);
		});
	}

	this.addDefault = ()=>{
		Poll.find({}, (err, data) => {
			if (err) throw err;
			if (data.length === 0) {
				// add default poll
				console.log('add default');
				var poll = new Poll({
					name : "Do You Like This App?",
					uid : 'default',
					list : [
						{key : 'Yes', value : 0},
						{key : 'No', value : 0}]
				});
				poll.save((err, data) => {
					if (err) throw err;
					console.log(data);
				})
			}
		});
	}

	// get all user polls
	this.getPolls = function(req, res){
		var id = req.user.id;
		Poll
			.find()
			.exec((err, data) => {
				if (err) throw err;
				// console.log('getUserPolls');
				var polls = data.filter(poll => {
					if (poll.uid.toString() === id) {
						return poll;
					}
				});
				res.json(polls);
			});
	}

	this.addPoll = (req, res) => {
		req.on('data', function(body) {

			var data = JSON.parse(body);

			Poll.find({name : data.name, uid : data.uid}, (err, poll) => {
				if (err) throw err;

				if (poll.length) {
					// console.log('sending json');
					res.json({isExists : true, isSaved : false});
				} else {
					var newPoll = new Poll(data);

					// Saving it to the database.
					newPoll.save(function (err, data) {
						if (err) {
							// console.log ('Error on save!');
							res.json({isExists : false, isSaved : false});
						}
						// console.log('data saved');
						res.json({isExists : false, isSaved : true, poll : data});
					});
				}
			});
		});
	}

	this.getPoll = (req, res) => {
		// console.log('getPoll');
		Poll
			.findOne({'_id': req.params.id})
			.exec((err, poll) => {
				if (err) throw err;
				res.json(poll)
			});
	}

	this.takePoll = (req, res) => {
		// console.log('editPoll');
		// console.log(req.params.id);
		req.on('data', function(body) {

			var data = JSON.parse(body);

			Poll
				.findOneAndUpdate({
					'_id': data.id,
					'name' : data.name,
					'list.key' : data.key
				},
					{ $inc : { 'list.$.value': 1 }},
					// get the update poll
					{ new: true }
				)
				.exec((err, poll) => {
					if (err) throw err;
					res.json(poll);
				});
		});
	}

	this.editPoll = (req, res) => {
		// console.log('editPoll');
		req.on('data', body => {

			var data = JSON.parse(body);

			Poll
				.update({
					'_id': req.params.poll,
					'name' : data.name
				},
					{ $push : { list: { key: data.key, value : data.value}}}
				)
				.exec((err, poll) => {
					if (err) throw err;
					res.json(poll);
				});
		});
	}

	this.delPoll = (req, res) => {
		// console.log('del getPoll');
		Poll
		  .findByIdAndRemove(req.params.poll)
			.exec((err, poll) => {
				if (err) throw err;
				res.json(poll)
			});
	}

}

module.exports = ClickHandler;

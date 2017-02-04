'use strict';

var GitHubStrategy = require('passport-github').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		// console.log('seralizeUser');
		// console.log(user.id);
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			// console.log('deserializeUser');
			// console.log(user);
			done(err, user);
		});
	});

	passport.use(new TwitterStrategy({
	    consumerKey: configAuth.twitterAuth.clientID,
	    consumerSecret: configAuth.twitterAuth.clientSecret,
	    callbackURL: configAuth.twitterAuth.callbackURL
	  },
	  function(token, tokenSecret, profile, done) {
	    User.findOne({ 'data.id': profile.id }, function (err, user) {
				// console.log('user');
				// console.log(user);
				if (err) {
					return done(err);
				}

				if (user) {
					// console.log('Passport user');
					// console.log(user);
					return done(null, user);
				} else {
					var newUser = new User();
					// console.log('new user profile twitter');
					// console.log(profile.provider);
					newUser.provider = profile.provider;
					newUser.username = profile.username;
					newUser.id = newUser._id;
					newUser.uid = profile.provider + "_" + profile.id;
					newUser.data.id = profile.id;
					newUser.data.username = profile.username;
					newUser.data.displayName = profile.displayName;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
	    });
	  }
	));

	passport.use(new GitHubStrategy({
		clientID: configAuth.githubAuth.clientID,
		clientSecret: configAuth.githubAuth.clientSecret,
		callbackURL: configAuth.githubAuth.callbackURL
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({ 'data.id': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					// console.log('Passport user');
					// console.log(user);
					return done(null, user);
				} else {
					var newUser = new User();
					// console.log('new user profile github');
					// console.log(profile.provider);
					newUser.provider = profile.provider;
					newUser.username = profile.username;
					newUser.id = newUser._id;
					newUser.uid = profile.provider + "_" + profile.id;
					newUser.data.id = profile.id;
					newUser.data.username = profile.username;
					newUser.data.displayName = profile.displayName;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});
	}));
};

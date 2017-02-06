'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var Quotes = require(path + '/app/controllers/Quotes.js');
var index = path + '/public/index.html';

module.exports = function (app, passport, primus) {

	// function isLoggedIn(req, res, next) {
	// 	console.log('starting isAuthenticated');
	// 	if (req.isAuthenticated()) {
	// 		console.log('isAuthenticated true');
	// 		return next();
	// 	} else {
	// 		console.log('isAuthenticated false');
	// 		console.log(req.url);
	// 		res.json({ id: false });
	// 	}
	// }

	var clickHandler = new ClickHandler();
	var quotes = new Quotes();
	// clickHandler.addDefault();

	app.route('/')
		.get(function (req, res) {
			// console.log(req.params);
			res.sendFile(index);
		});

	// console.log(primus);
	primus.on('connection', function connection(spark) {
		console.log('new connection ' + spark.id);
		// primus.write('data');

		spark.on('data', function received(data) {
			console.log(spark.id, 'received message:', data);
			/**
			 * NOTE: check to see if symbol is in database
			 *  or add to database then run the for loop on primus
			 */
			primus.forEach(function (spark, id, connections) {
				// if (spark.query.foo !== 'bar') return;
				console.log('sending ' + data + ' to ' + spark.id);

				spark.write(data);
			});

		});
	});

	/**
	 * Get the stock symbol data
	 */
	app.route('/api/quotes')
		.post(quotes.history)

};
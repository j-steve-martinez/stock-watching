'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var Quotes = require(path + '/app/controllers/Quotes.js');
var index = path + '/public/index.html';

module.exports = function (app, passport, primus) {

	var clickHandler = new ClickHandler();
	clickHandler.addDefault();
	var quotes = new Quotes();

	app.route('/')
		.get(function (req, res) {
			// console.log(req.params);
			res.sendFile(index);
		});

	// console.log(primus);
	primus.on('connection', function connection(spark) {
		console.log('new connection ' + spark.id);
		// primus.write('data');

		/**
		 * Wait for all data to be received from the client
		 */
		spark.on('data', function received(data) {
			console.log(spark.id, 'received message:', data);
			var sourceId = spark.id;
			/**
			 * Check to see if Stock is in database
			 *  or add to database then run the for loop on primus
			 */
			var dataArr = data.split(':');
			// var stock = { name : dataArr[] }
			var stock = dataArr[1] + ':' + dataArr[2]
			if (dataArr[0] === 'add') {
				// clickHandler.addStock(dataArr[1]);
				clickHandler.addStock(stock);
			} else if (dataArr[0] === 'del') {
				// clickHandler.delStock(dataArr[1]);
				clickHandler.delStock(stock);
			}

			/**
			 * Send the message to all clients
			 */
			primus.forEach(function (spark, id, connections) {

				if (sourceId !== spark.id) {
					console.log('sending ' + data + ' to ' + spark.id);

					spark.write(data);
				}

			});
		});
	});
 
	/**
	 * Get the stock Stock data
	 */
	app.route('/api/quotes')
		.get(clickHandler.getStocks)
		.put(quotes.validate)
		.post(quotes.history)

};

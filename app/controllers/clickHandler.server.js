'use strict';

// var Users = require('../models/users.js');
var Stock = require('../models/stocks.js');

function ClickHandler() {
	this.isSaved = false;

	this.addDefault = () => {
		Stock
			.find({}, (err, data) => {
				if (err) throw err;
				if (data.length === 0) {
					// add default Stock
					console.log('add default: Twitter');
					var stock = new Stock({
						symbol: "TWTR",
						name: 'Twitter Inc.'
					});
					stock.save((err, data) => {
						if (err) throw err;
						console.log(data);
					})
				}
			});
	}

	// get all Stocks
	this.getStocks = function (req, res) {
		Stock
			.find()
			.exec((err, data) => {
				if (err) throw err;
				res.json(data);
			});
	}

	this.addStock = (stock) => {
		var isSaved = false;
		console.log('Stock:');
		console.log(stock);

		var symbol = stock.split(':')[0];
		var name = stock.split(':')[1];

		Stock.find({ name: name }, (err, symbols) => {
			if (err) throw err;

			if (symbols.length) {
				console.log('symbol already exists');
				// res.send({isOk: false});
				// return {isOk: false};
				// this.isSaved = false;

			} else {
				var newStock = new Stock({ symbol: symbol, name: name });

				// Saving it to the database.
				newStock.save(function (err, data) {
					if (err) { throw err }
					console.log('data saved');
					// return {isOk : true};
					isSaved = true;
					// res.send({isOk : true})
					// this.isSaved = true;
				});
			}
		});

	}

	this.delStock = (stock) => {
		// console.log('del getStock');
		var symbol = stock.split(':')[0];
		// var name = stock.split(':')[1];

		Stock
			.findOneAndRemove({ symbol: symbol }, (err, doc) => {
				console.log('removed');
				console.log(doc);
			})
		// .exec((err, Stock) => {
		// 	if (err) throw err;
		// 	res.json(Stock)
		// });
	}

}

module.exports = ClickHandler;

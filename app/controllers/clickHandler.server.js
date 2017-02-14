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
						name: "TWTR"
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

	this.addStock = (symbol) => {
		var isSaved = false;
		Stock.find({ name: symbol }, (err, symbols) => {
			if (err) throw err;

			if (symbols.length) {
				console.log('symbol already exists');
				// res.send({isOk: false});
				// return {isOk: false};
				// this.isSaved = false;

			} else {
				var newStock = new Stock({ name: symbol });

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

	this.delStock = (symbol) => {
		// console.log('del getStock');
		Stock
			.findOneAndRemove({ name: symbol }, (err, doc) => {
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

'use strict';

var yahooFinance = require('yahoo-finance');

function Quotes() {
    this.history = (req, res) => {

        req.on('data', body => {

            var data = JSON.parse(body);

            console.log(data);

            var now = new Date();

            yahooFinance.historical({
                symbols: data.symbols,
                from: '2016-01-01',
                to: '2016-12-31',
            }).then(result => {
                // if (err) { throw err; }
                // console.log(result);
                res.send(result);

            });
        });
    }

    this.validate = (req, res) => {

        req.on('data', body => {

            var data = JSON.parse(body);

            console.log('Validate data:');
            console.log(data);

            yahooFinance.snapshot({
                symbols: data.symbols,
                fields: ['s', 'n'],
            }, function (err, results) {
                if (err) { throw err; }
                console.log(results);
                res.json(results);
            });
        });
    }
}

module.exports = Quotes;

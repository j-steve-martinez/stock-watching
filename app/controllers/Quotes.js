'use strict';

var yahooFinance = require('yahoo-finance');
/**
 * For dev only remove later
 */
var fs = require('fs');
var data = require("../../data.json");

function Quotes() {
    this.history = (req, res) => {

        req.on('data', body => {
            /**
             * Use saved twtr data for dev
             */
            // res.send(data);

            /**
             * Remove yahooFinance call until client is working better
             * this is so i don't hammer yahoo will tons of calls and get 
             * my IP blocked for spamming the server
             */
            var data = JSON.parse(body);
            var dates = data.dates;

            console.log(data);
            yahooFinance.historical({
                symbols: data.symbols,
                from: dates.start,
                to: dates.end,
            }).then(result => {
                // if (err) { throw err; }
                console.log('quote results');
                // console.log(result);

                /**
                 * This was to get mock data and save to a file
                 * remove when client is finished
                 */
                // fs.writeFile("data.json", JSON.stringify(result), function (err) {
                //     if (err) {
                //         return console.log(err);
                //     }
                // });
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

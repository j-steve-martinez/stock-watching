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

            console.log(data);

            yahooFinance.snapshot({
                symbol: 'AAPL',
                fields: ['s', 'n', 'd1', 'l1', 'y', 'r'],
            }, function (err, snapshot) {
                if (err) { throw err; }
                console.log(results);
            });
        });
    }
}

module.exports = Quotes;

  /*
  {
    YHOO: [
      {
        date: Fri Apr 12 1996 00:00:00 GMT-0400 (EDT),
        open: 25.25,
        high: 43,
        low: 24.5,
        close: 33,
        volume: 408720000,
        adjClose: 1.38,
        symbol: 'YHOO'
      },
      ...
      {
        date: Thu Nov 14 2013 00:00:00 GMT-0500 (EST),
        open: 35.07,
        high: 35.89,
        low: 34.76,
        close: 35.69,
        volume: 21368600,
        adjClose: 35.69,
        symbol: 'YHOO'
      }
    ],
    GOOGL: [
      {
        date: Thu Aug 19 2004 00:00:00 GMT-0400 (EDT),
        open: 100,
        high: 104.06,
        low: 95.96,
        close: 100.34,
        volume: 22351900,
        adjClose: 100.34,
        symbol: 'GOOGL'
      },
      ...
      {
        date: Thu Nov 14 2013 00:00:00 GMT-0500 (EST),
        open: 1033.92,
        high: 1039.75,
        low: 1030.35,
        close: 1035.23,
        volume: 1166700,
        adjClose: 1035.23,
        symbol: 'GOOGL'
      }
    ],
    ...
  }
  */
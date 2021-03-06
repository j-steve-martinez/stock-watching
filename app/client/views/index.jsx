'use strict'
var React = require('react');
var ReactDOM = require('react-dom');

import LineAndScatterChart from './LineAndScatterChart.jsx';
// import CandleStickChartWithMA from './CandleStickChartWithMA.jsx';
// import StockChart from './StockChart.jsx';

// if sass build fails
// npm update
// npm install
// node node_modules/node-sass/scripts/install.js
// npm rebuild node-sass

function getColors(num) {
  // console.log('getting colors');
  var data = { c: [], bg: [] };
  var myColors = Please.make_color({
    value: .9,
    golden: true,
    full_random: false,
    format: 'rgb',
    colors_returned: num
  });
  if (num <= 1) {
    // console.log(num);
    myColors = [myColors];
  }
  // console.log(myColors);
  myColors.forEach(item => {
    var color = 'rgba(' + item.r + ', ' + item.g + ', ' + item.b + ', ' + '1)';
    var bg = 'rgba(' + item.r + ', ' + item.g + ', ' + item.b + ', ' + '0.2)';
    data.c.push(color);
    data.bg.push(bg);
  });
  // console.log(data);
  return data;
}

function getDates() {
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var startYear = date.getFullYear() - 1;
  var endYear = date.getFullYear();
  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }
  var start = startYear + '-' + month + '-' + day;
  var end = endYear + '-' + month + '-' + day;
  var dates = { start: start, end: end };
  return dates;
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    // console.log('Main init');
    this.callBack = this.callBack.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.optimusPrime = this.optimusPrime.bind(this);

    // this.state = { symbols: [], symbol: "" };
  }
  handleClick(e) {
    // console.log('handleClick')
    e.preventDefault();

    var message, symbol, echo;
    /**
     * Get a reference to the html input
     */
    echo = document.getElementById('echo');

    /**
     * Get the value from the form
     */
    symbol = echo.value.toUpperCase();

    /**
     * Do nothing if the symbol already exists in the list
     */
    if (this.state.symbols.indexOf(symbol) === -1) {
      /**
       * Update the clients
       */
      this.optimusPrime(symbol);
    }

    /**
     * Clear the current entry in the form;
     */
    echo.value = '';
  }

  optimusPrime(symbol) {
    // console.log('optimusPrime called');
    var message;

    /**
     * Get the symbols list
     */
    var symbols = this.state.symbols;
    var full = this.state.full;

    /**
     * Add or delete the symbols from the list
     */

    /**
     * If the symbol is not in the list 
     *  ask the server to validate 
     *  then notify other clients
     * Else delete the symbol from the list
     *  then notify other clients
     */
    if (symbols.indexOf(symbol) === -1 && symbol !== '') {
      /**
       * Validate the symbol
       */
      var url, full,
        data = {},
        header = {};

      data = { symbols: [symbol] };
      url = window.location.origin + '/api/quotes';
      header.url = url;
      header.method = 'PUT';
      header.data = JSON.stringify(data);
      header.contentType = "application/json";
      header.dataType = 'json';
      // console.log(header);
      $.ajax(header).then(results => {

        // console.log('Main getQuote done');
        // console.log(results);
        if (results[0].symbol === null) {
          // console.log('Main getQuote null');
          /**
           * Not a valid symbol: notify the user;
           */
          this.setState({ message: 'Not A Valid Symbol' });
        } else {
          // console.log('Main getQuote got a symbol');
          /**
           * Add the symbol to the list
           */
          // console.log(results);
          symbols.push(symbol);

          /**
           * Notify the server to update all clients
           */
          // message = 'add:' + symbol;
          message = 'add:' + results[0]['symbol'] + ':' + results[0]['name'];
          this.state.primus.write(message);

          /**
           * Update the app
           */

          full.push(results[0]);
          // console.log(symbols);
          // console.log(symbol);
          // console.log(full);
          this.setState({ symbols: symbols, symbol: symbol, full: full });
        }

      });



    } else if (symbols.indexOf(symbol) >= 0 && symbol !== '') {
      // console.log('Attempting delete of symbol ' + symbol);
      /**
       * Remove the symbol from the list
       */
      symbols = symbols.filter(value => {
        return value != symbol;
      });

      /**
       * Notify the server to update all clients
       */
      message = 'del:' + symbol;
      this.state.primus.write(message);

      /**
       * Get the data and filter out the deleted symbol then
       * Update the App
       */
      var historical = this.state.historical;
      /**
       * Get the filtered keys
       */
      var keys = Object.keys(historical).filter(value => {
        return value !== symbol;
      });
      /**
       * Make a new object with the filtered keys
       */
      var newObj = {};
      keys.forEach(key => {
        newObj[key] = historical[key];
      });
      /**
       * Remove the symbol from the full name list
       */
      var fullname = full.filter(value => {
        return value['symbol'] !== symbol;
      });
      // console.log(newObj);
      // console.log(symbols);
      // console.log(symbol);
      // console.log(full);
      this.setState({ historical: newObj, symbols: symbols, symbol: '', full: fullname })
    }
  }

  callBack(type, data) {
    // console.log('Main callBack called');
    // console.log('type: ' + type);
    // console.log(data);
    var historical, keys, key, value, newObj = {};
    /**
     * Possible type values:
     * add
     * historical
     * del
     */
    switch (type) {
      case 'add':
        /**
         * Get the current data
         */
        historical = this.state.historical;
        // console.log('historical');
        // console.log(historical);

        /**
         * Get the property names
         */
        key = Object.keys(data)[0];

        /**
         * Get the data
         */
        value = data[key];
        // console.log('key');
        // console.log(key);
        // console.log('value');
        // console.log(value);

        /**
         * Add a new property with the data
         */
        historical[key] = value;
        this.setState({ historical: historical, symbol: '' })
        break;
      case 'historical':
        this.setState({ historical: data, symbol: '' });
        break;
      case 'del':
        this.optimusPrime(data);
        break;
      default:
        // console.log('Something went wrong');
        // console.log(type);
        // console.log(data);
        break;
    }
  }

  componentDidMount() {
    // console.log('Main componentDidMount');
    // console.log('state');
    // console.log(this.state);

    /**
     * Set the primus handler
     */
    var primus = new Primus();
    primus.on('data', data => {
      // console.log('primus new data: ' + data);
      var action = data.split(':')[0];
      var symbol = data.split(':')[1];
      var name = data.split(':')[2];

      // console.log(action);
      // console.log(symbol);
      var symbols = this.state.symbols;
      var full = this.state.full;
      if (symbols.indexOf(symbol) === -1) {
        // console.log('adding');
        // add
        full.push({ symbol: symbol, name: name });
        symbols.push(symbol);
        this.setState({ symbols: symbols, symbol: symbol, full: full });
      } else {
        // console.log('primus deleting symbol');
        // console.log('state');
        // console.log(this.state);
        var historical = this.state.historical;
        // console.log(historical);
        // remove
        symbols = symbols.filter((value, key) => {
          // console.log(value);
          return value !== symbol;
        });
        var newHist = {};
        symbols.forEach(value => {
          newHist[value] = historical[value];
        });
        // console.log(symbol);
        full = full.filter(value => {
          // console.log(value.symbol);
          return value.symbol !== symbol;
        });
        // console.log(full);
        symbol = "";
        this.setState({ symbols: symbols, symbol: symbol, historical: newHist, full: full });
      }

    });

    /**
     * Get the symbols from the server
     */
    var full = [];
    var url = window.location.origin + '/api/quotes';
    $.ajax({
      url: url,
      method: 'GET',
      dataType: 'json'
    }).then(list => {
      // console.log('Got Symbol List');
      // console.log(list);
      full = list;
      var symbols = list.map(value => {
        // console.log(value);
        return value.symbol;
      });

      this.setState({ symbols, symbol: "", primus: primus, historical: {}, full: full });

    });
  }

  render() {
    // console.log('Main this.state');
    // console.log(this.state);

    var quotes, stocks, chart, colors, data = null;

    if (this.state === null || this.state.symbols.length === 0) {
      quotes = null;
      stocks = null;
    } else {
      colors = getColors(this.state.symbols.length);
      // console.log(colors);
      quotes = <GetQuote symbols={this.state.symbols} symbol={this.state.symbol} cb={this.callBack} />;
      stocks = <ListStocks stocks={this.state.full} symbols={this.state.symbols} colors={colors} hist={this.state.historical} cb={this.callBack} />;
    }

    if (this.state === null || this.state.historical.length === 0) {
      // console.log('setting chart to null');
      chart = null;
    } else {
      // console.log('setting chart data');
      /**
       * LineAndScatterChart only accepts an array
       *  so put the object into and array
       */
      data = [this.state.historical];
      chart = <FilterData data={data} colors={colors} />
    }

    return (
      <div className="container-fluid">
        <div id='header' >
          <div className="row">
            <div className="col-sm-12">
              <h4>STOCKS</h4>
            </div>
          </div>
        </div>
        {chart}
        <div id='stocks' >
          {quotes}
          <form>
            <input type="text" id="echo" placeholder="Enter a Stock Symbol" />
            <button type="submit" className='submit' onClick={this.handleClick}>Enter</button>
          </form>
          {stocks}
        </div>
      </div>
    )
  }
}

const ListStocks = React.createClass({
  handleClick(e) {
    e.preventDefault();
    // console.log('handleClick');
    // console.log('del:' + e.target.id);
    // var symbols = this.props.symbols.filter((value, key) => {
    //   return value !== e.target.id;
    // });
    this.props.cb('del', e.target.id);
  },
  render() {
    // console.log('ListStocks');
    // console.log(this.props);
    // console.log(Object.keys(this.props.hist).length);
    // var list = null;
    if (Object.keys(this.props.hist).length === 0) {
      var list = null;
    } else {
      var list = this.props.stocks.map((value, key) => {
        // console.log(key);
        // console.log('background-color:' + this.props.colors.c[key] + ';');
        var color = this.props.colors.c[key];
        var style = { 'backgroundColor': color }
        // style="property:value;"
        return (
          <button
            onClick={this.handleClick}
            id={value['symbol']}
            key={key}
            style={style}
            className="btn">
            <span
              className="glyphicon glyphicon-remove-sign"
              aria-hidden="true">
            </span> {value['symbol'] + ' : ' + value['name']}
          </button>
        )
      });
    }

    // console.log(list);
    return (
      <div className="list-group">
        {list}
      </div>
    );
  }
});

const GetQuote = React.createClass({
  getData(symbols, type) {
    // console.log('GetQuote getData');
    // console.log(type);
    // console.log(symbols);

    var url, dates,
      data = {},
      header = {};

    dates = getDates();
    data = { symbols: symbols, dates: dates };
    // console.log(data);
    url = window.location.origin + '/api/quotes';
    header.url = url;
    header.method = 'POST';
    header.data = JSON.stringify(data);
    header.contentType = "application/json";
    header.dataType = 'json';
    // console.log(header);


    /**
     * Get data from server
     */
    $.ajax(header).then(results => {
      // console.log('GetQuote got historical');
      // console.log(results);
      this.props.cb(type, results);
    });

    /**
     * Using Mock Data
     */
    // setTimeout(() => {
    //   var results = getMockData();
    //   this.props.cb('historical', results);
    // }, 1000)


  },
  componentWillMount() {
    // console.log('getQuote componentWillMount');
    /**
     * TODO: For test only use the for loop when finished
     */

    this.getData(this.props.symbols, 'historical');

  },
  render() {
    // console.log('GetQuote render');
    // console.log('symbols');
    // console.log(this.props.symbols);
    // console.log('symbol');
    // console.log(this.props.symbol);
    if (this.props.symbol !== '') {
      // console.log('mock get data');
      // var symbol = [this.props.symbol];
      this.getData([this.props.symbol], 'add');
    }
    return (null);
  }
});

const FilterData = React.createClass({
  getInitialState() {
    var data;
    if (this.props.data !== null) {
      data = this.props.data;
    } else {
      data = [];
    }
    // console.log('FilterData getInitialState data');
    // console.log(data);
    return { data: data };
  },
  componentWillReceiveProps(newProps) {
    // console.log('componentWillReceiveProps');
    // console.log(newProps);
    if (newProps.data !== null) {
      this.setState({ data: newProps.data });
    }
  },
  clickH(e) {
    // console.log('FilterData filter');
    // console.log(e.target.id);
    /**
     * Get the last date to start calculations
     */
    this.setState({ filter: e.target.id });
    // console.log(this.state.data);
  },
  filter() {
    var filter = this.state.filter;
    // console.log(typeof filter);
    // console.log(filter);
    if (filter === undefined || filter === '12') {
      // console.log('full data or unfiltered');
      var filtered = this.state.data;
    } else {
      // var arrLen = this.state.data.length;
      var data = this.state.data[0];
      var keys = Object.keys(data);
      var dates = getDates();
      // console.log('filter: ' + filter);
      // console.log(typeof filter);
      // console.log('arrLen: ' + arrLen);
      // console.log(keys);
      var day = 86400000;
      var start = new Date(dates.end), duration;
      // console.log(start);
      switch (filter) {
        case '1':
          // console.log('one month');
          duration = day * 30;
          break;
        case '3':
          // console.log('3 months');
          duration = day * 90;
          break;
        case '6':
          // console.log('six months');
          duration = day * 180;
          break;
        default:
          break;
      }
      // console.log(duration);
      start = start - duration;
      // console.log(start);
      // console.log(new Date(start));
      var test, newObj = {};
      keys.forEach((value, key) => {
        // console.log(value);
        newObj[value] = [];
        // console.log(newObj);
        // var tmp = [];
        var tmp = data[value].filter((value, key) => {
          var tmpDate = new Date(value.date);
          var diff = tmpDate - start;
          if (diff >= 0) {
            // console.log(value);
            return value;
          }

        });
        // console.log(tmp);
        newObj[value] = tmp;
      });
      // console.log('new obj');
      // console.log(newObj);
      var filtered = [newObj];
    }
    // console.log(filtered);
    return filtered;

  },
  render() {
    // console.log('FilterData render');
    // console.log('props');
    // console.log(this.props);
    // console.log('state');
    // console.log(this.state);
    var labels = [1, 3, 6, 12],
      chart, list, dates, colors;

    list = labels.map((value, key) => {
      var label = value + "M";

      return (
        <button
          onClick={this.clickH}
          id={value}
          key={key}
          className="btn btn-xs btn-warning filter">
          {label}
        </button>
      )
    });
    // console.log('data keys');
    // console.log(this.state.data[0]);
    // console.log(Object.keys(this.state.data[0]).length);
    if (this.state.data === null || Object.keys(this.state.data[0]).length === 0) {
      // console.log('null chart');
      chart = null;
      dates = null;
    } else {
      // console.log('LineAndScatterChart');

      // var ratio = 1;
      // var width = 1000;
      var type = "svg"

      /**
       * Use the filtered data
       */
      var data = this.filter();

      // console.log('filtered data');
      // console.log(data[0]);
      // console.log(data[0][Object.keys(data[0])[0]].length);
      var end = data[0][Object.keys(data[0])[0]].length - 1;
      // console.log(data[0][Object.keys(data[0])[0]][0].date);
      var startDate = data[0][Object.keys(data[0])[0]][0].date.split('T')[0];
      // console.log(data[0][Object.keys(data[0])[0]][end].date);
      var endDate = data[0][Object.keys(data[0])[0]][end].date.split('T')[0];
      // console.log(startDate.split('T')[0]);
      // console.log(endDate);
      // console.log(Object.keys(data[0]).length);

      // colors = getColors(Object.keys(data[0]).length);
      colors = this.props.colors;

      dates = (
        <span className='dates'>
          <div className="pull-left btn-xs btn-success date">Start: {startDate}</div>
          <div className="pull-left btn-xs btn-danger date">End: {endDate}</div>
        </span>
      );
      // chart = <LineAndScatterChart data={data} type={type} ratio={ratio} width={width} />
      chart = <LineAndScatterChart data={data} type={type} colors={colors} />
    }

    return (
      <div id='chart'>
        <div>
          {list}
          {dates}
        </div>
        {chart}
      </div>
    );
  }
});

const About = React.createClass({
  render() {
    return (
      <Body title="App Name Here">
        <p className='about bg-warning'>
          This web site is for the <a href="https://www.freecodecamp.com" target="_blank">freeCodeCamp </a>
          Dynamic Web Applications Project:
          {/*<a href="https://www.freecodecamp.com/challenges/build-a-voting-app" target="_blank"> Build a Voting App</a>.*/}
          <br></br>
          <br></br>
          It is a full stack web application that uses
          <a href="https://www.mongodb.com/" target="_blank"> mongoDB </a>
          for the back end database,
          <a href="https://nodejs.org" target="_blank"> Node.js </a>
          for the web server and
          <a href="https://facebook.github.io/react/" target="_blanks"> React.js </a>
          to render html in the client browser.
          <br></br>
          <br></br>
          The app also uses
          <a href="http://getbootstrap.com" target="_blank"> Bootstrap </a>
          for the style sheets and
          <a href="http://www.chartjs.org" target="_blank"> Chart.js </a> to render the data in a bar chart.
          <br></br>
          <br></br>
          <span id='warning'>
            This application is for educational purposes only.  Any and all data may be removed at anytime without warning.
          </span>
        </p>
        <div id="credits">
          <div>
            <span className="credit">Created By: </span>
            <a className='link' href="https://github.com/j-steve-martinez" target="_blank">
              J. Steve Martinez
            </a>
          </div>
          <div>
            <div className="credit">Heroku:</div>
            {/*<a className='link' href="https://vote-machine-jsm.herokuapp.com/">
              https://vote-machine-jsm.herokuapp.com
            </a>*/}
          </div>
          <div>
            <div className="credit">GitHub:</div>
            {/*<a className='link' href="https://github.com/j-steve-martinez/vote-machine">
              https://github.com/j-steve-martinez/vote-machine
            </a>*/}
          </div>
        </div>

      </Body>
    )
  }
});

const Tweet = React.createClass({
  componentDidMount() {
    // console.log(this.props.poll);
    var id = this.props.poll._id;
    var name = 'New Poll: ' + this.props.poll.name;
    var url = window.location.href + '?poll=' + id;
    var elem = document.getElementById('twit-share');
    var data = {};
    data.text = name;
    data.size = 'large';
    twttr.widgets.createShareButton(url, elem, data);
  },
  render() {
    return <a id='twit-share'></a>
  }
});

ReactDOM.render(
  <Main />,
  document.getElementById('content')
);
'use strict'
var React = require('react');
var ReactDOM = require('react-dom');
var rd3 = require('rd3');
// var Markit = require('../controller/Markit.js');
// console.log(Markit);
// https://api.robinhood.com/quotes/historicals/FB/?interval=10minute&span=day
function BP(props) {
  const polls = props.polls;
  const cb = props.cb;
  const links = polls.map((poll) =>
    <div className="panel-body bg-warning" key={poll._id.toString()}><NavLink
      to={'/api/poll/' + poll._id}
      cb={cb} >
      {poll.name}
    </NavLink></div>
  );
  return (
    <span>
      {links}
    </span>

  );
}

function NewPollResults(props) {
  let items = props.items;
  let title = items[0];
  let poll = items.filter((value, key) => {
    if (key > 0) {
      return value;
    }
  });
  let listItems = poll.map((value, key) =>
    <li key={key.toString()}>
      {value}
    </li>
  );
  return (
    <div>
      <h4>{title}</h4>
      <ul>{listItems}</ul>
    </div>

  );
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  // console.log('Query variable %s not found', variable);
}

function getColors(num) {
  // console.log('getting colors');
  var data = { c: [], bg: [] };
  var myColors = Please.make_color({
    format: 'rgb',
    colors_returned: num
  });
  myColors.forEach(item => {
    var color = 'rgba(' + item.r + ', ' + item.g + ', ' + item.b + ', ' + '1)';
    var bg = 'rgba(' + item.r + ', ' + item.g + ', ' + item.b + ', ' + '0.2)';
    data.c.push(color);
    data.bg.push(bg);
  });
  // console.log(data);
  return data;
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    console.log('Main init');
    this.callBack = this.callBack.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    console.log('handleClick')
    e.preventDefault();

    var symbols,
      symbol,
      echo = document.getElementById('echo');

    symbols = this.state.symbols;
    symbol = echo.value.toUpperCase();

    /**
     * Check to see if symbol is already in list
     * if not update symbols array
     * and set new state
     */
    if (symbols.indexOf(symbol) === -1 && symbol !== '') {

      symbols.push(symbol);

      /**
       * Write the typed message to the server.
       */
      this.state.primus.write(echo.value.toUpperCase());

      this.setState({ symbols: symbols, symbol: symbol })
    }
    echo.value = '';


  }
  callBack(type, data) {
    console.log('Main callBack called');
    console.log('type ' + type);
    console.log(data);
    /**
     * Possible type values:
     * symbol
     * symbols
     * tickers
     */
    switch (type) {
      case 'symbols':
        this.setState({ symbols: data, symbol: '' })
        break;
      case 'symbol':
        this.setState({ symbol: data })
        break;
      case 'tickers':
        this.setState({ tickers: data, symbol: '' })
        break;
      default:
        console.log('Something went wrong');
        console.log(type);
        console.log(data);
        break;
    }

  }
  componentDidMount() {
    // console.log('Main componentDidMount');

    /**
     * Listen for incoming data and log it in our textarea.
     */
    // var output = document.getElementById('output');
    // this.state.primus.on('data', function received(data) {
    //   output.value += data + '\n';
    // });
  }
  componentWillMount() {
    console.log('Main componentWillMount');
    /**
     * Tell primus to create a new connect to the current domain/port/protocol
    */
    var primus = new Primus();

    /**
     * Get the symbols from the server
     */

    /**
     * This is a mockup will be replaced later with a ajax call
     */
    var symbols = ['FB', 'GOOG', 'APPL'];
    this.setState({ primus, symbols: symbols, symbol: "" });

  }
  render() {
    console.log('Main this.state');
    console.log(this.state);
    return (
      <div className="container">
        <div className="jumbotron">
          <div className="row">
            <div className="col-sm-12">
              <h1>Stock Watcher</h1>
              {/*<div id="chart" className="jumbotron" ></div>*/}
            </div>
          </div>
        </div>
        <div>
          <form>
            <input type="text" id="echo" placeholder="Enter a Stock Symbol" />
            <button type="submit" className='btn btn-success btn-sm' onClick={this.handleClick}>Enter</button>
          </form>
          <ListStocks symbols={this.state.symbols} cb={this.callBack} />
          <GetQuote symbols={this.state.symbols} symbol={this.state.symbol} cb={this.callBack} />
        </div>
        <div className='chart-container' >
          <Chart />
        </div>
      </div>
    )
  }
}

const ListStocks = React.createClass({
  handleClick(e) {
    e.preventDefault();
    console.log('handleClick');
    console.log(e.target.id);
    var symbols = this.props.symbols.filter((value, key) => {
      return value !== e.target.id;
    });
    this.props.cb('symbols', symbols);
  },
  render() {
    console.log('ListStocks');
    console.log(this.props);
    var list = this.props.symbols.map((value, key) => {
      return (
        <button
          onClick={this.handleClick}
          id={value} 
          key={key}
          className="btn btn-info">
          <span
            className="glyphicon glyphicon-remove-sign"
            aria-hidden="true">
          </span> {value}
        </button>
      )
    });
    console.log(list);
    return (
      <div className="list-group">
        {list}
      </div>
    );
  }
});

const Chart = React.createClass({
  render() {
    var LineChart = rd3.LineChart
    var lineData = [
      {
        name: 'series1',
        values: [{ x: 0, y: 20 }, { x: 1, y: 30 }, { x: 2, y: 10 }, { x: 3, y: 5 }, { x: 4, y: 8 }, { x: 5, y: 15 }, { x: 6, y: 10 }],
        strokeWidth: 3,
        strokeDashArray: "5,5",
      },
      {
        name: 'series2',
        values: [{ x: 0, y: 8 }, { x: 1, y: 5 }, { x: 2, y: 20 }, { x: 3, y: 12 }, { x: 4, y: 4 }, { x: 5, y: 6 }, { x: 6, y: 2 }]
      },
      {
        name: 'series3',
        values: [{ x: 0, y: 0 }, { x: 1, y: 5 }, { x: 2, y: 8 }, { x: 3, y: 2 }, { x: 4, y: 6 }, { x: 5, y: 4 }, { x: 6, y: 2 }]
      }
    ];
    return (
      <LineChart
        legend={true}
        data={lineData}
        width='100%'
        height={400}
        viewBoxObject={{
          x: 0,
          y: 0,
          width: 500,
          height: 400
        }}
        title="Line Chart"
        yAxisLabel="Altitude"
        xAxisLabel="Elapsed Time (sec)"
        domain={{ x: [, 6], y: [-10,] }}
        gridHorizontal={true}
      />
    )
  }
});

const GetQuote = React.createClass({
  getData(symbol) {
    var base = 'https://api.robinhood.com/quotes/historicals/';
    var interval = '/?interval=10minute&span=day';
    // var urls = [];
    var url = base + symbol + interval;

    console.log(url);
    var quote = {
      "quote": "https://api.robinhood.com/quotes/MS/", "symbol": "MS", "interval": "10minute", "span": "day", "bounds": "regular", "previous_close_price": "42.1300", "open_price": "43.0900", "open_time": "2017-02-03T14:30:00Z", "instrument": "https://api.robinhood.com/instruments/75f435f0-0d44-44a4-bd14-ac2eba5badea/", "historicals": [{ "begins_at": "2017-02-03T14:30:00Z", "open_price": "43.0900", "close_price": "43.0500", "high_price": "43.1800", "low_price": "42.9200", "volume": 205255, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T14:40:00Z", "open_price": "43.0450", "close_price": "43.2601", "high_price": "43.2800", "low_price": "43.0100", "volume": 496418, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T14:50:00Z", "open_price": "43.2650", "close_price": "43.5200", "high_price": "43.5200", "low_price": "43.2650", "volume": 257254, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T15:00:00Z", "open_price": "43.5100", "close_price": "43.5700", "high_price": "43.6600", "low_price": "43.4400", "volume": 154462, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T15:10:00Z", "open_price": "43.5700", "close_price": "43.5100", "high_price": "43.6100", "low_price": "43.4300", "volume": 114364, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T15:20:00Z", "open_price": "43.5200", "close_price": "43.7000", "high_price": "43.7400", "low_price": "43.4993", "volume": 144117, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T15:30:00Z", "open_price": "43.7000", "close_price": "43.7300", "high_price": "43.7453", "low_price": "43.6029", "volume": 93458, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T15:40:00Z", "open_price": "43.7400", "close_price": "43.8200", "high_price": "43.8200", "low_price": "43.7100", "volume": 112242, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T15:50:00Z", "open_price": "43.8200", "close_price": "43.9100", "high_price": "43.9300", "low_price": "43.7550", "volume": 159319, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T16 :00:00Z", "open_price": "43.9100", "close_price": "44.1334", "high_price": "44.1400", "low_price": "43.8850", "volume": 259733, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T16:10:00Z", "open_price": "44.1400", "close_price": "44.1550", "high_price": "44.2400", "low_price": "44.1000", "volume": 222836, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T16:20:00Z", "open_price": "44.1550", "close_price": "44.1500", "high_price": "44.1800", "low_price": "43.9950", "volume": 201216, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T16:30:00Z", "open_price": "44.1500", "close_price": "44.3450", "high_price": "44.3750", "low_price": "44.1400", "volume": 339468, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T16 :40:00Z", "open_price": "44.3450", "close_price": "44.2650", "high_price": "44.3500", "low_price": "44.1600", "volume": 286679, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T16:50:00Z", "open_price": "44.2600", "close_price": "44.2750", "high_price": "44.2950", "low_price": "44.2100", "volume": 101145, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T17:00:00Z", "open_price": "44.2850", "close_price": "44.3800", "high_price": "44.4137", "low_price": "44.2700", "volume": 141608, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T17:10:00Z", "open_price": "44.3800", "close_price": "44.4100", "high_price": "44.4600", "low_price": "44.3250", "volume": 138610, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T17 :20:00Z", "open_price": "44.4100", "close_price": "44.2600", "high_price": "44.4150", "low_price": "44.2350", "volume": 170131, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T17:30:00Z", "open_price": "44.2700", "close_price": "44.3150", "high_price": "44.3400", "low_price": "44.2650", "volume": 110492, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T17:40:00Z", "open_price": "44.3150", "close_price": "44.3400", "high_price": "44.3484", "low_price": "44.3000", "volume": 66772, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T17:50:00Z", "open_price": "44.3400", "close_price": "44.4400", "high_price": "44.4450", "low_price": "44.3300", "volume": 130393, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T18 :00:00Z", "open_price": "44.4422", "close_price": "44.4189", "high_price": "44.4700", "low_price": "44.3750", "volume": 124831, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T18:10:00Z", "open_price": "44.4196", "close_price": "44.4900", "high_price": "44.5400", "low_price": "44.4100", "volume": 160903, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T18:20:00Z", "open_price": "44.4900", "close_price": "44.4300", "high_price": "44.5600", "low_price": "44.4100", "volume": 131311, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T18:30:00Z", "open_price": "44.4350", "close_price": "44.4900", "high_price": "44.5150", "low_price": "44.4300", "volume": 72421, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T18 :40:00Z", "open_price": "44.4862", "close_price": "44.5136", "high_price": "44.5163", "low_price": "44.4500", "volume": 66857, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T18:50:00Z", "open_price": "44.5100", "close_price": "44.4929", "high_price": "44.5450", "low_price": "44.4700", "volume": 120009, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T19:00:00Z", "open_price": "44.4950", "close_price": "44.5000", "high_price": "44.5500", "low_price": "44.4900", "volume": 67163, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T19:10:00Z", "open_price": "44.5050", "close_price": "44.3900", "high_price": "44.5150", "low_price": "44.3810", "volume": 114827, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T19 :20:00Z", "open_price": "44.3850", "close_price": "44.3600", "high_price": "44.4150", "low_price": "44.3000", "volume": 132923, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T19:30:00Z", "open_price": "44.3550", "close_price": "44.4500", "high_price": "44.4850", "low_price": "44.3399", "volume": 152656, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T19:40:00Z", "open_price": "44.4600", "close_price": "44.4711", "high_price": "44.5100", "low_price": "44.4350", "volume": 53679, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T19:50:00Z", "open_price": "44.4700", "close_price": "44.5000", "high_price": "44.5000", "low_price": "44.4200", "volume": 57609, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T20 :00:00Z", "open_price": "44.5000", "close_price": "44.4750", "high_price": "44.5300", "low_price": "44.4345", "volume": 110797, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T20:10:00Z", "open_price": "44.4730", "close_price": "44.4900", "high_price": "44.5000", "low_price": "44.4350", "volume": 95394, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T20:20:00Z", "open_price": "44.4938", "close_price": "44.4700", "high_price": "44.5000", "low_price": "44.4600", "volume": 92586, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T20:30:00Z", "open_price": "44.4650", "close_price": "44.5564", "high_price": "44.5890", "low_price": "44.4500", "volume": 193732, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T20 :40:00Z", "open_price": "44.5550", "close_price": "44.5400", "high_price": "44.6000", "low_price": "44.5100", "volume": 340050, "session": "reg", "interpolated": false }, { "begins_at": "2017-02-03T20:50:00Z", "open_price": "44.5410", "close_price": "44.4400", "high_price": "44.5500", "low_price": "44.4300", "volume": 485053, "session": "reg", "interpolated": false }]
    };

    console.log(quote);
    this.props.cb('tickers', quote);
    /**
     * Uncomment later use mock data for now
     */
    // $.ajax({
    //   url: url,
    //   method: 'GET'//,
    //   dataType : 'json'
    // }).then(quote => {
    //   console.log('Got Quote');
    //   console.log(quote);
    // })
  },
  componentWillMount() {
    /**
     * TODO: For test only use the for loop when finished
     */
    console.log('mock getting data');
    // this.getData(this.props.symbols[0]);

    // this.props.symbols.forEach((symbol) => {
    // this.getData(symbol);
    // });
  },
  render() {
    console.log('GetQuote');
    console.log(this.props.symbols);
    console.log(this.props.symbol);
    if (this.props.symbol !== '') {
      console.log('mock get data');
      this.getData(this.props.symbol);
    }
    return (null);
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


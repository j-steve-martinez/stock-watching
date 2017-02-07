'use strict'
var React = require('react');
var ReactDOM = require('react-dom');
var rd3 = require('rd3');
// var yahooFinance = require('yahoo-finance');

// https://api.robinhood.com/quotes/historicals/FB/?interval=10minute&span=day


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
    this.optimusPrime = this.optimusPrime.bind(this);
  }
  handleClick(e) {
    console.log('handleClick')
    e.preventDefault();

    var message, symbol,
      /**
       * Get the symbol list
       */
      symbols = this.state.symbols,
      /**
       * Get a reference to the html input
       */
      echo = document.getElementById('echo');

    /**
     * Get the value from the form
     */
    symbol = echo.value.toUpperCase();

    /**
     * Update the clients
     */
    this.optimusPrime(symbol);

    // /**
    //  * Add or delete the symbols from the list
    //  */
    // if (symbols.indexOf(symbol) === -1 && symbol !== '') {
    //   /**
    //    * Add the symbol to the list
    //    */
    //   symbols.push(symbol);

    //   /**
    //    * Notify the server to update all clients
    //    */
    //   message = 'add:' + symbol;
    //   this.state.primus.write(message);

    //   /**
    //    * Update the app
    //    */
    //   this.setState({ symbols: symbols, symbol: symbol });

    // } else if (symbols.indexOf(symbol) >= 0 && symbol !== '') {
    //   console.log('Attempting delete of symbol ' + symbol);
    //   /**
    //    * Remove the symbol from the list
    //    */
    //   var symbols = symbols.filter(valeu => {
    //     return value != symbol;
    //   });

    //   /**
    //    * Notify the server to update all clients
    //    */
    //   message = 'del:' + symbol;
    //   this.state.primus.write(message);

    //   /**
    //    * Update the app
    //    */
    //   this.setState({ symbols: symbols, symbol: '' })
    // }

    /**
     * Clear the current entry in the form;
     */
    echo.value = '';
  }

  optimusPrime(symbol) {
    var message;
 
    /**
     * Get the symbols list
     */
    var symbols = this.state.symbols;

    /**
     * Add or delete the symbols from the list
     */
    if (symbols.indexOf(symbol) === -1 && symbol !== '') {
      /**
       * Add the symbol to the list
       */
      symbols.push(symbol);

      /**
       * Notify the server to update all clients
       */
      message = 'add:' + symbol;
      this.state.primus.write(message);

      /**
       * Update the app
       */
      this.setState({ symbols: symbols, symbol: symbol });

    } else if (symbols.indexOf(symbol) >= 0 && symbol !== '') {
      console.log('Attempting delete of symbol ' + symbol);
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
       * Update the app
       */
      this.setState({ symbols: symbols, symbol: '' })
    }
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
      case 'del':
        this.optimusPrime(data);
        // console.log();
        // var symbol = data;
        // if (this.state.symbols.indexOf(symbol) >= 0 && symbol !== '') {
        //   console.log('Attempting delete of symbol ' + data);
        //   /**
        //    * Remove the symbol from the list
        //    */

        //   var symbols = this.state.symbols.filter(value => {
        //     return value != symbol;
        //   });

        //   /**
        //    * Notify the server to update all clients
        //    */
        //   var message = 'del:' + symbol;
        //   this.state.primus.write(message);

        //   /**
        //    * Update the app
        //    */
        //   this.setState({ symbols: symbols, symbol: '' })
        // }
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
    var symbols = ['FB', 'GOOG', 'AAPL'];
    this.setState({ primus, symbols: symbols, symbol: "" });

  }

  render() {
    console.log('Main this.state');
    console.log(this.state);
    console.log(this.props);
    var colors = getColors(5);
    console.log(colors);
    return (
      <div className="container">
        <div className="jumbotron">
          <div className="row">
            <div className="col-sm-12">
              <h1>Stock Watcher</h1>
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
    console.log('del:' + e.target.id);
    // var symbols = this.props.symbols.filter((value, key) => {
    //   return value !== e.target.id;
    // });
    // this.props.cb('symbols', symbols);
    this.props.cb('del', e.target.id);
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
  getData(symbols) {
    console.log('Main getData data');
    console.log(symbols);

    // var url,
    //   data = {},
    //   header = {};

    // data = { symbols: symbols };
    // url = window.location.origin + '/api/quotes';
    // header.url = url;
    // header.method = 'POST';
    // header.data = JSON.stringify(data);
    // header.contentType = "application/json";
    // header.dataType = 'json';
    // console.log(header);
    // $.ajax(header).then(results => {
    //   console.log('Main getQuote done');
    //   console.log(results);

    // });

    var test = getMockData();
    console.log(test);

    /**
     * Format the data to display in chart
     */
    // var historicals, hist, symbol, start, end, low, high, data;
    // historicals = quote.historicals;
    // start = historicals[0].begins_at;
    // end = historicals[historicals.length - 1].begins_at;
    // // low = historicals.sort()[0]
    // symbol = quote.symbol;
    // hist = historicals.map((value)=>{
    //   return value.close_price;
    // });
    // data = {
    //   symbol : symbol,
    //   hist : hist,
    //   start : start,
    //   end : end
    // };
    // console.log(quote);
    // console.log(historicals);
    // console.log(hist.sort());
    // console.log(symbol);
    // console.log(start);
    // console.log(end);
    // console.log(data);
    // this.props.cb('tickers', quote);
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

    this.getData(this.props.symbols);

  },
  render() {
    console.log('GetQuote');
    console.log(this.props.symbols);
    console.log(this.props.symbol);
    if (this.props.symbol !== '') {
      console.log('mock get data');
      // var symbol = [this.props.symbol];
      this.getData([this.props.symbol]);
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

function getMockData() {

  var mockData = {
    "MS": [
      {
        "date": "2016-01-04T05:00:00.000Z",
        "open": 30.700001,
        "high": 31.52,
        "low": 30.559999,
        "close": 31.48,
        "volume": 15749200,
        "adjClose": 30.587742,
        "symbol": "MS"
      },
      {
        "date": "2016-01-05T05:00:00.000Z",
        "open": 31.48,
        "high": 31.700001,
        "low": 30.93,
        "close": 31.280001,
        "volume": 9850500,
        "adjClose": 30.393412,
        "symbol": "MS"
      },
      {
        "date": "2016-01-06T05:00:00.000Z",
        "open": 30.629999,
        "high": 30.780001,
        "low": 30.25,
        "close": 30.5,
        "volume": 13057400,
        "adjClose": 29.63552,
        "symbol": "MS"
      },
      {
        "date": "2016-01-07T05:00:00.000Z",
        "open": 29.879999,
        "high": 30.07,
        "low": 28.780001,
        "close": 28.98,
        "volume": 18138200,
        "adjClose": 28.158602,
        "symbol": "MS"
      },
      {
        "date": "2016-01-08T05:00:00.000Z",
        "open": 29.41,
        "high": 29.49,
        "low": 28.299999,
        "close": 28.379999,
        "volume": 15295600,
        "adjClose": 27.575607,
        "symbol": "MS"
      },
      {
        "date": "2016-01-11T05:00:00.000Z",
        "open": 28.450001,
        "high": 28.6,
        "low": 27.809999,
        "close": 28.459999,
        "volume": 19414800,
        "adjClose": 27.65334,
        "symbol": "MS"
      },
      {
        "date": "2016-01-12T05:00:00.000Z",
        "open": 28.74,
        "high": 28.879999,
        "low": 28,
        "close": 28.459999,
        "volume": 16041800,
        "adjClose": 27.65334,
        "symbol": "MS"
      },
      {
        "date": "2016-01-13T05:00:00.000Z",
        "open": 28.73,
        "high": 28.799999,
        "low": 26.5,
        "close": 26.889999,
        "volume": 29721900,
        "adjClose": 26.12784,
        "symbol": "MS"
      },
      {
        "date": "2016-01-14T05:00:00.000Z",
        "open": 26.99,
        "high": 27.32,
        "low": 26.23,
        "close": 27.15,
        "volume": 23814500,
        "adjClose": 26.38047,
        "symbol": "MS"
      },
      {
        "date": "2016-01-15T05:00:00.000Z",
        "open": 26.030001,
        "high": 26.41,
        "low": 25.51,
        "close": 25.969999,
        "volume": 29462200,
        "adjClose": 25.233916,
        "symbol": "MS"
      },
      {
        "date": "2016-01-19T05:00:00.000Z",
        "open": 26.83,
        "high": 27.129999,
        "low": 25.76,
        "close": 26.26,
        "volume": 28788200,
        "adjClose": 25.515697,
        "symbol": "MS"
      },
      {
        "date": "2016-01-20T05:00:00.000Z",
        "open": 25.700001,
        "high": 25.77,
        "low": 24.67,
        "close": 25.24,
        "volume": 25940900,
        "adjClose": 24.524607,
        "symbol": "MS"
      },
      {
        "date": "2016-01-21T05:00:00.000Z",
        "open": 25.290001,
        "high": 25.59,
        "low": 24.690001,
        "close": 24.780001,
        "volume": 22130300,
        "adjClose": 24.077646,
        "symbol": "MS"
      },
      {
        "date": "2016-01-22T05:00:00.000Z",
        "open": 25.26,
        "high": 25.98,
        "low": 25.18,
        "close": 25.610001,
        "volume": 22498400,
        "adjClose": 24.884121,
        "symbol": "MS"
      },
      {
        "date": "2016-01-25T05:00:00.000Z",
        "open": 25.459999,
        "high": 25.51,
        "low": 24.940001,
        "close": 24.98,
        "volume": 20144600,
        "adjClose": 24.271976,
        "symbol": "MS"
      },
      {
        "date": "2016-01-26T05:00:00.000Z",
        "open": 25.040001,
        "high": 25.66,
        "low": 25.030001,
        "close": 25.49,
        "volume": 13362900,
        "adjClose": 24.767521,
        "symbol": "MS"
      },
      {
        "date": "2016-01-27T05:00:00.000Z",
        "open": 25.25,
        "high": 26.16,
        "low": 25.049999,
        "close": 25.370001,
        "volume": 19796300,
        "adjClose": 24.796845,
        "symbol": "MS"
      },
      {
        "date": "2016-01-28T05:00:00.000Z",
        "open": 25.67,
        "high": 25.84,
        "low": 24.940001,
        "close": 25.17,
        "volume": 16015600,
        "adjClose": 24.601362,
        "symbol": "MS"
      },
      {
        "date": "2016-01-29T05:00:00.000Z",
        "open": 25.35,
        "high": 25.889999,
        "low": 25.120001,
        "close": 25.879999,
        "volume": 18766500,
        "adjClose": 25.295321,
        "symbol": "MS"
      },
      {
        "date": "2016-02-01T05:00:00.000Z",
        "open": 25.780001,
        "high": 25.93,
        "low": 25.42,
        "close": 25.709999,
        "volume": 11177900,
        "adjClose": 25.129162,
        "symbol": "MS"
      },
      {
        "date": "2016-02-02T05:00:00.000Z",
        "open": 25.360001,
        "high": 25.360001,
        "low": 24.389999,
        "close": 24.5,
        "volume": 18326800,
        "adjClose": 23.946499,
        "symbol": "MS"
      },
      {
        "date": "2016-02-03T05:00:00.000Z",
        "open": 24.43,
        "high": 24.52,
        "low": 23.290001,
        "close": 24.32,
        "volume": 25132900,
        "adjClose": 23.770565,
        "symbol": "MS"
      },
      {
        "date": "2016-02-04T05:00:00.000Z",
        "open": 24.15,
        "high": 25.200001,
        "low": 24.120001,
        "close": 25.01,
        "volume": 17497500,
        "adjClose": 24.444977,
        "symbol": "MS"
      },
      {
        "date": "2016-02-05T05:00:00.000Z",
        "open": 25.09,
        "high": 25.42,
        "low": 24.18,
        "close": 24.35,
        "volume": 16106100,
        "adjClose": 23.799888,
        "symbol": "MS"
      },
      {
        "date": "2016-02-08T05:00:00.000Z",
        "open": 23.76,
        "high": 23.84,
        "low": 22.32,
        "close": 22.67,
        "volume": 24258700,
        "adjClose": 22.157842,
        "symbol": "MS"
      },
      {
        "date": "2016-02-09T05:00:00.000Z",
        "open": 21.889999,
        "high": 23.290001,
        "low": 21.76,
        "close": 22.93,
        "volume": 25642000,
        "adjClose": 22.411968,
        "symbol": "MS"
      },
      {
        "date": "2016-02-10T05:00:00.000Z",
        "open": 23.379999,
        "high": 23.780001,
        "low": 22.639999,
        "close": 22.700001,
        "volume": 21564200,
        "adjClose": 22.187165,
        "symbol": "MS"
      },
      {
        "date": "2016-02-11T05:00:00.000Z",
        "open": 21.67,
        "high": 22.129999,
        "low": 21.16,
        "close": 21.690001,
        "volume": 29160400,
        "adjClose": 21.199982,
        "symbol": "MS"
      },
      {
        "date": "2016-02-12T05:00:00.000Z",
        "open": 21.91,
        "high": 23.200001,
        "low": 21.860001,
        "close": 23.09,
        "volume": 22802200,
        "adjClose": 22.568353,
        "symbol": "MS"
      },
      {
        "date": "2016-02-16T05:00:00.000Z",
        "open": 24.07,
        "high": 24.139999,
        "low": 23.209999,
        "close": 23.719999,
        "volume": 20565500,
        "adjClose": 23.18412,
        "symbol": "MS"
      },
      {
        "date": "2016-02-17T05:00:00.000Z",
        "open": 24.219999,
        "high": 24.67,
        "low": 24.120001,
        "close": 24.23,
        "volume": 19226500,
        "adjClose": 23.682598,
        "symbol": "MS"
      },
      {
        "date": "2016-02-18T05:00:00.000Z",
        "open": 24.360001,
        "high": 24.540001,
        "low": 23.780001,
        "close": 23.959999,
        "volume": 17521200,
        "adjClose": 23.418697,
        "symbol": "MS"
      },
      {
        "date": "2016-02-19T05:00:00.000Z",
        "open": 23.780001,
        "high": 24.190001,
        "low": 23.639999,
        "close": 24,
        "volume": 12986200,
        "adjClose": 23.457795,
        "symbol": "MS"
      },
      {
        "date": "2016-02-22T05:00:00.000Z",
        "open": 24.4,
        "high": 24.74,
        "low": 24.33,
        "close": 24.540001,
        "volume": 12182000,
        "adjClose": 23.985596,
        "symbol": "MS"
      },
      {
        "date": "2016-02-23T05:00:00.000Z",
        "open": 24.450001,
        "high": 24.49,
        "low": 23.68,
        "close": 23.709999,
        "volume": 14728800,
        "adjClose": 23.174345,
        "symbol": "MS"
      },
      {
        "date": "2016-02-24T05:00:00.000Z",
        "open": 23.16,
        "high": 23.709999,
        "low": 22.68,
        "close": 23.709999,
        "volume": 20271400,
        "adjClose": 23.174345,
        "symbol": "MS"
      },
      {
        "date": "2016-02-25T05:00:00.000Z",
        "open": 23.799999,
        "high": 24.68,
        "low": 23.77,
        "close": 24.629999,
        "volume": 17568600,
        "adjClose": 24.073561,
        "symbol": "MS"
      },
      {
        "date": "2016-02-26T05:00:00.000Z",
        "open": 25,
        "high": 25.67,
        "low": 24.780001,
        "close": 25.16,
        "volume": 19258000,
        "adjClose": 24.591588,
        "symbol": "MS"
      },
      {
        "date": "2016-02-29T05:00:00.000Z",
        "open": 25.01,
        "high": 25.15,
        "low": 24.67,
        "close": 24.700001,
        "volume": 13301500,
        "adjClose": 24.141981,
        "symbol": "MS"
      },
      {
        "date": "2016-03-01T05:00:00.000Z",
        "open": 25.09,
        "high": 26.120001,
        "low": 25.059999,
        "close": 26.09,
        "volume": 17197000,
        "adjClose": 25.500578,
        "symbol": "MS"
      },
      {
        "date": "2016-03-02T05:00:00.000Z",
        "open": 26,
        "high": 26.290001,
        "low": 25.83,
        "close": 26.110001,
        "volume": 16119300,
        "adjClose": 25.520126,
        "symbol": "MS"
      },
      {
        "date": "2016-03-03T05:00:00.000Z",
        "open": 26.1,
        "high": 26.190001,
        "low": 25.809999,
        "close": 26.139999,
        "volume": 11515400,
        "adjClose": 25.549447,
        "symbol": "MS"
      },
      {
        "date": "2016-03-04T05:00:00.000Z",
        "open": 26.26,
        "high": 26.5,
        "low": 25.91,
        "close": 26.129999,
        "volume": 13629400,
        "adjClose": 25.539673,
        "symbol": "MS"
      },
      {
        "date": "2016-03-07T05:00:00.000Z",
        "open": 25.84,
        "high": 26.33,
        "low": 25.700001,
        "close": 26.09,
        "volume": 9835300,
        "adjClose": 25.500578,
        "symbol": "MS"
      },
      {
        "date": "2016-03-08T05:00:00.000Z",
        "open": 25.700001,
        "high": 25.860001,
        "low": 24.940001,
        "close": 25.01,
        "volume": 21715100,
        "adjClose": 24.444977,
        "symbol": "MS"
      },
      {
        "date": "2016-03-09T05:00:00.000Z",
        "open": 25.200001,
        "high": 25.26,
        "low": 24.440001,
        "close": 24.610001,
        "volume": 23542300,
        "adjClose": 24.054014,
        "symbol": "MS"
      },
      {
        "date": "2016-03-10T05:00:00.000Z",
        "open": 24.91,
        "high": 25.15,
        "low": 24.450001,
        "close": 24.65,
        "volume": 20117300,
        "adjClose": 24.09311,
        "symbol": "MS"
      },
      {
        "date": "2016-03-11T05:00:00.000Z",
        "open": 25.15,
        "high": 26.09,
        "low": 25.110001,
        "close": 26,
        "volume": 24457300,
        "adjClose": 25.412611,
        "symbol": "MS"
      },
      {
        "date": "2016-03-14T04:00:00.000Z",
        "open": 25.83,
        "high": 26.07,
        "low": 25.66,
        "close": 25.91,
        "volume": 17603300,
        "adjClose": 25.324644,
        "symbol": "MS"
      },
      {
        "date": "2016-03-15T04:00:00.000Z",
        "open": 25.629999,
        "high": 25.690001,
        "low": 25.120001,
        "close": 25.43,
        "volume": 15900500,
        "adjClose": 24.855489,
        "symbol": "MS"
      },
      {
        "date": "2016-03-16T04:00:00.000Z",
        "open": 25.299999,
        "high": 25.790001,
        "low": 24.709999,
        "close": 25.16,
        "volume": 17841100,
        "adjClose": 24.591588,
        "symbol": "MS"
      },
      {
        "date": "2016-03-17T04:00:00.000Z",
        "open": 25.01,
        "high": 26.030001,
        "low": 24.58,
        "close": 25.85,
        "volume": 20718900,
        "adjClose": 25.266,
        "symbol": "MS"
      },
      {
        "date": "2016-03-18T04:00:00.000Z",
        "open": 26.049999,
        "high": 26.549999,
        "low": 25.98,
        "close": 26.280001,
        "volume": 24032000,
        "adjClose": 25.686286,
        "symbol": "MS"
      },
      {
        "date": "2016-03-21T04:00:00.000Z",
        "open": 26.17,
        "high": 26.610001,
        "low": 25.860001,
        "close": 25.940001,
        "volume": 10054000,
        "adjClose": 25.353967,
        "symbol": "MS"
      },
      {
        "date": "2016-03-22T04:00:00.000Z",
        "open": 25.610001,
        "high": 26.02,
        "low": 25.450001,
        "close": 25.84,
        "volume": 13623900,
        "adjClose": 25.256226,
        "symbol": "MS"
      },
      {
        "date": "2016-03-23T04:00:00.000Z",
        "open": 25.83,
        "high": 25.870001,
        "low": 25.200001,
        "close": 25.27,
        "volume": 10430600,
        "adjClose": 24.699103,
        "symbol": "MS"
      },
      {
        "date": "2016-03-24T04:00:00.000Z",
        "open": 24.940001,
        "high": 24.940001,
        "low": 24.290001,
        "close": 24.93,
        "volume": 15777900,
        "adjClose": 24.366785,
        "symbol": "MS"
      },
      {
        "date": "2016-03-28T04:00:00.000Z",
        "open": 24.98,
        "high": 25.07,
        "low": 24.68,
        "close": 24.719999,
        "volume": 9540200,
        "adjClose": 24.161528,
        "symbol": "MS"
      },
      {
        "date": "2016-03-29T04:00:00.000Z",
        "open": 24.559999,
        "high": 24.809999,
        "low": 24.120001,
        "close": 24.780001,
        "volume": 13927200,
        "adjClose": 24.220174,
        "symbol": "MS"
      },
      {
        "date": "2016-03-30T04:00:00.000Z",
        "open": 24.959999,
        "high": 25.43,
        "low": 24.76,
        "close": 25.07,
        "volume": 11502400,
        "adjClose": 24.503621,
        "symbol": "MS"
      },
      {
        "date": "2016-03-31T04:00:00.000Z",
        "open": 24.91,
        "high": 25.540001,
        "low": 24.889999,
        "close": 25.01,
        "volume": 15492000,
        "adjClose": 24.444977,
        "symbol": "MS"
      },
      {
        "date": "2016-04-01T04:00:00.000Z",
        "open": 24.889999,
        "high": 25.68,
        "low": 24.620001,
        "close": 25.530001,
        "volume": 15484800,
        "adjClose": 24.95323,
        "symbol": "MS"
      },
      {
        "date": "2016-04-04T04:00:00.000Z",
        "open": 25.49,
        "high": 25.51,
        "low": 24.91,
        "close": 25.040001,
        "volume": 11408300,
        "adjClose": 24.4743,
        "symbol": "MS"
      },
      {
        "date": "2016-04-05T04:00:00.000Z",
        "open": 24.629999,
        "high": 24.700001,
        "low": 24.24,
        "close": 24.379999,
        "volume": 12860000,
        "adjClose": 23.829209,
        "symbol": "MS"
      },
      {
        "date": "2016-04-06T04:00:00.000Z",
        "open": 24.34,
        "high": 24.73,
        "low": 24.27,
        "close": 24.42,
        "volume": 14982000,
        "adjClose": 23.868306,
        "symbol": "MS"
      },
      {
        "date": "2016-04-07T04:00:00.000Z",
        "open": 24.23,
        "high": 24.309999,
        "low": 23.51,
        "close": 23.719999,
        "volume": 17145400,
        "adjClose": 23.18412,
        "symbol": "MS"
      },
      {
        "date": "2016-04-08T04:00:00.000Z",
        "open": 24.01,
        "high": 24.18,
        "low": 23.66,
        "close": 23.75,
        "volume": 10000600,
        "adjClose": 23.213443,
        "symbol": "MS"
      },
      {
        "date": "2016-04-11T04:00:00.000Z",
        "open": 23.9,
        "high": 24.440001,
        "low": 23.870001,
        "close": 24.110001,
        "volume": 12107600,
        "adjClose": 23.56531,
        "symbol": "MS"
      },
      {
        "date": "2016-04-12T04:00:00.000Z",
        "open": 24.219999,
        "high": 24.85,
        "low": 24.18,
        "close": 24.58,
        "volume": 14947800,
        "adjClose": 24.024691,
        "symbol": "MS"
      },
      {
        "date": "2016-04-13T04:00:00.000Z",
        "open": 25.030001,
        "high": 25.879999,
        "low": 24.98,
        "close": 25.879999,
        "volume": 18251000,
        "adjClose": 25.295321,
        "symbol": "MS"
      },
      {
        "date": "2016-04-14T04:00:00.000Z",
        "open": 25.74,
        "high": 26.26,
        "low": 25.66,
        "close": 26.17,
        "volume": 18678400,
        "adjClose": 25.57877,
        "symbol": "MS"
      },
      {
        "date": "2016-04-15T04:00:00.000Z",
        "open": 26.309999,
        "high": 26.370001,
        "low": 25.709999,
        "close": 25.76,
        "volume": 14899900,
        "adjClose": 25.178033,
        "symbol": "MS"
      },
      {
        "date": "2016-04-18T04:00:00.000Z",
        "open": 26.18,
        "high": 26.200001,
        "low": 25.530001,
        "close": 25.73,
        "volume": 29605100,
        "adjClose": 25.14871,
        "symbol": "MS"
      },
      {
        "date": "2016-04-19T04:00:00.000Z",
        "open": 25.860001,
        "high": 26.49,
        "low": 25.799999,
        "close": 26.459999,
        "volume": 23006500,
        "adjClose": 25.862218,
        "symbol": "MS"
      },
      {
        "date": "2016-04-20T04:00:00.000Z",
        "open": 26.48,
        "high": 27.48,
        "low": 26.42,
        "close": 27.41,
        "volume": 24836300,
        "adjClose": 26.790756,
        "symbol": "MS"
      },
      {
        "date": "2016-04-21T04:00:00.000Z",
        "open": 27.35,
        "high": 27.879999,
        "low": 27.15,
        "close": 27.26,
        "volume": 16579300,
        "adjClose": 26.644145,
        "symbol": "MS"
      },
      {
        "date": "2016-04-22T04:00:00.000Z",
        "open": 27.32,
        "high": 27.82,
        "low": 27.290001,
        "close": 27.700001,
        "volume": 19084100,
        "adjClose": 27.074205,
        "symbol": "MS"
      },
      {
        "date": "2016-04-25T04:00:00.000Z",
        "open": 27.530001,
        "high": 27.709999,
        "low": 27.23,
        "close": 27.530001,
        "volume": 11748800,
        "adjClose": 26.908046,
        "symbol": "MS"
      },
      {
        "date": "2016-04-26T04:00:00.000Z",
        "open": 27.51,
        "high": 27.67,
        "low": 27.33,
        "close": 27.549999,
        "volume": 13779800,
        "adjClose": 26.927593,
        "symbol": "MS"
      },
      {
        "date": "2016-04-27T04:00:00.000Z",
        "open": 27.33,
        "high": 27.83,
        "low": 27.190001,
        "close": 27.530001,
        "volume": 12481700,
        "adjClose": 27.055353,
        "symbol": "MS"
      },
      {
        "date": "2016-04-28T04:00:00.000Z",
        "open": 27.23,
        "high": 27.82,
        "low": 27.08,
        "close": 27.23,
        "volume": 11096600,
        "adjClose": 26.760524,
        "symbol": "MS"
      },
      {
        "date": "2016-04-29T04:00:00.000Z",
        "open": 27.01,
        "high": 27.24,
        "low": 26.860001,
        "close": 27.059999,
        "volume": 15477400,
        "adjClose": 26.593455,
        "symbol": "MS"
      },
      {
        "date": "2016-05-02T04:00:00.000Z",
        "open": 27.1,
        "high": 27.52,
        "low": 26.84,
        "close": 27.26,
        "volume": 14987500,
        "adjClose": 26.790007,
        "symbol": "MS"
      },
      {
        "date": "2016-05-03T04:00:00.000Z",
        "open": 26.879999,
        "high": 26.91,
        "low": 26.34,
        "close": 26.889999,
        "volume": 16716600,
        "adjClose": 26.426386,
        "symbol": "MS"
      },
      {
        "date": "2016-05-04T04:00:00.000Z",
        "open": 26.5,
        "high": 26.620001,
        "low": 26.049999,
        "close": 26.280001,
        "volume": 15144500,
        "adjClose": 25.826904,
        "symbol": "MS"
      },
      {
        "date": "2016-05-05T04:00:00.000Z",
        "open": 26.26,
        "high": 26.5,
        "low": 26,
        "close": 26.17,
        "volume": 11909100,
        "adjClose": 25.7188,
        "symbol": "MS"
      },
      {
        "date": "2016-05-06T04:00:00.000Z",
        "open": 25.99,
        "high": 26.35,
        "low": 25.9,
        "close": 26.25,
        "volume": 12002200,
        "adjClose": 25.797421,
        "symbol": "MS"
      },
      {
        "date": "2016-05-09T04:00:00.000Z",
        "open": 26.24,
        "high": 26.5,
        "low": 26.040001,
        "close": 26.1,
        "volume": 10734400,
        "adjClose": 25.650007,
        "symbol": "MS"
      },
      {
        "date": "2016-05-10T04:00:00.000Z",
        "open": 26.41,
        "high": 26.790001,
        "low": 26.280001,
        "close": 26.629999,
        "volume": 11200000,
        "adjClose": 26.170868,
        "symbol": "MS"
      },
      {
        "date": "2016-05-11T04:00:00.000Z",
        "open": 26.59,
        "high": 26.99,
        "low": 26.35,
        "close": 26.360001,
        "volume": 9589900,
        "adjClose": 25.905525,
        "symbol": "MS"
      },
      {
        "date": "2016-05-12T04:00:00.000Z",
        "open": 26.559999,
        "high": 26.73,
        "low": 25.969999,
        "close": 26.23,
        "volume": 9838300,
        "adjClose": 25.777765,
        "symbol": "MS"
      },
      {
        "date": "2016-05-13T04:00:00.000Z",
        "open": 26.190001,
        "high": 26.65,
        "low": 25.889999,
        "close": 25.889999,
        "volume": 13378800,
        "adjClose": 25.443627,
        "symbol": "MS"
      },
      {
        "date": "2016-05-16T04:00:00.000Z",
        "open": 25.860001,
        "high": 26.42,
        "low": 25.85,
        "close": 26.209999,
        "volume": 9883900,
        "adjClose": 25.758109,
        "symbol": "MS"
      },
      {
        "date": "2016-05-17T04:00:00.000Z",
        "open": 26.08,
        "high": 26.559999,
        "low": 25.950001,
        "close": 26.16,
        "volume": 14474100,
        "adjClose": 25.708972,
        "symbol": "MS"
      },
      {
        "date": "2016-05-18T04:00:00.000Z",
        "open": 26.190001,
        "high": 27.290001,
        "low": 26.18,
        "close": 27.24,
        "volume": 20335500,
        "adjClose": 26.770352,
        "symbol": "MS"
      },
      {
        "date": "2016-05-19T04:00:00.000Z",
        "open": 27.07,
        "high": 27.35,
        "low": 26.440001,
        "close": 26.610001,
        "volume": 11487100,
        "adjClose": 26.151214,
        "symbol": "MS"
      },
      {
        "date": "2016-05-20T04:00:00.000Z",
        "open": 26.85,
        "high": 27.17,
        "low": 26.67,
        "close": 26.77,
        "volume": 14313000,
        "adjClose": 26.308456,
        "symbol": "MS"
      },
      {
        "date": "2016-05-23T04:00:00.000Z",
        "open": 26.719999,
        "high": 26.940001,
        "low": 26.6,
        "close": 26.83,
        "volume": 8913100,
        "adjClose": 26.367421,
        "symbol": "MS"
      },
      {
        "date": "2016-05-24T04:00:00.000Z",
        "open": 27.040001,
        "high": 27.66,
        "low": 26.959999,
        "close": 27.41,
        "volume": 18026100,
        "adjClose": 26.937421,
        "symbol": "MS"
      },
      {
        "date": "2016-05-25T04:00:00.000Z",
        "open": 27.610001,
        "high": 28.290001,
        "low": 27.6,
        "close": 27.780001,
        "volume": 15856700,
        "adjClose": 27.301042,
        "symbol": "MS"
      },
      {
        "date": "2016-05-26T04:00:00.000Z",
        "open": 27.91,
        "high": 27.91,
        "low": 27.35,
        "close": 27.42,
        "volume": 10080100,
        "adjClose": 26.947249,
        "symbol": "MS"
      },
      {
        "date": "2016-05-27T04:00:00.000Z",
        "open": 27.450001,
        "high": 27.639999,
        "low": 27.309999,
        "close": 27.530001,
        "volume": 10156100,
        "adjClose": 27.055353,
        "symbol": "MS"
      },
      {
        "date": "2016-05-31T04:00:00.000Z",
        "open": 27.639999,
        "high": 27.870001,
        "low": 27.24,
        "close": 27.370001,
        "volume": 12723400,
        "adjClose": 26.898111,
        "symbol": "MS"
      },
      {
        "date": "2016-06-01T04:00:00.000Z",
        "open": 27.110001,
        "high": 27.57,
        "low": 26.67,
        "close": 27.49,
        "volume": 11175000,
        "adjClose": 27.016041,
        "symbol": "MS"
      },
      {
        "date": "2016-06-02T04:00:00.000Z",
        "open": 27.459999,
        "high": 27.549999,
        "low": 27.219999,
        "close": 27.280001,
        "volume": 8077400,
        "adjClose": 26.809663,
        "symbol": "MS"
      },
      {
        "date": "2016-06-03T04:00:00.000Z",
        "open": 26.6,
        "high": 26.65,
        "low": 26.01,
        "close": 26.540001,
        "volume": 14562600,
        "adjClose": 26.082422,
        "symbol": "MS"
      },
      {
        "date": "2016-06-06T04:00:00.000Z",
        "open": 26.620001,
        "high": 27.01,
        "low": 26.549999,
        "close": 26.85,
        "volume": 10174200,
        "adjClose": 26.387076,
        "symbol": "MS"
      },
      {
        "date": "2016-06-07T04:00:00.000Z",
        "open": 26.91,
        "high": 26.940001,
        "low": 26.5,
        "close": 26.52,
        "volume": 9949100,
        "adjClose": 26.062766,
        "symbol": "MS"
      },
      {
        "date": "2016-06-08T04:00:00.000Z",
        "open": 26.459999,
        "high": 26.82,
        "low": 26.4,
        "close": 26.540001,
        "volume": 10311500,
        "adjClose": 26.082422,
        "symbol": "MS"
      },
      {
        "date": "2016-06-09T04:00:00.000Z",
        "open": 26.27,
        "high": 26.309999,
        "low": 25.950001,
        "close": 26.08,
        "volume": 9893000,
        "adjClose": 25.630352,
        "symbol": "MS"
      },
      {
        "date": "2016-06-10T04:00:00.000Z",
        "open": 25.639999,
        "high": 25.85,
        "low": 25.440001,
        "close": 25.540001,
        "volume": 13449800,
        "adjClose": 25.099663,
        "symbol": "MS"
      },
      {
        "date": "2016-06-13T04:00:00.000Z",
        "open": 25.309999,
        "high": 25.73,
        "low": 25.24,
        "close": 25.26,
        "volume": 12824300,
        "adjClose": 24.82449,
        "symbol": "MS"
      },
      {
        "date": "2016-06-14T04:00:00.000Z",
        "open": 25.09,
        "high": 25.42,
        "low": 24.42,
        "close": 24.6,
        "volume": 15812900,
        "adjClose": 24.175869,
        "symbol": "MS"
      },
      {
        "date": "2016-06-15T04:00:00.000Z",
        "open": 24.84,
        "high": 25.17,
        "low": 24.57,
        "close": 24.719999,
        "volume": 17393000,
        "adjClose": 24.293799,
        "symbol": "MS"
      },
      {
        "date": "2016-06-16T04:00:00.000Z",
        "open": 24.450001,
        "high": 25.110001,
        "low": 24.23,
        "close": 25.07,
        "volume": 16309400,
        "adjClose": 24.637765,
        "symbol": "MS"
      },
      {
        "date": "2016-06-17T04:00:00.000Z",
        "open": 25.1,
        "high": 25.49,
        "low": 25.049999,
        "close": 25.309999,
        "volume": 19295900,
        "adjClose": 24.873627,
        "symbol": "MS"
      },
      {
        "date": "2016-06-20T04:00:00.000Z",
        "open": 25.879999,
        "high": 26.299999,
        "low": 25.85,
        "close": 25.9,
        "volume": 17426400,
        "adjClose": 25.453455,
        "symbol": "MS"
      },
      {
        "date": "2016-06-21T04:00:00.000Z",
        "open": 26.059999,
        "high": 26.299999,
        "low": 25.799999,
        "close": 26.200001,
        "volume": 12357100,
        "adjClose": 25.748283,
        "symbol": "MS"
      },
      {
        "date": "2016-06-22T04:00:00.000Z",
        "open": 26.23,
        "high": 26.68,
        "low": 26.139999,
        "close": 26.389999,
        "volume": 14542900,
        "adjClose": 25.935006,
        "symbol": "MS"
      },
      {
        "date": "2016-06-23T04:00:00.000Z",
        "open": 26.93,
        "high": 27.290001,
        "low": 26.799999,
        "close": 27.290001,
        "volume": 18027200,
        "adjClose": 26.819491,
        "symbol": "MS"
      },
      {
        "date": "2016-06-24T04:00:00.000Z",
        "open": 25.07,
        "high": 25.530001,
        "low": 24.51,
        "close": 24.52,
        "volume": 49311900,
        "adjClose": 24.097248,
        "symbol": "MS"
      },
      {
        "date": "2016-06-27T04:00:00.000Z",
        "open": 24.049999,
        "high": 24.110001,
        "low": 23.110001,
        "close": 23.610001,
        "volume": 25434000,
        "adjClose": 23.202938,
        "symbol": "MS"
      },
      {
        "date": "2016-06-28T04:00:00.000Z",
        "open": 24.26,
        "high": 24.629999,
        "low": 23.879999,
        "close": 24.610001,
        "volume": 19792300,
        "adjClose": 24.185697,
        "symbol": "MS"
      },
      {
        "date": "2016-06-29T04:00:00.000Z",
        "open": 24.940001,
        "high": 25.25,
        "low": 24.639999,
        "close": 25.23,
        "volume": 13760800,
        "adjClose": 24.795006,
        "symbol": "MS"
      },
      {
        "date": "2016-06-30T04:00:00.000Z",
        "open": 25.34,
        "high": 26,
        "low": 25.18,
        "close": 25.98,
        "volume": 19736300,
        "adjClose": 25.532075,
        "symbol": "MS"
      },
      {
        "date": "2016-07-01T04:00:00.000Z",
        "open": 25.77,
        "high": 26.4,
        "low": 25.76,
        "close": 25.92,
        "volume": 8863400,
        "adjClose": 25.47311,
        "symbol": "MS"
      },
      {
        "date": "2016-07-05T04:00:00.000Z",
        "open": 25.5,
        "high": 25.57,
        "low": 24.83,
        "close": 25,
        "volume": 13317300,
        "adjClose": 24.568972,
        "symbol": "MS"
      },
      {
        "date": "2016-07-06T04:00:00.000Z",
        "open": 24.73,
        "high": 25.23,
        "low": 24.57,
        "close": 25.15,
        "volume": 14165000,
        "adjClose": 24.716385,
        "symbol": "MS"
      },
      {
        "date": "2016-07-07T04:00:00.000Z",
        "open": 25.27,
        "high": 25.92,
        "low": 25.26,
        "close": 25.690001,
        "volume": 13428700,
        "adjClose": 25.247076,
        "symbol": "MS"
      },
      {
        "date": "2016-07-08T04:00:00.000Z",
        "open": 26.17,
        "high": 26.43,
        "low": 26.030001,
        "close": 26.370001,
        "volume": 14141600,
        "adjClose": 25.915352,
        "symbol": "MS"
      },
      {
        "date": "2016-07-11T04:00:00.000Z",
        "open": 26.690001,
        "high": 26.92,
        "low": 26.389999,
        "close": 26.459999,
        "volume": 13213000,
        "adjClose": 26.003799,
        "symbol": "MS"
      },
      {
        "date": "2016-07-12T04:00:00.000Z",
        "open": 26.82,
        "high": 27.440001,
        "low": 26.790001,
        "close": 27.370001,
        "volume": 15516900,
        "adjClose": 26.898111,
        "symbol": "MS"
      },
      {
        "date": "2016-07-13T04:00:00.000Z",
        "open": 27.450001,
        "high": 27.48,
        "low": 26.940001,
        "close": 27.16,
        "volume": 12911900,
        "adjClose": 26.691731,
        "symbol": "MS"
      },
      {
        "date": "2016-07-14T04:00:00.000Z",
        "open": 27.799999,
        "high": 28.08,
        "low": 27.66,
        "close": 28,
        "volume": 15436600,
        "adjClose": 27.517249,
        "symbol": "MS"
      },
      {
        "date": "2016-07-15T04:00:00.000Z",
        "open": 28.25,
        "high": 28.280001,
        "low": 27.690001,
        "close": 28.01,
        "volume": 18519800,
        "adjClose": 27.527076,
        "symbol": "MS"
      },
      {
        "date": "2016-07-18T04:00:00.000Z",
        "open": 28.059999,
        "high": 28.23,
        "low": 27.860001,
        "close": 28.209999,
        "volume": 14083900,
        "adjClose": 27.723627,
        "symbol": "MS"
      },
      {
        "date": "2016-07-19T04:00:00.000Z",
        "open": 27.950001,
        "high": 28.4,
        "low": 27.77,
        "close": 28.190001,
        "volume": 21511200,
        "adjClose": 27.703973,
        "symbol": "MS"
      },
      {
        "date": "2016-07-20T04:00:00.000Z",
        "open": 29.139999,
        "high": 29.139999,
        "low": 28.190001,
        "close": 28.780001,
        "volume": 28606100,
        "adjClose": 28.283801,
        "symbol": "MS"
      },
      {
        "date": "2016-07-21T04:00:00.000Z",
        "open": 28.719999,
        "high": 29.08,
        "low": 28.629999,
        "close": 28.870001,
        "volume": 20312700,
        "adjClose": 28.37225,
        "symbol": "MS"
      },
      {
        "date": "2016-07-22T04:00:00.000Z",
        "open": 28.77,
        "high": 29.07,
        "low": 28.73,
        "close": 28.92,
        "volume": 12996700,
        "adjClose": 28.421387,
        "symbol": "MS"
      },
      {
        "date": "2016-07-25T04:00:00.000Z",
        "open": 28.82,
        "high": 29.139999,
        "low": 28.790001,
        "close": 29.129999,
        "volume": 10622900,
        "adjClose": 28.627765,
        "symbol": "MS"
      },
      {
        "date": "2016-07-26T04:00:00.000Z",
        "open": 29.02,
        "high": 29.280001,
        "low": 28.870001,
        "close": 29.23,
        "volume": 15019500,
        "adjClose": 28.726042,
        "symbol": "MS"
      },
      {
        "date": "2016-07-27T04:00:00.000Z",
        "open": 29.030001,
        "high": 29.370001,
        "low": 28.93,
        "close": 29.02,
        "volume": 13672200,
        "adjClose": 28.716146,
        "symbol": "MS"
      },
      {
        "date": "2016-07-28T04:00:00.000Z",
        "open": 28.9,
        "high": 29.030001,
        "low": 28.66,
        "close": 28.860001,
        "volume": 11528400,
        "adjClose": 28.557822,
        "symbol": "MS"
      },
      {
        "date": "2016-07-29T04:00:00.000Z",
        "open": 28.77,
        "high": 29.01,
        "low": 28.59,
        "close": 28.73,
        "volume": 10498500,
        "adjClose": 28.429182,
        "symbol": "MS"
      },
      {
        "date": "2016-08-01T04:00:00.000Z",
        "open": 28.84,
        "high": 28.92,
        "low": 28.370001,
        "close": 28.5,
        "volume": 10396000,
        "adjClose": 28.20159,
        "symbol": "MS"
      },
      {
        "date": "2016-08-02T04:00:00.000Z",
        "open": 28.389999,
        "high": 28.559999,
        "low": 27.790001,
        "close": 28,
        "volume": 16915500,
        "adjClose": 27.706826,
        "symbol": "MS"
      },
      {
        "date": "2016-08-03T04:00:00.000Z",
        "open": 27.969999,
        "high": 28.51,
        "low": 27.950001,
        "close": 28.42,
        "volume": 10562000,
        "adjClose": 28.122428,
        "symbol": "MS"
      },
      {
        "date": "2016-08-04T04:00:00.000Z",
        "open": 28.27,
        "high": 28.4,
        "low": 27.99,
        "close": 28.280001,
        "volume": 12162900,
        "adjClose": 27.983895,
        "symbol": "MS"
      },
      {
        "date": "2016-08-05T04:00:00.000Z",
        "open": 28.6,
        "high": 29.18,
        "low": 28.59,
        "close": 29.01,
        "volume": 11881900,
        "adjClose": 28.706251,
        "symbol": "MS"
      },
      {
        "date": "2016-08-08T04:00:00.000Z",
        "open": 29.02,
        "high": 29.42,
        "low": 29,
        "close": 29.120001,
        "volume": 9018600,
        "adjClose": 28.8151,
        "symbol": "MS"
      },
      {
        "date": "2016-08-09T04:00:00.000Z",
        "open": 29.15,
        "high": 29.49,
        "low": 29.15,
        "close": 29.34,
        "volume": 11012600,
        "adjClose": 29.032795,
        "symbol": "MS"
      },
      {
        "date": "2016-08-10T04:00:00.000Z",
        "open": 29.389999,
        "high": 29.469999,
        "low": 29.049999,
        "close": 29.110001,
        "volume": 8186700,
        "adjClose": 28.805204,
        "symbol": "MS"
      },
      {
        "date": "2016-08-11T04:00:00.000Z",
        "open": 29.190001,
        "high": 29.450001,
        "low": 29.030001,
        "close": 29.379999,
        "volume": 8741100,
        "adjClose": 29.072376,
        "symbol": "MS"
      },
      {
        "date": "2016-08-12T04:00:00.000Z",
        "open": 29.15,
        "high": 29.200001,
        "low": 28.860001,
        "close": 29.17,
        "volume": 9749000,
        "adjClose": 28.864575,
        "symbol": "MS"
      },
      {
        "date": "2016-08-15T04:00:00.000Z",
        "open": 29.370001,
        "high": 29.799999,
        "low": 29.309999,
        "close": 29.66,
        "volume": 9411000,
        "adjClose": 29.349445,
        "symbol": "MS"
      },
      {
        "date": "2016-08-16T04:00:00.000Z",
        "open": 29.99,
        "high": 30.370001,
        "low": 29.870001,
        "close": 30.25,
        "volume": 22161900,
        "adjClose": 29.933267,
        "symbol": "MS"
      },
      {
        "date": "2016-08-17T04:00:00.000Z",
        "open": 30.27,
        "high": 30.469999,
        "low": 30.120001,
        "close": 30.370001,
        "volume": 12327000,
        "adjClose": 30.052011,
        "symbol": "MS"
      },
      {
        "date": "2016-08-18T04:00:00.000Z",
        "open": 30.27,
        "high": 30.74,
        "low": 30.200001,
        "close": 30.549999,
        "volume": 13369400,
        "adjClose": 30.230125,
        "symbol": "MS"
      },
      {
        "date": "2016-08-19T04:00:00.000Z",
        "open": 30.4,
        "high": 30.719999,
        "low": 30.26,
        "close": 30.549999,
        "volume": 8831900,
        "adjClose": 30.230125,
        "symbol": "MS"
      },
      {
        "date": "2016-08-22T04:00:00.000Z",
        "open": 30.440001,
        "high": 30.700001,
        "low": 30.389999,
        "close": 30.6,
        "volume": 6613900,
        "adjClose": 30.279603,
        "symbol": "MS"
      },
      {
        "date": "2016-08-23T04:00:00.000Z",
        "open": 30.799999,
        "high": 30.969999,
        "low": 30.67,
        "close": 30.719999,
        "volume": 7907700,
        "adjClose": 30.398345,
        "symbol": "MS"
      },
      {
        "date": "2016-08-24T04:00:00.000Z",
        "open": 30.82,
        "high": 31.16,
        "low": 30.719999,
        "close": 30.91,
        "volume": 12453500,
        "adjClose": 30.586356,
        "symbol": "MS"
      },
      {
        "date": "2016-08-25T04:00:00.000Z",
        "open": 30.91,
        "high": 31.059999,
        "low": 30.77,
        "close": 30.969999,
        "volume": 7838700,
        "adjClose": 30.645728,
        "symbol": "MS"
      },
      {
        "date": "2016-08-26T04:00:00.000Z",
        "open": 31.120001,
        "high": 31.58,
        "low": 30.93,
        "close": 31.16,
        "volume": 10693400,
        "adjClose": 30.833739,
        "symbol": "MS"
      },
      {
        "date": "2016-08-29T04:00:00.000Z",
        "open": 31.209999,
        "high": 31.6,
        "low": 31.15,
        "close": 31.41,
        "volume": 9167800,
        "adjClose": 31.081121,
        "symbol": "MS"
      },
      {
        "date": "2016-08-30T04:00:00.000Z",
        "open": 31.41,
        "high": 32.189999,
        "low": 31.41,
        "close": 32.189999,
        "volume": 13745600,
        "adjClose": 31.852953,
        "symbol": "MS"
      },
      {
        "date": "2016-08-31T04:00:00.000Z",
        "open": 32.130001,
        "high": 32.310001,
        "low": 31.719999,
        "close": 32.060001,
        "volume": 15561200,
        "adjClose": 31.724317,
        "symbol": "MS"
      },
      {
        "date": "2016-09-01T04:00:00.000Z",
        "open": 32.139999,
        "high": 32.369999,
        "low": 31.440001,
        "close": 31.91,
        "volume": 11986500,
        "adjClose": 31.575886,
        "symbol": "MS"
      },
      {
        "date": "2016-09-02T04:00:00.000Z",
        "open": 31.959999,
        "high": 32.209999,
        "low": 31.67,
        "close": 31.889999,
        "volume": 12288200,
        "adjClose": 31.556095,
        "symbol": "MS"
      },
      {
        "date": "2016-09-06T04:00:00.000Z",
        "open": 31.959999,
        "high": 32.220001,
        "low": 31.549999,
        "close": 31.75,
        "volume": 14191400,
        "adjClose": 31.417561,
        "symbol": "MS"
      },
      {
        "date": "2016-09-07T04:00:00.000Z",
        "open": 31.68,
        "high": 31.940001,
        "low": 31.58,
        "close": 31.690001,
        "volume": 10845000,
        "adjClose": 31.35819,
        "symbol": "MS"
      },
      {
        "date": "2016-09-08T04:00:00.000Z",
        "open": 31.700001,
        "high": 32.209999,
        "low": 31.610001,
        "close": 32.040001,
        "volume": 12696100,
        "adjClose": 31.704526,
        "symbol": "MS"
      },
      {
        "date": "2016-09-09T04:00:00.000Z",
        "open": 31.98,
        "high": 32.27,
        "low": 31.59,
        "close": 31.59,
        "volume": 16493900,
        "adjClose": 31.259237,
        "symbol": "MS"
      },
      {
        "date": "2016-09-12T04:00:00.000Z",
        "open": 31.32,
        "high": 32.32,
        "low": 31.139999,
        "close": 32.240002,
        "volume": 13888100,
        "adjClose": 31.902432,
        "symbol": "MS"
      },
      {
        "date": "2016-09-13T04:00:00.000Z",
        "open": 31.690001,
        "high": 32,
        "low": 31.27,
        "close": 31.459999,
        "volume": 13954100,
        "adjClose": 31.130597,
        "symbol": "MS"
      },
      {
        "date": "2016-09-14T04:00:00.000Z",
        "open": 31.49,
        "high": 31.809999,
        "low": 31.309999,
        "close": 31.559999,
        "volume": 11687600,
        "adjClose": 31.22955,
        "symbol": "MS"
      },
      {
        "date": "2016-09-15T04:00:00.000Z",
        "open": 31.549999,
        "high": 32.139999,
        "low": 31.5,
        "close": 31.950001,
        "volume": 9947900,
        "adjClose": 31.615468,
        "symbol": "MS"
      },
      {
        "date": "2016-09-16T04:00:00.000Z",
        "open": 31.67,
        "high": 31.799999,
        "low": 31.379999,
        "close": 31.59,
        "volume": 14756200,
        "adjClose": 31.259237,
        "symbol": "MS"
      },
      {
        "date": "2016-09-19T04:00:00.000Z",
        "open": 31.719999,
        "high": 32.099998,
        "low": 31.52,
        "close": 31.6,
        "volume": 7806500,
        "adjClose": 31.269132,
        "symbol": "MS"
      },
      {
        "date": "2016-09-20T04:00:00.000Z",
        "open": 31.84,
        "high": 32,
        "low": 31.65,
        "close": 31.700001,
        "volume": 8849000,
        "adjClose": 31.368086,
        "symbol": "MS"
      },
      {
        "date": "2016-09-21T04:00:00.000Z",
        "open": 31.84,
        "high": 32.060001,
        "low": 31.5,
        "close": 31.92,
        "volume": 10073600,
        "adjClose": 31.585781,
        "symbol": "MS"
      },
      {
        "date": "2016-09-22T04:00:00.000Z",
        "open": 32.130001,
        "high": 32.439999,
        "low": 31.98,
        "close": 32.240002,
        "volume": 8185300,
        "adjClose": 31.902432,
        "symbol": "MS"
      },
      {
        "date": "2016-09-23T04:00:00.000Z",
        "open": 32.119999,
        "high": 32.25,
        "low": 31.67,
        "close": 31.91,
        "volume": 9400600,
        "adjClose": 31.575886,
        "symbol": "MS"
      },
      {
        "date": "2016-09-26T04:00:00.000Z",
        "open": 31.530001,
        "high": 31.57,
        "low": 30.959999,
        "close": 31.030001,
        "volume": 10217700,
        "adjClose": 30.705101,
        "symbol": "MS"
      },
      {
        "date": "2016-09-27T04:00:00.000Z",
        "open": 30.82,
        "high": 31.49,
        "low": 30.620001,
        "close": 31.35,
        "volume": 9753500,
        "adjClose": 31.02175,
        "symbol": "MS"
      },
      {
        "date": "2016-09-28T04:00:00.000Z",
        "open": 31.440001,
        "high": 31.799999,
        "low": 31.32,
        "close": 31.77,
        "volume": 7425100,
        "adjClose": 31.437352,
        "symbol": "MS"
      },
      {
        "date": "2016-09-29T04:00:00.000Z",
        "open": 31.77,
        "high": 32.110001,
        "low": 30.74,
        "close": 31.040001,
        "volume": 12529700,
        "adjClose": 30.714996,
        "symbol": "MS"
      },
      {
        "date": "2016-09-30T04:00:00.000Z",
        "open": 31.27,
        "high": 32.32,
        "low": 31,
        "close": 32.060001,
        "volume": 16269700,
        "adjClose": 31.724317,
        "symbol": "MS"
      },
      {
        "date": "2016-10-03T04:00:00.000Z",
        "open": 32.02,
        "high": 32.150002,
        "low": 31.469999,
        "close": 31.950001,
        "volume": 10324300,
        "adjClose": 31.615468,
        "symbol": "MS"
      },
      {
        "date": "2016-10-04T04:00:00.000Z",
        "open": 32.07,
        "high": 32.400002,
        "low": 31.809999,
        "close": 32.040001,
        "volume": 9525400,
        "adjClose": 31.704526,
        "symbol": "MS"
      },
      {
        "date": "2016-10-05T04:00:00.000Z",
        "open": 32.169998,
        "high": 32.73,
        "low": 32.099998,
        "close": 32.560001,
        "volume": 11157700,
        "adjClose": 32.219082,
        "symbol": "MS"
      },
      {
        "date": "2016-10-06T04:00:00.000Z",
        "open": 32.48,
        "high": 32.650002,
        "low": 32.200001,
        "close": 32.389999,
        "volume": 11347200,
        "adjClose": 32.05086,
        "symbol": "MS"
      },
      {
        "date": "2016-10-07T04:00:00.000Z",
        "open": 32.34,
        "high": 32.52,
        "low": 31.950001,
        "close": 32.310001,
        "volume": 11406100,
        "adjClose": 31.971699,
        "symbol": "MS"
      },
      {
        "date": "2016-10-10T04:00:00.000Z",
        "open": 32.619999,
        "high": 32.709999,
        "low": 32.41,
        "close": 32.560001,
        "volume": 6609200,
        "adjClose": 32.219082,
        "symbol": "MS"
      },
      {
        "date": "2016-10-11T04:00:00.000Z",
        "open": 32.490002,
        "high": 32.759998,
        "low": 31.950001,
        "close": 32.18,
        "volume": 6827700,
        "adjClose": 31.843059,
        "symbol": "MS"
      },
      {
        "date": "2016-10-12T04:00:00.000Z",
        "open": 32.18,
        "high": 32.380001,
        "low": 31.879999,
        "close": 31.91,
        "volume": 6743300,
        "adjClose": 31.575886,
        "symbol": "MS"
      },
      {
        "date": "2016-10-13T04:00:00.000Z",
        "open": 31.49,
        "high": 33,
        "low": 30.959999,
        "close": 31.73,
        "volume": 13893500,
        "adjClose": 31.39777,
        "symbol": "MS"
      },
      {
        "date": "2016-10-14T04:00:00.000Z",
        "open": 32.240002,
        "high": 32.790001,
        "low": 31.889999,
        "close": 32.07,
        "volume": 13734100,
        "adjClose": 31.73421,
        "symbol": "MS"
      },
      {
        "date": "2016-10-17T04:00:00.000Z",
        "open": 32.049999,
        "high": 32.169998,
        "low": 31.610001,
        "close": 31.790001,
        "volume": 10114300,
        "adjClose": 31.457143,
        "symbol": "MS"
      },
      {
        "date": "2016-10-18T04:00:00.000Z",
        "open": 32.25,
        "high": 32.509998,
        "low": 32.040001,
        "close": 32.32,
        "volume": 13091600,
        "adjClose": 31.981593,
        "symbol": "MS"
      },
      {
        "date": "2016-10-19T04:00:00.000Z",
        "open": 32.84,
        "high": 33,
        "low": 32.18,
        "close": 32.93,
        "volume": 18522700,
        "adjClose": 32.585206,
        "symbol": "MS"
      },
      {
        "date": "2016-10-20T04:00:00.000Z",
        "open": 32.84,
        "high": 33.189999,
        "low": 32.580002,
        "close": 32.900002,
        "volume": 10650700,
        "adjClose": 32.555522,
        "symbol": "MS"
      },
      {
        "date": "2016-10-21T04:00:00.000Z",
        "open": 32.599998,
        "high": 33.52,
        "low": 32.540001,
        "close": 33.439999,
        "volume": 13910300,
        "adjClose": 33.089865,
        "symbol": "MS"
      },
      {
        "date": "2016-10-24T04:00:00.000Z",
        "open": 33.57,
        "high": 33.68,
        "low": 33.34,
        "close": 33.380001,
        "volume": 9221300,
        "adjClose": 33.030495,
        "symbol": "MS"
      },
      {
        "date": "2016-10-25T04:00:00.000Z",
        "open": 33.389999,
        "high": 33.59,
        "low": 33.200001,
        "close": 33.349998,
        "volume": 7912200,
        "adjClose": 33.000807,
        "symbol": "MS"
      },
      {
        "date": "2016-10-26T04:00:00.000Z",
        "open": 33.150002,
        "high": 33.650002,
        "low": 33.060001,
        "close": 33.59,
        "volume": 9113000,
        "adjClose": 33.238296,
        "symbol": "MS"
      },
      {
        "date": "2016-10-27T04:00:00.000Z",
        "open": 33.82,
        "high": 34.009998,
        "low": 33.580002,
        "close": 33.82,
        "volume": 12608400,
        "adjClose": 33.666343,
        "symbol": "MS"
      },
      {
        "date": "2016-10-28T04:00:00.000Z",
        "open": 33.689999,
        "high": 34.029999,
        "low": 33.169998,
        "close": 33.52,
        "volume": 10183500,
        "adjClose": 33.367707,
        "symbol": "MS"
      },
      {
        "date": "2016-10-31T04:00:00.000Z",
        "open": 33.709999,
        "high": 33.880001,
        "low": 33.490002,
        "close": 33.57,
        "volume": 8687200,
        "adjClose": 33.417479,
        "symbol": "MS"
      },
      {
        "date": "2016-11-01T04:00:00.000Z",
        "open": 33.68,
        "high": 33.830002,
        "low": 32.91,
        "close": 33.360001,
        "volume": 8988700,
        "adjClose": 33.208434,
        "symbol": "MS"
      },
      {
        "date": "2016-11-02T04:00:00.000Z",
        "open": 33.119999,
        "high": 33.169998,
        "low": 32.73,
        "close": 32.919998,
        "volume": 8900400,
        "adjClose": 32.770431,
        "symbol": "MS"
      },
      {
        "date": "2016-11-03T04:00:00.000Z",
        "open": 33.07,
        "high": 33.23,
        "low": 32.77,
        "close": 32.810001,
        "volume": 8172500,
        "adjClose": 32.660934,
        "symbol": "MS"
      },
      {
        "date": "2016-11-04T04:00:00.000Z",
        "open": 32.82,
        "high": 33.209999,
        "low": 32.560001,
        "close": 32.779999,
        "volume": 7897800,
        "adjClose": 32.631067,
        "symbol": "MS"
      },
      {
        "date": "2016-11-07T05:00:00.000Z",
        "open": 33.57,
        "high": 34,
        "low": 33.57,
        "close": 34,
        "volume": 11328000,
        "adjClose": 33.845526,
        "symbol": "MS"
      },
      {
        "date": "2016-11-08T05:00:00.000Z",
        "open": 33.810001,
        "high": 34.279999,
        "low": 33.540001,
        "close": 34.099998,
        "volume": 7370500,
        "adjClose": 33.94507,
        "symbol": "MS"
      },
      {
        "date": "2016-11-09T05:00:00.000Z",
        "open": 34.700001,
        "high": 36.91,
        "low": 34.470001,
        "close": 36.52,
        "volume": 28311000,
        "adjClose": 36.354077,
        "symbol": "MS"
      },
      {
        "date": "2016-11-10T05:00:00.000Z",
        "open": 36.720001,
        "high": 38.939999,
        "low": 36.720001,
        "close": 38.02,
        "volume": 38586800,
        "adjClose": 37.847262,
        "symbol": "MS"
      },
      {
        "date": "2016-11-11T05:00:00.000Z",
        "open": 37.369999,
        "high": 38.75,
        "low": 37.34,
        "close": 38.490002,
        "volume": 22845500,
        "adjClose": 38.315128,
        "symbol": "MS"
      },
      {
        "date": "2016-11-14T05:00:00.000Z",
        "open": 38.880001,
        "high": 39.880001,
        "low": 38.779999,
        "close": 39.349998,
        "volume": 25619000,
        "adjClose": 39.171217,
        "symbol": "MS"
      },
      {
        "date": "2016-11-15T05:00:00.000Z",
        "open": 38.810001,
        "high": 40.029999,
        "low": 38.41,
        "close": 40,
        "volume": 18608000,
        "adjClose": 39.818265,
        "symbol": "MS"
      },
      {
        "date": "2016-11-16T05:00:00.000Z",
        "open": 39.009998,
        "high": 39.48,
        "low": 38.959999,
        "close": 39.189999,
        "volume": 18234900,
        "adjClose": 39.011944,
        "symbol": "MS"
      },
      {
        "date": "2016-11-17T05:00:00.000Z",
        "open": 39.02,
        "high": 39.970001,
        "low": 38.720001,
        "close": 39.970001,
        "volume": 12676900,
        "adjClose": 39.788403,
        "symbol": "MS"
      },
      {
        "date": "2016-11-18T05:00:00.000Z",
        "open": 40,
        "high": 40.669998,
        "low": 39.889999,
        "close": 40.43,
        "volume": 16413300,
        "adjClose": 40.246312,
        "symbol": "MS"
      },
      {
        "date": "2016-11-21T05:00:00.000Z",
        "open": 40.439999,
        "high": 40.799999,
        "low": 40.110001,
        "close": 40.560001,
        "volume": 10122300,
        "adjClose": 40.375723,
        "symbol": "MS"
      },
      {
        "date": "2016-11-22T05:00:00.000Z",
        "open": 40.560001,
        "high": 40.77,
        "low": 39.970001,
        "close": 40.540001,
        "volume": 12341100,
        "adjClose": 40.355813,
        "symbol": "MS"
      },
      {
        "date": "2016-11-23T05:00:00.000Z",
        "open": 40.5,
        "high": 41.18,
        "low": 40.220001,
        "close": 41.040001,
        "volume": 9841000,
        "adjClose": 40.853541,
        "symbol": "MS"
      },
      {
        "date": "2016-11-25T05:00:00.000Z",
        "open": 41.099998,
        "high": 41.200001,
        "low": 40.790001,
        "close": 41.099998,
        "volume": 4027500,
        "adjClose": 40.913266,
        "symbol": "MS"
      },
      {
        "date": "2016-11-28T05:00:00.000Z",
        "open": 40.630001,
        "high": 41,
        "low": 40.349998,
        "close": 40.439999,
        "volume": 10123600,
        "adjClose": 40.256265,
        "symbol": "MS"
      },
      {
        "date": "2016-11-29T05:00:00.000Z",
        "open": 40.439999,
        "high": 40.919998,
        "low": 40.290001,
        "close": 40.599998,
        "volume": 8602900,
        "adjClose": 40.415538,
        "symbol": "MS"
      },
      {
        "date": "2016-11-30T05:00:00.000Z",
        "open": 41.02,
        "high": 41.639999,
        "low": 41.009998,
        "close": 41.360001,
        "volume": 14726600,
        "adjClose": 41.172087,
        "symbol": "MS"
      },
      {
        "date": "2016-12-01T05:00:00.000Z",
        "open": 41.759998,
        "high": 42.540001,
        "low": 41.580002,
        "close": 42.16,
        "volume": 14053900,
        "adjClose": 41.968452,
        "symbol": "MS"
      },
      {
        "date": "2016-12-02T05:00:00.000Z",
        "open": 42.09,
        "high": 42.09,
        "low": 41.139999,
        "close": 41.830002,
        "volume": 11288400,
        "adjClose": 41.639953,
        "symbol": "MS"
      },
      {
        "date": "2016-12-05T05:00:00.000Z",
        "open": 42.299999,
        "high": 42.849998,
        "low": 41.810001,
        "close": 42.09,
        "volume": 12264200,
        "adjClose": 41.89877,
        "symbol": "MS"
      },
      {
        "date": "2016-12-06T05:00:00.000Z",
        "open": 42.490002,
        "high": 42.740002,
        "low": 41.970001,
        "close": 42.509998,
        "volume": 11769500,
        "adjClose": 42.31686,
        "symbol": "MS"
      },
      {
        "date": "2016-12-07T05:00:00.000Z",
        "open": 42.5,
        "high": 42.790001,
        "low": 42.290001,
        "close": 42.639999,
        "volume": 16213400,
        "adjClose": 42.44627,
        "symbol": "MS"
      },
      {
        "date": "2016-12-08T05:00:00.000Z",
        "open": 42.900002,
        "high": 43.720001,
        "low": 42.700001,
        "close": 43.580002,
        "volume": 14972900,
        "adjClose": 43.382002,
        "symbol": "MS"
      },
      {
        "date": "2016-12-09T05:00:00.000Z",
        "open": 43.490002,
        "high": 44.040001,
        "low": 43.23,
        "close": 43.73,
        "volume": 12115100,
        "adjClose": 43.531318,
        "symbol": "MS"
      },
      {
        "date": "2016-12-12T05:00:00.000Z",
        "open": 43.5,
        "high": 43.91,
        "low": 42.66,
        "close": 42.98,
        "volume": 12052000,
        "adjClose": 42.784726,
        "symbol": "MS"
      },
      {
        "date": "2016-12-13T05:00:00.000Z",
        "open": 43.119999,
        "high": 43.299999,
        "low": 42.16,
        "close": 42.560001,
        "volume": 16674900,
        "adjClose": 42.366636,
        "symbol": "MS"
      },
      {
        "date": "2016-12-14T05:00:00.000Z",
        "open": 42.27,
        "high": 43.650002,
        "low": 42.119999,
        "close": 42.860001,
        "volume": 15136500,
        "adjClose": 42.665272,
        "symbol": "MS"
      },
      {
        "date": "2016-12-15T05:00:00.000Z",
        "open": 43.369999,
        "high": 43.509998,
        "low": 42.889999,
        "close": 43.009998,
        "volume": 15725700,
        "adjClose": 42.814588,
        "symbol": "MS"
      },
      {
        "date": "2016-12-16T05:00:00.000Z",
        "open": 43.119999,
        "high": 43.549999,
        "low": 42.610001,
        "close": 42.709999,
        "volume": 19076900,
        "adjClose": 42.515952,
        "symbol": "MS"
      },
      {
        "date": "2016-12-19T05:00:00.000Z",
        "open": 42.66,
        "high": 42.860001,
        "low": 42.139999,
        "close": 42.830002,
        "volume": 12663500,
        "adjClose": 42.63541,
        "symbol": "MS"
      },
      {
        "date": "2016-12-20T05:00:00.000Z",
        "open": 43.130001,
        "high": 43.580002,
        "low": 43.130001,
        "close": 43.5,
        "volume": 8647400,
        "adjClose": 43.302364,
        "symbol": "MS"
      },
      {
        "date": "2016-12-21T05:00:00.000Z",
        "open": 43.639999,
        "high": 43.66,
        "low": 43.279999,
        "close": 43.369999,
        "volume": 6859300,
        "adjClose": 43.172953,
        "symbol": "MS"
      },
      {
        "date": "2016-12-22T05:00:00.000Z",
        "open": 43.299999,
        "high": 43.389999,
        "low": 42.759998,
        "close": 42.790001,
        "volume": 8200300,
        "adjClose": 42.59559,
        "symbol": "MS"
      },
      {
        "date": "2016-12-23T05:00:00.000Z",
        "open": 42.860001,
        "high": 43.07,
        "low": 42.75,
        "close": 43.060001,
        "volume": 6733000,
        "adjClose": 42.864364,
        "symbol": "MS"
      },
      {
        "date": "2016-12-27T05:00:00.000Z",
        "open": 43.27,
        "high": 43.27,
        "low": 42.950001,
        "close": 43.119999,
        "volume": 5927000,
        "adjClose": 42.924089,
        "symbol": "MS"
      },
      {
        "date": "2016-12-28T05:00:00.000Z",
        "open": 43.25,
        "high": 43.290001,
        "low": 42.57,
        "close": 42.619999,
        "volume": 4854500,
        "adjClose": 42.426361,
        "symbol": "MS"
      },
      {
        "date": "2016-12-29T05:00:00.000Z",
        "open": 42.650002,
        "high": 42.77,
        "low": 41.73,
        "close": 42.150002,
        "volume": 7180200,
        "adjClose": 41.958499,
        "symbol": "MS"
      },
      {
        "date": "2016-12-30T05:00:00.000Z",
        "open": 42.169998,
        "high": 42.549999,
        "low": 41.880001,
        "close": 42.25,
        "volume": 6943500,
        "adjClose": 42.058043,
        "symbol": "MS"
      }
    ]
  }
  return mockData;
}
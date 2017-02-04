'use strict'
var React = require('react');
var ReactDOM = require('react-dom');
// var Chart = require('chart.js');

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

    // TODO: used for debugging set to false
    // var auth = {id : 243224486};

    /**
     * Tell primus to create a new connect to the current domain/port/protocol
    */
    var primus = new Primus();
    // var auth = { id: false };
    this.state = { primus };
  }
  handleClick(e) {
    console.log('handleClick')
    e.preventDefault();

    var echo = document.getElementById('echo');

    /**
     * Write the typed message.
     */
    this.state.primus.write(echo.value);
    echo.value = '';

  }
  callBack(path, type, data) {
    // console.log('Main callBack called');
    // console.log('path ' + path);
    // console.log('type ' + type);
    // console.log(data);
  }
  componentDidMount() {
    // console.log('Main componentDidMount');

    /**
     * Listen for incoming data and log it in our textarea.
     */
    var output = document.getElementById('output');
    this.state.primus.on('data', function received(data) {
      output.value += data + '\n';
    });
  }
  componentWillMount() {
    // console.log('Main componentWillMount');
    // var apiUrl = window.location.origin + '/api/:id';
    // $.ajax({
    //   url: apiUrl,
    //   method: 'GET'
    // }).then(auth => {
    //   this.setState({ auth })
    // })
  }
  render() {
    // console.log('Main this.state');
    // console.log(this.state);
    return (
      <div>
        {/*<div id="chart" className="jumbotron" ></div>*/}
        <form>
          <textarea id="output" readOnly></textarea>
          <br />
          <input type="text" id="echo" />
          <button type="submit" onClick={this.handleClick}>Enter</button>
        </form>
      </div>
    )
  }
}

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
})

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

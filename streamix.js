var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var request = require('request');
var SC = require('node-soundcloud');
var credentials = require('./credentials.js');

SC.init({
  id: credentials.id,
  secret: credentials.secret 
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3007);
app.use(express.static('public'));


app.get('/', function(req, res) {
	res.render('home');
});

app.get('/search', function (req, res) {
  var key = credentials.key; 
  var url = "https://www.googleapis.com/youtube/v3/search?key=" + key + "&part=snippet&q=" + 
  req.query.searchTerm + "&maxResults=5&type=video"; 
  var context;
  request.get(url, function (err, response, body) {
    if (!err && response.statusCode <= 400) {
      context = response.body;
      res.send(context);
    }
  });
});

app.get('/searchSC', function (req, res) {
  console.log(req.query);
  SC.get('/tracks', {q: req.query.searchTerm},function (err, track) {
    if (err) {
      console.log(err);
    } else {
      console.log('track retrieved:', track);
      res.send(track);
    }
  });
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

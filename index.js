var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Twitter = require('node-tweet-stream');
var fs = require('fs');

var t = new Twitter({
  consumer_key: "",
  consumer_secret: "" ,
  token: "",
  token_secret: ""
});

var tweetLog = fs.createWriteStream('tweets.out');

t.on('tweet', function(tweet) {
  var text = tweet.text;
  if ( !(text[0] === 'R' && text[1] === 'T') ) { 
    tweetLog.write(text + '\n');
    io.emit('tweet', text);
  }
});


app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var currentTerm = "";

io.on('connection', function(socket) {
  socket.on('search', function(term) {
    console.log("Hitting search api with: " + term);
    t.untrack(currentTerm);
    currentTerm = term;
    t.track(currentTerm);
  });
});

http.listen(3000, function() {
  console.log("Server is up and running...");
  console.log("Serving on port 3000...");
});

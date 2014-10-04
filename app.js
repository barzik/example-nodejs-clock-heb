/**
Creating the server object. launch the createServer method and the handler as the callback.
The handler is being fired rght after
**/
var app = require('http').createServer(handler) 
var io = require('socket.io')(app);
var fs = require('fs'); //We need fs to call index.html

app.listen(5000); //Listening on port 80. change it to 3000 if you have Apache on local machine

/**
Callback that fired when http.createServer completed

var req = the request.
var res = the result.
**/
function handler (req, res) {
  fs.readFile(__dirname + '/index.html', //reading the file
  function (err, data) {  //calback that get fired right after the file was created
    if (err) { //if callback return error.
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200); //returning 200
    res.end(data); //printing the data - the index.html content
  });
}

/**
IO event on connection. here is the magic
**/

io.on('connection', function (socket) { //connection event. happends when a connection is initiated
  var clockInterval = setInterval(function(){ //running it every second
  var current_time = getCurrentTime(); //calculating the time 
    socket.emit('clock-event', current_time); //emitting the clock-event through the socket
  },  1000);  
    socket.on("disconnect", function(s) { //when the socket is being closed, destroy the interval
      console.log('user disconnected! resetting interval');
      clearInterval(clockInterval);
  });  
});


/** function for printing the hour. Taken from 
http://www.mcterano.com/blog/%D7%A0%D7%99%D7%A1%D7%95%D7%99-17-%D7%A9%D7%A2%D7%95%D7%9F-%D7%A9%D7%9E%D7%AA%D7%A2%D7%93%D7%9B%D7%9F-%D7%91%D7%96%D7%9E%D7%9F-%D7%90%D7%9E%D7%AA-%D7%91%D7%A2%D7%96%D7%A8%D7%AA-node-js/
**/

function getCurrentTime(){
    var currentDate = new Date();
    var currentHours = addZeroToOneDigit(currentDate.getHours());
    var currentMinutes = addZeroToOneDigit(currentDate.getMinutes());
    var currentSeconds = addZeroToOneDigit(currentDate.getSeconds());
    var currentTime = currentHours + ":" + currentMinutes + ":" + currentSeconds;
    var html = parseHtml(currentTime);
    return html;
}
 
function addZeroToOneDigit(digits){
    var result = ((digits).toString().length === 1) ? "0" + digits : digits;
    return result;
}
 
function parseHtml(currentTime){
    var result = '<p style="direction: rtl; font: 12px Tahoma">';
    result += 'השעה כרגע היא: ' + currentTime;
    result += '.</p>';
    return result;
}

var express = require('express');
var app = express();
var httpServer = require("http").createServer(app);
var five = require("johnny-five");
var io = require('socket.io')(httpServer);

var port = 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

httpServer.listen(port);
console.log('Server available at http://localhost:' + port);

var led;
var array;

//Arduino board connection

var board = new five.Board();
board.on("ready", function() {
    console.log('Arduino connected');
    // led = new five.Led(3);

    array = new five.Leds([2, 3, 4, 5, 6]);
});

//Socket connection handler

io.on('connection', function(socket) {
    console.log(socket.id);

    socket.on('all-on', function(data) {
        array.on();
        console.log('LED ON RECEIVED');
    });

    socket.on('all-off', function(data) {
        array.stop().off();
        console.log('LED OFF RECEIVED');

    });

    socket.on('toggle', function(data) {
        var leds = data.newArr;
        array.stop().off();
        array.each(function(led, index) {
            if (leds.indexOf(led.pin) > -1) {
                led.on();
            }
        });
    });

});

console.log('Waiting for connection');
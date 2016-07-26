'use strict';

var app = require('express')();
var http = require('http').Server(app); // eslint-disable-line import/order, babel/new-cap
var io = require('socket.io')(http);

// http.Server(app); // eslint-disable-line babel/new-cap

var players = [];

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/dashboard/index.html'); // eslint-disable-line no-path-concat
});

io.on('connection', function (socket) {
	console.log('Player Connected!' + socket.id);
	socket.emit('socketID', {id: socket.id});
	socket.emit('getPlayers', players);
	socket.broadcast.emit('newPlayer', {id: socket.id});
	socket.on('disconnect', function () {
		console.log('Player Disconnected');
		socket.broadcast.emit('playerDisconnected', {id: socket.id});
		for (var i = 0; i < players.length; i++) {
			if (players[i].id === socket.id) {
				players.splice(i, 1);
			}
		}
	});
	players.push(new Player(socket.id, 0, 0));
	socket.on('update', function (data) {
		for (var i = 0; i < players.length; i++) {
			if (players[i].id === data.id) {
				players[i].x = data.x;
				players[i].y = data.y; // socket.broadcast.emit('playerUpdate', data);
				console.log('Player ' + data.id + ' moved to ' + data.x + ', ' + data.y);
			}
		}
	});
});

var tick = setInterval(function () {
	io.emit('fullUpdate', players);
}, 50);
console.log(tick);

function Player(id, x, y) {
	this.id = id;
	this.x = x;
	this.y = y;
}

http.listen(3000, function () {
	console.log('listening on *:3000');
});

/* global $, document, window*/

'use strict';

$(document).ready(function () {
	var socket = io.connect('http://localhost:3000'); // eslint-disable-line no-undef
	var lastUpdate = new Date().getTime() - 3000;

	socket.on('connect', function () {
		socket.emit('imabrowser');
	});

	socket.on('fullUpdate', function (data) {
		if (new Date().getTime() - lastUpdate >= 5000) {
			lastUpdate = new Date().getTime();
			console.log(data);
			$('#players').text('');
			for (var i = 0; i < data.length; i++) {
				$('#players').append(data[i].id + '<button onclick="kickPlayer(\'' + data[i].id + '\')">kick</button><br>');
			}
		}
	});

	window.kickPlayer = function (idnum) { // eslint-disable-line no-unused-vars
		console.log('attempting to send kick');
		socket.emit('kick', {id: idnum});
	};

	window.emitBrowserness = function () { // eslint-disable-line no-unused-vars
		socket.emit('imabrowser');
		console.log('lit');
	};
});

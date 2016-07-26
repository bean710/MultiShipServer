/* global $, document*/

'use strict';

$(document).ready(function () {
console.log('loaded!');
	var socket = io.connect('http://localhost:3000'); // eslint-disable-line no-undef
	var lastUpdate = 0;

	socket.on('connect', function () {
		socket.emit('imabrowser');
	});

	socket.on('fullUpdate', function (data) {
		if (new Date().getTime() - lastUpdate >= 5000) {
			lastUpdate = new Date().getTime();
			console.log(data);
			$('#players').text('');
			for (var i = 0; i < data.length; i++) {
				$('#players').append(data[i].id + '<button onclick="kickPlayer(' + data[i].id + ')">kick</button><button onclick="console.log("lit")">Lit</button><br>');
			}
		}
	});

	window.kickPlayer = function(id) { // eslint-disable-line no-unused-vars
		console.log('attempting to send kick');
		socket.emit('kick', id);
	}

	window.emitBrowserness = function() { // eslint-disable-line no-unused-vars
		socket.emit('imabrowser');
		console.log('lit');
	}
});

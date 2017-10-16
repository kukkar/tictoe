var io = require('socket.io-client');
var socket = io('http://localhost:3000',{ forceNew: true });



socket.on('connect', () => {
  console.log(socket.id); // 'G5p5...'
  socket.emit('newuser',socket.id);

});
socket.on('rival',(pairid) => {
	console.log(socket.id);
	console.log("my rival is ",pairid);
});


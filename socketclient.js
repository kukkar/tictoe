
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3000');
console.log(socket.id);
function newuser(cb) {
	socket.on('rival',(pairid) => {
	console.log(socket.id);
	console.log("my rival is ",pairid);
	});
	console.log(socket.id);
  	socket.emit('newuser',socket.id);
}

export { newuser };
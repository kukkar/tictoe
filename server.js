var express = require('express') ;  
var webpack = require('webpack');  
var path  = require('path') ;  
//import config from '../webpack.config.dev';  
var open = require('open') ;  
//var favicon from 'serve-favicon';
var StackOfUsers = Array();
var StackOfPairedUsers = Array();

/* eslint-disable no-console */

const port = 3000;  
const app = express();  
/*const compiler = webpack(config);*/

/*app.use(require('webpack-dev-middleware')(compiler, {  
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));  */
/*
app.get('*', function(req, res) {  
  
  console.log(path.join( __dirname, '/index.html'));
});*/

const server = app.listen(port, function(err) {  
  if (err) {
    return err;
  } else {
    console.log("server started");
  }
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('a user connected');
 
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('newuser',function(data) {
    StackOfUsers.push(data);
    console.log(StackOfUsers);
    pushtopair(socket,data);
  });
   socket.on('handleClickevent',function(history,squares,rivalsocketid,mysocketid) {
    console.log(squares);
    io.to(rivalsocketid).emit('handleEvents',squares,history); //this is not working
    io.to(mysocketid).emit('handleEvents',squares,history); 
  });
  
 function pushtopair(socket,data) {

     if(StackOfUsers.length > 1) {
      var first = StackOfUsers.pop();
      var second  = StackOfUsers.pop();

      StackOfPairedUsers.push(first);
      StackOfPairedUsers.push(second);
    console.log("rival event emiitted");
      io.to(first).emit('rival',second); //this is not working
      io.to(second).emit('rival',first); 
    } else {
      io.to(data).emit('rival',null); //this is not working
    }
}


 
  

 /* socket.on('room', function(data) {
=======

      io.to(first).emit('rival',second); //this is not working
      io.to(second).emit('rival',first); 
    } else {
      //socket.to(data).emit('rival',"Mot to fjsljfl");
      io.to(data).emit('rival', "fsfss");
    }
}
 
  

  socket.on('room', function(data) {
>>>>>>> da1d60446ac1adee487fb40880688b920e20108b
    console.log('in joining room in SERVER')
    socket.join(data.room);
    console.log(data)
    socket.broadcast.to(data.room).emit('load users and code')
    socket.broadcast.to(data.room).emit('new user join', data.user)
  });

<<<<<<< HEAD

=======
>>>>>>> da1d60446ac1adee487fb40880688b920e20108b
  socket.on('leave room', function(data) {
    socket.broadcast.to(data.room).emit('user left room', {user: data.user})
    socket.leave(data.room)
  })

  socket.on('coding event', function(data) {
    console.log('in EXPRESS coding event')
    console.log(data)
    socket.broadcast.to(data.room).emit('receive code', {code: data.code, currentlyTyping: data.currentlyTyping});
  })
  socket.on('change mode', function(data) {
    socket.broadcast.to(data.room).emit('receive change mode', data.mode)
  })

  socket.on('send users and code', function(data) {
    socket.broadcast.to(data.room).emit('receive users and code', data)
<<<<<<< HEAD
  })*/
});




